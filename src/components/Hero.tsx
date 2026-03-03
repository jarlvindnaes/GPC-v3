import { ArrowRight, PlayCircle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

const SCREENSHOTS = [
  {
    src: `${import.meta.env.BASE_URL}screenshots/product-studio_crop.png`,
    label: "Product Studio",
    description: "3D model ingestion & component breakdown"
  },
  {
    src: `${import.meta.env.BASE_URL}screenshots/supply-chain_crop.png`,
    label: "Supply Chain Map",
    description: "Global transport routes & logistics tracking"
  }
];

interface NetworkNode {
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
  {
    type: 0,
    color: "#60a5fa",
    labels: [
      "Oak Frame",
      "Steel Bolt",
      "Leather Seat",
      "Arm Rest",
      "Back Panel",
      "Leg Assembly",
      "Cross Bar",
      "Cushion Core"
    ]
  },
  {
    type: 1,
    color: "#f97316",
    labels: [
      "Timber Mill",
      "Steel Foundry",
      "Tannery",
      "Foam Factory",
      "Paint Shop",
      "CNC Router",
      "Welder",
      "Finisher"
    ]
  },
  {
    type: 2,
    color: "#a78bfa",
    labels: ["Dining Chair", "Office Chair", "Lounge Sofa", "Bar Stool", "Bench", "Side Table", "Desk", "Shelf Unit"]
  },
  {
    type: 3,
    color: "#fb923c",
    labels: ["Retailer EU", "D2C Portal", "Warranty", "Spare Parts", "Recycling", "Analytics", "End User", "Inspector"]
  },
  { type: 4, color: "#818cf8", labels: ["EPD Cert", "ISO 14001", "FSC Label", "ESPR Tag", "QR Code", "DPP Record"] }
];

function HeroNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const nodesRef = useRef<NetworkNode[]>([]);
  const dimensionsRef = useRef({ width: 0, height: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const parent = canvas.parentElement;
    if (!parent) {
      return;
    }
    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    const devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    let animationId: number;

    const initNodes = () => {
      const w = dimensionsRef.current.width;
      const h = dimensionsRef.current.height;
      if (w === 0 || h === 0) {
        return;
      }
      const count = Math.min(55, Math.floor((w * h) / 15000));
      const nodes: NetworkNode[] = [];

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
          phase: Math.random() * Math.PI * 2
        });
      }
      nodesRef.current = nodes;
    };

    const resize = () => {
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      dimensionsRef.current = { width: w, height: h };
      canvas.width = w * devicePixelRatio;
      canvas.height = h * devicePixelRatio;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      if (nodesRef.current.length === 0) {
        initNodes();
      }
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (event: MouseEvent) => {
      const rectangle = parent.getBoundingClientRect();
      mouseRef.current = { x: event.clientX - rectangle.left, y: event.clientY - rectangle.top, active: true };
    };
    const onMouseLeave = () => {
      mouseRef.current.active = false;
    };
    parent.addEventListener("mousemove", onMouseMove);
    parent.addEventListener("mouseleave", onMouseLeave);

    let time = 0;
    const connectionDist = 220;

    const draw = () => {
      time += 0.008;
      const w = dimensionsRef.current.width;
      const h = dimensionsRef.current.height;
      if (w === 0) {
        animationId = requestAnimationFrame(draw);
        return;
      }
      context.clearRect(0, 0, w, h);

      const nodes = nodesRef.current;
      const mouse = mouseRef.current;

      for (const node of nodes) {
        node.x += node.vx + Math.sin(time * 0.5 + node.phase) * 0.15 * node.depth;
        node.y += node.vy + Math.cos(time * 0.4 + node.phase + 1) * 0.1 * node.depth;

        if (node.x < -40) {
          node.x = w + 40;
        }
        if (node.x > w + 40) {
          node.x = -40;
        }
        if (node.y < -40) {
          node.y = h + 40;
        }
        if (node.y > h + 40) {
          node.y = -40;
        }

        if (mouse.active) {
          const dx = mouse.x - node.x;
          const dy = mouse.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 300) {
            const push = (1 - dist / 300) * 0.8 * node.depth;
            node.x -= (dx / dist) * push;
            node.y -= (dy / dist) * push;
          }
        }
      }

      // Connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const nodeA = nodes[i],
            nodeB = nodes[j];
          const dx = nodeA.x - nodeB.x,
            dy = nodeA.y - nodeB.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < connectionDist) {
            const alpha = (1 - dist / connectionDist) * 0.25 * Math.min(nodeA.depth, nodeB.depth);
            context.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
            context.lineWidth = (1 - dist / connectionDist) * 1.5;
            context.beginPath();
            context.moveTo(nodeA.x, nodeA.y);
            context.lineTo(nodeB.x, nodeB.y);
            context.stroke();
          }
        }
      }

      // Nodes + labels
      for (const node of nodes) {
        const group = NODE_LABELS[node.type];
        const baseAlpha = 0.3 + node.depth * 0.5;

        // Outer glow
        const glowR = node.radius * 5;
        const glow = context.createRadialGradient(node.x, node.y, 0, node.x, node.y, glowR);
        glow.addColorStop(0, `${group.color}40`);
        glow.addColorStop(1, `${group.color}00`);
        context.fillStyle = glow;
        context.beginPath();
        context.arc(node.x, node.y, glowR, 0, Math.PI * 2);
        context.fill();

        // Core dot
        context.fillStyle = group.color;
        context.globalAlpha = baseAlpha;
        context.beginPath();
        context.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        context.fill();

        // Ring
        context.strokeStyle = group.color;
        context.globalAlpha = baseAlpha * 0.5;
        context.lineWidth = 0.8;
        context.beginPath();
        context.arc(node.x, node.y, node.radius * 2.2, 0, Math.PI * 2);
        context.stroke();

        // Label
        if (node.depth > 0.5) {
          context.globalAlpha = (node.depth - 0.5) * 0.7;
          context.fillStyle = "#64748b";
          context.font = `${9 * node.depth}px ui-sans-serif, system-ui, -apple-system, sans-serif`;
          context.textAlign = "center";
          context.fillText(node.label, node.x, node.y + node.radius * 2.8 + 8);
        }

        context.globalAlpha = 1;
      }

      animationId = requestAnimationFrame(draw);
    };

    animationId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      parent.removeEventListener("mousemove", onMouseMove);
      parent.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      aria-label="Interactive product network visualization"
    />
  );
}

