import { motion } from "motion/react";
import { useCallback, useEffect, useRef } from "react";

interface Node {
  baseX: number;
  baseY: number;
  x: number;
  y: number;
  radius: number;
  phase: number;
  driftSpeed: number;
  driftRadius: number;
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
      const radiusVariation = 250 + Math.random() * 200;
      const x = 600 + Math.cos(angle) * radiusVariation;
      const y = 500 + Math.sin(angle) * radiusVariation;
      const nodeRadius = Math.random() * 3 + 1;
      nodes.push({
        baseX: x,
        baseY: y,
        x,
        y,
        radius: nodeRadius,
        phase: Math.random() * Math.PI * 2,
        driftSpeed: 0.3 + Math.random() * 0.5,
        driftRadius: 3 + Math.random() * 6
      });
    }
    nodesRef.current = nodes;
  }, []);

  useEffect(() => {
    initNodes();
  }, [initNodes]);

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

    const handleMouseMove = (event: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      mouseRef.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        active: true
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
      canvas.width = w * devicePixelRatio;
      canvas.height = h * devicePixelRatio;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    let time = 0;
    const draw = () => {
      time += 0.016;
      const w = canvas.width / devicePixelRatio;
      const h = canvas.height / devicePixelRatio;
      context.clearRect(0, 0, w, h);

      const scaleX = w / 1200;
      const scaleY = h / 1200;
      const nodes = nodesRef.current;
      const mouse = mouseRef.current;

      const anchorX = 600 * scaleX;
      const anchorY = 900 * scaleY;

      for (const node of nodes) {
        const driftX = Math.sin(time * node.driftSpeed + node.phase) * node.driftRadius;
        const driftY = Math.cos(time * node.driftSpeed * 0.7 + node.phase + 1.5) * node.driftRadius;
        const targetX = node.baseX * scaleX + driftX;
        const targetY = node.baseY * scaleY + driftY;
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
      context.lineWidth = 1.5 * Math.min(scaleX, scaleY);
      for (const node of nodes) {
        const controlPointX = (anchorX + node.x) / 2;
        const controlPointY = (anchorY + node.y) / 2;
        context.strokeStyle = "rgba(99, 102, 241, 0.35)";
        context.beginPath();
        context.moveTo(anchorX, anchorY);
        context.quadraticCurveTo(controlPointX, controlPointY, node.x, node.y);
        context.stroke();
      }

      // Draw nodes
      for (const node of nodes) {
        const scaledRadius = node.radius * Math.min(scaleX, scaleY);
        context.fillStyle = "rgba(99, 102, 241, 0.8)";
        context.beginPath();
        context.arc(node.x, node.y, scaledRadius, 0, Math.PI * 2);
        context.fill();
      }

      animationId = requestAnimationFrame(draw);
    };

    animationId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      parent.removeEventListener("mousemove", handleMouseMove);
      parent.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-label="Network particle visualization" />
  );
}

export function StatsSection() {
  return (
    <section className="relative overflow-hidden bg-slate-950 py-16 text-white sm:py-24 md:py-48">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mb-12 max-w-4xl font-display font-semibold text-3xl leading-[1.1] tracking-tight sm:text-5xl md:mb-24 md:text-7xl lg:text-8xl"
        >
          The backbone of sustainable manufacturing.
        </motion.h2>

        <div className="relative grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center"
          >
            <div className="mb-4 bg-gradient-to-b from-white to-slate-400 bg-clip-text font-display font-semibold text-4xl text-transparent sm:text-6xl md:text-7xl">
              10M+
            </div>
            <div className="max-w-[200px] font-medium text-base text-slate-400 leading-relaxed md:text-lg">
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
            <div className="mb-4 bg-gradient-to-b from-white to-slate-400 bg-clip-text font-display font-semibold text-4xl text-transparent sm:text-6xl md:text-7xl">
              €50M+
            </div>
            <div className="max-w-[200px] font-medium text-base text-slate-400 leading-relaxed md:text-lg">
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
            <div className="mb-4 bg-gradient-to-b from-white to-slate-400 bg-clip-text font-display font-semibold text-4xl text-transparent sm:text-6xl md:text-7xl">
              99.9%
            </div>
            <div className="max-w-[200px] font-medium text-base text-slate-400 leading-relaxed md:text-lg">
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
            <div className="mb-4 bg-gradient-to-b from-white to-slate-400 bg-clip-text font-display font-semibold text-4xl text-transparent sm:text-6xl md:text-7xl">
              2026
            </div>
            <div className="max-w-[200px] font-medium text-base text-slate-400 leading-relaxed md:text-lg">
              ESPR compliance ready today
            </div>
          </motion.div>
        </div>
      </div>

      {/* Abstract circular visual — nodes gravitate toward mouse */}
      <div className="pointer-events-auto absolute -bottom-[200px] left-1/2 z-0 h-[1200px] w-[1200px] -translate-x-1/2 opacity-30 mix-blend-screen">
        <NetworkCanvas />
      </div>
    </section>
  );
}
