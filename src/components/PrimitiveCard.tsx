import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { motion } from "framer-motion";

interface PrimitiveCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  examples: string[];
  variant: "land" | "action" | "signal" | "value";
  delay?: number;
}

const variantStyles = {
  land: {
    container: "hover:border-verdant/50",
    icon: "bg-verdant/10 text-verdant",
    badge: "bg-verdant/10 text-verdant border-verdant/20",
  },
  action: {
    container: "hover:border-earth-light/50",
    icon: "bg-earth/10 text-earth-light",
    badge: "bg-earth/10 text-earth-light border-earth/20",
  },
  signal: {
    container: "hover:border-water/50",
    icon: "bg-water/10 text-water",
    badge: "bg-water/10 text-water border-water/20",
  },
  value: {
    container: "hover:border-accent/50",
    icon: "bg-accent/10 text-accent",
    badge: "bg-accent/10 text-accent border-accent/20",
  },
};

export function PrimitiveCard({
  title,
  description,
  icon,
  examples,
  variant,
  delay = 0,
}: PrimitiveCardProps) {
  const styles = variantStyles[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={cn(
        "group relative bg-card border border-border rounded-xl p-6 transition-all duration-300 glow-card",
        styles.container
      )}
    >
      <div className={cn("primitive-icon mb-4", styles.icon)}>{icon}</div>

      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
        {description}
      </p>

      <div className="flex flex-wrap gap-2">
        {examples.map((example) => (
          <span
            key={example}
            className={cn(
              "text-xs px-2.5 py-1 rounded-full border font-mono",
              styles.badge
            )}
          >
            {example}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
