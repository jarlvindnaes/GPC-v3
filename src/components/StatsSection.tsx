import { motion } from "motion/react";
import { type RefObject, useCallback, useEffect, useRef } from "react";
import { useIsNearViewport } from "../utilities/useIsNearViewport";

interface Node {
  baseX: number;
  baseY: number;
  x: number;
  y: number;
  radius: number;
  phase: number;
  driftSpeed: number;
  driftRadius: number;
  colorIndex: number;
}

function readBrandColors(): string[] {
  const styles = getComputedStyle(document.documentElement);
  return [
    styles.getPropertyValue("--color-brand").trim(),
    styles.getPropertyValue("--color-brand-light").trim(),
    styles.getPropertyValue("--color-brand-accent").trim(),
    styles.getPropertyValue("--color-brand-cyan").trim(),
    styles.getPropertyValue("--color-brand-amber").trim(),
    styles.getPropertyValue("--color-brand-violet").trim()
  ];
}

function NetworkCanvas({ sectionMouseRef }: { sectionMouseRef: RefObject<{ x: number; y: number; active: boolean }> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isNearViewport = useIsNearViewport(canvasRef);
  const nodesRef = useRef<Node[]>([]);

  const initNodes = useCallback(() => {
    const count = 150;
    const nodes: Node[] = [];
    for (let i = 0; i < count; i++) {
      // Fan upward: angles from -150° to -30° (upper hemisphere, wide spread)
      const angle = -Math.PI * (5 / 6) + (i / count) * Math.PI * (4 / 6);
      const radiusVariation = 250 + Math.random() * 550;
      const x = 600 + Math.cos(angle) * radiusVariation;
      const y = 1100 + Math.sin(angle) * radiusVariation;
      const nodeRadius = Math.random() * 3 + 1;
      nodes.push({
        baseX: x,
        baseY: y,
        x,
        y,
        radius: nodeRadius,
        phase: Math.random() * Math.PI * 2,
        driftSpeed: 0.3 + Math.random() * 0.5,
        driftRadius: 3 + Math.random() * 6,
        colorIndex: Math.floor(Math.random() * 6)
      });
    }
    nodesRef.current = nodes;
  }, []);

  useEffect(() => {
    initNodes();
  }, [initNodes]);

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

    const brandColors = readBrandColors();
    const devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    let animationId: number;

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
      animationId = requestAnimationFrame(draw);
      if (!isNearViewport.current) {
        return;
      }
      time += 0.016;
      const w = canvas.width / devicePixelRatio;
      const h = canvas.height / devicePixelRatio;
      context.clearRect(0, 0, w, h);

      const scaleX = w / 1200;
      const scaleY = h / 1200;
      const nodes = nodesRef.current;

      // Translate section-relative mouse coords to canvas parent-relative coords
      const sectionMouse = sectionMouseRef.current;
      const section = parent.closest("section");
      const mouse = { x: 0, y: 0, active: sectionMouse.active };
      if (section && sectionMouse.active) {
        const sectionRect = section.getBoundingClientRect();
        const parentRect = parent.getBoundingClientRect();
        mouse.x = sectionMouse.x - (parentRect.left - sectionRect.left);
        mouse.y = sectionMouse.y - (parentRect.top - sectionRect.top);
      }

      const anchorX = 600 * scaleX;
      const anchorY = 1100 * scaleY;

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
        const color = brandColors[node.colorIndex];
        context.strokeStyle = `${color}66`;
        context.beginPath();
        context.moveTo(anchorX, anchorY);
        context.quadraticCurveTo(controlPointX, controlPointY, node.x, node.y);
        context.stroke();
      }

      // Draw nodes
      for (const node of nodes) {
        const scaledRadius = node.radius * Math.min(scaleX, scaleY);
        const color = brandColors[node.colorIndex];
        context.fillStyle = `${color}cc`;
        context.beginPath();
        context.arc(node.x, node.y, scaledRadius, 0, Math.PI * 2);
        context.fill();
      }
    };

    animationId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-label="Network particle visualization" />
  );
}

const STAT_GRADIENT =
  "radial-gradient(circle 400px at var(--mouse-x, 50%) var(--mouse-y, 50%), var(--color-brand-accent), var(--color-brand-violet))";

export function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const statEls = useRef<Set<HTMLDivElement>>(new Set());
  const addStatRef = useCallback((el: HTMLDivElement | null) => {
    if (el) {
      statEls.current.add(el);
    }
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) {
      return;
    }

    const handleMouseMove = (event: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      mouseRef.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        active: true
      };
      for (const el of statEls.current) {
        const elRect = el.getBoundingClientRect();
        el.style.setProperty("--mouse-x", `${((event.clientX - elRect.left) / elRect.width) * 100}%`);
        el.style.setProperty("--mouse-y", `${((event.clientY - elRect.top) / elRect.height) * 100}%`);
      }
    };
    const handleMouseLeave = () => {
      mouseRef.current.active = false;
      for (const el of statEls.current) {
        el.style.removeProperty("--mouse-x");
        el.style.removeProperty("--mouse-y");
      }
    };

    section.addEventListener("mousemove", handleMouseMove);
    section.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      section.removeEventListener("mousemove", handleMouseMove);
      section.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-12 sm:py-16 md:py-24"
      style={{
        background: "radial-gradient(ellipse 80% 70% at 50% 100%, var(--color-brand-surface) 0%, white 70%)"
      }}
    >
      <div className="absolute top-0 right-0 left-0 z-20 h-px bg-gradient-to-r from-transparent via-brand/50 to-transparent" />
      <div className="pointer-events-none relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mb-8 max-w-4xl font-display font-semibold text-2xl text-brand-darkest leading-[1.1] tracking-tight sm:text-3xl md:mb-16 md:text-4xl"
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
            <div
              ref={addStatRef}
              className="mb-3 bg-clip-text font-display font-semibold text-3xl text-transparent sm:text-4xl md:text-5xl"
              style={{ backgroundImage: STAT_GRADIENT }}
            >
              10M+
            </div>
            <div className="max-w-[200px] font-medium text-brand-text text-sm leading-relaxed md:text-base">
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
            <div
              ref={addStatRef}
              className="mb-3 bg-clip-text font-display font-semibold text-3xl text-transparent sm:text-4xl md:text-5xl"
              style={{ backgroundImage: STAT_GRADIENT }}
            >
              €50M+
            </div>
            <div className="max-w-[200px] font-medium text-brand-text text-sm leading-relaxed md:text-base">
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
            <div
              ref={addStatRef}
              className="mb-3 bg-clip-text font-display font-semibold text-3xl text-transparent sm:text-4xl md:text-5xl"
              style={{ backgroundImage: STAT_GRADIENT }}
            >
              99.9%
            </div>
            <div className="max-w-[200px] font-medium text-brand-text text-sm leading-relaxed md:text-base">
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
            <div
              ref={addStatRef}
              className="mb-3 bg-clip-text font-display font-semibold text-3xl text-transparent sm:text-4xl md:text-5xl"
              style={{ backgroundImage: STAT_GRADIENT }}
            >
              2026
            </div>
            <div className="max-w-[200px] font-medium text-brand-text text-sm leading-relaxed md:text-base">
              ESPR compliance ready today
            </div>
          </motion.div>
        </div>
      </div>

      {/* Abstract circular visual - nodes gravitate toward mouse */}
      <div className="pointer-events-auto absolute -bottom-[200px] left-1/2 z-0 h-[900px] w-[900px] -translate-x-1/2 opacity-25">
        <NetworkCanvas sectionMouseRef={mouseRef} />
      </div>
    </section>
  );
}
