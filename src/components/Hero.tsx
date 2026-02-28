import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, PlayCircle } from "lucide-react";

const SCREENSHOTS = [
  { src: import.meta.env.BASE_URL + "screenshots/product-studio_crop.png", label: "Product Studio", desc: "3D model ingestion & component breakdown" },
  { src: import.meta.env.BASE_URL + "screenshots/supply-chain_crop.png", label: "Supply Chain Map", desc: "Global transport routes & logistics tracking" },
];

// ─── Floating Network Canvas ─────────────────────────────────────────────────

interface NetNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  depth: number;
  type: number;
  label: string;
  phase: number;
}

const NODE_LABELS: { type: number; color: string; labels: string[] }[] = [
  { type: 0, color: "#60a5fa", labels: ["Oak Frame", "Steel Bolt", "Leather Seat", "Arm Rest", "Back Panel", "Leg Assembly", "Cross Bar", "Cushion Core"] },
  { type: 1, color: "#f97316", labels: ["Timber Mill", "Steel Foundry", "Tannery", "Foam Factory", "Paint Shop", "CNC Router", "Welder", "Finisher"] },
  { type: 2, color: "#a78bfa", labels: ["Dining Chair", "Office Chair", "Lounge Sofa", "Bar Stool", "Bench", "Side Table", "Desk", "Shelf Unit"] },
  { type: 3, color: "#fb923c", labels: ["Retailer EU", "D2C Portal", "Warranty", "Spare Parts", "Recycling", "Analytics", "End User", "Inspector"] },
  { type: 4, color: "#818cf8", labels: ["EPD Cert", "ISO 14001", "FSC Label", "ESPR Tag", "QR Code", "DPP Record"] },
];

function HeroNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const nodesRef = useRef<NetNode[]>([]);
  const dimRef = useRef({ w: 0, h: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let animId: number;

    const initNodes = () => {
      const w = dimRef.current.w;
      const h = dimRef.current.h;
      if (w === 0 || h === 0) return;
      const count = Math.min(55, Math.floor(w * h / 15000));
      const nodes: NetNode[] = [];

      for (let i = 0; i < count; i++) {
        const type = i % 5;
        const group = NODE_LABELS[type];
        const label = group.labels[i % group.labels.length];
        const depth = 0.3 + Math.random() * 0.7;
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.3 * depth,
          vy: (Math.random() - 0.5) * 0.2 * depth,
          radius: (3 + Math.random() * 4) * depth,
          depth,
          type,
          label,
          phase: Math.random() * Math.PI * 2,
        });
      }
      nodesRef.current = nodes;
    };

    const resize = () => {
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      dimRef.current = { w, h };
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (nodesRef.current.length === 0) initNodes();
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e: MouseEvent) => {
      const r = parent.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top, active: true };
    };
    const onMouseLeave = () => { mouseRef.current.active = false; };
    parent.addEventListener("mousemove", onMouseMove);
    parent.addEventListener("mouseleave", onMouseLeave);

    let time = 0;
    const connectionDist = 220;

    const draw = () => {
      time += 0.008;
      const w = dimRef.current.w;
      const h = dimRef.current.h;
      if (w === 0) { animId = requestAnimationFrame(draw); return; }
      ctx.clearRect(0, 0, w, h);

      const nodes = nodesRef.current;
      const mouse = mouseRef.current;

      for (const n of nodes) {
        n.x += n.vx + Math.sin(time * 0.5 + n.phase) * 0.15 * n.depth;
        n.y += n.vy + Math.cos(time * 0.4 + n.phase + 1) * 0.1 * n.depth;

        if (n.x < -40) n.x = w + 40;
        if (n.x > w + 40) n.x = -40;
        if (n.y < -40) n.y = h + 40;
        if (n.y > h + 40) n.y = -40;

        if (mouse.active) {
          const dx = mouse.x - n.x;
          const dy = mouse.y - n.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 300) {
            const push = (1 - dist / 300) * 0.8 * n.depth;
            n.x -= (dx / dist) * push;
            n.y -= (dy / dist) * push;
          }
        }
      }

      // Connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < connectionDist) {
            const alpha = (1 - dist / connectionDist) * 0.25 * Math.min(a.depth, b.depth);
            ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
            ctx.lineWidth = (1 - dist / connectionDist) * 1.5;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Nodes + labels
      for (const n of nodes) {
        const group = NODE_LABELS[n.type];
        const baseAlpha = 0.3 + n.depth * 0.5;

        // Outer glow
        const glowR = n.radius * 5;
        const glow = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, glowR);
        glow.addColorStop(0, group.color + "40");
        glow.addColorStop(1, group.color + "00");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(n.x, n.y, glowR, 0, Math.PI * 2);
        ctx.fill();

        // Core dot
        ctx.fillStyle = group.color;
        ctx.globalAlpha = baseAlpha;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fill();

        // Ring
        ctx.strokeStyle = group.color;
        ctx.globalAlpha = baseAlpha * 0.5;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius * 2.2, 0, Math.PI * 2);
        ctx.stroke();

        // Label
        if (n.depth > 0.5) {
          ctx.globalAlpha = (n.depth - 0.5) * 0.7;
          ctx.fillStyle = "#64748b";
          ctx.font = `${9 * n.depth}px ui-sans-serif, system-ui, -apple-system, sans-serif`;
          ctx.textAlign = "center";
          ctx.fillText(n.label, n.x, n.y + n.radius * 2.8 + 8);
        }

        ctx.globalAlpha = 1;
      }

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      parent.removeEventListener("mousemove", onMouseMove);
      parent.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

