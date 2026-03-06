import {
  Box,
  CheckCircle2,
  Cpu,
  Database,
  Factory,
  Globe,
  Hammer,
  Layers,
  Package,
  QrCode,
  Truck,
  Users,
  Warehouse
} from "lucide-react";
import { motion } from "motion/react";
import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { InteractiveGrid } from "./CountdownBanner";

interface PathData {
  d: string;
  gradient: string;
  phase: number;
  reverse: boolean;
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
    if (!container || !hub || !qr || !topRef.current || !leftRef.current || !rightRef.current || !bottomRef.current) {
      return;
    }

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
        b: r.bottom - cr.top
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
        d:
          Math.abs(n.cx - h.cx) < 5
            ? `M ${h.cx} ${h.t} L ${n.cx} ${n.b}`
            : `M ${h.cx} ${h.t} C ${h.cx} ${mid}, ${n.cx} ${mid}, ${n.cx} ${n.b}`,
        gradient: "flow-indigo",
        phase: i * 0.4,
        reverse: true
      });
    });

    lefts.forEach((n, i) => {
      const ey = h.t + ((h.b - h.t) * (i + 1)) / (lefts.length + 1);
      const mx = (h.l + n.r) / 2;
      p.push({
        d: `M ${h.l} ${ey} C ${mx} ${ey}, ${mx} ${n.cy}, ${n.r} ${n.cy}`,
        gradient: "flow-amber",
        phase: 0.3 + i * 0.4,
        reverse: true
      });
    });

    rights.forEach((n, i) => {
      const ey = h.t + ((h.b - h.t) * (i + 1)) / (rights.length + 1);
      const mx = (h.r + n.l) / 2;
      p.push({
        d: `M ${h.r} ${ey} C ${mx} ${ey}, ${mx} ${n.cy}, ${n.l} ${n.cy}`,
        gradient: i < 2 ? "flow-indigo" : "flow-emerald",
        phase: 0.5 + i * 0.4,
        reverse: i < 2
      });
    });

    p.push({
      d: `M ${h.cx} ${h.b} L ${q.cx} ${q.t}`,
      gradient: "flow-violet",
      phase: 0.2,
      reverse: false
    });

    bots.forEach((n, i) => {
      const mid = (q.b + n.t) / 2;
      p.push({
        d: `M ${q.cx} ${q.b} C ${q.cx} ${mid}, ${n.cx} ${mid}, ${n.cx} ${n.t}`,
        gradient: "flow-rose",
        phase: 0.4 + i * 0.5,
        reverse: i === 1
      });
    });

    setPaths(p);
  }, []);

  useEffect(() => {
    const t = setTimeout(computePaths, 150);
    const obs = new ResizeObserver(computePaths);
    if (containerRef.current) {
      obs.observe(containerRef.current);
    }
    return () => {
      clearTimeout(t);
      obs.disconnect();
    };
  }, [computePaths]);

  return (
    <section className="relative overflow-hidden bg-brand-deep py-16 text-white sm:py-24 md:py-32">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-3xl sm:mb-16 md:mb-24">
          <h2 className="mb-6 font-display font-semibold text-3xl tracking-tight sm:text-4xl md:text-5xl">
            Connect to existing systems.
          </h2>
          <p className="text-base text-slate-400 leading-relaxed sm:text-lg md:text-xl">
            Orchestrate data across multiple ERPs, build custom workflows, and connect to third parties using APIs,
            partner apps or pre-built integrations. Securely connect directly to your end users.
          </p>
        </div>

        <div
          ref={containerRef}
          className="relative mx-auto h-[350px] w-full max-w-6xl sm:h-[400px] md:h-[600px] lg:h-[800px]"
        >
          <div className="pointer-events-none absolute inset-0">
            <div className="pointer-events-auto h-full w-full">
              <InteractiveGrid />
            </div>
          </div>

          {/* Hub — explicit dimensions on ref so measurements are stable */}
          <div
            ref={hubRef}
            className="absolute z-30 h-28 w-28 md:h-36 md:w-36 lg:h-44 lg:w-44"
            style={{ top: "38%", left: "50%", transform: "translate(-50%, -50%)" }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              className="h-full w-full"
            >
              <div className="group relative h-full w-full">
                <div className="absolute inset-0 bg-brand/20 blur-3xl transition-all duration-700 group-hover:bg-brand/30"></div>
                <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[2rem] border border-brand-light/50 bg-brand-deep shadow-[0_0_80px_color-mix(in_srgb,var(--color-brand)_15%,transparent)] md:rounded-[3rem]">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand/10 to-transparent"></div>
                  <span className="text-center font-bold font-display text-lg leading-tight tracking-tight md:text-2xl">
                    <span className="text-indigo-400">Product</span>
                    <br />
                    Connect
                  </span>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                    className="absolute inset-0 rounded-[2rem] border-2 border-indigo-400/30 md:rounded-[3rem]"
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* QR — explicit dimensions on ref */}
          <div
            ref={qrRef}
            className="absolute z-30 h-14 w-14 md:h-[72px] md:w-[72px] lg:h-20 lg:w-20"
            style={{ top: "63%", left: "50%", transform: "translate(-50%, -50%)" }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="h-full w-full"
            >
              <div className="flex h-full w-full items-center justify-center rounded-2xl border border-violet-400/50 bg-brand-deep/80 shadow-[0_0_40px_rgba(139,92,246,0.15)]">
                <QrCode className="h-7 w-7 text-violet-400 md:h-9 md:w-9" />
              </div>
            </motion.div>
          </div>

          {/* Nodes */}
          <div className="pointer-events-none absolute inset-0 z-20">
            <div ref={topRef} className="absolute top-[5%] right-0 left-0 flex justify-center gap-3 sm:gap-6 md:gap-16">
              <IntegrationNode title="Business Central" icon={<Database className="h-4 w-4" />} color="slate" />
              <IntegrationNode title="SAP S/4HANA" icon={<Box className="h-4 w-4" />} color="slate" />
              <IntegrationNode title="Akeneo PIM" icon={<Layers className="h-4 w-4" />} color="slate" />
            </div>

            <div
              ref={leftRef}
              className="absolute top-1/2 left-[1%] flex -translate-y-1/2 flex-col gap-6 md:left-[4%] md:gap-8"
            >
              <IntegrationNode title="Wood Supplier" icon={<Warehouse className="h-4 w-4" />} color="amber" />
              <IntegrationNode title="Steel Foundry" icon={<Factory className="h-4 w-4" />} color="amber" />
              <IntegrationNode title="Leather Tannery" icon={<Hammer className="h-4 w-4" />} color="amber" />
              <IntegrationNode title="Logistics Partner" icon={<Truck className="h-4 w-4" />} color="amber" />
            </div>

            <div
              ref={rightRef}
              className="absolute top-1/2 right-[1%] flex -translate-y-1/2 flex-col gap-5 md:right-[4%] md:gap-7"
            >
              <IntegrationNode
                title="Ecoinvent DB"
                icon={<Globe className="h-4 w-4" />}
                color="indigo"
                reverse={true}
              />
              <IntegrationNode
                title="Supplier Portal"
                icon={<Users className="h-4 w-4" />}
                color="indigo"
                reverse={true}
              />
              <IntegrationNode
                title="Verified EPDs"
                icon={<CheckCircle2 className="h-4 w-4" />}
                color="emerald"
                reverse={true}
              />
              <IntegrationNode
                title="Public DPP"
                icon={<QrCode className="h-4 w-4" />}
                color="emerald"
                reverse={true}
              />
            </div>

            <div
              ref={bottomRef}
              className="absolute right-0 bottom-[3%] left-0 flex justify-center gap-3 sm:gap-6 md:gap-16"
            >
              <IntegrationNode title="D2C Spare Parts" icon={<Package className="h-4 w-4" />} color="rose" />
              <IntegrationNode title="Usage Analytics" icon={<Cpu className="h-4 w-4" />} color="rose" />
            </div>
          </div>

          {/* SVG lines — viewBox matches container pixels for 1:1 coordinate mapping */}
          <svg className="pointer-events-none absolute inset-0 z-10 h-full w-full" viewBox={viewBox}>
            <title>Integration connection lines</title>
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
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <g fill="none" strokeWidth="1.5" filter="url(#glow)">
              {paths.map((p) => (
                <FlowingPath
                  key={`${p.gradient}-${p.phase}`}
                  d={p.d}
                  gradient={p.gradient}
                  phase={p.phase}
                  reverse={p.reverse}
                />
              ))}
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
}

type IntegrationNodeColor = "amber" | "emerald" | "indigo" | "rose" | "slate";

interface IntegrationNodeProperties {
  title: string;
  icon: ReactNode;
  color: IntegrationNodeColor;
  reverse?: boolean;
}

const integrationNodeColors: Record<IntegrationNodeColor, string> = {
  slate: "border-slate-400/40 bg-brand-deep/40 text-slate-400",
  indigo: "border-indigo-400/40 bg-indigo-500/5 text-indigo-400",
  emerald: "border-emerald-500/20 bg-emerald-500/5 text-emerald-400",
  amber: "border-amber-500/20 bg-amber-500/5 text-amber-400",
  rose: "border-rose-500/20 bg-rose-500/5 text-rose-400"
};

function IntegrationNode({ title, icon, color, reverse = false }: IntegrationNodeProperties) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`pointer-events-auto flex cursor-default items-center gap-2 rounded-xl border px-3 py-2 backdrop-blur-xl transition-all duration-500 hover:scale-105 hover:border-white/20 md:gap-3 md:rounded-2xl md:px-5 md:py-2.5 ${integrationNodeColors[color]} ${reverse ? "flex-row-reverse" : ""}`}
    >
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/5">{icon}</div>
      <span className="font-bold text-[10px] uppercase tracking-widest md:text-xs">{title}</span>
    </motion.div>
  );
}

const flowingPathColors: Record<string, string> = {
  "flow-indigo": "#6366f1",
  "flow-amber": "#f59e0b",
  "flow-emerald": "#10b981",
  "flow-violet": "#8b5cf6",
  "flow-rose": "#f43f5e"
};

function FlowingPath({
  d,
  gradient,
  phase,
  reverse
}: {
  d: string;
  gradient: string;
  phase: number;
  reverse: boolean;
}) {
  const color = flowingPathColors[gradient] ?? "#6366f1";
  const duration = 3.5;
  const keyPoints = reverse ? "1;0" : "0;1";

  return (
    <g>
      <path d={d} stroke={`url(#${gradient})`} strokeOpacity={0.6} strokeWidth={1.5} />
      {[0, 0.33, 0.66].map((offset) => (
        <circle key={offset} r={3} fill={color} opacity={0.8} filter="url(#glow)">
          <animateMotion
            dur={`${duration}s`}
            repeatCount="indefinite"
            begin={`${phase + offset * duration}s`}
            path={d}
            keyPoints={keyPoints}
            keyTimes="0;1"
          />
        </circle>
      ))}
    </g>
  );
}
