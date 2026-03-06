import { useEffect, useRef, useState } from "react";
import { useTheme } from "../theme";
import { useIsNearViewport } from "../utilities/useIsNearViewport";

interface GridNode {
  baseX: number;
  baseY: number;
  x: number;
  y: number;
  brighten: number;
}

function readGridLineColor(): string {
  return getComputedStyle(document.documentElement).getPropertyValue("--color-brand-light").trim();
}

const GRID_SPACING = 48;

export function InteractiveGrid() {
  const canvasReference = useRef<HTMLCanvasElement>(null);
  const isNearViewport = useIsNearViewport(canvasReference);
  const mouseReference = useRef({ x: 0, y: 0, active: false });
  const nodesReference = useRef<GridNode[]>([]);
  const gridColumnsReference = useRef(0);
  const dimensionsReference = useRef({ width: 0, height: 0 });

  // biome-ignore lint/correctness/useExhaustiveDependencies: isNearViewport is a stable ref read inside rAF
  useEffect(() => {
    const canvas = canvasReference.current;
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

    const lineColor = readGridLineColor();
    const devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    let animationId: number;

    const initGrid = () => {
      const w = dimensionsReference.current.width;
      const h = dimensionsReference.current.height;
      if (w === 0 || h === 0) {
        return;
      }

      const columns = Math.ceil(w / GRID_SPACING) + 1;
      const rows = Math.ceil(h / GRID_SPACING) + 1;
      gridColumnsReference.current = columns;
      const nodes: GridNode[] = [];

      for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
          const baseX = column * GRID_SPACING;
          const baseY = row * GRID_SPACING;
          nodes.push({
            baseX,
            baseY,
            x: baseX,
            y: baseY,
            brighten: 0
          });
        }
      }
      nodesReference.current = nodes;
    };

    const resize = () => {
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      dimensionsReference.current = { width: w, height: h };
      canvas.width = w * devicePixelRatio;
      canvas.height = h * devicePixelRatio;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      initGrid();
    };
    resize();
    window.addEventListener("resize", resize);

    const section = canvas.closest("section");
    if (!section) {
      return;
    }

    const onMouseMove = (event: MouseEvent) => {
      const rectangle = section.getBoundingClientRect();
      mouseReference.current = {
        x: event.clientX - rectangle.left,
        y: event.clientY - rectangle.top,
        active: true
      };
    };
    const onMouseLeave = () => {
      mouseReference.current.active = false;
    };
    section.addEventListener("mousemove", onMouseMove);
    section.addEventListener("mouseleave", onMouseLeave);

    const pushRadius = 280;
    const growRadius = 550;
    const lerpSpeed = 0.1;
    const springSpeed = 0.08;

    const draw = () => {
      animationId = requestAnimationFrame(draw);
      if (!isNearViewport.current) {
        return;
      }
      const w = dimensionsReference.current.width;
      const h = dimensionsReference.current.height;
      if (w === 0) {
        return;
      }
      context.clearRect(0, 0, w, h);

      const nodes = nodesReference.current;
      const columns = gridColumnsReference.current;
      const mouse = mouseReference.current;

      for (const node of nodes) {
        let targetBrighten = 0;
        let pushX = 0;
        let pushY = 0;

        if (mouse.active) {
          const dx = mouse.x - node.baseX;
          const dy = mouse.y - node.baseY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < pushRadius && dist > 0.1) {
            const push = (1 - dist / pushRadius) * 14;
            pushX = -(dx / dist) * push;
            pushY = -(dy / dist) * push;
          }

          if (dist < growRadius) {
            targetBrighten = 1 - dist / growRadius;
          }
        }

        const targetX = node.baseX + pushX;
        const targetY = node.baseY + pushY;
        node.x += (targetX - node.x) * springSpeed;
        node.y += (targetY - node.y) * springSpeed;
        node.brighten += (targetBrighten - node.brighten) * lerpSpeed;
      }

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const column = i % columns;
        const row = Math.floor(i / columns);

        const lineBaseAlpha = 0.06;
        const lineBaseWidth = 1;

        if (column < columns - 1) {
          const neighbor = nodes[i + 1];
          const brightenBoost = Math.min(node.brighten, neighbor.brighten) * 0.25;
          const alpha = lineBaseAlpha + brightenBoost;
          const alphaHex = Math.round(Math.min(1, alpha) * 255)
            .toString(16)
            .padStart(2, "0");
          context.strokeStyle = `${lineColor}${alphaHex}`;
          context.lineWidth = lineBaseWidth;
          context.beginPath();
          context.moveTo(node.x, node.y);
          context.lineTo(neighbor.x, neighbor.y);
          context.stroke();
        }

        if (row < Math.floor((nodes.length - 1) / columns)) {
          const neighbor = nodes[i + columns];
          if (neighbor) {
            const brightenBoost = Math.min(node.brighten, neighbor.brighten) * 0.25;
            const alpha = lineBaseAlpha + brightenBoost;
            const alphaHex = Math.round(Math.min(1, alpha) * 255)
              .toString(16)
              .padStart(2, "0");
            context.strokeStyle = `${lineColor}${alphaHex}`;
            context.lineWidth = lineBaseWidth;
            context.beginPath();
            context.moveTo(node.x, node.y);
            context.lineTo(neighbor.x, neighbor.y);
            context.stroke();
          }
        }
      }
    };

    animationId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      section.removeEventListener("mousemove", onMouseMove);
      section.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <canvas ref={canvasReference} className="absolute inset-0 h-full w-full" aria-label="Interactive grid background" />
  );
}

