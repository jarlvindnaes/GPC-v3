import { useEffect, useRef } from "react";

import { useIsNearViewport } from "../../utilities/useIsNearViewport";
import { useIsTouchDevice } from "../../utilities/useIsTouchDevice";

// Interactive warping-grid background island for the dark "Trust & compliance" section.
// Ported from the static wireframe's grid.js to a hydrated React island:
// a 48px grid of lines whose nodes spring away from the cursor and brighten nearby.
// Tuned to the same quiet tone as the How-it-works particles — light indigo on the dark base.
// Pauses off-screen and skips the per-node mouse physics on touch devices.

const LINE = "157,180,255"; // --indigo-soft (#9db4ff) — matches the particle palette
const SPACING = 48;
const PUSH_R = 280;
const GROW_R = 550;
const LERP = 0.1;
const SPRING = 0.08;
const BASE_ALPHA = 0.08;
const PUSH_STRENGTH = 14;
const BRIGHTEN_BOOST = 0.25;

interface GridNode {
  bx: number;
  by: number;
  x: number;
  y: number;
  brighten: number;
}

const CANVAS_STYLE = {
  position: "absolute",
  inset: "0",
  width: "100%",
  height: "100%",
  display: "block"
} as const;

export function GridField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isNear = useIsNearViewport(canvasRef);
  const { isTouchRef } = useIsTouchDevice();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let width = 0;
    let height = 0;
    let cols = 0;
    let raf = 0;
    let nodes: GridNode[] = [];
    const mouse = { x: 0, y: 0, active: false };

    function initGrid() {
      if (!width || !height) {
        return;
      }
      cols = Math.ceil(width / SPACING) + 1;
      const rows = Math.ceil(height / SPACING) + 1;
      nodes = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const bx = c * SPACING;
          const by = r * SPACING;
          nodes.push({ bx, by, x: bx, y: by, brighten: 0 });
        }
      }
    }

    function resize() {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h) {
        return;
      }
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      width = w;
      height = h;
      initGrid();
    }

    function line(a: GridNode, b: GridNode) {
      const boost = Math.min(a.brighten, b.brighten) * BRIGHTEN_BOOST;
      const alpha = Math.min(1, BASE_ALPHA + boost);
      ctx.strokeStyle = `rgba(${LINE},${alpha})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      if (!isTouchRef.current) {
        for (const n of nodes) {
          let tBright = 0;
          let pushX = 0;
          let pushY = 0;
          if (mouse.active) {
            const dx = mouse.x - n.bx;
            const dy = mouse.y - n.by;
            const dist = Math.hypot(dx, dy);
            if (dist < PUSH_R && dist > 0.1) {
              const p = (1 - dist / PUSH_R) * PUSH_STRENGTH;
              pushX = -(dx / dist) * p;
              pushY = -(dy / dist) * p;
            }
            if (dist < GROW_R) {
              tBright = 1 - dist / GROW_R;
            }
          }
          n.x += (n.bx + pushX - n.x) * SPRING;
          n.y += (n.by + pushY - n.y) * SPRING;
          n.brighten += (tBright - n.brighten) * LERP;
        }
      }

      const lastRowStart = Math.floor((nodes.length - 1) / cols);
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const col = i % cols;
        const row = Math.floor(i / cols);
        if (col < cols - 1) {
          line(n, nodes[i + 1]);
        }
        if (row < lastRowStart) {
          const below = nodes[i + cols];
          if (below) {
            line(n, below);
          }
        }
      }
    }

    function loop() {
      raf = requestAnimationFrame(loop);
      if (!isNear.current || !width) {
        return;
      }
      draw();
    }

    const section = canvas.closest("section");
    const onMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
      mouse.active = true;
    };
    const onLeave = () => {
      mouse.active = false;
    };

    resize();
    raf = requestAnimationFrame(loop);

    if (section) {
      section.addEventListener("mousemove", onMove);
      section.addEventListener("mouseleave", onLeave);
    }
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      if (section) {
        section.removeEventListener("mousemove", onMove);
        section.removeEventListener("mouseleave", onLeave);
      }
      resizeObserver.disconnect();
    };
  }, [isNear, isTouchRef]);

  return (
    <div className="trust-grid" id="trust-grid" aria-hidden={true}>
      <canvas ref={canvasRef} style={CANVAS_STYLE} />
    </div>
  );
}
