import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardFilters } from "@/components/dashboard/DashboardFilters";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { EcosystemList } from "@/components/dashboard/EcosystemList";
import { MetricsChart } from "@/components/dashboard/MetricsChart";
import { ValuationPanel } from "@/components/dashboard/ValuationPanel";
import { 
  useEcosystemUnits, 
  useRegions, 
  useLatestMetrics,
  useEcosystemMetrics,
  useValuation,
  useAggregatedStats
} from "@/hooks/useEcosystem";
import { subscribeToMetrics } from "@/lib/api";
import { type EcosystemStatus, type EcosystemType, type EcosystemMetric } from "@/lib/api";
import { ArrowLeft, RefreshCw, Trees, Droplets, Activity, Gauge } from "lucide-react";

export default function Dashboard() {
  const [selectedEcosystem, setSelectedEcosystem] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<EcosystemStatus | null>(null);
  const [selectedType, setSelectedType] = useState<EcosystemType | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMetric, setActiveMetric] = useState<"carbon" | "water" | "biodiversity" | "soil">("carbon");

  const { data: ecosystems, isLoading: loadingEcosystems, refetch: refetchEcosystems } = useEcosystemUnits();
  const { data: regions, isLoading: loadingRegions } = useRegions();
  const { data: latestMetrics, refetch: refetchMetrics } = useLatestMetrics();
  const { data: ecosystemMetrics } = useEcosystemMetrics(selectedEcosystem);
  const { data: valuation, isLoading: loadingValuation } = useValuation(selectedEcosystem);
  const stats = useAggregatedStats();

  // Create a map of latest metrics by ecosystem ID
  const metricsMap = useMemo(() => {
    const map = new Map<string, EcosystemMetric>();
    latestMetrics?.forEach(m => map.set(m.ecosystem_id, m));
    return map;
  }, [latestMetrics]);

  // Filter ecosystems
  const filteredEcosystems = useMemo(() => {
    if (!ecosystems) return [];
    
    return ecosystems.filter(eco => {
      if (selectedRegion && eco.region_id !== selectedRegion) return false;
      if (selectedStatus && eco.status !== selectedStatus) return false;
      if (selectedType && eco.type !== selectedType) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!eco.name.toLowerCase().includes(query) && 
            !eco.unit_id.toLowerCase().includes(query)) {
          return false;
        }
      }
      return true;
    });
  }, [ecosystems, selectedRegion, selectedStatus, selectedType, searchQuery]);

  // Subscribe to realtime updates
  useEffect(() => {
    const channel = subscribeToMetrics(() => {
      refetchMetrics();
    });

    return () => {
      channel.unsubscribe();
    };
  }, [refetchMetrics]);

  const handleRefresh = () => {
    refetchEcosystems();
    refetchMetrics();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg gradient-verdant flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">VF</span>
              </div>
              <div>
                <h1 className="font-semibold">Ecosystem Dashboard</h1>
                <p className="text-xs text-muted-foreground">Real-time monitoring</p>
              </div>
            </div>
          </div>
          <Button variant="verdant-ghost" size="sm" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <StatsGrid
            totalEcosystems={stats.totalEcosystems}
            activeEcosystems={stats.activeEcosystems}
            totalHectares={stats.totalHectares}
            avgConfidence={stats.avgConfidence}
            totalCarbon={stats.totalCarbon}
            totalWater={stats.totalWater}
            className="mb-8"
          />
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-6"
        >
          <DashboardFilters
            regions={regions || []}
            selectedRegion={selectedRegion}
            onRegionChange={setSelectedRegion}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            selectedType={selectedType}
            onTypeChange={setSelectedType}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Ecosystem List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-card border border-border rounded-lg p-4 max-h-[700px] overflow-y-auto">
              <h2 className="font-semibold mb-4">Ecosystem Units</h2>
              {loadingEcosystems ? (
                <div className="space-y-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-32 bg-muted rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : (
                <EcosystemList
                  ecosystems={filteredEcosystems}
                  metrics={metricsMap}
                  selectedId={selectedEcosystem}
                  onSelect={setSelectedEcosystem}
                />
              )}
            </div>
          </motion.div>

          {/* Charts & Valuation */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Metrics Charts */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">
                  {selectedEcosystem 
                    ? `Metrics: ${ecosystems?.find(e => e.id === selectedEcosystem)?.name || 'Selected Ecosystem'}`
                    : 'Select an ecosystem to view metrics'
                  }
                </h2>
              </div>

              {selectedEcosystem && ecosystemMetrics && ecosystemMetrics.length > 0 ? (
                <Tabs value={activeMetric} onValueChange={(v) => setActiveMetric(v as typeof activeMetric)}>
                  <TabsList className="mb-4">
                    <TabsTrigger value="carbon" className="gap-2">
                      <Trees className="w-4 h-4" />
                      Carbon
                    </TabsTrigger>
                    <TabsTrigger value="water" className="gap-2">
                      <Droplets className="w-4 h-4" />
                      Water
                    </TabsTrigger>
                    <TabsTrigger value="biodiversity" className="gap-2">
                      <Activity className="w-4 h-4" />
                      Biodiversity
                    </TabsTrigger>
                    <TabsTrigger value="soil" className="gap-2">
                      <Gauge className="w-4 h-4" />
                      Soil
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="carbon">
                    <MetricsChart metrics={ecosystemMetrics} metric="carbon" />
                  </TabsContent>
                  <TabsContent value="water">
                    <MetricsChart metrics={ecosystemMetrics} metric="water" />
                  </TabsContent>
                  <TabsContent value="biodiversity">
                    <MetricsChart metrics={ecosystemMetrics} metric="biodiversity" />
                  </TabsContent>
                  <TabsContent value="soil">
                    <MetricsChart metrics={ecosystemMetrics} metric="soil" />
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  {selectedEcosystem ? 'No historical data available' : 'Select an ecosystem to view metrics'}
                </div>
              )}
            </div>

            {/* Valuation Panel */}
            <ValuationPanel
              valuation={valuation}
              isLoading={loadingValuation && !!selectedEcosystem}
            />
          </motion.div>
        </div>
      </main>
    </div>
  );
}