export function Hero() {
  return (
    <section className="relative mx-auto max-w-7xl overflow-hidden px-4 pt-32 pb-20 sm:px-6 md:pt-48 md:pb-32 lg:px-8">
      {/* Background gradient shapes */}
      <div className="absolute top-0 right-0 z-0 h-[300px] w-[300px] translate-x-1/3 -translate-y-1/4 rounded-full bg-gradient-to-br from-indigo-50 via-slate-50 to-white opacity-70 blur-[120px] sm:h-[500px] sm:w-[500px] md:h-[800px] md:w-[800px]"></div>
      <div className="absolute bottom-0 left-0 z-0 h-[250px] w-[250px] -translate-x-1/2 translate-y-1/2 rounded-full bg-gradient-to-tr from-blue-50/50 via-transparent to-transparent opacity-40 blur-[100px] sm:h-[400px] sm:w-[400px] md:h-[600px] md:w-[600px]"></div>

      {/* Network background — above gradients, below content */}
      <div className="pointer-events-none absolute inset-0 z-[1]">
        <div className="pointer-events-auto h-full w-full">
          <HeroNetwork />
        </div>
      </div>

      <div className="relative z-[2] max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-indigo-100/50 bg-indigo-50/50 px-3 py-1 font-semibold text-indigo-700 text-sm backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-600"></span>
            </span>
            ESPR 2026 Ready
          </div>
          <h1 className="mb-8 font-bold font-display text-[1.7rem] text-slate-900 leading-[1.05] tracking-tight sm:text-4xl md:text-[5rem]">
            Revolutionize Furniture Manufacturing with{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
              Product Connect.
            </span>
          </h1>
          <p className="mb-12 max-w-2xl font-medium text-lg text-slate-600 leading-relaxed md:text-xl">
            Streamline your supply chain, integrate data seamlessly, and track environmental impact. The infrastructure
            that gives intelligence to physical products.
          </p>
          <div className="flex flex-col gap-5 sm:flex-row">
            <button
              type="button"
              className="group flex items-center justify-center gap-2 rounded-full bg-slate-900 px-8 py-4 font-semibold text-base text-white shadow-lg shadow-slate-200/50 transition-all hover:scale-105 hover:bg-slate-800 active:scale-95"
            >
              Start Building <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              type="button"
              className="group flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-8 py-4 font-semibold text-base text-slate-900 transition-all hover:border-slate-300 hover:bg-slate-50"
            >
              <PlayCircle className="h-5 w-5 text-slate-400 transition-colors group-hover:text-indigo-500" /> Book a
              Demo
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
        className="absolute bottom-10 left-1/2 z-[2] flex -translate-x-1/2 flex-col items-center gap-2 opacity-40"
      >
        <span className="font-bold text-[10px] text-slate-400 uppercase tracking-widest">Scroll to explore</span>
        <div className="h-12 w-px bg-gradient-to-b from-indigo-500 to-transparent"></div>
      </motion.div>
    </section>
  );
}

function HeroCarousel() {
  const [active, setActive] = useState(0);
  const next = useCallback(() => setActive((i) => (i + 1) % SCREENSHOTS.length), []);

  useEffect(() => {
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [next]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="group relative mt-20 overflow-hidden rounded-3xl border border-slate-200/60 bg-slate-900 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.25)]"
    >
      {/* Browser chrome */}
      <div className="flex h-11 items-center justify-between border-slate-700/50 border-b bg-slate-800/80 px-5">
        <div className="flex gap-2">
          <div className="h-3 w-3 rounded-full bg-rose-500/40"></div>
          <div className="h-3 w-3 rounded-full bg-amber-500/40"></div>
          <div className="h-3 w-3 rounded-full bg-emerald-500/40"></div>
        </div>
        <div className="mx-auto max-w-[85%] flex-1 sm:max-w-md">
          <div className="flex items-center gap-2 rounded-lg bg-slate-700/50 px-3 py-1">
            <svg
              className="h-3 w-3 text-slate-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <title>Secure connection icon</title>
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span className="font-medium text-[11px] text-slate-400">getproductconnect.com</span>
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
            className="absolute inset-0 h-full w-full object-cover object-center"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5 }}
          />
        </AnimatePresence>

        {/* Bottom gradient overlay */}
        <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-28 bg-gradient-to-t from-slate-900/90 to-transparent" />

        {/* Caption + dots */}
        <div className="absolute right-0 bottom-0 left-0 flex items-end justify-between px-6 pb-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <p className="font-semibold text-sm text-white">{SCREENSHOTS[active].label}</p>
              <p className="mt-0.5 text-slate-400 text-xs">{SCREENSHOTS[active].description}</p>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center gap-2">
            {SCREENSHOTS.map((screenshot, screenshotIndex) => (
              <button
                type="button"
                key={screenshot.label}
                aria-label={`Go to ${screenshot.label}`}
                onClick={() => setActive(screenshotIndex)}
                className={`h-2.5 rounded-full transition-all duration-300 ${screenshotIndex === active ? "w-6 bg-indigo-400" : "w-2.5 bg-slate-600 hover:bg-slate-500"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
