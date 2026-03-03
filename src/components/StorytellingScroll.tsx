import { Box, Cpu, Layers, MapPin, QrCode, Ship, Sparkles, Train, TreePine, Truck, Users } from "lucide-react";
import type { MotionStyle } from "motion/react";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ComponentsCanvas, FinishedProductCanvas, PassportChairCanvas, RawMaterialCanvas } from "./Native3DModels";

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
        <div className="pointer-events-none absolute top-0 right-0 left-0 z-20 pt-16 pb-8 md:pt-24 md:pb-16">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="mb-6 font-display font-semibold text-3xl tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                How it works
              </h2>
              <p className="mx-auto max-w-3xl text-base text-slate-400 leading-relaxed sm:text-lg md:text-xl">
                From construction model to certified Digital Product Passport in seven steps. Scroll to see how Product
                Connect digitises your product into a verified digital twin.
              </p>
            </motion.div>
          </div>
        </div>

        <div className="sticky top-0 flex h-screen items-center overflow-hidden">
          {/* Metro Line */}
          <div className="absolute top-0 bottom-0 left-8 z-0 w-px bg-slate-800 md:left-1/2 md:-translate-x-1/2">
            <motion.div
              className="absolute top-0 right-0 left-0 bg-gradient-to-b from-indigo-500 to-violet-500"
              style={{ height: lineProgress }}
            />
          </div>

          <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center gap-4 px-4 sm:px-6 md:flex-row md:gap-12 lg:px-8">
            {/* ── Text panel (left) ── */}
            <div className="relative flex min-h-[180px] w-full items-center pl-10 sm:pl-12 md:h-[420px] md:w-[44%] md:pr-12 md:pl-0">
              {[
                {
                  op: op1,
                  icon: <Box className="h-5 w-5" />,
                  title: "Ingest Your Model",
                  body: "Start with your product. Upload your construction model — BIM, IFC, or 3D CAD — and we automatically create a digital twin, splitting it into every component and sub-assembly."
                },
                {
                  op: op2,
                  icon: <Layers className="h-5 w-5" />,
                  title: "Add Component Details",
                  body: "Enrich each component with the data that matters. Materials, weights, manufacturing processes, supplier assignments — building a complete digital bill of materials."
                },
                {
                  op: op3,
                  icon: <Users className="h-5 w-5" />,
                  title: "Supplier Verification",
                  body: "Your suppliers verify details and add context directly. A secure portal lets them confirm specs, upload certifications, and enrich data — no middlemen, no email chains."
                },
                {
                  op: op4,
                  icon: <TreePine className="h-5 w-5" />,
                  title: "Raw Material Mapping",
                  body: "Material flows are mapped all the way to the source. From the timber forest to the steel foundry — establishing full provenance for every input in your product."
                },
                {
                  op: op5,
                  icon: <Truck className="h-5 w-5" />,
                  title: "Transport Route Calculation",
                  body: "Detailed transport routes are calculated automatically. Every logistics leg — distances, modes, and emissions — mapped from raw material origin to final assembly."
                },
                {
                  op: op6,
                  icon: <Cpu className="h-5 w-5" />,
                  title: "Impact Calculation",
                  body: "Our engine calculates precise environmental impact per component. PEF-aligned lifecycle assessment, automated and accurate — without the €15K consultant fee."
                },
                {
                  op: op7,
                  icon: <QrCode className="h-5 w-5" />,
                  title: "Passport & Certifications",
                  body: "Generate a Digital Product Passport and certifications. A living, GS1-compliant document ready for ESPR 2026 — verifiable, scannable, and built to prove your claims."
                }
              ].map(({ op, icon, title, body }) => (
                <motion.div
                  key={title}
                  style={{ opacity: op }}
                  className="absolute inset-y-0 flex flex-col justify-center"
                >
                  <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-700 bg-slate-800 text-indigo-400 shadow-indigo-500/10 shadow-lg">
                    {icon}
                  </div>
                  <h2 className="mb-4 font-bold text-2xl leading-[1.1] tracking-tight sm:text-4xl md:text-5xl">
                    {title}
                  </h2>
                  <p className="max-w-sm text-base text-slate-400 leading-relaxed md:text-lg">{body}</p>
                </motion.div>
              ))}
            </div>

            {/* ── Visual panel (right) ── */}
            <div className="relative flex min-h-[250px] w-full flex-1 items-center justify-center overflow-hidden sm:min-h-[350px] md:min-h-[700px]">
              {/* Visual 1: Chair */}
              <motion.div
                style={{ opacity: vOp1, pointerEvents: pView1 as MotionStyle["pointerEvents"] }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="aspect-square w-[min(100%,70vw)] md:w-[min(100%,85vh)]">
                  <FinishedProductCanvas />
                </div>
                <div className="pointer-events-none absolute bottom-2 left-1/2 hidden -translate-x-1/2 items-center gap-3 rounded-2xl border border-slate-700/40 bg-slate-800/40 px-3 py-2 shadow-2xl shadow-black/20 backdrop-blur-xl sm:flex md:bottom-6 md:gap-4 md:px-5 md:py-3.5">
                  <div className="flex flex-col">
                    <p className="whitespace-nowrap font-semibold text-sm text-white">West Elm Slope Leather Chair</p>
                    <p className="mt-0.5 text-[11px] text-slate-400">247 components • 18 suppliers</p>
                  </div>
                  <div className="flex items-center gap-1.5 border-slate-600/40 border-l pl-3">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                    <span className="font-bold text-[10px] text-emerald-400 uppercase tracking-wider">Ready</span>
                  </div>
                </div>
              </motion.div>

              {/* Visual 2: Components - 3D Model */}
              <motion.div
                style={{ opacity: vOp2, pointerEvents: pView2 as MotionStyle["pointerEvents"] }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="aspect-square w-[min(100%,70vw)] md:w-[min(100%,85vh)]">
                  <ComponentsCanvas />
                </div>
                <div className="pointer-events-none absolute bottom-2 left-1/2 hidden -translate-x-1/2 rounded-2xl border border-slate-700/40 bg-slate-800/40 px-3 py-2 shadow-2xl shadow-black/20 backdrop-blur-xl sm:block md:bottom-6 md:px-5 md:py-3.5">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                      <p className="whitespace-nowrap font-semibold text-sm text-white">Steel Bolt — ISO 4762 M8×30</p>
                      <div className="mt-1 flex items-center gap-3">
                        <span className="font-medium text-[10px] text-slate-500 uppercase tracking-wider">
                          Material
                        </span>
                        <span className="text-[11px] text-slate-300">Grade 8.8 Steel</span>
                        <span className="text-slate-700">·</span>
                        <span className="font-medium text-[10px] text-slate-500 uppercase tracking-wider">Weight</span>
                        <span className="text-[11px] text-slate-300">24g</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Visual 3: Supplier portal card */}
              <motion.div
                style={{ opacity: vOp3, pointerEvents: pView3 as MotionStyle["pointerEvents"] }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-full max-w-80 rounded-2xl border border-slate-700/40 bg-slate-800/40 p-4 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-6">
                  <div className="mb-5 flex items-center justify-between">
                    <p className="font-semibold text-sm text-white">Supplier Data Entry</p>
                    <span className="rounded-full border border-emerald-500/25 bg-emerald-500/15 px-2 py-0.5 font-bold text-[10px] text-emerald-400">
                      Live
                    </span>
                  </div>
                  <div className="space-y-3">
                    {[
                      { label: "Material Composition", value: "FSC oak · 94%" },
                      { label: "Manufacturing Origin", value: "Gdańsk, Poland" },
                      { label: "CO₂ per unit", value: "12.4 kg CO₂e" }
                    ].map((f) => (
                      <div key={f.label} className="rounded-xl border border-slate-700/40 bg-slate-900/50 px-4 py-3">
                        <p className="mb-0.5 font-medium text-[10px] text-slate-500 uppercase tracking-wide">
                          {f.label}
                        </p>
                        <p className="font-medium text-slate-200 text-sm">{f.value}</p>
                      </div>
                    ))}
                    <div className="flex h-10 cursor-pointer items-center justify-center rounded-xl bg-indigo-600/80 transition-colors hover:bg-indigo-500/80">
                      <span className="font-semibold text-sm text-white">Submit & Verify</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Visual 4: Raw Material (3D rock) */}
              <motion.div
                style={{ opacity: vOp4, pointerEvents: pView4 as MotionStyle["pointerEvents"] }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="aspect-square w-[min(100%,70vw)] md:w-[min(100%,85vh)]">
                  <RawMaterialCanvas />
                </div>
                <div className="pointer-events-none absolute bottom-2 left-1/2 hidden -translate-x-1/2 rounded-2xl border border-slate-700/40 bg-slate-800/40 px-3 py-2 shadow-2xl shadow-black/20 backdrop-blur-xl sm:flex md:bottom-6 md:px-5 md:py-3.5">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                      <p className="font-semibold text-sm text-white">Iron Ore — Raw Material</p>
                      <div className="mt-1 flex items-center gap-3">
                        <span className="font-medium text-[10px] text-slate-500 uppercase tracking-wider">Origin</span>
                        <span className="text-[11px] text-slate-300">Kiruna, Sweden</span>
                        <span className="text-slate-700">·</span>
                        <span className="font-medium text-[10px] text-slate-500 uppercase tracking-wider">Grade</span>
                        <span className="text-[11px] text-slate-300">Fe 65%</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-center border-slate-600/40 border-l pl-3">
                      <span className="font-bold text-emerald-400 text-xs">✓</span>
                      <span className="text-[9px] text-slate-500 uppercase">Verified</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Visual 5: Transport Routes Card */}
              <motion.div
                style={{ opacity: vOp5, pointerEvents: pView5 as MotionStyle["pointerEvents"] }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-full max-w-[320px] overflow-hidden rounded-2xl border border-slate-700/40 bg-slate-800/40 shadow-2xl shadow-black/20 backdrop-blur-xl sm:max-w-96">
                  {/* Header */}
                  <div className="border-slate-700/50 border-b px-4 pt-4 pb-3 sm:px-5 sm:pt-5 sm:pb-4">
                    <div className="mb-1 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-indigo-500/20 bg-indigo-500/10">
                          <MapPin className="h-3.5 w-3.5 text-indigo-400" />
                        </div>
                        <span className="font-semibold text-sm text-white">Supply Chain Routes</span>
                      </div>
                      <span className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 font-bold text-[10px] text-indigo-400">
                        3 legs
                      </span>
                    </div>
                    <p className="ml-9 text-[10px] text-slate-500">Calculated distances · Real-time tracking</p>
                  </div>

                  {/* Route legs */}
                  <div className="space-y-3 p-4">
                    {[
                      {
                        from: "Kuopio, Finland",
                        to: "Hamburg, Germany",
                        mode: "ship",
                        icon: <Ship className="h-3 w-3" />,
                        dist: "1,842 km",
                        co2: "4.2 kg",
                        time: "3 days",
                        pct: 100
                      },
                      {
                        from: "Hamburg, Germany",
                        to: "Gdańsk, Poland",
                        mode: "train",
                        icon: <Train className="h-3 w-3" />,
                        dist: "680 km",
                        co2: "1.1 kg",
                        time: "8 hrs",
                        pct: 65
                      },
                      {
                        from: "Gdańsk, Poland",
                        to: "Copenhagen, Denmark",
                        mode: "truck",
                        icon: <Truck className="h-3 w-3" />,
                        dist: "520 km",
                        co2: "3.8 kg",
                        time: "6 hrs",
                        pct: 30
                      }
                    ].map((leg, legIndex) => (
                      <div key={leg.from} className="rounded-xl border border-slate-700/30 bg-slate-900/40 p-3">
                        <div className="mb-2.5 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className={`flex h-5 w-5 items-center justify-center rounded-md ${leg.mode === "ship" ? "bg-cyan-500/10 text-cyan-400" : leg.mode === "train" ? "bg-amber-500/10 text-amber-400" : "bg-violet-500/10 text-violet-400"}`}
                            >
                              {leg.icon}
                            </div>
                            <div>
                              <p className="text-[10px] text-slate-400 leading-tight">{leg.from}</p>
                              <p className="font-medium text-[10px] text-white leading-tight">{leg.to}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-[10px] text-white">{leg.dist}</p>
                            <p className="text-[9px] text-slate-500">{leg.time}</p>
                          </div>
                        </div>
                        {/* Progress bar */}
                        <div className="relative h-1 overflow-hidden rounded-full bg-slate-800">
                          <motion.div
                            className={`absolute top-0 left-0 h-full rounded-full ${leg.mode === "ship" ? "bg-gradient-to-r from-cyan-500 to-cyan-400" : leg.mode === "train" ? "bg-gradient-to-r from-amber-500 to-amber-400" : "bg-gradient-to-r from-violet-500 to-violet-400"}`}
                            style={{ width: `${leg.pct}%` }}
                          />
                          <motion.div
                            className="absolute top-1/2 flex h-3.5 w-3.5 -translate-y-1/2 items-center justify-center rounded-full border border-slate-500 bg-slate-700 shadow-md"
                            animate={{ left: ["2%", "90%"] }}
                            transition={{
                              repeat: Infinity,
                              duration: 3 + legIndex * 0.8,
                              ease: "linear",
                              delay: legIndex * 0.6
                            }}
                          >
                            <div
                              className={`h-1.5 w-1.5 rounded-full ${leg.mode === "ship" ? "bg-cyan-400" : leg.mode === "train" ? "bg-amber-400" : "bg-violet-400"}`}
                            />
                          </motion.div>
                        </div>
                        <div className="mt-1.5 flex justify-between">
                          <span className="text-[9px] text-slate-600 uppercase tracking-wide">{leg.mode}</span>
                          <span className="text-[9px] text-slate-500">{leg.co2} CO₂e</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary footer */}
                  <div className="px-4 pb-4">
                    <div className="flex items-center justify-between rounded-xl border border-indigo-500/10 bg-indigo-500/5 p-3">
                      <div>
                        <p className="font-medium text-[10px] text-slate-500 uppercase tracking-wide">Total Route</p>
                        <p className="font-bold text-sm text-white">3,042 km</p>
                      </div>
                      <div className="h-8 w-px bg-slate-700" />
                      <div>
                        <p className="font-medium text-[10px] text-slate-500 uppercase tracking-wide">Transport CO₂</p>
                        <p className="font-bold text-indigo-400 text-sm">9.1 kg</p>
                      </div>
                      <div className="h-8 w-px bg-slate-700" />
                      <div>
                        <p className="font-medium text-[10px] text-slate-500 uppercase tracking-wide">Transit Time</p>
                        <p className="font-bold text-sm text-white">~4 days</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Visual 6: LCA Engine */}
              <motion.div
                style={{ opacity: vOp6, pointerEvents: pView6 as MotionStyle["pointerEvents"] }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="relative flex aspect-square w-full max-w-[280px] items-center justify-center sm:max-w-[350px] md:max-w-[420px]">
                  {/* Outer ring */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                    className="absolute inset-0 rounded-full border border-indigo-500/20"
                  />
                  {/* Second ring */}
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ repeat: Infinity, duration: 14, ease: "linear" }}
                    className="absolute inset-6 rounded-full border border-violet-500/25 border-dashed"
                  />
                  {/* Third ring */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                    className="absolute inset-16 rounded-full border border-indigo-400/20 border-dashed"
                  />
                  {/* Inner ring */}
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
                    className="absolute inset-24 rounded-full border border-violet-400/15"
                  />

                  {/* Outer orbiting data nodes */}
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                    <motion.div
                      key={`outer-${deg}`}
                      className="absolute h-1.5 w-1.5 rounded-full bg-indigo-400/60"
                      style={{
                        left: `calc(50% + ${Math.cos((deg * Math.PI) / 180) * 46}% - 3px)`,
                        top: `calc(50% + ${Math.sin((deg * Math.PI) / 180) * 46}% - 3px)`
                      }}
                      animate={{ opacity: [0.2, 0.8, 0.2], scale: [0.8, 1.3, 0.8] }}
                      transition={{ repeat: Infinity, duration: 3, delay: (deg / 360) * 3 }}
                    />
                  ))}

                  {/* Mid orbiting data nodes */}
                  {[0, 72, 144, 216, 288].map((deg) => (
                    <motion.div
                      key={`mid-${deg}`}
                      className="absolute h-2.5 w-2.5 rounded-full bg-indigo-400 shadow-[0_0_12px_#6366f1]"
                      style={{
                        left: `calc(50% + ${Math.cos((deg * Math.PI) / 180) * 33}% - 5px)`,
                        top: `calc(50% + ${Math.sin((deg * Math.PI) / 180) * 33}% - 5px)`
                      }}
                      animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.4, 1] }}
                      transition={{ repeat: Infinity, duration: 2.5, delay: (deg / 360) * 2.5 }}
                    />
                  ))}

                  {/* Inner orbiting nodes */}
                  {[30, 150, 270].map((deg) => (
                    <motion.div
                      key={`inner-${deg}`}
                      className="absolute h-2 w-2 rounded-full bg-violet-400 shadow-[0_0_10px_#8b5cf6]"
                      style={{
                        left: `calc(50% + ${Math.cos((deg * Math.PI) / 180) * 20}% - 4px)`,
                        top: `calc(50% + ${Math.sin((deg * Math.PI) / 180) * 20}% - 4px)`
                      }}
                      animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.5, 1] }}
                      transition={{ repeat: Infinity, duration: 2, delay: (deg / 360) * 2 }}
                    />
                  ))}

                  {/* Data streams — lines flowing toward center */}
                  {[0, 60, 120, 180, 240, 300].map((deg) => (
                    <motion.div
                      key={`stream-${deg}`}
                      className="absolute w-px bg-gradient-to-b from-transparent via-indigo-400/40 to-transparent"
                      style={{
                        height: "14%",
                        left: `calc(50% + ${Math.cos((deg * Math.PI) / 180) * 28}%)`,
                        top: `calc(50% + ${Math.sin((deg * Math.PI) / 180) * 28}% - 7%)`,
                        transform: `rotate(${deg + 90}deg)`
                      }}
                      animate={{ opacity: [0, 0.8, 0] }}
                      transition={{ repeat: Infinity, duration: 1.8, delay: (deg / 360) * 1.8 }}
                    />
                  ))}

                  {/* Pulsing core glow */}
                  <motion.div
                    className="absolute aspect-square w-[28%] rounded-full bg-indigo-500/10"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  />
                  <motion.div
                    className="absolute aspect-square w-[19%] rounded-full bg-violet-500/10"
                    animate={{ scale: [1.1, 1.5, 1.1], opacity: [0.4, 0.7, 0.4] }}
                    transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut", delay: 0.5 }}
                  />

                  {/* Core */}
                  <motion.div
                    className="z-10 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 shadow-[0_0_60px_rgba(99,102,241,0.5)] sm:h-20 sm:w-20 md:h-24 md:w-24"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  >
                    <Cpu className="h-6 w-6 text-white sm:h-8 sm:w-8 md:h-10 md:w-10" />
                  </motion.div>

                  {/* Floating metric labels */}
                  <motion.div
                    className="absolute top-6 right-8 hidden rounded-xl border border-slate-700/40 bg-slate-800/40 px-3 py-2 shadow-lg backdrop-blur-xl sm:block"
                    animate={{ y: [0, -6, 0], opacity: [0.7, 1, 0.7] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  >
                    <p className="font-medium text-[10px] text-slate-500 uppercase tracking-wide">CO₂ Impact</p>
                    <p className="font-bold text-indigo-400 text-sm">12.4 kg</p>
                  </motion.div>
                  <motion.div
                    className="absolute bottom-12 left-4 hidden rounded-xl border border-slate-700/40 bg-slate-800/40 px-3 py-2 shadow-lg backdrop-blur-xl sm:block"
                    animate={{ y: [0, 6, 0], opacity: [0.6, 1, 0.6] }}
                    transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                  >
                    <p className="font-medium text-[10px] text-slate-500 uppercase tracking-wide">PEF Score</p>
                    <p className="font-bold text-emerald-400 text-sm">A+</p>
                  </motion.div>
                  <motion.div
                    className="absolute top-16 left-2 hidden rounded-xl border border-slate-700/40 bg-slate-800/40 px-3 py-2 shadow-lg backdrop-blur-xl sm:block"
                    animate={{ y: [0, -4, 0], opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 2 }}
                  >
                    <p className="font-medium text-[10px] text-slate-500 uppercase tracking-wide">Components</p>
                    <p className="font-bold text-sm text-violet-400">24 analysed</p>
                  </motion.div>
                </div>
              </motion.div>

              {/* Visual 7: DPP mini-card */}
              <motion.div
                style={{ opacity: vOp7, pointerEvents: pView7 as MotionStyle["pointerEvents"] }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-full max-w-[260px] overflow-hidden rounded-3xl border border-slate-700/40 bg-slate-800/40 shadow-2xl shadow-black/20 backdrop-blur-xl sm:max-w-72">
                  <div className="border-slate-700/40 border-b bg-gradient-to-br from-slate-700/50 to-slate-800/50 p-5">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="font-bold text-[10px] text-indigo-400 uppercase tracking-widest">
                        Digital Product Passport
                      </span>
                      <span className="rounded-lg bg-slate-900/50 px-2 py-0.5 font-bold text-[10px] text-white">
                        ESPR 2026
                      </span>
                    </div>
                    <p className="font-bold text-base text-white leading-tight">
                      West Elm Slope
                      <br />
                      Leather Chair
                    </p>
                    <p className="mt-1 font-mono text-[10px] text-slate-400">DPP-2024-WE-SL-0042</p>
                  </div>
                  <div className="space-y-4 p-5">
                    <div>
                      <div className="mb-1.5 flex justify-between text-[11px]">
                        <span className="font-medium text-slate-400 uppercase tracking-wide">Sustainability</span>
                        <span className="font-bold text-emerald-400">94 / 100</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-slate-700">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500"
                          style={{ width: "94%" }}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {[
                        { label: "CO₂", value: "12kg" },
                        { label: "Repair", value: "9/10" },
                        { label: "Lifecycle", value: "25yr" }
                      ].map((s) => (
                        <div
                          key={s.label}
                          className="flex-1 rounded-xl border border-slate-700/40 bg-slate-900/40 p-2.5 text-center"
                        >
                          <p className="font-bold text-base text-white">{s.value}</p>
                          <p className="mt-0.5 text-[10px] text-slate-500">{s.label}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-3 rounded-xl border border-slate-700/40 bg-slate-900/40 p-3">
                      <QrCode className="h-10 w-10 shrink-0 text-white" />
                      <div>
                        <p className="font-semibold text-[11px] text-white">Scan to verify</p>
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
      <section className="relative overflow-hidden bg-slate-900 pt-4 pb-16 text-white sm:pt-8 sm:pb-32">
        {/* Metro line continuation — fades from story section into the QR on the chair */}
        <div className="absolute top-0 left-8 z-0 w-px md:left-1/2 md:-translate-x-1/2" style={{ height: "45%" }}>
          <div className="h-full w-full bg-gradient-to-b from-violet-500 to-transparent" />
        </div>

        {/* Subtle radial glow behind the chair */}
        <div className="pointer-events-none absolute top-1/3 left-1/2 h-[min(100vw,800px)] w-[min(100vw,800px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/[0.03] blur-3xl" />

        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center"
          >
            <div className="-mb-12">
              <PassportChairCanvas />
            </div>

            <div className="text-center">
              <div className="mb-4 flex items-center justify-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-800/80 text-indigo-400">
                  <Sparkles className="h-4.5 w-4.5" />
                </div>
                <h2 className="font-display font-semibold text-3xl tracking-tight sm:text-4xl md:text-5xl">
                  Your Intelligent Product
                </h2>
              </div>
              <p className="mx-auto max-w-lg text-lg text-slate-400 leading-relaxed">
                The journey is complete. Your product is now a living, intelligent asset — spare parts, documentation,
                care guides, and verified claims, all accessible with a single scan.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
