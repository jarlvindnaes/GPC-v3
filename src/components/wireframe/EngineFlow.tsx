import { useEffect, useRef } from "react";

import { useIsNearViewport } from "../../utilities/useIsNearViewport";

// Animated flow overlay for the "data layer" engine diagram. Drawn on a canvas that sits over the
// existing .engine markup: it measures the Data-in boxes, the Product Connect core, and the Value-out
// boxes, then draws yellow lines (in -> core) and green lines (core -> out) with dots travelling along them.
// Desktop fans the lines from each box to the core; mobile (stacked) threads one line down through the gaps.

const YELLOW = "#f2b43c";
const GREEN = "#41c98a";
const LINE_ALPHA = "66"; // ~0.4 on the dark engine background
const DOT_SPEED = 0.5; // px per frame
const CORE_MARGIN = 10; // gap from the core's top/bottom edge for the spread connection points
const DOT_RADIUS = 3.6;

interface Seg {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface Flow {
  color: string;
  segs: Seg[];
  lengths: number[];
  total: number;
  dots: number;
}

export function EngineFlow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isNear = useIsNearViewport(canvasRef);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const engine = canvas.closest(".engine");
    if (!(engine instanceof HTMLElement)) {
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let flows: Flow[] = [];
    let raf = 0;
    let time = 0;

    const buildFlow = (color: string, segs: Seg[]): Flow => {
      const lengths = segs.map((s) => Math.hypot(s.x2 - s.x1, s.y2 - s.y1));
      const total = lengths.reduce((a, b) => a + b, 0);
      return { color, segs, lengths, total, dots: segs.length > 1 ? 3 : 1 };
    };

    const measure = () => {
      const er = engine.getBoundingClientRect();
      width = er.width;
      height = er.height;
      if (!width || !height) {
        return;
      }
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const core = engine.querySelector(".core");
      const cols = engine.querySelectorAll(".engine__col");
      if (!core || cols.length < 2) {
        flows = [];
        return;
      }
      const rel = (el: Element) => {
        const b = el.getBoundingClientRect();
        return {
          left: b.left - er.left,
          right: b.right - er.left,
          top: b.top - er.top,
          bottom: b.bottom - er.top,
          midX: (b.left + b.right) / 2 - er.left,
          midY: (b.top + b.bottom) / 2 - er.top
        };
      };
      const c = rel(core);
      const inBoxes = [...cols[0].querySelectorAll(".engine__list li")].map(rel);
      const outBoxes = [...cols[1].querySelectorAll(".engine__list li")].map(rel);
      if (!inBoxes.length || !outBoxes.length) {
        flows = [];
        return;
      }

      const next: Flow[] = [];
      const sideBySide = inBoxes[0].right <= c.left + 2 && c.right <= outBoxes[0].left + 2;
      if (sideBySide) {
        // distribute the core-side endpoints evenly down the core's height (with a top/bottom margin)
        const spreadY = (count: number, index: number) => {
          const usable = c.bottom - c.top - CORE_MARGIN * 2;
          return c.top + CORE_MARGIN + (count > 1 ? (usable * index) / (count - 1) : usable / 2);
        };
        inBoxes.forEach((box, i) => {
          next.push(buildFlow(YELLOW, [{ x1: box.right, y1: box.midY, x2: c.left, y2: spreadY(inBoxes.length, i) }]));
        });
        outBoxes.forEach((box, i) => {
          next.push(buildFlow(GREEN, [{ x1: c.right, y1: spreadY(outBoxes.length, i), x2: box.left, y2: box.midY }]));
        });
      } else {
        const x = c.midX;
        const yellow: Seg[] = [];
        for (let k = 0; k < inBoxes.length - 1; k++) {
          yellow.push({ x1: x, y1: inBoxes[k].bottom, x2: x, y2: inBoxes[k + 1].top });
        }
        yellow.push({ x1: x, y1: inBoxes[inBoxes.length - 1].bottom, x2: x, y2: c.top });
        next.push(buildFlow(YELLOW, yellow));
        const green: Seg[] = [{ x1: x, y1: c.bottom, x2: x, y2: outBoxes[0].top }];
        for (let k = 0; k < outBoxes.length - 1; k++) {
          green.push({ x1: x, y1: outBoxes[k].bottom, x2: x, y2: outBoxes[k + 1].top });
        }
        next.push(buildFlow(GREEN, green));
      }
      flows = next;
    };

    const pointAt = (flow: Flow, distance: number) => {
      let d = distance;
      for (let i = 0; i < flow.segs.length; i++) {
        const len = flow.lengths[i];
        if (d <= len || i === flow.segs.length - 1) {
          const s = flow.segs[i];
          const t = len ? Math.min(d / len, 1) : 0;
          return { x: s.x1 + (s.x2 - s.x1) * t, y: s.y1 + (s.y2 - s.y1) * t };
        }
        d -= len;
      }
      const last = flow.segs[flow.segs.length - 1];
      return { x: last.x2, y: last.y2 };
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      for (const f of flows) {
        ctx.strokeStyle = `${f.color}${LINE_ALPHA}`;
        for (const s of f.segs) {
          ctx.beginPath();
          ctx.moveTo(s.x1, s.y1);
          ctx.lineTo(s.x2, s.y2);
          ctx.stroke();
        }
      }
      for (const f of flows) {
        if (!f.total) {
          continue;
        }
        ctx.fillStyle = f.color;
        ctx.shadowColor = f.color;
        ctx.shadowBlur = 9;
        for (let k = 0; k < f.dots; k++) {
          const phase = (f.total / f.dots) * k;
          const distance = (time * DOT_SPEED + phase) % f.total;
          const p = pointAt(f, distance);
          ctx.beginPath();
          ctx.arc(p.x, p.y, DOT_RADIUS, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.shadowBlur = 0;
      }
    };

    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!isNear.current || !width) {
        return;
      }
      time += 1;
      render();
    };

    measure();
    render();
    if (!reduceMotion) {
      raf = requestAnimationFrame(loop);
    }

    const resizeObserver = new ResizeObserver(() => {
      measure();
      render();
    });
    resizeObserver.observe(engine);

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
    };
  }, [isNear]);

  return <canvas ref={canvasRef} className="engine__flow" aria-label="Animated data flow into and out of Product Connect" />;
}
