import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PrimitiveCard } from "@/components/PrimitiveCard";
import { EcosystemUnit } from "@/components/EcosystemUnit";
import { ArchitectureDiagram } from "@/components/ArchitectureDiagram";
import { APIPreview } from "@/components/APIPreview";
import { motion } from "framer-motion";
import { 
  Globe2, 
  Zap, 
  Radio, 
  Coins,
  ArrowRight,
  Shield,
  Scale,
  TrendingUp
} from "lucide-react";

const sampleEcosystem = {
  id: "watershed_KE_042",
  name: "Tana River Watershed",
  type: "Watershed",
  region: "Kenya, East Africa",
  status: "active" as const,
  metrics: {
    carbonSequestration: { value: 365, range: [320, 410] as [number, number], confidence: 0.82 },
    waterRetention: { value: 15000, range: [12000, 18000] as [number, number], confidence: 0.78 },
    biodiversityIndex: { value: 0.73, range: [0.68, 0.79] as [number, number], confidence: 0.85 },
    soilHealth: { value: 67, range: [62, 74] as [number, number], confidence: 0.71 },
  },
};

const primitives = [
  {
    title: "Land / Ecosystem Units",
    description: "A plot, watershed, forest, urban block, farm. Has biophysical state, ownership, history.",
    icon: <Globe2 className="w-5 h-5" />,
    examples: ["watershed", "forest", "urban block"],
    variant: "land" as const,
  },
  {
    title: "Actions",
    description: "Planting, restoration, education, healthcare delivery, financing. Actions consume resources and change state.",
    icon: <Zap className="w-5 h-5" />,
    examples: ["reforestation", "education", "healthcare"],
    variant: "action" as const,
  },
  {
    title: "Signals",
    description: "Sensor data, satellite data, human reports, financial flows. Signals are noisy; truth is probabilistic.",
    icon: <Radio className="w-5 h-5" />,
    examples: ["IoT sensors", "satellite", "reports"],
    variant: "signal" as const,
  },
  {
    title: "Value Tokens",
    description: "Not crypto hype—accounting instruments. Carbon restored, water retained, children protected.",
    icon: <Coins className="w-5 h-5" />,
    examples: ["carbon", "water", "health outcomes"],
    variant: "value" as const,
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background grid-pattern">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg gradient-verdant flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">VF</span>
            </div>
            <span className="font-semibold tracking-tight">Verdant Forge</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="verdant" size="sm">Open Dashboard</Button>
            </Link>
            <Button variant="verdant-outline" size="sm">API Access</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 gradient-glow pointer-events-none" />
        
        <div className="container mx-auto px-6 relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-verdant/30 bg-verdant/5 text-verdant text-sm font-mono mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-verdant animate-pulse" />
              Production-Grade Regeneration Infrastructure
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              The Ledger for{" "}
              <span className="text-gradient-verdant">Life Itself</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Verdant Forge turns degraded systems—ecological, social, economic—into regenerative assets. 
              Measure reality, change incentives, compound over time.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="verdant" size="xl">
                Access Platform
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button variant="command" size="lg">
                <span className="text-muted-foreground mr-2">$</span>
                curl api.verdantforge.io/status
              </Button>
            </div>
          </motion.div>

          {/* Key metrics */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-20 grid grid-cols-3 gap-8 max-w-3xl mx-auto"
          >
            {[
              { value: "2.4M", label: "Hectares Monitored" },
              { value: "0.84", label: "Avg. Confidence Score" },
              { value: "47", label: "Active Watersheds" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="metric-value text-3xl text-verdant-glow">{stat.value}</div>
                <div className="metric-label mt-2">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* System Primitives */}
      <section className="py-20 border-t border-border">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mb-12">
            <h2 className="text-3xl font-bold mb-4">System Primitives</h2>
            <p className="text-muted-foreground">
              Four atomic units that bind together into a ledger + reasoning engine.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {primitives.map((primitive, i) => (
              <PrimitiveCard
                key={primitive.title}
                {...primitive}
                delay={i * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Live Ecosystem Example */}
      <section className="py-20 border-t border-border bg-secondary/20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <div className="max-w-lg mb-8">
                <h2 className="text-3xl font-bold mb-4">Ecosystem Unit</h2>
                <p className="text-muted-foreground">
                  Real-time data from monitored ecosystems. Ranges and confidence intervals—not fake certainty.
                </p>
              </div>
              <EcosystemUnit {...sampleEcosystem} />
            </div>

            <div>
              <div className="max-w-lg mb-8">
                <h2 className="text-3xl font-bold mb-4">API Design</h2>
                <p className="text-muted-foreground">
                  APIs that feel like physics, not paperwork. Probabilistic outputs with confidence scores.
                </p>
              </div>
              <APIPreview />
            </div>
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section className="py-20 border-t border-border">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl font-bold mb-4">Production Architecture</h2>
              <p className="text-muted-foreground mb-8">
                Event-driven, modular, boring where possible. Built to survive audits from UNICEF, governments, insurers, and ESG auditors.
              </p>
              
              <div className="space-y-6">
                {[
                  { icon: Shield, title: "Zero-Trust Security", desc: "Role-based access, cultural data sovereignty" },
                  { icon: Scale, title: "Compliance Layer", desc: "Immutable logs, explainable models" },
                  { icon: TrendingUp, title: "Incentive Engine", desc: "Verified outcomes, not promises" },
                ].map((feature) => (
                  <div key={feature.title} className="flex gap-4 items-start">
                    <div className="primitive-icon bg-secondary text-muted-foreground">
                      <feature.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <ArchitectureDiagram />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-border">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative bg-card border border-verdant/30 rounded-2xl p-12 text-center glow-verdant overflow-hidden"
          >
            {/* Background pattern */}
            <div className="absolute inset-0 grid-pattern opacity-30" />
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Build Logistics for Life
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                Amazon built logistics for goods. Verdant Forge builds logistics for life itself.
                Join us in creating civilizational infrastructure.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button variant="verdant" size="lg">
                  Request Access
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button variant="verdant-outline" size="lg">
                  Read Documentation
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded gradient-verdant flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs">VF</span>
            </div>
            <span>Verdant Forge © 2026</span>
          </div>
          <div className="font-mono text-xs">
            v0.1.0 • Measuring reality, not vibes
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
