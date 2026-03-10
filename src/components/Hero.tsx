import { ArrowRight, PlayCircle } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef } from "react";

import { useIsNearViewport } from "../utilities/useIsNearViewport";
import { useSectionMouse } from "../utilities/useSectionMouse";
import { WebsiteButton } from "./WebsiteButton";

interface NetworkNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  depth: number;
  type: number;
  label: string;
  phase: number;
  brighten: number;
}

const NODE_TYPE_LABELS: string[][] = [
  ["Oak Frame", "Steel Bolt", "Leather Seat", "Arm Rest", "Back Panel", "Leg Assembly", "Cross Bar", "Cushion Core"],
  ["Timber Mill", "Steel Foundry", "Tannery", "Foam Factory", "Paint Shop", "CNC Router", "Welder", "Finisher"],
  ["Dining Chair", "Office Chair", "Lounge Sofa", "Bar Stool", "Bench", "Side Table", "Desk", "Shelf Unit"],
  ["Retailer EU", "D2C Portal", "Warranty", "Spare Parts", "Recycling", "Analytics", "End User", "Inspector"],
  ["EPD Cert", "ISO 14001", "FSC Label", "ESPR Tag", "QR Code", "DPP Record"],
  ["LCA Report", "Carbon Map", "Impact Score", "Emission Log", "Green Audit", "Eco Rating"],
  ["Ship Route", "Rail Link", "Road Haul", "Port Hub", "Warehouse", "Last Mile"]
];

interface NetworkColors {
  nodeTypes: string[];
  connection: string;
  label: string;
}

function readNetworkColors(): NetworkColors {
  const styles = getComputedStyle(document.documentElement);
  const brand = styles.getPropertyValue("--color-brand").trim();
  const brandLight = styles.getPropertyValue("--color-brand-light").trim();
  const brandDark = styles.getPropertyValue("--color-brand-dark").trim();
  const accent = styles.getPropertyValue("--color-brand-accent").trim();
  const text = styles.getPropertyValue("--color-brand-text").trim();
  const cyan = styles.getPropertyValue("--color-brand-cyan").trim();
  const amber = styles.getPropertyValue("--color-brand-amber").trim();
  const violet = styles.getPropertyValue("--color-brand-violet").trim();
  return {
    nodeTypes: [brand, brandLight, accent, cyan, amber, violet, brandDark],
    connection: brand,
    label: text
  };
}

