import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface MetricCardProps {
  label: string;
  value: string;
  range?: [string, string];
  confidence?: number;
  icon?: ReactNode;
  variant?: "verdant" | "earth" | "water" | "carbon" | "default";
  className?: string;
}

const variantStyles = {
  verdant: "border-verdant/30 hover:border-verdant/60",
  earth: "border-earth/30 hover:border-earth/60",
  water: "border-water/30 hover:border-water/60",
  carbon: "border-carbon/30 hover:border-carbon/60",
  default: "border-border hover:border-muted-foreground/30",
};

const confidenceColor = (confidence: number) => {
  if (confidence >= 0.8) return "bg-confidence-high";
  if (confidence >= 0.5) return "bg-confidence-medium";
  return "bg-confidence-low";
};

export function MetricCard({
  label,
  value,
  range,
  confidence,
  icon,
  variant = "default",
  className,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        "group relative bg-card border rounded-lg p-4 transition-all duration-300 glow-card",
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="metric-label">{label}</span>
        {icon && (
          <div className="text-muted-foreground group-hover:text-foreground transition-colors">
            {icon}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="metric-value">{value}</div>
        
        {range && (
          <div className="data-point text-muted-foreground">
            <span className="text-xs">Range:</span>
            <span className="text-foreground">[{range[0]}, {range[1]}]</span>
          </div>
        )}

        {confidence !== undefined && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Confidence</span>
              <span className="font-mono text-foreground">{(confidence * 100).toFixed(0)}%</span>
            </div>
            <div className="confidence-bar">
              <div
                className={cn("confidence-fill", confidenceColor(confidence))}
                style={{ width: `${confidence * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
