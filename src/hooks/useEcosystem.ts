import { useQuery } from "@tanstack/react-query";
import { 
  fetchEcosystemUnits, 
  fetchRegions, 
  fetchEcosystemMetrics, 
  fetchLatestMetrics,
  fetchSignals,
  fetchActions,
  getValuation,
  type EcosystemUnit,
  type Region,
  type EcosystemMetric,
} from "@/lib/api";

export function useEcosystemUnits() {
  return useQuery({
    queryKey: ['ecosystem-units'],
    queryFn: fetchEcosystemUnits,
    staleTime: 30000,
  });
}

export function useRegions() {
  return useQuery({
    queryKey: ['regions'],
    queryFn: fetchRegions,
    staleTime: 60000,
  });
}

export function useEcosystemMetrics(ecosystemId: string | null) {
  return useQuery({
    queryKey: ['ecosystem-metrics', ecosystemId],
    queryFn: () => ecosystemId ? fetchEcosystemMetrics(ecosystemId) : Promise.resolve([]),
    enabled: !!ecosystemId,
    staleTime: 15000,
  });
}

export function useLatestMetrics() {
  return useQuery({
    queryKey: ['latest-metrics'],
    queryFn: fetchLatestMetrics,
    staleTime: 15000,
  });
}

export function useSignals(ecosystemId: string | null) {
  return useQuery({
    queryKey: ['signals', ecosystemId],
    queryFn: () => ecosystemId ? fetchSignals(ecosystemId) : Promise.resolve([]),
    enabled: !!ecosystemId,
    staleTime: 15000,
  });
}

export function useActions(ecosystemId: string | null) {
  return useQuery({
    queryKey: ['actions', ecosystemId],
    queryFn: () => ecosystemId ? fetchActions(ecosystemId) : Promise.resolve([]),
    enabled: !!ecosystemId,
    staleTime: 30000,
  });
}

export function useValuation(ecosystemId: string | null, actionType?: string) {
  return useQuery({
    queryKey: ['valuation', ecosystemId, actionType],
    queryFn: () => ecosystemId ? getValuation(ecosystemId, actionType) : Promise.resolve(null),
    enabled: !!ecosystemId,
    staleTime: 60000,
  });
}

// Helper to get aggregated stats
export function useAggregatedStats() {
  const { data: ecosystems } = useEcosystemUnits();
  const { data: metrics } = useLatestMetrics();
  
  const stats = {
    totalEcosystems: ecosystems?.length || 0,
    activeEcosystems: ecosystems?.filter(e => e.status === 'active').length || 0,
    monitoringEcosystems: ecosystems?.filter(e => e.status === 'monitoring').length || 0,
    degradedEcosystems: ecosystems?.filter(e => e.status === 'degraded').length || 0,
    restoredEcosystems: ecosystems?.filter(e => e.status === 'restored').length || 0,
    totalHectares: ecosystems?.reduce((sum, e) => sum + (e.area_hectares || 0), 0) || 0,
    avgConfidence: metrics?.length 
      ? metrics.reduce((sum, m) => sum + ((m.carbon_confidence || 0) + (m.water_confidence || 0) + (m.biodiversity_confidence || 0) + (m.soil_confidence || 0)) / 4, 0) / metrics.length
      : 0,
    totalCarbon: metrics?.reduce((sum, m) => sum + (m.carbon_sequestration_tons || 0), 0) || 0,
    totalWater: metrics?.reduce((sum, m) => sum + (m.water_retention_m3 || 0), 0) || 0,
  };
  
  return stats;
}