function HeroNetwork({ mouseRef }: { mouseRef: React.RefObject<{ x: number; y: number; active: boolean }> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isNearViewport = useIsNearViewport(canvasRef);
  const nodesRef = useRef<NetworkNode[]>([]);
  const dimensionsRef = useRef({ width: 0, height: 0 });

  // biome-ignore lint/correctness/useExhaustiveDependencies: isNearViewport is a stable ref read inside rAF
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

    const colors = readNetworkColors();
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
        const type = i % NODE_TYPE_LABELS.length;
        const labels = NODE_TYPE_LABELS[type];
        const label = labels[i % labels.length];
        const depth = 0.3 + Math.random() * 0.7;
        const baseRadius = (3 + Math.random() * 4) * depth;
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.3 * depth,
          vy: (Math.random() - 0.5) * 0.2 * depth,
          radius: baseRadius,
          baseRadius,
          depth,
          type,
          label,
          phase: Math.random() * Math.PI * 2,
          brighten: 0
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

    let time = 0;
    const connectionDist = 220;

    const draw = () => {
      animationId = requestAnimationFrame(draw);
      if (!isNearViewport.current) {
        return;
      }
      time += 0.008;
      const w = dimensionsRef.current.width;
      const h = dimensionsRef.current.height;
      if (w === 0) {
        return;
      }
      context.clearRect(0, 0, w, h);

      const nodes = nodesRef.current;
      const mouse = mouseRef.current;

      const pushRadius = 120;
      const growRadius = 300;
      const lerpSpeed = 0.08;

      for (const node of nodes) {
        node.x += node.vx + Math.sin(time * 0.5 + node.phase) * 0.15 * node.depth;
        node.y += node.vy + Math.cos(time * 0.4 + node.phase + 1) * 0.1 * node.depth;

        if (node.x < 0 || node.x > w) {
          node.vx = -node.vx;
          node.x = Math.max(0, Math.min(w, node.x));
        }
        if (node.y < 0 || node.y > h) {
          node.vy = -node.vy;
          node.y = Math.max(0, Math.min(h, node.y));
        }

        let targetBrighten = 0;
        let targetRadius = node.baseRadius;

        if (mouse.active) {
          const dx = mouse.x - node.x;
          const dy = mouse.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < pushRadius && dist > 0.1) {
            const push = (1 - dist / pushRadius) * 0.5 * node.depth;
            node.x -= (dx / dist) * push;
            node.y -= (dy / dist) * push;
          }

          if (dist < growRadius) {
            const proximity = 1 - dist / growRadius;
            targetRadius = node.baseRadius + proximity * 5 * node.depth;
            targetBrighten = proximity;
          }
        }

        node.radius += (targetRadius - node.radius) * lerpSpeed;
        node.brighten += (targetBrighten - node.brighten) * lerpSpeed;
      }

      const connectionDistSquared = connectionDist * connectionDist;

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const nodeA = nodes[i];
          const nodeB = nodes[j];
          const dx = nodeA.x - nodeB.x;
          const dy = nodeA.y - nodeB.y;
          const distSquared = dx * dx + dy * dy;
          if (distSquared < connectionDistSquared) {
            const ratio = distSquared / connectionDistSquared;
            const brightenBoost = Math.min(nodeA.brighten, nodeB.brighten) * 0.4;
            const alpha = (1 - ratio) * (0.5 + brightenBoost) * Math.min(nodeA.depth, nodeB.depth);
            const alphaHex = Math.round(Math.min(1, alpha) * 255)
              .toString(16)
              .padStart(2, "0");
            context.strokeStyle = `${colors.connection}${alphaHex}`;
            context.lineWidth = (1 - ratio) * (1.5 + brightenBoost * 2);
            context.beginPath();
            context.moveTo(nodeA.x, nodeA.y);
            context.lineTo(nodeB.x, nodeB.y);
            context.stroke();
          }
        }
      }

      for (const node of nodes) {
        const nodeColor = colors.nodeTypes[node.type];
        const baseAlpha = 0.3 + node.depth * 0.5;
        const brightenedAlpha = Math.min(1, baseAlpha + node.brighten * 0.4);

        context.fillStyle = nodeColor;
        context.globalAlpha = brightenedAlpha;
        context.beginPath();
        context.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        context.fill();

        if (node.depth > 0.4) {
          const labelAlpha = 0.3 + (node.depth - 0.4) * 0.8 + node.brighten * 0.3;
          context.globalAlpha = Math.min(1, labelAlpha);
          context.fillStyle = colors.label;
          context.font = `${9 * node.depth}px ui-sans-serif, system-ui, -apple-system, sans-serif`;
          context.textAlign = "center";
          context.fillText(node.label, node.x, node.y + node.radius * 2.8 + 8);
        }

        context.globalAlpha = 1;
      }
    };

    animationId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
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
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const { mouseRef, addCssTarget } = useSectionMouse(sectionRef);

  useEffect(() => {
    if (textRef.current) {
      addCssTarget(textRef.current);
    }
  }, [addCssTarget]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-white">
      <div className="pointer-events-none absolute inset-0 z-[1]">
        <div className="pointer-events-auto h-full w-full">
          <HeroNetwork mouseRef={mouseRef} />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 z-[1] bg-white [mask-image:radial-gradient(ellipse_at_30%_50%,black_0%,black_40%,transparent_75%)]" />

      <div className="relative z-[2] mx-auto max-w-7xl px-4 pt-32 pb-32 sm:px-6 md:pt-48 md:pb-32 lg:px-8">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-brand-accent/20 bg-brand-accent/10 px-3 py-1 font-semibold text-brand-accent text-sm backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-accent opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-accent"></span>
              </span>
              ESPR 2026 Ready
            </div>
            <h1 className="mb-8 font-bold font-display text-[1.7rem] text-brand-darkest leading-[1.05] tracking-tight sm:text-4xl md:text-[5rem]">
              Revolutionize Furniture Manufacturing with{" "}
              <span
                ref={textRef}
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "radial-gradient(circle 400px at var(--mouse-x, 50%) var(--mouse-y, 50%), var(--color-brand-accent), var(--color-brand-violet))"
                }}
              >
                Product Connect.
              </span>
            </h1>
            <p className="mb-12 max-w-2xl font-medium text-brand-text text-lg leading-relaxed md:text-xl">
              Streamline your supply chain, integrate data seamlessly, and track environmental impact. The
              infrastructure that gives intelligence to physical products.
            </p>
            <div className="flex flex-col gap-5 sm:flex-row">
              <WebsiteButton icon={ArrowRight}>Start Building</WebsiteButton>
              <WebsiteButton variant="secondary" icon={PlayCircle} iconPosition="left">
                Book a Demo
              </WebsiteButton>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 opacity-40"
        >
          <span className="font-bold text-[10px] text-slate-400 uppercase tracking-widest">Scroll to explore</span>
          <div className="h-12 w-px bg-gradient-to-b from-brand to-transparent"></div>
        </motion.div>
      </div>
    </section>
  );
}
