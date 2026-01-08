-- Create enum types for ecosystem data
CREATE TYPE public.ecosystem_status AS ENUM ('active', 'monitoring', 'degraded', 'restored');
CREATE TYPE public.ecosystem_type AS ENUM ('watershed', 'forest', 'urban_block', 'farm', 'grassland', 'wetland');
CREATE TYPE public.action_type AS ENUM ('reforestation', 'restoration', 'education', 'healthcare', 'financing', 'conservation');
CREATE TYPE public.signal_source AS ENUM ('iot_sensor', 'satellite', 'human_report', 'financial_flow', 'audit');

-- Create regions table
CREATE TABLE public.regions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  continent TEXT NOT NULL,
  coordinates JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create ecosystem_units table
CREATE TABLE public.ecosystem_units (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  unit_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  type ecosystem_type NOT NULL DEFAULT 'watershed',
  status ecosystem_status NOT NULL DEFAULT 'monitoring',
  region_id UUID REFERENCES public.regions(id) ON DELETE SET NULL,
  area_hectares NUMERIC(12, 2),
  coordinates JSONB,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create ecosystem_metrics table for time-series data
CREATE TABLE public.ecosystem_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ecosystem_id UUID NOT NULL REFERENCES public.ecosystem_units(id) ON DELETE CASCADE,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  carbon_sequestration_tons NUMERIC(10, 2),
  carbon_sequestration_range JSONB,
  carbon_confidence NUMERIC(3, 2) CHECK (carbon_confidence >= 0 AND carbon_confidence <= 1),
  water_retention_m3 NUMERIC(12, 2),
  water_retention_range JSONB,
  water_confidence NUMERIC(3, 2) CHECK (water_confidence >= 0 AND water_confidence <= 1),
  biodiversity_index NUMERIC(4, 3),
  biodiversity_range JSONB,
  biodiversity_confidence NUMERIC(3, 2) CHECK (biodiversity_confidence >= 0 AND biodiversity_confidence <= 1),
  soil_health_percent NUMERIC(5, 2),
  soil_health_range JSONB,
  soil_confidence NUMERIC(3, 2) CHECK (soil_confidence >= 0 AND soil_confidence <= 1),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create signals table for raw data ingestion
CREATE TABLE public.signals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ecosystem_id UUID NOT NULL REFERENCES public.ecosystem_units(id) ON DELETE CASCADE,
  source signal_source NOT NULL,
  source_id TEXT,
  signal_type TEXT NOT NULL,
  value NUMERIC,
  unit TEXT,
  raw_data JSONB,
  credibility_score NUMERIC(3, 2) CHECK (credibility_score >= 0 AND credibility_score <= 1),
  temporal_relevance NUMERIC(3, 2) CHECK (temporal_relevance >= 0 AND temporal_relevance <= 1),
  spatial_accuracy NUMERIC(3, 2) CHECK (spatial_accuracy >= 0 AND spatial_accuracy <= 1),
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create actions table
CREATE TABLE public.actions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ecosystem_id UUID NOT NULL REFERENCES public.ecosystem_units(id) ON DELETE CASCADE,
  action_type action_type NOT NULL,
  description TEXT,
  inputs JSONB NOT NULL DEFAULT '{}',
  projected_impact JSONB,
  confidence NUMERIC(3, 2) CHECK (confidence >= 0 AND confidence <= 1),
  time_to_impact_years NUMERIC(4, 1),
  status TEXT DEFAULT 'planned',
  executed_at TIMESTAMP WITH TIME ZONE,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create value_tokens table for accounting
CREATE TABLE public.value_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ecosystem_id UUID NOT NULL REFERENCES public.ecosystem_units(id) ON DELETE CASCADE,
  action_id UUID REFERENCES public.actions(id) ON DELETE SET NULL,
  token_type TEXT NOT NULL,
  value NUMERIC(12, 4) NOT NULL,
  unit TEXT NOT NULL,
  verified BOOLEAN DEFAULT false,
  verification_method TEXT,
  issued_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ecosystem_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ecosystem_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.value_tokens ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public read access (dashboard is public facing)
CREATE POLICY "Public read access for regions" ON public.regions FOR SELECT USING (true);
CREATE POLICY "Public read access for ecosystem_units" ON public.ecosystem_units FOR SELECT USING (true);
CREATE POLICY "Public read access for ecosystem_metrics" ON public.ecosystem_metrics FOR SELECT USING (true);
CREATE POLICY "Public read access for signals" ON public.signals FOR SELECT USING (true);
CREATE POLICY "Public read access for actions" ON public.actions FOR SELECT USING (true);
CREATE POLICY "Public read access for value_tokens" ON public.value_tokens FOR SELECT USING (true);

-- Create indexes for performance
CREATE INDEX idx_ecosystem_units_status ON public.ecosystem_units(status);
CREATE INDEX idx_ecosystem_units_type ON public.ecosystem_units(type);
CREATE INDEX idx_ecosystem_units_region ON public.ecosystem_units(region_id);
CREATE INDEX idx_ecosystem_metrics_ecosystem ON public.ecosystem_metrics(ecosystem_id);
CREATE INDEX idx_ecosystem_metrics_recorded ON public.ecosystem_metrics(recorded_at);
CREATE INDEX idx_signals_ecosystem ON public.signals(ecosystem_id);
CREATE INDEX idx_signals_recorded ON public.signals(recorded_at);
CREATE INDEX idx_actions_ecosystem ON public.actions(ecosystem_id);
CREATE INDEX idx_value_tokens_ecosystem ON public.value_tokens(ecosystem_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_regions_updated_at BEFORE UPDATE ON public.regions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_ecosystem_units_updated_at BEFORE UPDATE ON public.ecosystem_units FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_actions_updated_at BEFORE UPDATE ON public.actions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for ecosystem_metrics and signals
ALTER PUBLICATION supabase_realtime ADD TABLE public.ecosystem_metrics;
ALTER PUBLICATION supabase_realtime ADD TABLE public.signals;