import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  Globe2, 
  Activity, 
  TrendingUp, 
  Droplets, 
  Trees, 
  Gauge 
} from "lucide-react";

interface StatsGridProps {
  totalEcosystems: number;
  activeEcosystems: number;
  totalHectares: number;
  avgConfidence: number;
  totalCarbon: number;
  totalWater: number;
  className?: string;
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  variant?: "verdant" | "water" | "earth" | "accent" | "default";
  delay?: number;
}

const variantStyles = {
  verdant: "border-verdant/30 hover:border-verdant/50",
  water: "border-water/30 hover:border-water/50",
  earth: "border-earth/30 hover:border-earth/50",
  accent: "border-accent/30 hover:border-accent/50",
  default: "border-border hover:border-muted-foreground/30",
};

const iconStyles = {
  verdant: "text-verdant",
  water: "text-water",
  earth: "text-earth-light",
  accent: "text-accent",
  default: "text-muted-foreground",
};

function StatCard({ label, value, icon, trend, variant = "default", delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={cn(
        "bg-card border rounded-lg p-4 transition-all duration-300",
        variantStyles[variant]
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <div className={iconStyles[variant]}>{icon}</div>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-semibold font-mono">{value}</span>
        {trend && (
          <span className="text-xs text-verdant font-mono mb-1">{trend}</span>
        )}
      </div>
    </motion.div>
  );
}

export function StatsGrid({
  totalEcosystems,
  activeEcosystems,
  totalHectares,
  avgConfidence,
  totalCarbon,
  totalWater,
  className,
}: StatsGridProps) {
  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4", className)}>
      <StatCard
        label="Total Ecosystems"
        value={totalEcosystems}
        icon={<Globe2 className="w-4 h-4" />}
        variant="verdant"
        delay={0}
      />
      <StatCard
        label="Active"
        value={activeEcosystems}
        icon={<Activity className="w-4 h-4" />}
        trend="+2 this month"
        variant="verdant"
        delay={0.05}
      />
      <StatCard
        label="Hectares"
        value={totalHectares >= 1000000 
          ? `${(totalHectares / 1000000).toFixed(1)}M` 
          : totalHectares >= 1000 
            ? `${(totalHectares / 1000).toFixed(0)}K`
            : totalHectares.toFixed(0)
        }
        icon={<TrendingUp className="w-4 h-4" />}
        variant="earth"
        delay={0.1}
      />
      <StatCard
        label="Avg. Confidence"
        value={avgConfidence.toFixed(2)}
        icon={<Gauge className="w-4 h-4" />}
        variant="accent"
        delay={0.15}
      />
      <StatCard
        label="Carbon (tons)"
        value={totalCarbon >= 1000 
          ? `${(totalCarbon / 1000).toFixed(1)}K`
          : totalCarbon.toFixed(0)
        }
        icon={<Trees className="w-4 h-4" />}
        variant="verdant"
        delay={0.2}
      />
      <StatCard
        label="Water (m³)"
        value={totalWater >= 1000000 
          ? `${(totalWater / 1000000).toFixed(1)}M`
          : totalWater >= 1000 
            ? `${(totalWater / 1000).toFixed(0)}K`
            : totalWater.toFixed(0)
        }
        icon={<Droplets className="w-4 h-4" />}
        variant="water"
        delay={0.25}
      />
    </div>
  );
}
