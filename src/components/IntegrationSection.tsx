import { motion } from "motion/react";
import { Database, Box, Cpu, Package, Globe, Users, Layers, CheckCircle2, QrCode, Factory, Truck, Warehouse, Hammer } from "lucide-react";

export function IntegrationSection() {
  return (
    <section className="py-32 bg-slate-950 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mb-24">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-semibold tracking-tight mb-6">
            Connect to existing systems.
          </h2>
          <p className="text-xl text-slate-400 leading-relaxed">
            Orchestrate data across multiple ERPs, build custom workflows, and connect to third parties using APIs, partner apps or pre-built integrations. Securely connect directly to your end users.
          </p>
        </div>

        {/* Integration Diagram */}
        <div className="relative h-[400px] md:h-[600px] lg:h-[800px] w-full max-w-6xl mx-auto flex items-center justify-center">
          {/* Background grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.05)_0%,transparent_70%)]"></div>

          {/* Central Hub */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="absolute z-30"
            style={{ top: "38%", left: "50%", transform: "translate(-50%, -50%)" }}
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-indigo-500/20 blur-3xl group-hover:bg-indigo-500/30 transition-all duration-700"></div>
              <div className="w-28 h-28 md:w-36 md:h-36 lg:w-44 lg:h-44 bg-slate-900 rounded-[2rem] md:rounded-[3rem] flex items-center justify-center border border-indigo-500/30 shadow-[0_0_80px_rgba(99,102,241,0.15)] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent"></div>
                <span className="text-lg md:text-2xl font-display font-bold tracking-tight text-center leading-tight">
                  <span className="text-indigo-400">Product</span><br />Connect
                </span>
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
                  transition={{ repeat: Infinity, duration: 4 }}
                  className="absolute inset-0 border-2 border-indigo-500/20 rounded-[2rem] md:rounded-[3rem]"
                />
              </div>
            </div>
          </motion.div>

          {/* QR Code — below Product Connect */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="absolute z-30"
            style={{ top: "63%", left: "50%", transform: "translate(-50%, -50%)" }}
          >
            <div className="w-14 h-14 md:w-18 md:h-18 lg:w-20 lg:h-20 rounded-2xl bg-slate-900/80 border border-violet-500/30 flex items-center justify-center shadow-[0_0_40px_rgba(139,92,246,0.15)]">
              <QrCode className="w-7 h-7 md:w-9 md:h-9 text-violet-400" />
            </div>
          </motion.div>

          {/* Nodes Layer */}
          <div className="absolute inset-0 z-20 pointer-events-none">
            {/* Top: ERP inputs */}
            <div className="absolute top-[5%] left-0 right-0 flex justify-center gap-8 md:gap-16">
              <IntegrationNode title="Business Central" icon={<Database className="w-4 h-4" />} delay={0.2} color="slate" />
              <IntegrationNode title="SAP S/4HANA" icon={<Box className="w-4 h-4" />} delay={0.3} color="slate" />
              <IntegrationNode title="Akeneo PIM" icon={<Layers className="w-4 h-4" />} delay={0.4} color="slate" />
            </div>

            {/* Left: Suppliers */}
            <div className="absolute top-1/2 -translate-y-1/2 left-[1%] md:left-[4%] flex flex-col gap-6 md:gap-8">
              <IntegrationNode title="Wood Supplier" icon={<Warehouse className="w-4 h-4" />} delay={0.4} color="amber" />
              <IntegrationNode title="Steel Foundry" icon={<Factory className="w-4 h-4" />} delay={0.5} color="amber" />
              <IntegrationNode title="Leather Tannery" icon={<Hammer className="w-4 h-4" />} delay={0.6} color="amber" />
              <IntegrationNode title="Logistics Partner" icon={<Truck className="w-4 h-4" />} delay={0.7} color="amber" />
            </div>

            {/* Right: Data sources & outputs */}
            <div className="absolute top-1/2 -translate-y-1/2 right-[1%] md:right-[4%] flex flex-col gap-5 md:gap-7">
              <IntegrationNode title="Ecoinvent DB" icon={<Globe className="w-4 h-4" />} delay={0.5} color="indigo" reverse />
              <IntegrationNode title="Supplier Portal" icon={<Users className="w-4 h-4" />} delay={0.6} color="indigo" reverse />
              <IntegrationNode title="Verified EPDs" icon={<CheckCircle2 className="w-4 h-4" />} delay={0.7} color="emerald" reverse />
              <IntegrationNode title="Public DPP" icon={<QrCode className="w-4 h-4" />} delay={0.8} color="emerald" reverse />
            </div>

            {/* Bottom: End consumer outputs — below QR */}
            <div className="absolute bottom-[3%] left-0 right-0 flex justify-center gap-8 md:gap-16">
              <IntegrationNode title="D2C Spare Parts" icon={<Package className="w-4 h-4" />} delay={0.9} color="rose" />
              <IntegrationNode title="Usage Analytics" icon={<Cpu className="w-4 h-4" />} delay={1.0} color="rose" />
            </div>
          </div>

          {/* Connecting Lines — preserveAspectRatio="none" so SVG coords map to CSS % positions */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 1000 800" preserveAspectRatio="none">
            <defs>
              <linearGradient id="flow-indigo" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0" />
                <stop offset="50%" stopColor="#6366f1" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="flow-amber" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0" />
                <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="flow-emerald" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
                <stop offset="50%" stopColor="#10b981" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="flow-violet" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0" />
                <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
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
              {/* Hub top (500,216) → Top boxes bottom (297,84), (500,84), (703,84) */}
              <FlowingPath d="M 500 216 C 500 140, 297 100, 297 84" gradient="flow-indigo" phase={0} />
              <FlowingPath d="M 500 216 L 500 84" gradient="flow-indigo" phase={0.4} />
              <FlowingPath d="M 500 216 C 500 140, 703 100, 703 84" gradient="flow-indigo" phase={0.8} />

              {/* Hub left (424,y) → Left box right edges (222,y) */}
              <FlowingPath d="M 424 270 C 340 270, 270 286, 222 286" gradient="flow-amber" phase={0.3} />
              <FlowingPath d="M 424 300 C 340 315, 270 350, 222 362" gradient="flow-amber" phase={0.7} />
              <FlowingPath d="M 424 330 C 340 365, 270 420, 222 438" gradient="flow-amber" phase={1.1} />
              <FlowingPath d="M 424 360 C 340 405, 270 490, 222 514" gradient="flow-amber" phase={1.5} />

              {/* Hub right (576,y) → Right box left edges (804,y) */}
              <FlowingPath d="M 576 270 C 660 270, 740 290, 804 292" gradient="flow-indigo" phase={0.5} />
              <FlowingPath d="M 576 300 C 660 315, 740 355, 804 364" gradient="flow-indigo" phase={0.9} />
              <FlowingPath d="M 576 330 C 660 365, 740 420, 804 436" gradient="flow-emerald" phase={0.6} />
              <FlowingPath d="M 576 360 C 660 405, 740 490, 804 508" gradient="flow-emerald" phase={1.0} />

              {/* Hub bottom (500,392) → QR top (500,464) */}
              <FlowingPath d="M 500 392 L 500 464" gradient="flow-violet" phase={0.2} />

              {/* QR bottom (500,544) → Bottom boxes (390,754), (610,754) */}
              <FlowingPath d="M 500 544 C 500 630, 390 700, 390 754" gradient="flow-rose" phase={0.4} />
              <FlowingPath d="M 500 544 C 500 630, 610 700, 610 754" gradient="flow-rose" phase={0.9} />
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
    amber: "border-amber-500/20 bg-amber-500/5 text-amber-400",
    rose: "border-rose-500/20 bg-rose-500/5 text-rose-400",
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`px-3 py-2 md:px-5 md:py-2.5 border rounded-xl md:rounded-2xl flex items-center gap-2 md:gap-3 backdrop-blur-xl pointer-events-auto cursor-default hover:border-white/20 transition-all duration-500 hover:scale-105 ${colors[color]} ${reverse ? "flex-row-reverse" : ""}`}
    >
      <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center">{icon}</div>
      <span className="text-[10px] md:text-xs font-bold tracking-widest uppercase">{title}</span>
    </motion.div>
  );
}

function FlowingPath({ d, gradient, phase }: { d: string; gradient: string; phase: number }) {
  const totalLength = 600;
  const dashLen = 80;
  const gap = totalLength;

  return (
    <g>
      <motion.path
        d={d}
        stroke={`url(#${gradient})`}
        strokeOpacity={0.15}
        strokeWidth={1}
        vectorEffect="non-scaling-stroke"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
      {[0, 0.33, 0.66].map((offset, i) => (
        <motion.path
          key={i}
          d={d}
          stroke={`url(#${gradient})`}
          strokeWidth={1.8}
          vectorEffect="non-scaling-stroke"
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