// ─── Hero Section ────────────────────────────────────────────────────────────

export function Hero() {
  return (
    <section className="pt-32 pb-20 md:pt-48 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden relative">
      {/* Background gradient shapes */}
      <div className="absolute top-0 right-0 z-0 w-[800px] h-[800px] bg-gradient-to-br from-indigo-50 via-slate-50 to-white rounded-full blur-[120px] opacity-70 translate-x-1/3 -translate-y-1/4"></div>
      <div className="absolute bottom-0 left-0 z-0 w-[600px] h-[600px] bg-gradient-to-tr from-blue-50/50 via-transparent to-transparent rounded-full blur-[100px] opacity-40 -translate-x-1/2 translate-y-1/2"></div>

      {/* Network background — above gradients, below content */}
      <div className="absolute inset-0 z-[1] pointer-events-none">
        <div className="w-full h-full pointer-events-auto">
          <HeroNetwork />
        </div>
      </div>

      <div className="max-w-4xl relative z-[2]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50/50 text-indigo-700 text-sm font-semibold mb-8 border border-indigo-100/50 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
            </span>
            ESPR 2026 Ready
          </div>
          <h1 className="text-[1.7rem] sm:text-4xl md:text-[5rem] font-display font-bold text-slate-900 tracking-tight leading-[1.05] mb-8">
            Revolutionize Furniture Manufacturing with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">Product Connect.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 mb-12 leading-relaxed max-w-2xl font-medium">
            Streamline your supply chain, integrate data seamlessly, and track environmental impact. The infrastructure that gives intelligence to physical products.
          </p>
          <div className="flex flex-col sm:flex-row gap-5">
            <button className="group bg-slate-900 text-white px-8 py-4 rounded-full text-base font-semibold hover:bg-slate-800 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-slate-200/50 flex items-center justify-center gap-2">
              Start Building <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="group bg-white text-slate-900 border border-slate-200 px-8 py-4 rounded-full text-base font-semibold hover:bg-slate-50 transition-all hover:border-slate-300 flex items-center justify-center gap-2">
              <PlayCircle className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-colors" /> Book a Demo
            </button>
          </div>
        </motion.div>
      </div>

      {/* Product Screenshots Carousel */}
      <div className="relative z-[2]">
        <HeroCarousel />
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40 z-[2]"
      >
        <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Scroll to explore</span>
        <div className="w-px h-12 bg-gradient-to-b from-indigo-500 to-transparent"></div>
      </motion.div>
    </section>
  );
}

function HeroCarousel() {
  const [active, setActive] = useState(0);
  const next = useCallback(() => setActive(i => (i + 1) % SCREENSHOTS.length), []);

  useEffect(() => {
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [next]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="mt-20 relative rounded-3xl border border-slate-200/60 bg-slate-900 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.25)] overflow-hidden group"
    >
      {/* Browser chrome */}
      <div className="h-11 bg-slate-800/80 border-b border-slate-700/50 flex items-center px-5 justify-between">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-rose-500/40"></div>
          <div className="w-3 h-3 rounded-full bg-amber-500/40"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-500/40"></div>
        </div>
        <div className="flex-1 max-w-md mx-auto">
          <div className="flex items-center gap-2 bg-slate-700/50 rounded-lg px-3 py-1">
            <svg className="w-3 h-3 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
            <span className="text-[11px] text-slate-400 font-medium">getproductconnect.com</span>
          </div>
        </div>
        <div className="w-16" />
      </div>

      {/* Carousel area */}
      <div className="relative aspect-[16/9.5] overflow-hidden bg-slate-950">
        <AnimatePresence mode="wait">
          <motion.img
            key={active}
            src={SCREENSHOTS[active].src}
            alt={SCREENSHOTS[active].label}
            className="absolute inset-0 w-full h-full object-cover object-center"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5 }}
          />
        </AnimatePresence>

        {/* Bottom gradient overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-slate-900/90 to-transparent pointer-events-none" />

        {/* Caption + dots */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-5 flex items-end justify-between">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-sm font-semibold text-white">{SCREENSHOTS[active].label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{SCREENSHOTS[active].desc}</p>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center gap-2">
            {SCREENSHOTS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === active ? 'w-6 bg-indigo-400' : 'w-1.5 bg-slate-600 hover:bg-slate-500'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