export function CountdownBanner() {
  const { theme } = useTheme();
  const targetDate = new Date("2027-01-01T00:00:00Z").getTime();

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const tick = () => {
      const distance = targetDate - Date.now();
      if (distance < 0) {
        return;
      }
      setTimeLeft({
        days: Math.floor(distance / 86400000),
        hours: Math.floor((distance % 86400000) / 3600000),
        minutes: Math.floor((distance % 3600000) / 60000),
        seconds: Math.floor((distance % 60000) / 1000)
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const Unit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <span className="font-mono font-semibold text-3xl text-brand-darkest tabular-nums leading-none tracking-tight sm:text-5xl md:text-6xl">
        {String(value).padStart(2, "0")}
      </span>
      <span className="mt-2 font-medium text-[11px] text-slate-400 uppercase tracking-widest">{label}</span>
    </div>
  );

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-brand-surface py-16 md:py-20">
      {/* Subtle top border accent */}
      <div className="absolute top-0 right-0 left-0 h-px bg-gradient-to-r from-transparent via-brand/50 to-transparent" />

      {/* Interactive grid background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="pointer-events-auto h-full w-full">
          <InteractiveGrid key={theme} />
        </div>
      </div>

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
            </span>
            <span className="text-center font-semibold text-slate-700 text-xs tracking-wide sm:text-sm">
              EU DPP Legislation — ESPR Deadline
            </span>
          </div>

          {/* Countdown */}
          <div className="flex items-start gap-3 sm:gap-6 md:gap-8">
            <Unit value={timeLeft.days} label="days" />
            <span className="mt-1.5 select-none font-light text-3xl text-slate-300 md:text-4xl">:</span>
            <Unit value={timeLeft.hours} label="hours" />
            <span className="mt-1.5 select-none font-light text-3xl text-slate-300 md:text-4xl">:</span>
            <Unit value={timeLeft.minutes} label="min" />
            <span className="mt-1.5 select-none font-light text-3xl text-slate-300 md:text-4xl">:</span>
            <Unit value={timeLeft.seconds} label="sec" />
          </div>

          {/* Sub-text */}
          <p className="max-w-lg text-center text-base text-slate-500 leading-relaxed">
            Non-compliance risks market exclusion across the EU.{" "}
            <span className="font-medium text-brand-dark">Is your product passport strategy ready?</span>
          </p>
        </div>
      </div>

      {/* Subtle bottom border */}
      <div className="absolute right-0 bottom-0 left-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
    </section>
  );
}
