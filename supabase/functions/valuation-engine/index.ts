import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ValuationRequest {
  ecosystem_id: string;
  action_type?: string;
  inputs?: Record<string, unknown>;
}

interface ImpactProjection {
  carbon_sequestration_tons: [number, number];
  water_retention_m3: [number, number];
  biodiversity_impact: [number, number];
  soil_improvement_percent: [number, number];
}

interface ValuationResponse {
  ecosystem_id: string;
  projected_impact: ImpactProjection;
  confidence: number;
  time_to_impact_years: [number, number];
  economic_value_usd: [number, number];
  methodology: string;
  signals_used: number;
  data_quality_score: number;
}

// Carbon price per ton (current market rate range)
const CARBON_PRICE_MIN = 45;
const CARBON_PRICE_MAX = 85;

// Ecosystem type impact multipliers
const typeMultipliers: Record<string, number> = {
  watershed: 1.2,
  forest: 1.5,
  wetland: 1.8,
  grassland: 0.8,
  farm: 0.6,
  urban_block: 0.4,
};

// Action type impact coefficients
const actionCoefficients: Record<string, { carbon: number; water: number; bio: number; soil: number }> = {
  reforestation: { carbon: 1.0, water: 0.8, bio: 0.7, soil: 0.6 },
  restoration: { carbon: 0.8, water: 0.9, bio: 0.9, soil: 0.8 },
  conservation: { carbon: 0.6, water: 0.7, bio: 1.0, soil: 0.5 },
  education: { carbon: 0.2, water: 0.2, bio: 0.3, soil: 0.2 },
  healthcare: { carbon: 0.1, water: 0.1, bio: 0.1, soil: 0.1 },
  financing: { carbon: 0.5, water: 0.5, bio: 0.5, soil: 0.5 },
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    if (req.method === 'POST') {
      const body: ValuationRequest = await req.json();
      console.log('Valuation request received:', body);

      if (!body.ecosystem_id) {
        return new Response(
          JSON.stringify({ error: 'ecosystem_id is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Fetch ecosystem data
      const { data: ecosystem, error: ecoError } = await supabase
        .from('ecosystem_units')
        .select('*, regions(*)')
        .eq('id', body.ecosystem_id)
        .maybeSingle();

      if (ecoError || !ecosystem) {
        console.error('Ecosystem fetch error:', ecoError);
        return new Response(
          JSON.stringify({ error: 'Ecosystem not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Fetch latest metrics
      const { data: metrics } = await supabase
        .from('ecosystem_metrics')
        .select('*')
        .eq('ecosystem_id', body.ecosystem_id)
        .order('recorded_at', { ascending: false })
        .limit(1);

      // Fetch recent signals for data quality assessment
      const { data: signals } = await supabase
        .from('signals')
        .select('*')
        .eq('ecosystem_id', body.ecosystem_id)
        .order('recorded_at', { ascending: false })
        .limit(10);

      const latestMetric = metrics?.[0];
      const signalCount = signals?.length || 0;

      // Calculate data quality score from signals
      const dataQualityScore = signals?.reduce((acc, s) => {
        return acc + ((s.credibility_score || 0.5) + (s.temporal_relevance || 0.5) + (s.spatial_accuracy || 0.5)) / 3;
      }, 0) / Math.max(signalCount, 1) || 0.5;

      // Get ecosystem type multiplier
      const typeMultiplier = typeMultipliers[ecosystem.type] || 1.0;
      const areaFactor = Math.sqrt(ecosystem.area_hectares || 1000) / 100;

      // Get action coefficients
      const actionType = body.action_type || 'restoration';
      const coefficients = actionCoefficients[actionType] || actionCoefficients.restoration;

      // Calculate base projections from current metrics or estimates
      const baseCarbon = latestMetric?.carbon_sequestration_tons || 100;
      const baseWater = latestMetric?.water_retention_m3 || 5000;
      const baseBio = latestMetric?.biodiversity_index || 0.5;
      const baseSoil = latestMetric?.soil_health_percent || 50;

      // Project future impact with uncertainty ranges
      const carbonImpact: [number, number] = [
        Math.round(baseCarbon * coefficients.carbon * typeMultiplier * areaFactor * 0.85),
        Math.round(baseCarbon * coefficients.carbon * typeMultiplier * areaFactor * 1.15),
      ];

      const waterImpact: [number, number] = [
        Math.round(baseWater * coefficients.water * typeMultiplier * areaFactor * 0.8),
        Math.round(baseWater * coefficients.water * typeMultiplier * areaFactor * 1.2),
      ];

      const bioImpact: [number, number] = [
        Number((baseBio * coefficients.bio * 0.9).toFixed(3)),
        Number((Math.min(baseBio * coefficients.bio * 1.1, 1.0)).toFixed(3)),
      ];

      const soilImpact: [number, number] = [
        Math.round(baseSoil * coefficients.soil * 0.9),
        Math.round(Math.min(baseSoil * coefficients.soil * 1.1, 100)),
      ];

      // Calculate economic value based on carbon and ecosystem services
      const carbonValue = [
        carbonImpact[0] * CARBON_PRICE_MIN,
        carbonImpact[1] * CARBON_PRICE_MAX,
      ];

      // Add ecosystem service value (water, biodiversity)
      const ecosystemServiceMultiplier = 1.5; // Additional value from co-benefits
      const economicValue: [number, number] = [
        Math.round(carbonValue[0] * ecosystemServiceMultiplier),
        Math.round(carbonValue[1] * ecosystemServiceMultiplier),
      ];

      // Calculate confidence based on data quality and signal coverage
      const baseConfidence = latestMetric ? 
        ((latestMetric.carbon_confidence || 0.5) + 
         (latestMetric.water_confidence || 0.5) + 
         (latestMetric.biodiversity_confidence || 0.5) + 
         (latestMetric.soil_confidence || 0.5)) / 4 : 0.5;
      
      const confidence = Number(((baseConfidence + dataQualityScore) / 2).toFixed(2));

      // Estimate time to impact based on action type
      const timeToImpact: [number, number] = actionType === 'reforestation' ? [3, 7] :
        actionType === 'restoration' ? [2, 5] :
        actionType === 'conservation' ? [1, 3] : [2, 6];

      const response: ValuationResponse = {
        ecosystem_id: body.ecosystem_id,
        projected_impact: {
          carbon_sequestration_tons: carbonImpact,
          water_retention_m3: waterImpact,
          biodiversity_impact: bioImpact,
          soil_improvement_percent: soilImpact,
        },
        confidence,
        time_to_impact_years: timeToImpact,
        economic_value_usd: economicValue,
        methodology: 'harmonic_weighted_projection_v1',
        signals_used: signalCount,
        data_quality_score: Number(dataQualityScore.toFixed(2)),
      };

      console.log('Valuation response:', response);

      return new Response(
        JSON.stringify(response),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // GET request - return API info
    return new Response(
      JSON.stringify({
        name: 'Verdant Forge Valuation Engine',
        version: '1.0.0',
        description: 'Converts signals into impact metrics with confidence intervals',
        endpoints: {
          'POST /': 'Calculate valuation for an ecosystem unit',
        },
        required_fields: ['ecosystem_id'],
        optional_fields: ['action_type', 'inputs'],
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Valuation engine error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
