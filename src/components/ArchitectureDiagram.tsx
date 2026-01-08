import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LayerProps {
  title: string;
  items: string[];
  color: "verdant" | "water" | "earth" | "accent";
  delay: number;
}

const colorStyles = {
  verdant: "border-verdant/40 bg-verdant/5",
  water: "border-water/40 bg-water/5",
  earth: "border-earth/40 bg-earth/5",
  accent: "border-accent/40 bg-accent/5",
};

const dotColors = {
  verdant: "bg-verdant",
  water: "bg-water",
  earth: "bg-earth-light",
  accent: "bg-accent",
};

function Layer({ title, items, color, delay }: LayerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay }}
      className={cn(
        "relative border rounded-lg p-4 transition-all duration-300",
        colorStyles[color]
      )}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className={cn("w-2 h-2 rounded-full", dotColors[color])} />
        <h4 className="text-sm font-semibold uppercase tracking-wider">{title}</h4>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="text-xs font-mono px-2 py-1 rounded bg-secondary/50 text-muted-foreground"
          >
            {item}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export function ArchitectureDiagram() {
  return (
    <div className="space-y-4">
      <Layer
        title="Frontend Layer"
        items={["React/Next.js", "React Native", "Decision Surfaces"]}
        color="verdant"
        delay={0}
      />
      
      <div className="flex justify-center">
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="w-px h-8 bg-border"
        />
      </div>

      <Layer
        title="Backend Services"
        items={["Forge Core API", "Signal Ingestion", "Valuation Engine", "Identity & Trust"]}
        color="water"
        delay={0.2}
      />

      <div className="flex justify-center">
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="w-px h-8 bg-border"
        />
      </div>

      <Layer
        title="Data Layer"
        items={["PostgreSQL", "TimescaleDB", "Object Storage", "Graph DB"]}
        color="earth"
        delay={0.4}
      />

      <div className="flex justify-center">
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.3, delay: 0.7 }}
          className="w-px h-8 bg-border"
        />
      </div>

      <Layer
        title="Intelligence Layer"
        items={["Rule Engines", "ML Models", "Fraud Detection", "Forecasting"]}
        color="accent"
        delay={0.6}
      />
    </div>
  );
}
