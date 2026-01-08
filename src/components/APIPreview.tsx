import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface APIPreviewProps {
  className?: string;
}

const requestCode = `POST /actions/restore
{
  "ecosystem_id": "watershed_KE_042",
  "action_type": "reforestation",
  "inputs": {
    "trees": 1200,
    "species": ["acacia", "baobab"],
    "labor_hours": 900
  }
}`;

const responseCode = `{
  "projected_impact": {
    "carbon_sequestration_tons": [320, 410],
    "water_retention_m3": [12000, 18000]
  },
  "confidence": 0.82,
  "time_to_impact": "3-5 years"
}`;

export function APIPreview({ className }: APIPreviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={cn("space-y-4", className)}
    >
      {/* Request */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="px-4 py-2 border-b border-border bg-secondary/30 flex items-center gap-2">
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-verdant/20 text-verdant">
            REQUEST
          </span>
          <span className="text-xs text-muted-foreground font-mono">
            /actions/restore
          </span>
        </div>
        <pre className="p-4 text-sm font-mono text-muted-foreground overflow-x-auto">
          <code>{requestCode}</code>
        </pre>
      </div>

      {/* Arrow */}
      <div className="flex justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col items-center gap-1"
        >
          <div className="w-px h-4 bg-verdant/50" />
          <div className="w-2 h-2 rounded-full bg-verdant animate-pulse" />
          <div className="w-px h-4 bg-verdant/50" />
        </motion.div>
      </div>

      {/* Response */}
      <div className="bg-card border border-verdant/30 rounded-lg overflow-hidden glow-verdant">
        <div className="px-4 py-2 border-b border-verdant/20 bg-verdant/5 flex items-center gap-2">
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-verdant/20 text-verdant">
            RESPONSE
          </span>
          <span className="text-xs text-verdant font-mono">
            200 OK
          </span>
          <span className="ml-auto text-xs text-muted-foreground">
            confidence: 0.82
          </span>
        </div>
        <pre className="p-4 text-sm font-mono text-foreground overflow-x-auto">
          <code className="text-verdant-glow">{responseCode}</code>
        </pre>
      </div>

      <p className="text-center text-xs text-muted-foreground font-mono">
        Notice: ranges, not lies.
      </p>
    </motion.div>
  );
}
