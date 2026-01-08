import { supabase } from "@/integrations/supabase/client";

export type EcosystemStatus = 'active' | 'monitoring' | 'degraded' | 'restored';
export type EcosystemType = 'watershed' | 'forest' | 'urban_block' | 'farm' | 'grassland' | 'wetland';

export interface Region {
  id: string;
  name: string;
  country: string;
  continent: string;
}

export interface EcosystemUnit {
  id: string;
  unit_id: string;
  name: string;
  type: EcosystemType;
  status: EcosystemStatus;
  region_id: string | null;
  area_hectares: number | null;
  created_at: string;
  regions?: Region | null;
}

export interface EcosystemMetric {
  id: string;
  ecosystem_id: string;
  recorded_at: string;
  carbon_sequestration_tons: number | null;
  carbon_sequestration_range: unknown;
  carbon_confidence: number | null;
  water_retention_m3: number | null;
  water_retention_range: unknown;
  water_confidence: number | null;
  biodiversity_index: number | null;
  biodiversity_range: unknown;
  biodiversity_confidence: number | null;
  soil_health_percent: number | null;
  soil_health_range: unknown;
  soil_confidence: number | null;
}

export interface Signal {
  id: string;
  ecosystem_id: string;
  source: string;
  signal_type: string;
  value: number | null;
  unit: string | null;
  credibility_score: number | null;
  temporal_relevance: number | null;
  spatial_accuracy: number | null;
  recorded_at: string;
}

export interface Action {
  id: string;
  ecosystem_id: string;
  action_type: string;
  description: string | null;
  inputs: Record<string, unknown>;
  projected_impact: Record<string, unknown> | null;
  confidence: number | null;
  time_to_impact_years: number | null;
  status: string;
  executed_at: string | null;
}

export interface ValuationResponse {
  ecosystem_id: string;
  projected_impact: {
    carbon_sequestration_tons: [number, number];
    water_retention_m3: [number, number];
    biodiversity_impact: [number, number];
    soil_improvement_percent: [number, number];
  };
  confidence: number;
  time_to_impact_years: [number, number];
  economic_value_usd: [number, number];
  methodology: string;
  signals_used: number;
  data_quality_score: number;
}

// Fetch all ecosystem units with their regions
export async function fetchEcosystemUnits() {
  const { data, error } = await supabase
    .from('ecosystem_units')
    .select('*, regions(*)')
    .order('name');
  
  if (error) throw error;
  return data as (EcosystemUnit & { regions: Region | null })[];
}

// Fetch all regions
export async function fetchRegions() {
  const { data, error } = await supabase
    .from('regions')
    .select('*')
    .order('name');
  
  if (error) throw error;
  return data as Region[];
}

// Fetch metrics for a specific ecosystem
export async function fetchEcosystemMetrics(ecosystemId: string) {
  const { data, error } = await supabase
    .from('ecosystem_metrics')
    .select('*')
    .eq('ecosystem_id', ecosystemId)
    .order('recorded_at', { ascending: true });
  
  if (error) throw error;
  return data as EcosystemMetric[];
}

// Fetch latest metric for each ecosystem
export async function fetchLatestMetrics() {
  const { data, error } = await supabase
    .from('ecosystem_metrics')
    .select('*')
    .order('recorded_at', { ascending: false });
  
  if (error) throw error;
  
  // Group by ecosystem_id and get latest
  const latestByEcosystem = new Map<string, EcosystemMetric>();
  (data as EcosystemMetric[]).forEach(metric => {
    if (!latestByEcosystem.has(metric.ecosystem_id)) {
      latestByEcosystem.set(metric.ecosystem_id, metric);
    }
  });
  
  return Array.from(latestByEcosystem.values());
}

// Fetch signals for an ecosystem
export async function fetchSignals(ecosystemId: string) {
  const { data, error } = await supabase
    .from('signals')
    .select('*')
    .eq('ecosystem_id', ecosystemId)
    .order('recorded_at', { ascending: false });
  
  if (error) throw error;
  return data as Signal[];
}

// Fetch actions for an ecosystem
export async function fetchActions(ecosystemId: string) {
  const { data, error } = await supabase
    .from('actions')
    .select('*')
    .eq('ecosystem_id', ecosystemId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as Action[];
}

// Call the valuation engine
export async function getValuation(ecosystemId: string, actionType?: string): Promise<ValuationResponse> {
  const { data, error } = await supabase.functions.invoke('valuation-engine', {
    body: { ecosystem_id: ecosystemId, action_type: actionType },
  });
  
  if (error) throw error;
  return data as ValuationResponse;
}

// Subscribe to realtime updates
export function subscribeToMetrics(callback: (payload: unknown) => void) {
  return supabase
    .channel('ecosystem-metrics-realtime')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'ecosystem_metrics',
    }, callback)
    .subscribe();
}

export function subscribeToSignals(callback: (payload: unknown) => void) {
  return supabase
    .channel('signals-realtime')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'signals',
    }, callback)
    .subscribe();
}
