import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { cn } from "@/lib/utils";
import { type EcosystemMetric } from "@/lib/api";
import { format, parseISO } from "date-fns";

interface MetricsChartProps {
  metrics: EcosystemMetric[];
  metric: "carbon" | "water" | "biodiversity" | "soil";
  className?: string;
}

const chartConfig = {
  carbon: {
    label: "Carbon Sequestration (tons)",
    color: "hsl(152 60% 42%)",
    valueKey: "carbon_sequestration_tons",
    rangeKey: "carbon_sequestration_range",
  },
  water: {
    label: "Water Retention (m³)",
    color: "hsl(200 70% 50%)",
    valueKey: "water_retention_m3",
    rangeKey: "water_retention_range",
  },
  biodiversity: {
    label: "Biodiversity Index",
    color: "hsl(32 45% 50%)",
    valueKey: "biodiversity_index",
    rangeKey: "biodiversity_range",
  },
  soil: {
    label: "Soil Health (%)",
    color: "hsl(42 85% 55%)",
    valueKey: "soil_health_percent",
    rangeKey: "soil_health_range",
  },
};

export function MetricsChart({ metrics, metric, className }: MetricsChartProps) {
  const config = chartConfig[metric];

  const chartData = useMemo(() => {
    return metrics.map((m) => {
      const value = m[config.valueKey as keyof EcosystemMetric] as number | null;
      const range = m[config.rangeKey as keyof EcosystemMetric] as { min: number; max: number } | null;
      
      return {
        date: format(parseISO(m.recorded_at), "MMM yy"),
        value: value || 0,
        min: range?.min || (value ? value * 0.9 : 0),
        max: range?.max || (value ? value * 1.1 : 0),
      };
    });
  }, [metrics, config]);

  if (chartData.length === 0) {
    return (
      <div className={cn("h-[300px] flex items-center justify-center text-muted-foreground", className)}>
        No data available
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn("h-[300px]", className)}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={`gradient-${metric}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={config.color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={config.color} stopOpacity={0} />
            </linearGradient>
            <linearGradient id={`gradient-range-${metric}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={config.color} stopOpacity={0.15} />
              <stop offset="95%" stopColor={config.color} stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(200 15% 18%)" />
          <XAxis 
            dataKey="date" 
            tick={{ fill: 'hsl(200 10% 55%)', fontSize: 11 }}
            tickLine={{ stroke: 'hsl(200 15% 18%)' }}
            axisLine={{ stroke: 'hsl(200 15% 18%)' }}
          />
          <YAxis 
            tick={{ fill: 'hsl(200 10% 55%)', fontSize: 11 }}
            tickLine={{ stroke: 'hsl(200 15% 18%)' }}
            axisLine={{ stroke: 'hsl(200 15% 18%)' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(200 18% 9%)',
              border: '1px solid hsl(200 15% 18%)',
              borderRadius: '8px',
              color: 'hsl(140 15% 92%)',
            }}
            labelStyle={{ color: 'hsl(140 15% 92%)' }}
            formatter={(value: number, name: string) => [
              metric === 'biodiversity' ? value.toFixed(3) : value.toLocaleString(),
              name === 'value' ? config.label : name
            ]}
          />
          <Area
            type="monotone"
            dataKey="max"
            stroke="transparent"
            fill={`url(#gradient-range-${metric})`}
            name="Range (max)"
          />
          <Area
            type="monotone"
            dataKey="min"
            stroke="transparent"
            fill="hsl(200 18% 9%)"
            name="Range (min)"
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={config.color}
            strokeWidth={2}
            fill={`url(#gradient-${metric})`}
            name="Value"
            dot={{ fill: config.color, strokeWidth: 0, r: 3 }}
            activeDot={{ r: 5, stroke: config.color, strokeWidth: 2, fill: 'hsl(200 18% 9%)' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
