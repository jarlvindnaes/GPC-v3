import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Box, Layers, Users, Truck, TreePine, Cpu, QrCode } from "lucide-react";
import { FinishedProduct3DCanvas, RawMaterial3DCanvas } from "./Native3DModels";

export function StorytellingScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const lineProgress = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const op1 = useTransform(scrollYProgress, [0, 0.05, 0.1, 0.15], [0, 1, 1, 0]);
  const op2 = useTransform(scrollYProgress, [0.14, 0.19, 0.24, 0.29], [0, 1, 1, 0]);
  const op3 = useTransform(scrollYProgress, [0.28, 0.33, 0.38, 0.43], [0, 1, 1, 0]);
  const op4 = useTransform(scrollYProgress, [0.42, 0.47, 0.52, 0.57], [0, 1, 1, 0]);
  const op5 = useTransform(scrollYProgress, [0.57, 0.62, 0.67, 0.72], [0, 1, 1, 0]);
  const op6 = useTransform(scrollYProgress, [0.71, 0.76, 0.81, 0.86], [0, 1, 1, 0]);
  const op7 = useTransform(scrollYProgress, [0.85, 0.9, 0.95, 1], [0, 1, 1, 1]);

  const vOp1 = useTransform(scrollYProgress, [0, 0.1, 0.15], [1, 1, 0]);
  const vOp2 = useTransform(scrollYProgress, [0.1, 0.15, 0.25, 0.3], [0, 1, 1, 0]);
  const vOp3 = useTransform(scrollYProgress, [0.25, 0.3, 0.4, 0.45], [0, 1, 1, 0]);
  const vOp4 = useTransform(scrollYProgress, [0.4, 0.45, 0.55, 0.6], [0, 1, 1, 0]);
  const vOp5 = useTransform(scrollYProgress, [0.55, 0.6, 0.7, 0.75], [0, 1, 1, 0]);
  const vOp6 = useTransform(scrollYProgress, [0.7, 0.75, 0.85, 0.9], [0, 1, 1, 0]);
  const vOp7 = useTransform(scrollYProgress, [0.85, 0.9, 1], [0, 1, 1]);

  const pView1 = useTransform(scrollYProgress, [0, 0.1, 0.15], ["auto", "auto", "none"]);
  const pView2 = useTransform(scrollYProgress, [0.1, 0.15, 0.25, 0.3], ["none", "auto", "auto", "none"]);
  const pView3 = useTransform(scrollYProgress, [0.25, 0.3, 0.4, 0.45], ["none", "auto", "auto", "none"]);
  const pView5 = useTransform(scrollYProgress, [0.55, 0.6, 0.7, 0.75], ["none", "auto", "auto", "none"]);
  const pView7 = useTransform(scrollYProgress, [0.85, 0.9, 1], ["none", "auto", "auto"]);

  return (
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
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-display font-semibold tracking-tight mb-6">
              How it works
            </h2>
            <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Follow a product's journey from raw material to digital passport.
              Scroll to see how Product Connect transforms supply chain data into compliance-ready transparency.
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
          <div className="w-full md:w-[44%] pl-12 md:pl-0 md:pr-12 relative h-[420px] flex items-center">

            {[
              { op: op1, icon: <Box className="w-5 h-5" />, title: "The Finished Product", body: "Your products have a story. Most of it is hidden. We start with the physical object — a chair, a table, a textile." },
              { op: op2, icon: <Layers className="w-5 h-5" />, title: "Exploded View", body: "Upload your 3D models or BOMs. The product breaks down into its core components. Every screw, every sheet of plywood." },
              { op: op3, icon: <Users className="w-5 h-5" />, title: "Supplier Collaboration", body: "Suppliers input their own data directly. No middlemen. No telephone game. Real transparency across the chain." },
              { op: op4, icon: <Truck className="w-5 h-5" />, title: "Material Transport", body: "Track the journey. From the plywood factory to the assembly line — mapping the true environmental cost of logistics." },
              { op: op5, icon: <TreePine className="w-5 h-5" />, title: "Raw Materials", body: "All the way back to the source. The wooden log, the raw ore. Complete visibility from the very beginning." },
              { op: op6, icon: <Cpu className="w-5 h-5" />, title: "The Engine", body: "Our PEF-aligned LCA engine crunches the numbers and certificates. Automated impact calculation without the €15K consultant fee." },
              { op: op7, icon: <QrCode className="w-5 h-5" />, title: "Digital Product Passport", body: "A living, GS1-compliant passport. Ready for ESPR 2026. Monetize spare parts and prove your claims to the world." },
            ].map(({ op, icon, title, body }, i) => (
              <motion.div key={i} style={{ opacity: op }} className="absolute inset-y-0 flex flex-col justify-center">
                <div className="w-11 h-11 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-6 text-indigo-400 shadow-lg shadow-indigo-500/10">
                  {icon}
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight leading-[1.1]">{title}</h2>
                <p className="text-lg text-slate-400 leading-relaxed max-w-sm">{body}</p>
              </motion.div>
            ))}
          </div>

          {/* ── Visual panel (right) ── */}
          <div className="hidden md:flex flex-1 relative min-h-[600px] items-center justify-center">

            {/* Visual 1: Chair — full-panel, no padding, no boxing */}
            <motion.div style={{ opacity: vOp1, pointerEvents: pView1 as any }}
              className="absolute inset-0 flex items-center justify-center">
              <FinishedProduct3DCanvas />
              {/* Chair info label */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-slate-800/80 backdrop-blur-md border border-slate-700 rounded-2xl px-4 py-3 shadow-lg">
                <p className="text-sm font-semibold text-white mb-1">West Elm Slope Leather Chair</p>
                <p className="text-xs text-slate-400">Drag to rotate • Interactive 3D model</p>
              </div>
            </motion.div>

            {/* Visual 2: Exploded BOM */}
            <motion.div style={{ opacity: vOp2, pointerEvents: pView2 as any }}
              className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-72 h-72">
                {/* Central product blob */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-14 rounded-2xl bg-slate-700 border border-slate-600 shadow-xl flex items-center justify-center">
                    <span className="text-[10px] text-slate-400 font-semibold tracking-widest uppercase">Chair</span>
                  </div>
                </div>
                {/* Orbiting components */}
                {[
                  { label: "Oak Frame", x: -110, y: -80 },
                  { label: "Leather", x: 110, y: -80 },
                  { label: "Steel Legs", x: -110, y: 80 },
                  { label: "Foam", x: 110, y: 80 },
                ].map(c => (
                  <div key={c.label} className="absolute flex items-center gap-1.5"
                    style={{ left: '50%', top: '50%', transform: `translate(calc(-50% + ${c.x}px), calc(-50% + ${c.y}px))` }}>
                    {/* Connector line */}
                    <svg className="absolute inset-0 pointer-events-none overflow-visible" style={{ left: c.x < 0 ? '100%' : 'auto', right: c.x > 0 ? '100%' : 'auto' }}>
                      <line x1={c.x < 0 ? 0 : '100%'} y1="50%" x2={c.x < 0 ? -c.x / 2 : c.x / 2} y2="50%"
                        stroke="#4f46e5" strokeWidth="1" strokeDasharray="3 3" />
                    </svg>
                    <div className="px-3 py-1.5 bg-slate-800 border border-indigo-500/40 rounded-xl shadow-lg shadow-indigo-500/10">
                      <span className="text-[11px] text-slate-300 font-semibold">{c.label}</span>
                    </div>
                  </div>
                ))}
                {/* Pulsing rings */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <motion.div className="w-32 h-32 rounded-full border border-indigo-500/20"
                    animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }} />
                </div>
              </div>
            </motion.div>

            {/* Visual 3: Supplier portal card */}
            <motion.div style={{ opacity: vOp3, pointerEvents: pView3 as any }}
              className="absolute inset-0 flex items-center justify-center">
              <div className="w-80 bg-slate-800/90 backdrop-blur-md rounded-2xl border border-slate-700 p-6 shadow-2xl shadow-black/40">
                <div className="flex items-center justify-between mb-5">
                  <p className="text-sm font-semibold text-white">Supplier Data Entry</p>
                  <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">Live</span>
                </div>
                <div className="space-y-3">
                  {[
                    { label: "Material Composition", value: "FSC oak · 94%" },
                    { label: "Manufacturing Origin", value: "Gdańsk, Poland" },
                    { label: "CO₂ per unit", value: "12.4 kg CO₂e" },
                  ].map(f => (
                    <div key={f.label} className="bg-slate-900 rounded-xl border border-slate-700 px-4 py-3">
                      <p className="text-[10px] text-slate-500 mb-0.5 font-medium uppercase tracking-wide">{f.label}</p>
                      <p className="text-sm text-slate-200 font-medium">{f.value}</p>
                    </div>
                  ))}
                  <div className="h-10 bg-indigo-600 hover:bg-indigo-500 rounded-xl flex items-center justify-center cursor-pointer transition-colors">
                    <span className="text-sm text-white font-semibold">Submit & Verify</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Visual 4: Transport track */}
            <motion.div style={{ opacity: vOp4 }}
              className="absolute inset-0 flex items-center justify-center">
              <div className="w-full max-w-sm px-8 space-y-4">
                {[
                  { from: "Raw forest (FI)", to: "Sawmill (DE)", pct: 100 },
                  { from: "Sawmill (DE)", to: "Factory (PL)", pct: 65 },
                  { from: "Factory (PL)", to: "Retailer (DK)", pct: 30 },
                ].map((leg, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1.5">
                      <span>{leg.from}</span>
                      <span>{leg.to}</span>
                    </div>
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden relative">
                      <motion.div className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                        style={{ width: `${leg.pct}%` }} />
                      <motion.div
                        className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-slate-700 border border-indigo-400 rounded-full flex items-center justify-center shadow-lg"
                        animate={{ left: ["2%", "88%"] }}
                        transition={{ repeat: Infinity, duration: 3 + i, ease: "linear", delay: i * 0.8 }}>
                        <Truck className="w-2.5 h-2.5 text-indigo-400" />
                      </motion.div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Visual 5: Raw Material (3D rock) */}
            <motion.div style={{ opacity: vOp5, pointerEvents: pView5 as any }}
              className="absolute inset-0 flex items-center justify-center">
              <RawMaterial3DCanvas />
            </motion.div>

            {/* Visual 6: LCA Engine */}
            <motion.div style={{ opacity: vOp6 }}
              className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 relative flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                  className="absolute inset-0 border border-dashed border-indigo-500/30 rounded-full"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                  className="absolute inset-8 border border-dashed border-violet-500/20 rounded-full"
                />
                {/* Orbiting dots */}
                {[0, 60, 120, 180, 240, 300].map(deg => (
                  <motion.div key={deg}
                    className="absolute w-2 h-2 bg-indigo-400 rounded-full shadow-[0_0_8px_#6366f1]"
                    style={{
                      left: `calc(50% + ${Math.cos(deg * Math.PI / 180) * 100}px - 4px)`,
                      top: `calc(50% + ${Math.sin(deg * Math.PI / 180) * 100}px - 4px)`,
                    }}
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ repeat: Infinity, duration: 2, delay: deg / 360 * 2 }}
                  />
                ))}
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(99,102,241,0.4)]">
                  <Cpu className="w-9 h-9 text-white" />
                </div>
              </div>
            </motion.div>

            {/* Visual 7: DPP mini-card */}
            <motion.div style={{ opacity: vOp7, pointerEvents: pView7 as any }}
              className="absolute inset-0 flex items-center justify-center">
              <div className="w-72 rounded-3xl border border-slate-700 bg-slate-800/90 backdrop-blur-md shadow-2xl shadow-black/60 overflow-hidden">
                {/* Card header */}
                <div className="bg-gradient-to-br from-slate-700 to-slate-800 p-5 border-b border-slate-700">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold text-indigo-400 tracking-widest uppercase">Digital Product Passport</span>
                    <span className="text-[10px] font-bold bg-slate-900 text-white px-2 py-0.5 rounded-lg">ESPR 2026</span>
                  </div>
                  <p className="text-base font-bold text-white leading-tight">West Elm Slope<br />Leather Chair</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-1">DPP-2024-WE-SL-0042</p>
                </div>
                {/* Scores */}
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
                      { label: "CO₂", value: "12kg", color: "#6366f1" },
                      { label: "Repair", value: "9/10", color: "#10b981" },
                      { label: "Lifecycle", value: "25yr", color: "#f59e0b" },
                    ].map(s => (
                      <div key={s.label} className="flex-1 rounded-xl bg-slate-900 border border-slate-700 p-2.5 text-center">
                        <p className="text-base font-bold text-white">{s.value}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{s.label}</p>
                      </div>
                    ))}
                  </div>
                  {/* QR */}
                  <div className="flex items-center gap-3 bg-slate-900 rounded-xl p-3 border border-slate-700">
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
  );
}
