import { motion } from "motion/react";
import { Database, Box, Cpu, Package, Globe, Users, Layers, CheckCircle2, QrCode } from "lucide-react";

export function IntegrationSection() {
  return (
    <section className="py-32 bg-slate-950 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mb-24">
          <h2 className="text-4xl md:text-5xl font-display font-semibold tracking-tight mb-6">
            Connect to existing systems.
          </h2>
          <p className="text-xl text-slate-400 leading-relaxed">
            Orchestrate data across multiple ERPs, build custom workflows, and connect to third parties using APIs, partner apps or pre-built integrations. Securely connect directly to your end users.
          </p>
        </div>

        {/* Integration Diagram */}
        <div className="relative h-[800px] w-full max-w-6xl mx-auto flex items-center justify-center">
          {/* Background grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.05)_0%,transparent_70%)]"></div>

          {/* Central Hub */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="absolute z-30"
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-indigo-500/20 blur-3xl group-hover:bg-indigo-500/30 transition-all duration-700"></div>
              <div className="w-44 h-44 bg-slate-900 rounded-[3rem] flex items-center justify-center border border-indigo-500/30 shadow-[0_0_80px_rgba(99,102,241,0.15)] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent"></div>
                <span className="text-2xl font-display font-bold tracking-tight text-center leading-tight">
                  <span className="text-indigo-400">Product</span><br />Connect
                </span>
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
                  transition={{ repeat: Infinity, duration: 4 }}
                  className="absolute inset-0 border-2 border-indigo-500/20 rounded-[3rem]"
                />
              </div>
            </div>
          </motion.div>

          {/* Nodes Layer */}
          <div className="absolute inset-0 z-20 pointer-events-none">
            <div className="absolute top-[5%] left-0 right-0 flex justify-center gap-8 md:gap-16">
              <IntegrationNode title="Business Central" icon={<Database className="w-4 h-4" />} delay={0.2} color="slate" />
              <IntegrationNode title="SAP S/4HANA" icon={<Box className="w-4 h-4" />} delay={0.3} color="slate" />
              <IntegrationNode title="Akeneo PIM" icon={<Layers className="w-4 h-4" />} delay={0.4} color="slate" />
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 left-[2%] md:left-[8%] flex flex-col gap-12">
              <IntegrationNode title="Ecoinvent DB" icon={<Globe className="w-4 h-4" />} delay={0.5} color="indigo" />
              <IntegrationNode title="Supplier Portal" icon={<Users className="w-4 h-4" />} delay={0.6} color="indigo" />
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 right-[2%] md:right-[8%] flex flex-col gap-12">
              <IntegrationNode title="Verified EPDs" icon={<CheckCircle2 className="w-4 h-4" />} delay={0.7} color="emerald" reverse />
              <IntegrationNode title="Public DPP" icon={<QrCode className="w-4 h-4" />} delay={0.8} color="emerald" reverse />
            </div>
            <div className="absolute bottom-[5%] left-0 right-0 flex justify-center gap-8 md:gap-16">
              <IntegrationNode title="D2C Spare Parts" icon={<Package className="w-4 h-4" />} delay={0.9} color="rose" />
              <IntegrationNode title="Usage Analytics" icon={<Cpu className="w-4 h-4" />} delay={1.0} color="rose" />
            </div>
          </div>

          {/* Connecting Lines — animated flowing strings */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 1000 800" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="flow-indigo" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0" />
                <stop offset="50%" stopColor="#6366f1" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="flow-emerald" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
                <stop offset="50%" stopColor="#10b981" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="flow-rose" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f43f5e" stopOpacity="0" />
                <stop offset="50%" stopColor="#f43f5e" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            <g fill="none" strokeWidth="1.5" filter="url(#glow)">
              {/* Top lines → indigo (ERP inputs) */}
              <FlowingPath d="M 500 400 C 500 300, 320 250, 320 120" gradient="flow-indigo" phase={0} />
              <FlowingPath d="M 500 400 L 500 120" gradient="flow-indigo" phase={0.4} />
              <FlowingPath d="M 500 400 C 500 300, 680 250, 680 120" gradient="flow-indigo" phase={0.8} />

              {/* Left lines → indigo (data sources in) */}
              <FlowingPath d="M 500 400 C 350 400, 320 350, 200 350" gradient="flow-indigo" phase={1.2} />
              <FlowingPath d="M 500 400 C 350 400, 320 450, 200 450" gradient="flow-indigo" phase={1.6} />

              {/* Right lines → emerald (outputs) */}
              <FlowingPath d="M 500 400 C 650 400, 680 350, 800 350" gradient="flow-emerald" phase={0.6} />
              <FlowingPath d="M 500 400 C 650 400, 680 450, 800 450" gradient="flow-emerald" phase={1.0} />

              {/* Bottom lines → rose (end consumers) */}
              <FlowingPath d="M 500 400 C 500 550, 350 600, 350 720" gradient="flow-rose" phase={0.2} />
              <FlowingPath d="M 500 400 C 500 550, 650 600, 650 720" gradient="flow-rose" phase={0.9} />
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
}

function IntegrationNode({ title, icon, delay, color, reverse = false }: any) {
  const colors: any = {
    slate: "border-slate-800 bg-slate-900/40 text-slate-400",
    indigo: "border-indigo-500/20 bg-indigo-500/5 text-indigo-400",
    emerald: "border-emerald-500/20 bg-emerald-500/5 text-emerald-400",
    rose: "border-rose-500/20 bg-rose-500/5 text-rose-400",
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`px-5 py-2.5 border rounded-2xl flex items-center gap-3 backdrop-blur-xl pointer-events-auto cursor-default hover:border-white/20 transition-all duration-500 hover:scale-105 ${colors[color]} ${reverse ? "flex-row-reverse" : ""}`}
    >
      <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center">{icon}</div>
      <span className="text-xs font-bold tracking-widest uppercase">{title}</span>
    </motion.div>
  );
}

/**
 * A path that:
 * 1. Draws in immediately with a short initial animation.
 * 2. Then runs a continuous "flow" effect — a bright dot (short dasharray dash) travels
 *    along the full path length using strokeDashoffset animation. Multiple overlapping
 *    instances with different phases give the appearance of a data-stream river.
 */
function FlowingPath({ d, gradient, phase }: { d: string; gradient: string; phase: number }) {
  const totalLength = 600; // generous upper bound, SVG will clip naturally
  const dashLen = 80;      // length of the bright travelling segment
  const gap = totalLength; // only one dot visible at a time per instance

  return (
    <g>
      {/* Static faint base line */}
      <motion.path
        d={d}
        stroke={`url(#${gradient})`}
        strokeOpacity={0.15}
        strokeWidth={1}
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />

      {/* Flowing bright traveller — 3 staggered copies per path */}
      {[0, 0.33, 0.66].map((offset, i) => (
        <motion.path
          key={i}
          d={d}
          stroke={`url(#${gradient})`}
          strokeWidth={1.8}
          strokeDasharray={`${dashLen} ${gap}`}
          initial={{ strokeDashoffset: totalLength + dashLen }}
          animate={{ strokeDashoffset: -(dashLen) }}
          transition={{
            repeat: Infinity,
            duration: 3.5,
            ease: "linear",
            delay: phase + offset * 3.5,
          }}
        />
      ))}
    </g>
  );
}
