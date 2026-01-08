import { cn } from "@/lib/utils";
import { MetricCard } from "./MetricCard";
import { Droplets, Trees, Wind, Activity } from "lucide-react";
import { motion } from "framer-motion";

interface EcosystemUnitProps {
  id: string;
  name: string;
  type: string;
  region: string;
  status: "active" | "monitoring" | "degraded";
  metrics: {
    carbonSequestration: { value: number; range: [number, number]; confidence: number };
    waterRetention: { value: number; range: [number, number]; confidence: number };
    biodiversityIndex: { value: number; range: [number, number]; confidence: number };
    soilHealth: { value: number; range: [number, number]; confidence: number };
  };
  className?: string;
}

const statusStyles = {
  active: "bg-verdant/20 text-verdant border-verdant/30",
  monitoring: "bg-accent/20 text-accent border-accent/30",
  degraded: "bg-destructive/20 text-destructive border-destructive/30",
};

export function EcosystemUnit({
  id,
  name,
  type,
  region,
  status,
  metrics,
  className,
}: EcosystemUnitProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "bg-card border border-border rounded-xl overflow-hidden glow-card",
        className
      )}
    >
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs text-muted-foreground">{id}</span>
              <span className={cn("text-xs px-2 py-0.5 rounded-full border capitalize", statusStyles[status])}>
                {status}
              </span>
            </div>
            <h3 className="text-xl font-semibold">{name}</h3>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground uppercase tracking-wider">{type}</div>
            <div className="text-sm text-foreground">{region}</div>
          </div>
        </div>

        {/* Mini visualization bar */}
        <div className="flex gap-1 h-1.5 rounded-full overflow-hidden bg-muted">
          <div className="bg-verdant" style={{ width: `${metrics.carbonSequestration.confidence * 25}%` }} />
          <div className="bg-water" style={{ width: `${metrics.waterRetention.confidence * 25}%` }} />
          <div className="bg-earth-light" style={{ width: `${metrics.biodiversityIndex.confidence * 25}%` }} />
          <div className="bg-accent" style={{ width: `${metrics.soilHealth.confidence * 25}%` }} />
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="p-6 grid grid-cols-2 gap-4">
        <MetricCard
          label="Carbon Sequestration"
          value={`${metrics.carbonSequestration.value} tons`}
          range={[`${metrics.carbonSequestration.range[0]}`, `${metrics.carbonSequestration.range[1]}`]}
          confidence={metrics.carbonSequestration.confidence}
          icon={<Trees className="w-4 h-4" />}
          variant="verdant"
        />
        <MetricCard
          label="Water Retention"
          value={`${metrics.waterRetention.value.toLocaleString()} m³`}
          range={[`${metrics.waterRetention.range[0].toLocaleString()}`, `${metrics.waterRetention.range[1].toLocaleString()}`]}
          confidence={metrics.waterRetention.confidence}
          icon={<Droplets className="w-4 h-4" />}
          variant="water"
        />
        <MetricCard
          label="Biodiversity Index"
          value={metrics.biodiversityIndex.value.toFixed(2)}
          range={[metrics.biodiversityIndex.range[0].toFixed(2), metrics.biodiversityIndex.range[1].toFixed(2)]}
          confidence={metrics.biodiversityIndex.confidence}
          icon={<Activity className="w-4 h-4" />}
          variant="earth"
        />
        <MetricCard
          label="Soil Health"
          value={`${metrics.soilHealth.value}%`}
          range={[`${metrics.soilHealth.range[0]}%`, `${metrics.soilHealth.range[1]}%`]}
          confidence={metrics.soilHealth.confidence}
          icon={<Wind className="w-4 h-4" />}
          variant="carbon"
        />
      </div>
    </motion.div>
  );
}
