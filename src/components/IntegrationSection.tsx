import { motion } from "motion/react";
import { useRef, useState, useEffect, useCallback } from "react";
import { Database, Box, Cpu, Package, Globe, Users, Layers, CheckCircle2, QrCode, Factory, Truck, Warehouse, Hammer } from "lucide-react";

interface PathData {
  d: string;
  gradient: string;
  phase: number;
}

export function IntegrationSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const hubRef = useRef<HTMLDivElement>(null);
  const qrRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [paths, setPaths] = useState<PathData[]>([]);
  const [viewBox, setViewBox] = useState("0 0 1000 800");

  const computePaths = useCallback(() => {
    const container = containerRef.current;
    const hub = hubRef.current;
    const qr = qrRef.current;
    if (!container || !hub || !qr || !topRef.current || !leftRef.current || !rightRef.current || !bottomRef.current) return;

    const cr = container.getBoundingClientRect();
    setViewBox(`0 0 ${cr.width} ${cr.height}`);

    const pos = (el: Element) => {
      const r = el.getBoundingClientRect();
      return {
        cx: r.left + r.width / 2 - cr.left,
        cy: r.top + r.height / 2 - cr.top,
        l: r.left - cr.left,
        r: r.right - cr.left,
        t: r.top - cr.top,
        b: r.bottom - cr.top,
      };
    };

    const h = pos(hub);
    const q = pos(qr);
    const tops = Array.from(topRef.current.children).map(pos);
    const lefts = Array.from(leftRef.current.children).map(pos);
    const rights = Array.from(rightRef.current.children).map(pos);
    const bots = Array.from(bottomRef.current.children).map(pos);

    const p: PathData[] = [];

    tops.forEach((n, i) => {
      const mid = (h.t + n.b) / 2;
      p.push({
        d: Math.abs(n.cx - h.cx) < 5
          ? `M ${h.cx} ${h.t} L ${n.cx} ${n.b}`
          : `M ${h.cx} ${h.t} C ${h.cx} ${mid}, ${n.cx} ${mid}, ${n.cx} ${n.b}`,
        gradient: "flow-indigo",
        phase: i * 0.4,
      });
    });

    lefts.forEach((n, i) => {
      const ey = h.t + (h.b - h.t) * (i + 1) / (lefts.length + 1);
      const mx = (h.l + n.r) / 2;
      p.push({
        d: `M ${h.l} ${ey} C ${mx} ${ey}, ${mx} ${n.cy}, ${n.r} ${n.cy}`,
        gradient: "flow-amber",
        phase: 0.3 + i * 0.4,
      });
    });

    rights.forEach((n, i) => {
      const ey = h.t + (h.b - h.t) * (i + 1) / (rights.length + 1);
      const mx = (h.r + n.l) / 2;
      p.push({
        d: `M ${h.r} ${ey} C ${mx} ${ey}, ${mx} ${n.cy}, ${n.l} ${n.cy}`,
        gradient: i < 2 ? "flow-indigo" : "flow-emerald",
        phase: 0.5 + i * 0.4,
      });
    });

    p.push({
      d: `M ${h.cx} ${h.b} L ${q.cx} ${q.t}`,
      gradient: "flow-violet",
      phase: 0.2,
    });

    bots.forEach((n, i) => {
      const mid = (q.b + n.t) / 2;
      p.push({
        d: `M ${q.cx} ${q.b} C ${q.cx} ${mid}, ${n.cx} ${mid}, ${n.cx} ${n.t}`,
        gradient: "flow-rose",
        phase: 0.4 + i * 0.5,
      });
    });

    setPaths(p);
  }, []);

  useEffect(() => {
    const t = setTimeout(computePaths, 150);
    const obs = new ResizeObserver(computePaths);
    if (containerRef.current) obs.observe(containerRef.current);
    return () => { clearTimeout(t); obs.disconnect(); };
  }, [computePaths]);

  return (
    <section className="py-16 sm:py-24 md:py-32 bg-slate-950 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mb-12 sm:mb-16 md:mb-24">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-semibold tracking-tight mb-6">
            Connect to existing systems.
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-slate-400 leading-relaxed">
            Orchestrate data across multiple ERPs, build custom workflows, and connect to third parties using APIs, partner apps or pre-built integrations. Securely connect directly to your end users.
          </p>
        </div>

        <div ref={containerRef} className="relative h-[350px] sm:h-[400px] md:h-[600px] lg:h-[800px] w-full max-w-6xl mx-auto">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.05)_0%,transparent_70%)]"></div>

          {/* Hub — explicit dimensions on ref so measurements are stable */}
          <div
            ref={hubRef}
            className="absolute z-30 w-28 h-28 md:w-36 md:h-36 lg:w-44 lg:h-44"
            style={{ top: "38%", left: "50%", transform: "translate(-50%, -50%)" }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              className="w-full h-full"
            >
              <div className="relative group w-full h-full">
                <div className="absolute inset-0 bg-indigo-500/20 blur-3xl group-hover:bg-indigo-500/30 transition-all duration-700"></div>
                <div className="w-full h-full bg-slate-900 rounded-[2rem] md:rounded-[3rem] flex items-center justify-center border border-indigo-500/30 shadow-[0_0_80px_rgba(99,102,241,0.15)] relative overflow-hidden">
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
          </div>

          {/* QR — explicit dimensions on ref */}
          <div
            ref={qrRef}
            className="absolute z-30 w-14 h-14 md:w-[72px] md:h-[72px] lg:w-20 lg:h-20"
            style={{ top: "63%", left: "50%", transform: "translate(-50%, -50%)" }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="w-full h-full"
            >
              <div className="w-full h-full rounded-2xl bg-slate-900/80 border border-violet-500/30 flex items-center justify-center shadow-[0_0_40px_rgba(139,92,246,0.15)]">
                <QrCode className="w-7 h-7 md:w-9 md:h-9 text-violet-400" />
              </div>
            </motion.div>
          </div>

          {/* Nodes */}
          <div className="absolute inset-0 z-20 pointer-events-none">
            <div ref={topRef} className="absolute top-[5%] left-0 right-0 flex justify-center gap-3 sm:gap-6 md:gap-16">
              <IntegrationNode title="Business Central" icon={<Database className="w-4 h-4" />} delay={0.2} color="slate" />
              <IntegrationNode title="SAP S/4HANA" icon={<Box className="w-4 h-4" />} delay={0.3} color="slate" />
              <IntegrationNode title="Akeneo PIM" icon={<Layers className="w-4 h-4" />} delay={0.4} color="slate" />
            </div>

            <div ref={leftRef} className="absolute top-1/2 -translate-y-1/2 left-[1%] md:left-[4%] flex flex-col gap-6 md:gap-8">
              <IntegrationNode title="Wood Supplier" icon={<Warehouse className="w-4 h-4" />} delay={0.4} color="amber" />
              <IntegrationNode title="Steel Foundry" icon={<Factory className="w-4 h-4" />} delay={0.5} color="amber" />
              <IntegrationNode title="Leather Tannery" icon={<Hammer className="w-4 h-4" />} delay={0.6} color="amber" />
              <IntegrationNode title="Logistics Partner" icon={<Truck className="w-4 h-4" />} delay={0.7} color="amber" />
            </div>

            <div ref={rightRef} className="absolute top-1/2 -translate-y-1/2 right-[1%] md:right-[4%] flex flex-col gap-5 md:gap-7">
              <IntegrationNode title="Ecoinvent DB" icon={<Globe className="w-4 h-4" />} delay={0.5} color="indigo" reverse />
              <IntegrationNode title="Supplier Portal" icon={<Users className="w-4 h-4" />} delay={0.6} color="indigo" reverse />
              <IntegrationNode title="Verified EPDs" icon={<CheckCircle2 className="w-4 h-4" />} delay={0.7} color="emerald" reverse />
              <IntegrationNode title="Public DPP" icon={<QrCode className="w-4 h-4" />} delay={0.8} color="emerald" reverse />
            </div>

            <div ref={bottomRef} className="absolute bottom-[3%] left-0 right-0 flex justify-center gap-3 sm:gap-6 md:gap-16">
              <IntegrationNode title="D2C Spare Parts" icon={<Package className="w-4 h-4" />} delay={0.9} color="rose" />
              <IntegrationNode title="Usage Analytics" icon={<Cpu className="w-4 h-4" />} delay={1.0} color="rose" />
            </div>
          </div>

          {/* SVG lines — viewBox matches container pixels for 1:1 coordinate mapping */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox={viewBox}>
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
              {paths.map((p, i) => (
                <FlowingPath key={i} d={p.d} gradient={p.gradient} phase={p.phase} />
              ))}
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
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
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
  const totalLength = 1200;
  const dashLen = 120;
  const gap = totalLength;

  return (
    <g>
      <path
        d={d}
        stroke={`url(#${gradient})`}
        strokeOpacity={0.15}
        strokeWidth={1}
      />
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
