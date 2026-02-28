import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Box, Layers, Users, Truck, TreePine, Cpu, QrCode, Sparkles, Ship, Train, MapPin } from "lucide-react";
import { FinishedProduct3DCanvas, RawMaterial3DCanvas, Components3DCanvas, PassportChair3DCanvas } from "./Native3DModels";

export function StorytellingScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const lineProgress = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // Text opacities — 7 steps
  const op1 = useTransform(scrollYProgress, [0, 0.05, 0.1, 0.15], [0, 1, 1, 0]);
  const op2 = useTransform(scrollYProgress, [0.14, 0.19, 0.24, 0.29], [0, 1, 1, 0]);
  const op3 = useTransform(scrollYProgress, [0.28, 0.33, 0.38, 0.43], [0, 1, 1, 0]);
  const op4 = useTransform(scrollYProgress, [0.42, 0.47, 0.52, 0.57], [0, 1, 1, 0]);
  const op5 = useTransform(scrollYProgress, [0.57, 0.62, 0.67, 0.72], [0, 1, 1, 0]);
  const op6 = useTransform(scrollYProgress, [0.71, 0.76, 0.81, 0.86], [0, 1, 1, 0]);
  const op7 = useTransform(scrollYProgress, [0.85, 0.9, 0.95, 1], [0, 1, 1, 1]);

  // Visual opacities
  const vOp1 = useTransform(scrollYProgress, [0, 0.1, 0.15], [1, 1, 0]);
  const vOp2 = useTransform(scrollYProgress, [0.1, 0.15, 0.25, 0.3], [0, 1, 1, 0]);
  const vOp3 = useTransform(scrollYProgress, [0.25, 0.3, 0.4, 0.45], [0, 1, 1, 0]);
  const vOp4 = useTransform(scrollYProgress, [0.4, 0.45, 0.55, 0.6], [0, 1, 1, 0]);
  const vOp5 = useTransform(scrollYProgress, [0.55, 0.6, 0.7, 0.75], [0, 1, 1, 0]);
  const vOp6 = useTransform(scrollYProgress, [0.7, 0.75, 0.85, 0.9], [0, 1, 1, 0]);
  const vOp7 = useTransform(scrollYProgress, [0.85, 0.9, 1], [0, 1, 1]);

  // Pointer events for interactive visuals
  const pView1 = useTransform(scrollYProgress, [0, 0.1, 0.15], ["auto", "auto", "none"]);
  const pView2 = useTransform(scrollYProgress, [0.1, 0.15, 0.25, 0.3], ["none", "auto", "auto", "none"]);
  const pView3 = useTransform(scrollYProgress, [0.25, 0.3, 0.4, 0.45], ["none", "auto", "auto", "none"]);
  const pView4 = useTransform(scrollYProgress, [0.4, 0.45, 0.55, 0.6], ["none", "auto", "auto", "none"]);
  const pView5 = useTransform(scrollYProgress, [0.55, 0.6, 0.7, 0.75], ["none", "auto", "auto", "none"]);
  const pView6 = useTransform(scrollYProgress, [0.7, 0.75, 0.85, 0.9], ["none", "auto", "auto", "none"]);
  const pView7 = useTransform(scrollYProgress, [0.85, 0.9, 1], ["none", "auto", "auto"]);

  return (
    <>
    <section id="story" ref={containerRef} className="relative h-[700vh] bg-slate-900 text-white">
      {/* Header section */}
      <div className="absolute top-0 left-0 right-0 pt-24 pb-16 z-20 pointer-events-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-semibold tracking-tight mb-6">
              How it works
            </h2>
            <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
              From construction model to certified Digital Product Passport in seven steps.
              Scroll to see how Product Connect digitises your product into a verified digital twin.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="sticky top-0 h-screen overflow-hidden flex items-center">

        {/* Metro Line */}
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-slate-800 md:-translate-x-1/2 z-0">
          <motion.div
            className="absolute top-0 left-0 right-0 bg-gradient-to-b from-indigo-500 to-violet-500"
            style={{ height: lineProgress }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 flex flex-col md:flex-row items-center gap-12">

          {/* ── Text panel (left) ── */}
          <div className="w-full md:w-[44%] pl-12 md:pl-0 md:pr-12 relative min-h-[280px] md:h-[420px] flex items-center">

            {[
              { op: op1, icon: <Box className="w-5 h-5" />, title: "Ingest Your Model", body: "Start with your product. Upload your construction model — BIM, IFC, or 3D CAD — and we automatically create a digital twin, splitting it into every component and sub-assembly." },
              { op: op2, icon: <Layers className="w-5 h-5" />, title: "Add Component Details", body: "Enrich each component with the data that matters. Materials, weights, manufacturing processes, supplier assignments — building a complete digital bill of materials." },
              { op: op3, icon: <Users className="w-5 h-5" />, title: "Supplier Verification", body: "Your suppliers verify details and add context directly. A secure portal lets them confirm specs, upload certifications, and enrich data — no middlemen, no email chains." },
              { op: op4, icon: <TreePine className="w-5 h-5" />, title: "Raw Material Mapping", body: "Material flows are mapped all the way to the source. From the timber forest to the steel foundry — establishing full provenance for every input in your product." },
              { op: op5, icon: <Truck className="w-5 h-5" />, title: "Transport Route Calculation", body: "Detailed transport routes are calculated automatically. Every logistics leg — distances, modes, and emissions — mapped from raw material origin to final assembly." },
              { op: op6, icon: <Cpu className="w-5 h-5" />, title: "Impact Calculation", body: "Our engine calculates precise environmental impact per component. PEF-aligned lifecycle assessment, automated and accurate — without the €15K consultant fee." },
              { op: op7, icon: <QrCode className="w-5 h-5" />, title: "Passport & Certifications", body: "Generate a Digital Product Passport and certifications. A living, GS1-compliant document ready for ESPR 2026 — verifiable, scannable, and built to prove your claims." },
            ].map(({ op, icon, title, body }, i) => (
              <motion.div key={i} style={{ opacity: op }} className="absolute inset-y-0 flex flex-col justify-center">
                <div className="w-11 h-11 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-6 text-indigo-400 shadow-lg shadow-indigo-500/10">
                  {icon}
                </div>
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 tracking-tight leading-[1.1]">{title}</h2>
                <p className="text-base md:text-lg text-slate-400 leading-relaxed max-w-sm">{body}</p>
              </motion.div>
            ))}
          </div>

          {/* ── Visual panel (right) ── */}
          <div className="hidden md:flex flex-1 relative min-h-[550px] md:min-h-[700px] items-center justify-center">

            {/* Visual 1: Chair */}
            <motion.div style={{ opacity: vOp1, pointerEvents: pView1 as any }}
              className="absolute inset-0 flex items-center justify-center">
              <div className="w-[min(100%,85vh)] aspect-square">
                <FinishedProduct3DCanvas />
              </div>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-800/40 backdrop-blur-xl border border-slate-700/40 rounded-2xl px-5 py-3.5 shadow-2xl shadow-black/20 flex items-center gap-4 pointer-events-none">
                <div className="flex flex-col">
                  <p className="text-sm font-semibold text-white">West Elm Slope Leather Chair</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">247 components • 18 suppliers</p>
                </div>
                <div className="flex items-center gap-1.5 pl-3 border-l border-slate-600/40">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Ready</span>
                </div>
              </div>
            </motion.div>

            {/* Visual 2: Components - 3D Model */}
            <motion.div style={{ opacity: vOp2, pointerEvents: pView2 as any }}
              className="absolute inset-0 flex items-center justify-center">
              <div className="w-[min(100%,85vh)] aspect-square">
                <Components3DCanvas />
              </div>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-800/40 backdrop-blur-xl border border-slate-700/40 rounded-2xl px-5 py-3.5 shadow-2xl shadow-black/20 pointer-events-none">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col">
                    <p className="text-sm font-semibold text-white">Steel Bolt — ISO 4762 M8×30</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Material</span>
                      <span className="text-[11px] text-slate-300">Grade 8.8 Steel</span>
                      <span className="text-slate-700">·</span>
                      <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Weight</span>
                      <span className="text-[11px] text-slate-300">24g</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Visual 3: Supplier portal card */}
            <motion.div style={{ opacity: vOp3, pointerEvents: pView3 as any }}
              className="absolute inset-0 flex items-center justify-center">
              <div className="w-80 bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/40 p-6 shadow-2xl shadow-black/20">
                <div className="flex items-center justify-between mb-5">
                  <p className="text-sm font-semibold text-white">Supplier Data Entry</p>
                  <span className="text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 px-2 py-0.5 rounded-full">Live</span>
                </div>
                <div className="space-y-3">
                  {[
                    { label: "Material Composition", value: "FSC oak · 94%" },
                    { label: "Manufacturing Origin", value: "Gdańsk, Poland" },
                    { label: "CO₂ per unit", value: "12.4 kg CO₂e" },
                  ].map(f => (
                    <div key={f.label} className="bg-slate-900/50 rounded-xl border border-slate-700/40 px-4 py-3">
                      <p className="text-[10px] text-slate-500 mb-0.5 font-medium uppercase tracking-wide">{f.label}</p>
                      <p className="text-sm text-slate-200 font-medium">{f.value}</p>
                    </div>
                  ))}
                  <div className="h-10 bg-indigo-600/80 hover:bg-indigo-500/80 rounded-xl flex items-center justify-center cursor-pointer transition-colors">
                    <span className="text-sm text-white font-semibold">Submit & Verify</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Visual 4: Raw Material (3D rock) */}
            <motion.div style={{ opacity: vOp4, pointerEvents: pView4 as any }}
              className="absolute inset-0 flex items-center justify-center">
              <div className="w-[min(100%,85vh)] aspect-square">
                <RawMaterial3DCanvas />
              </div>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-800/40 backdrop-blur-xl border border-slate-700/40 rounded-2xl px-5 py-3.5 shadow-2xl shadow-black/20 pointer-events-none">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col">
                    <p className="text-sm font-semibold text-white">Iron Ore — Raw Material</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Origin</span>
                      <span className="text-[11px] text-slate-300">Kiruna, Sweden</span>
                      <span className="text-slate-700">·</span>
                      <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Grade</span>
                      <span className="text-[11px] text-slate-300">Fe 65%</span>
                    </div>
                  </div>
                  <div className="pl-3 border-l border-slate-600/40 flex flex-col items-center">
                    <span className="text-xs font-bold text-emerald-400">✓</span>
                    <span className="text-[9px] text-slate-500 uppercase">Verified</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Visual 5: Transport Routes Card */}
            <motion.div style={{ opacity: vOp5, pointerEvents: pView5 as any }}
              className="absolute inset-0 flex items-center justify-center">
              <div className="w-full max-w-96 rounded-2xl bg-slate-800/40 backdrop-blur-xl border border-slate-700/40 shadow-2xl shadow-black/20 overflow-hidden">
                {/* Header */}
                <div className="px-5 pt-5 pb-4 border-b border-slate-700/50">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                        <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                      </div>
                      <span className="text-sm font-semibold text-white">Supply Chain Routes</span>
                    </div>
                    <span className="text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full">3 legs</span>
                  </div>
                  <p className="text-[10px] text-slate-500 ml-9">Calculated distances · Real-time tracking</p>
                </div>

                {/* Route legs */}
                <div className="p-4 space-y-3">
                  {[
                    { from: "Kuopio, Finland", to: "Hamburg, Germany", mode: "ship", icon: <Ship className="w-3 h-3" />, dist: "1,842 km", co2: "4.2 kg", time: "3 days", pct: 100 },
                    { from: "Hamburg, Germany", to: "Gdańsk, Poland", mode: "train", icon: <Train className="w-3 h-3" />, dist: "680 km", co2: "1.1 kg", time: "8 hrs", pct: 65 },
                    { from: "Gdańsk, Poland", to: "Copenhagen, Denmark", mode: "truck", icon: <Truck className="w-3 h-3" />, dist: "520 km", co2: "3.8 kg", time: "6 hrs", pct: 30 },
                  ].map((leg, i) => (
                    <div key={i} className="rounded-xl bg-slate-900/40 border border-slate-700/30 p-3">
                      <div className="flex items-center justify-between mb-2.5">
                        <div className="flex items-center gap-2">
                          <div className={`w-5 h-5 rounded-md flex items-center justify-center ${leg.mode === 'ship' ? 'bg-cyan-500/10 text-cyan-400' : leg.mode === 'train' ? 'bg-amber-500/10 text-amber-400' : 'bg-violet-500/10 text-violet-400'}`}>
                            {leg.icon}
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 leading-tight">{leg.from}</p>
                            <p className="text-[10px] text-white font-medium leading-tight">{leg.to}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-white font-semibold">{leg.dist}</p>
                          <p className="text-[9px] text-slate-500">{leg.time}</p>
                        </div>
                      </div>
                      {/* Progress bar */}
                      <div className="h-1 bg-slate-800 rounded-full overflow-hidden relative">
                        <motion.div
                          className={`absolute left-0 top-0 h-full rounded-full ${leg.mode === 'ship' ? 'bg-gradient-to-r from-cyan-500 to-cyan-400' : leg.mode === 'train' ? 'bg-gradient-to-r from-amber-500 to-amber-400' : 'bg-gradient-to-r from-violet-500 to-violet-400'}`}
                          style={{ width: `${leg.pct}%` }}
                        />
                        <motion.div
                          className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-slate-700 border border-slate-500 rounded-full flex items-center justify-center shadow-md"
                          animate={{ left: ["2%", "90%"] }}
                          transition={{ repeat: Infinity, duration: 3 + i * 0.8, ease: "linear", delay: i * 0.6 }}
                        >
                          <div className={`w-1.5 h-1.5 rounded-full ${leg.mode === 'ship' ? 'bg-cyan-400' : leg.mode === 'train' ? 'bg-amber-400' : 'bg-violet-400'}`} />
                        </motion.div>
                      </div>
                      <div className="flex justify-between mt-1.5">
                        <span className="text-[9px] text-slate-600 uppercase tracking-wide">{leg.mode}</span>
                        <span className="text-[9px] text-slate-500">{leg.co2} CO₂e</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary footer */}
                <div className="px-4 pb-4">
                  <div className="rounded-xl bg-indigo-500/5 border border-indigo-500/10 p-3 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wide font-medium">Total Route</p>
                      <p className="text-sm font-bold text-white">3,042 km</p>
                    </div>
                    <div className="h-8 w-px bg-slate-700" />
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wide font-medium">Transport CO₂</p>
                      <p className="text-sm font-bold text-indigo-400">9.1 kg</p>
                    </div>
                    <div className="h-8 w-px bg-slate-700" />
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wide font-medium">Transit Time</p>
                      <p className="text-sm font-bold text-white">~4 days</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Visual 6: LCA Engine */}
            <motion.div style={{ opacity: vOp6, pointerEvents: pView6 as any }}
              className="absolute inset-0 flex items-center justify-center">
              <div className="w-full max-w-[420px] aspect-square relative flex items-center justify-center">
                {/* Outer ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                  className="absolute inset-0 border border-indigo-500/20 rounded-full"
                />
                {/* Second ring */}
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ repeat: Infinity, duration: 14, ease: "linear" }}
                  className="absolute inset-6 border border-dashed border-violet-500/25 rounded-full"
                />
                {/* Third ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                  className="absolute inset-16 border border-dashed border-indigo-400/20 rounded-full"
                />
                {/* Inner ring */}
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
                  className="absolute inset-24 border border-violet-400/15 rounded-full"
                />

                {/* Outer orbiting data nodes */}
                {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => (
                  <motion.div key={`outer-${deg}`}
                    className="absolute w-1.5 h-1.5 bg-indigo-400/60 rounded-full"
                    style={{
                      left: `calc(50% + ${Math.cos(deg * Math.PI / 180) * 195}px - 3px)`,
                      top: `calc(50% + ${Math.sin(deg * Math.PI / 180) * 195}px - 3px)`,
                    }}
                    animate={{ opacity: [0.2, 0.8, 0.2], scale: [0.8, 1.3, 0.8] }}
                    transition={{ repeat: Infinity, duration: 3, delay: deg / 360 * 3 }}
                  />
                ))}

                {/* Mid orbiting data nodes */}
                {[0, 72, 144, 216, 288].map(deg => (
                  <motion.div key={`mid-${deg}`}
                    className="absolute w-2.5 h-2.5 bg-indigo-400 rounded-full shadow-[0_0_12px_#6366f1]"
                    style={{
                      left: `calc(50% + ${Math.cos(deg * Math.PI / 180) * 140}px - 5px)`,
                      top: `calc(50% + ${Math.sin(deg * Math.PI / 180) * 140}px - 5px)`,
                    }}
                    animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.4, 1] }}
                    transition={{ repeat: Infinity, duration: 2.5, delay: deg / 360 * 2.5 }}
                  />
                ))}

                {/* Inner orbiting nodes */}
                {[30, 150, 270].map(deg => (
                  <motion.div key={`inner-${deg}`}
                    className="absolute w-2 h-2 bg-violet-400 rounded-full shadow-[0_0_10px_#8b5cf6]"
                    style={{
                      left: `calc(50% + ${Math.cos(deg * Math.PI / 180) * 85}px - 4px)`,
                      top: `calc(50% + ${Math.sin(deg * Math.PI / 180) * 85}px - 4px)`,
                    }}
                    animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.5, 1] }}
                    transition={{ repeat: Infinity, duration: 2, delay: deg / 360 * 2 }}
                  />
                ))}

                {/* Data streams — lines flowing toward center */}
                {[0, 60, 120, 180, 240, 300].map(deg => (
                  <motion.div key={`stream-${deg}`}
                    className="absolute w-px bg-gradient-to-b from-transparent via-indigo-400/40 to-transparent"
                    style={{
                      height: '60px',
                      left: `calc(50% + ${Math.cos(deg * Math.PI / 180) * 120}px)`,
                      top: `calc(50% + ${Math.sin(deg * Math.PI / 180) * 120}px - 30px)`,
                      transform: `rotate(${deg + 90}deg)`,
                    }}
                    animate={{ opacity: [0, 0.8, 0] }}
                    transition={{ repeat: Infinity, duration: 1.8, delay: deg / 360 * 1.8 }}
                  />
                ))}

                {/* Pulsing core glow */}
                <motion.div
                  className="absolute rounded-full bg-indigo-500/10"
                  style={{ width: 120, height: 120 }}
                  animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute rounded-full bg-violet-500/10"
                  style={{ width: 80, height: 80 }}
                  animate={{ scale: [1.1, 1.5, 1.1], opacity: [0.4, 0.7, 0.4] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut", delay: 0.5 }}
                />

                {/* Core */}
                <motion.div
                  className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(99,102,241,0.5)] z-10"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                >
                  <Cpu className="w-10 h-10 text-white" />
                </motion.div>

                {/* Floating metric labels */}
                <motion.div
                  className="absolute top-6 right-8 bg-slate-800/40 backdrop-blur-xl border border-slate-700/40 rounded-xl px-3 py-2 shadow-lg"
                  animate={{ y: [0, -6, 0], opacity: [0.7, 1, 0.7] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                >
                  <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wide">CO₂ Impact</p>
                  <p className="text-sm font-bold text-indigo-400">12.4 kg</p>
                </motion.div>
                <motion.div
                  className="absolute bottom-12 left-4 bg-slate-800/40 backdrop-blur-xl border border-slate-700/40 rounded-xl px-3 py-2 shadow-lg"
                  animate={{ y: [0, 6, 0], opacity: [0.6, 1, 0.6] }}
                  transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                >
                  <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wide">PEF Score</p>
                  <p className="text-sm font-bold text-emerald-400">A+</p>
                </motion.div>
                <motion.div
                  className="absolute top-16 left-2 bg-slate-800/40 backdrop-blur-xl border border-slate-700/40 rounded-xl px-3 py-2 shadow-lg"
                  animate={{ y: [0, -4, 0], opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 2 }}
                >
                  <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wide">Components</p>
                  <p className="text-sm font-bold text-violet-400">24 analysed</p>
                </motion.div>
              </div>
            </motion.div>

            {/* Visual 7: DPP mini-card */}
            <motion.div style={{ opacity: vOp7, pointerEvents: pView7 as any }}
              className="absolute inset-0 flex items-center justify-center">
              <div className="w-full max-w-72 rounded-3xl border border-slate-700/40 bg-slate-800/40 backdrop-blur-xl shadow-2xl shadow-black/20 overflow-hidden">
                <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 p-5 border-b border-slate-700/40">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold text-indigo-400 tracking-widest uppercase">Digital Product Passport</span>
                    <span className="text-[10px] font-bold bg-slate-900/50 text-white px-2 py-0.5 rounded-lg">ESPR 2026</span>
                  </div>
                  <p className="text-base font-bold text-white leading-tight">West Elm Slope<br />Leather Chair</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-1">DPP-2024-WE-SL-0042</p>
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <div className="flex justify-between text-[11px] mb-1.5">
                      <span className="text-slate-400 font-medium uppercase tracking-wide">Sustainability</span>
                      <span className="text-emerald-400 font-bold">94 / 100</span>
                    </div>
                    <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500" style={{ width: '94%' }} />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {[
                      { label: "CO₂", value: "12kg" },
                      { label: "Repair", value: "9/10" },
                      { label: "Lifecycle", value: "25yr" },
                    ].map(s => (
                      <div key={s.label} className="flex-1 rounded-xl bg-slate-900/40 border border-slate-700/40 p-2.5 text-center">
                        <p className="text-base font-bold text-white">{s.value}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{s.label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 bg-slate-900/40 rounded-xl p-3 border border-slate-700/40">
                    <QrCode className="w-10 h-10 text-white shrink-0" />
                    <div>
                      <p className="text-[11px] font-semibold text-white">Scan to verify</p>
                      <p className="text-[10px] text-slate-500">GS1-compliant · Verified</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>

    {/* ── Grand Finale: Your Intelligent Product ── */}
    <section className="bg-slate-900 text-white pt-8 pb-32 relative overflow-hidden">
      {/* Subtle radial glow behind the chair */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/[0.03] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center"
        >
          <div className="-mb-16">
            <PassportChair3DCanvas />
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-indigo-400">
                <Sparkles className="w-4.5 h-4.5" />
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-semibold tracking-tight">Your Intelligent Product</h2>
            </div>
            <p className="text-lg text-slate-400 max-w-lg mx-auto leading-relaxed">
              The journey is complete. Your product is now a living, intelligent asset — spare parts, documentation, care guides, and verified claims, all accessible with a single scan.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
    </>
  );
}
