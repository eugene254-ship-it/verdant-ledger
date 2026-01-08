import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { type EcosystemUnit, type EcosystemMetric, type Region } from "@/lib/api";
import { Trees, Droplets, Activity, Gauge, ChevronRight, MapPin } from "lucide-react";

interface EcosystemListProps {
  ecosystems: (EcosystemUnit & { regions: Region | null })[];
  metrics: Map<string, EcosystemMetric>;
  selectedId: string | null;
  onSelect: (id: string) => void;
  className?: string;
}

const statusStyles = {
  active: "bg-verdant/20 text-verdant border-verdant/30",
  monitoring: "bg-accent/20 text-accent border-accent/30",
  degraded: "bg-destructive/20 text-destructive border-destructive/30",
  restored: "bg-water/20 text-water border-water/30",
};

const typeIcons = {
  watershed: "🌊",
  forest: "🌲",
  urban_block: "🏙️",
  farm: "🌾",
  grassland: "🌿",
  wetland: "🦆",
};

export function EcosystemList({
  ecosystems,
  metrics,
  selectedId,
  onSelect,
  className,
}: EcosystemListProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {ecosystems.map((ecosystem, index) => {
        const metric = metrics.get(ecosystem.id);
        const isSelected = selectedId === ecosystem.id;
        
        return (
          <motion.div
            key={ecosystem.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            onClick={() => onSelect(ecosystem.id)}
            className={cn(
              "group bg-card border rounded-lg p-4 cursor-pointer transition-all duration-200",
              isSelected 
                ? "border-verdant/50 bg-verdant/5" 
                : "border-border hover:border-muted-foreground/30"
            )}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-xl">{typeIcons[ecosystem.type]}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground">
                      {ecosystem.unit_id}
                    </span>
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-full border capitalize",
                      statusStyles[ecosystem.status]
                    )}>
                      {ecosystem.status}
                    </span>
                  </div>
                  <h4 className="font-medium mt-0.5">{ecosystem.name}</h4>
                </div>
              </div>
              <ChevronRight className={cn(
                "w-4 h-4 text-muted-foreground transition-transform",
                isSelected && "rotate-90 text-verdant"
              )} />
            </div>

            {ecosystem.regions && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                <MapPin className="w-3 h-3" />
                <span>{ecosystem.regions.name}, {ecosystem.regions.country}</span>
              </div>
            )}

            {metric && (
              <div className="grid grid-cols-4 gap-2 pt-3 border-t border-border">
                <div className="text-center">
                  <Trees className="w-3 h-3 mx-auto text-verdant mb-1" />
                  <div className="text-xs font-mono">{metric.carbon_sequestration_tons?.toFixed(0) || '-'}</div>
                  <div className="text-[10px] text-muted-foreground">CO₂ tons</div>
                </div>
                <div className="text-center">
                  <Droplets className="w-3 h-3 mx-auto text-water mb-1" />
                  <div className="text-xs font-mono">
                    {metric.water_retention_m3 
                      ? metric.water_retention_m3 >= 1000 
                        ? `${(metric.water_retention_m3 / 1000).toFixed(0)}K`
                        : metric.water_retention_m3.toFixed(0)
                      : '-'
                    }
                  </div>
                  <div className="text-[10px] text-muted-foreground">m³ water</div>
                </div>
                <div className="text-center">
                  <Activity className="w-3 h-3 mx-auto text-earth-light mb-1" />
                  <div className="text-xs font-mono">{metric.biodiversity_index?.toFixed(2) || '-'}</div>
                  <div className="text-[10px] text-muted-foreground">biodiv.</div>
                </div>
                <div className="text-center">
                  <Gauge className="w-3 h-3 mx-auto text-accent mb-1" />
                  <div className="text-xs font-mono">{metric.soil_health_percent?.toFixed(0) || '-'}%</div>
                  <div className="text-[10px] text-muted-foreground">soil</div>
                </div>
              </div>
            )}
          </motion.div>
        );
      })}

      {ecosystems.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>No ecosystems match your filters</p>
        </div>
      )}
    </div>
  );
}
