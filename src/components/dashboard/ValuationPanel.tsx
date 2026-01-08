import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { type ValuationResponse } from "@/lib/api";
import { TrendingUp, DollarSign, Clock, Gauge, Shield } from "lucide-react";

interface ValuationPanelProps {
  valuation: ValuationResponse | null;
  isLoading: boolean;
  className?: string;
}

export function ValuationPanel({ valuation, isLoading, className }: ValuationPanelProps) {
  if (isLoading) {
    return (
      <div className={cn("bg-card border border-border rounded-lg p-6", className)}>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-muted rounded w-1/3" />
          <div className="h-8 bg-muted rounded w-1/2" />
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-muted rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!valuation) {
    return (
      <div className={cn("bg-card border border-border rounded-lg p-6 text-center text-muted-foreground", className)}>
        Select an ecosystem to view valuation
      </div>
    );
  }

  const formatRange = (range: [number, number], decimals = 0) => 
    `[${range[0].toLocaleString(undefined, { maximumFractionDigits: decimals })}, ${range[1].toLocaleString(undefined, { maximumFractionDigits: decimals })}]`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn("bg-card border border-verdant/30 rounded-lg overflow-hidden glow-verdant", className)}
    >
      <div className="px-6 py-4 border-b border-verdant/20 bg-verdant/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-verdant" />
            <h3 className="font-semibold">Valuation Engine</h3>
          </div>
          <span className="text-xs font-mono text-muted-foreground">
            {valuation.methodology}
          </span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Economic Value */}
        <div className="text-center pb-4 border-b border-border">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
            Projected Economic Value
          </div>
          <div className="flex items-center justify-center gap-2">
            <DollarSign className="w-6 h-6 text-accent" />
            <span className="text-3xl font-bold font-mono text-accent">
              {valuation.economic_value_usd[0] >= 1000000 
                ? `${(valuation.economic_value_usd[0] / 1000000).toFixed(1)}M`
                : valuation.economic_value_usd[0] >= 1000 
                  ? `${(valuation.economic_value_usd[0] / 1000).toFixed(0)}K`
                  : valuation.economic_value_usd[0].toFixed(0)
              }
            </span>
            <span className="text-muted-foreground">-</span>
            <span className="text-3xl font-bold font-mono text-accent">
              {valuation.economic_value_usd[1] >= 1000000 
                ? `${(valuation.economic_value_usd[1] / 1000000).toFixed(1)}M`
                : valuation.economic_value_usd[1] >= 1000 
                  ? `${(valuation.economic_value_usd[1] / 1000).toFixed(0)}K`
                  : valuation.economic_value_usd[1].toFixed(0)
              }
            </span>
            <span className="text-muted-foreground text-sm">USD</span>
          </div>
        </div>

        {/* Impact Projections */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-secondary/30 rounded-lg p-3">
            <div className="text-xs text-muted-foreground mb-1">Carbon (tons)</div>
            <div className="font-mono text-sm text-verdant">
              {formatRange(valuation.projected_impact.carbon_sequestration_tons)}
            </div>
          </div>
          <div className="bg-secondary/30 rounded-lg p-3">
            <div className="text-xs text-muted-foreground mb-1">Water (m³)</div>
            <div className="font-mono text-sm text-water">
              {formatRange(valuation.projected_impact.water_retention_m3)}
            </div>
          </div>
          <div className="bg-secondary/30 rounded-lg p-3">
            <div className="text-xs text-muted-foreground mb-1">Biodiversity</div>
            <div className="font-mono text-sm text-earth-light">
              {formatRange(valuation.projected_impact.biodiversity_impact, 3)}
            </div>
          </div>
          <div className="bg-secondary/30 rounded-lg p-3">
            <div className="text-xs text-muted-foreground mb-1">Soil (%)</div>
            <div className="font-mono text-sm text-accent">
              {formatRange(valuation.projected_impact.soil_improvement_percent)}
            </div>
          </div>
        </div>

        {/* Confidence & Metadata */}
        <div className="flex items-center justify-between pt-4 border-t border-border text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Gauge className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Confidence:</span>
              <span className="font-mono text-verdant">{(valuation.confidence * 100).toFixed(0)}%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Time:</span>
              <span className="font-mono">{valuation.time_to_impact_years[0]}-{valuation.time_to_impact_years[1]} yrs</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Signals:</span>
            <span className="font-mono">{valuation.signals_used}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
