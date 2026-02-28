import { useEffect, useRef, useCallback, useMemo } from "react";
import { motion } from "motion/react";

interface Node {
  baseX: number;
  baseY: number;
  x: number;
  y: number;
  radius: number;
}

function NetworkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const nodesRef = useRef<Node[]>([]);

  const initNodes = useCallback(() => {
    const count = 150;
    const nodes: Node[] = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radiusVariation = 400 + Math.random() * 250;
      const x = 600 + Math.cos(angle) * radiusVariation;
      const y = 300 + Math.sin(angle) * radiusVariation;
      const r = Math.random() * 3 + 1;
      nodes.push({ baseX: x, baseY: y, x, y, radius: r });
    }
    nodesRef.current = nodes;
  }, []);

  useEffect(() => {
    initNodes();
  }, [initNodes]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let animId: number;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };
    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    parent.addEventListener("mousemove", handleMouseMove);
    parent.addEventListener("mouseleave", handleMouseLeave);

    const resize = () => {
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.clearRect(0, 0, w, h);

      const scaleX = w / 1200;
      const scaleY = h / 1200;
      const nodes = nodesRef.current;
      const mouse = mouseRef.current;

      const anchorX = 600 * scaleX;
      const anchorY = 900 * scaleY;

      for (const node of nodes) {
        const targetX = node.baseX * scaleX;
        const targetY = node.baseY * scaleY;
        let goalX = targetX;
        let goalY = targetY;

        if (mouse.active) {
          const dx = mouse.x - targetX;
          const dy = mouse.y - targetY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const pullRadius = 250;
          if (dist < pullRadius) {
            const strength = (1 - dist / pullRadius) * 40;
            goalX += (dx / dist) * strength;
            goalY += (dy / dist) * strength;
          }
        }

        node.x += (goalX - node.x) * 0.08;
        node.y += (goalY - node.y) * 0.08;
      }

      // Draw connecting lines from anchor to each node
      ctx.lineWidth = 1.5 * Math.min(scaleX, scaleY);
      for (const node of nodes) {
        const cpx = (anchorX + node.x) / 2;
        const cpy = (anchorY + node.y) / 2;
        ctx.strokeStyle = "rgba(99, 102, 241, 0.35)";
        ctx.beginPath();
        ctx.moveTo(anchorX, anchorY);
        ctx.quadraticCurveTo(cpx, cpy, node.x, node.y);
        ctx.stroke();
      }

      // Draw nodes
      for (const node of nodes) {
        const r = node.radius * Math.min(scaleX, scaleY);
        ctx.fillStyle = "rgba(99, 102, 241, 0.8)";
        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      parent.removeEventListener("mousemove", handleMouseMove);
      parent.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

export function StatsSection() {
  return (
    <section className="py-32 md:py-48 bg-slate-950 text-white overflow-hidden relative">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-display font-semibold tracking-tight mb-12 md:mb-24 max-w-4xl mx-auto leading-[1.1]"
        >
          The backbone of sustainable manufacturing.
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center"
          >
            <div className="text-4xl sm:text-6xl md:text-7xl font-display font-semibold mb-4 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">10M+</div>
            <div className="text-base md:text-lg font-medium text-slate-400 max-w-[200px] leading-relaxed">
              components tracked across supply chains
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center"
          >
            <div className="text-4xl sm:text-6xl md:text-7xl font-display font-semibold mb-4 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">€50M+</div>
            <div className="text-base md:text-lg font-medium text-slate-400 max-w-[200px] leading-relaxed">
              in consulting fees saved by manufacturers
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center"
          >
            <div className="text-4xl sm:text-6xl md:text-7xl font-display font-semibold mb-4 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">99.9%</div>
            <div className="text-base md:text-lg font-medium text-slate-400 max-w-[200px] leading-relaxed">
              data accuracy for LCA calculations
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex flex-col items-center"
          >
            <div className="text-4xl sm:text-6xl md:text-7xl font-display font-semibold mb-4 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">2026</div>
            <div className="text-base md:text-lg font-medium text-slate-400 max-w-[200px] leading-relaxed">
              ESPR compliance ready today
            </div>
          </motion.div>
        </div>
      </div>

      {/* Abstract circular visual — nodes gravitate toward mouse */}
      <div className="absolute -bottom-[200px] left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] opacity-30 pointer-events-auto mix-blend-screen z-0">
        <NetworkCanvas />
      </div>
    </section>
  );
}
