import { useEffect, useRef, useCallback } from "react";
import { motion } from "motion/react";

interface GlobePoint {
  phi: number;
  theta: number;
}

function fibonacciSphere(n: number): GlobePoint[] {
  const pts: GlobePoint[] = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const radiusAtY = Math.sqrt(1 - y * y);
    const theta = goldenAngle * i;
    const phi = Math.asin(y);
    pts.push({ phi, theta });
  }
  return pts;
}

function GlobeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const frameRef = useRef(0);
  const pointsRef = useRef(fibonacciSphere(120));

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
      y: ((e.clientY - rect.top) / rect.height) * 2 - 1,
    };
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current = { x: 0, y: 0 };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    parent.addEventListener("mousemove", handleMouseMove);
    parent.addEventListener("mouseleave", handleMouseLeave);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

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

    const points = pointsRef.current;

    const draw = (time: number) => {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const radius = Math.min(w, h) * 0.38;
      const focalLength = radius * 3;

      const autoRotY = time * 0.0001;
      const tiltX = mouseRef.current.y * 0.3;
      const tiltY = mouseRef.current.x * 0.4;

      const rotY = autoRotY + tiltY;
      const rotX = tiltX;

      const cosRY = Math.cos(rotY);
      const sinRY = Math.sin(rotY);
      const cosRX = Math.cos(rotX);
      const sinRX = Math.sin(rotX);

      const projected: { sx: number; sy: number; z: number; depth: number }[] = [];

      for (const p of points) {
        const cosPhi = Math.cos(p.phi);
        let x3 = cosPhi * Math.cos(p.theta);
        let y3 = Math.sin(p.phi);
        let z3 = cosPhi * Math.sin(p.theta);

        const x1 = x3 * cosRY - z3 * sinRY;
        const z1 = x3 * sinRY + z3 * cosRY;
        const y1 = y3 * cosRX - z1 * sinRX;
        const z2 = y3 * sinRX + z1 * cosRX;

        const scale = focalLength / (focalLength + z2 * radius);
        const sx = cx + x1 * radius * scale;
        const sy = cy + y1 * radius * scale;
        const depth = (z2 + 1) / 2;

        projected.push({ sx, sy, z: z2, depth });
      }

      // Draw connections between nearby nodes (front-facing only)
      ctx.lineWidth = 0.5;
      for (let i = 0; i < projected.length; i++) {
        const a = projected[i];
        if (a.z < -0.2) continue;
        for (let j = i + 1; j < projected.length; j++) {
          const b = projected[j];
          if (b.z < -0.2) continue;
          const dx = a.sx - b.sx;
          const dy = a.sy - b.sy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = radius * 0.35;
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * Math.min(a.depth, b.depth) * 0.4;
            ctx.strokeStyle = `rgba(129, 140, 248, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(a.sx, a.sy);
            ctx.lineTo(b.sx, b.sy);
            ctx.stroke();
          }
        }
      }

      // Draw nodes (sort back to front)
      const sorted = projected.map((p, i) => ({ ...p, i })).sort((a, b) => a.z - b.z);
      for (const p of sorted) {
        if (p.z < -0.5) continue;
        const nodeRadius = 1 + p.depth * 2.5;
        const alpha = Math.max(0, p.depth * 0.9);

        if (p.depth > 0.6) {
          ctx.shadowColor = "rgba(129, 140, 248, 0.6)";
          ctx.shadowBlur = 8;
        } else {
          ctx.shadowColor = "transparent";
          ctx.shadowBlur = 0;
        }

        ctx.fillStyle = `rgba(165, 180, 252, ${alpha})`;
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, nodeRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;

      // Subtle equator ring
      ctx.strokeStyle = "rgba(129, 140, 248, 0.08)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(cx, cy, radius, radius * 0.3, 0, 0, Math.PI * 2);
      ctx.stroke();

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      parent.removeEventListener("mousemove", handleMouseMove);
      parent.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

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

      {/* 3D Globe visualization */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[900px] sm:w-[1100px] sm:h-[1100px] opacity-30 pointer-events-auto mix-blend-screen z-0">
        <GlobeCanvas />
      </div>
    </section>
  );
}
