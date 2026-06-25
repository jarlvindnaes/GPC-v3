import { useEffect, useRef } from "react";

import { useIsNearViewport } from "../../utilities/useIsNearViewport";
import { useIsTouchDevice } from "../../utilities/useIsTouchDevice";

// Animated SKU network island for the Enterprise hero.
// Vanilla-canvas port of the static wireframe's network.js to a hydrated React island:
// nodes drift, connect to nearby nodes, and repel + brighten near the mouse.
// Restyled to match the static constellation: indigo hubs (with a soft halo), slate dots,
// a few emerald, indigo links. Pauses off-screen and skips mouse physics on touch devices.

const INDIGO = "#3e63dd";
const SLATE = "#93a0c4";
const EMERALD = "#00b27e";
const LABEL = "#5d6373";
const HUB_LABELS = ["SKU 0215", "SKU 4471", "shared part", "SKU 1180", "shared part", "SKU 7740", "SKU 0884"];
const CONNECT = 200;
const CONNECT2 = CONNECT * CONNECT;
const HUB_COUNT = 7;
const VERIFIED_COUNT = 4;
const NODE_COUNT = 25;
const PUSH_RADIUS = 110;
const GROW_RADIUS = 280;
const LERP = 0.08;

interface NetworkNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  depth: number;
  phase: number;
  brighten: number;
  kind: "hub" | "verified" | "node";
  label: string;
  labelHalf: number;
}

const CANVAS_STYLE = {
  position: "absolute",
  inset: "0",
  width: "100%",
  height: "100%",
  display: "block"
} as const;

export function SkuNetwork({ caption = "Thousands of SKUs · one connected graph" }: { caption?: string }) {
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
    let raf = 0;
    let time = 0;
    let nodes: NetworkNode[] = [];
    const mouse = { x: 0, y: 0, active: false };

    function initNodes() {
      if (!width || !height) {
        return;
      }
      nodes = [];
      // fixed composition: 7 indigo hubs (with halo + caption), 4 emerald, 25 slate dots
      const kinds: NetworkNode["kind"][] = [];
      for (let i = 0; i < HUB_COUNT; i++) {
        kinds.push("hub");
      }
      for (let i = 0; i < VERIFIED_COUNT; i++) {
        kinds.push("verified");
      }
      for (let i = 0; i < NODE_COUNT; i++) {
        kinds.push("node");
      }
      let hub = 0;
      for (const kind of kinds) {
        const depth = 0.35 + Math.random() * 0.65;
        let base = 1.8 + Math.random() * 2.4;
        if (kind === "hub") {
          base = 5.5 + Math.random() * 2;
        } else if (kind === "verified") {
          base = 3.5 + Math.random() * 1.5;
        }
        const label = kind === "hub" ? HUB_LABELS[hub++ % HUB_LABELS.length] : "";
        const radius = base * (0.7 + depth * 0.3);
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.3 * depth,
          vy: (Math.random() - 0.5) * 0.2 * depth,
          radius,
          baseRadius: radius,
          depth,
          phase: Math.random() * Math.PI * 2,
          brighten: 0,
          kind,
          label,
          labelHalf: label ? label.length * 3.4 : 0 // approx half text width at 11px
        });
      }
    }

    function resize() {
      const newWidth = canvas.clientWidth;
      const newHeight = canvas.clientHeight;
      if (!newWidth || !newHeight) {
        return;
      }
      canvas.width = newWidth * dpr;
      canvas.height = newHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (nodes.length && width && height) {
        // rescale existing nodes to the new box so they keep filling it
        const sx = newWidth / width;
        const sy = newHeight / height;
        for (const node of nodes) {
          node.x *= sx;
          node.y *= sy;
        }
      }
      width = newWidth;
      height = newHeight;
      if (!nodes.length) {
        initNodes();
      }
    }

    function draw() {
      time += 0.008;
      ctx.clearRect(0, 0, width, height);

      for (const node of nodes) {
        node.x += node.vx + Math.sin(time * 0.5 + node.phase) * 0.15 * node.depth;
        node.y += node.vy + Math.cos(time * 0.4 + node.phase + 1) * 0.1 * node.depth;
        let targetBright = 0;
        let targetRadius = node.baseRadius;
        if (mouse.active) {
          const dx = mouse.x - node.x;
          const dy = mouse.y - node.y;
          const distance = Math.hypot(dx, dy);
          if (distance < PUSH_RADIUS && distance > 0.1) {
            const push = (1 - distance / PUSH_RADIUS) * 0.5 * node.depth;
            node.x -= (dx / distance) * push;
            node.y -= (dy / distance) * push;
          }
          if (distance < GROW_RADIUS) {
            const prox = 1 - distance / GROW_RADIUS;
            targetRadius = node.baseRadius + prox * 4 * node.depth;
            targetBright = prox;
          }
        }
        node.radius += (targetRadius - node.radius) * LERP;
        node.brighten += (targetBright - node.brighten) * LERP;
        // Clamp the FULL footprint inside the canvas (dot + hub halo + caption below) so nothing clips at the edges.
        const halo = node.kind === "hub" ? node.radius * 2.6 : node.radius;
        const marginX = Math.max(halo, node.labelHalf);
        const marginBottom = Math.max(halo, node.label ? node.radius + 24 : 0);
        if (node.x < marginX) {
          node.x = marginX;
          node.vx = Math.abs(node.vx);
        } else if (node.x > width - marginX) {
          node.x = width - marginX;
          node.vx = -Math.abs(node.vx);
        }
        if (node.y < halo) {
          node.y = halo;
          node.vy = Math.abs(node.vy);
        } else if (node.y > height - marginBottom) {
          node.y = height - marginBottom;
          node.vy = -Math.abs(node.vy);
        }
      }

      // proximity links
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < CONNECT2) {
            const ratio = d2 / CONNECT2;
            const boost = Math.min(a.brighten, b.brighten) * 0.4;
            ctx.strokeStyle = INDIGO;
            ctx.globalAlpha = Math.min(1, (1 - ratio) * (0.32 + boost) * Math.min(a.depth, b.depth));
            ctx.lineWidth = (1 - ratio) * (1 + boost * 2);
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;

      // nodes
      for (const node of nodes) {
        if (node.kind === "hub") {
          ctx.fillStyle = INDIGO;
          ctx.globalAlpha = 0.08 + node.brighten * 0.06;
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius * 2.6, 0, Math.PI * 2);
          ctx.fill();
        }
        let color = SLATE;
        if (node.kind === "hub") {
          color = INDIGO;
        } else if (node.kind === "verified") {
          color = EMERALD;
        }
        const baseAlpha = (node.kind === "node" ? 0.5 : 0.85) + node.depth * 0.15;
        ctx.fillStyle = color;
        ctx.globalAlpha = Math.min(1, baseAlpha + node.brighten * 0.3);
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();
        if (node.label) {
          ctx.fillStyle = LABEL;
          ctx.globalAlpha = 0.6;
          ctx.font = "11px system-ui, -apple-system, sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(node.label, node.x, node.y + node.radius + 14);
        }
      }
      ctx.globalAlpha = 1;
    }

    function loop() {
      raf = requestAnimationFrame(loop);
      if (!isNear.current || !width) {
        return;
      }
      draw();
    }

    // react to the mouse anywhere over the hero
    const hero = canvas.closest(".hero") ?? canvas;
    const onMove = (event: Event) => {
      if (isTouchRef.current) {
        return;
      }
      const mouseEvent = event as MouseEvent;
      const rect = canvas.getBoundingClientRect();
      mouse.x = mouseEvent.clientX - rect.left;
      mouse.y = mouseEvent.clientY - rect.top;
      mouse.active = true;
    };
    const onLeave = () => {
      mouse.active = false;
    };

    resize();
    draw();
    raf = requestAnimationFrame(loop);

    hero.addEventListener("mousemove", onMove);
    hero.addEventListener("mouseleave", onLeave);
    hero.addEventListener("mouseout", onLeave);
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      hero.removeEventListener("mousemove", onMove);
      hero.removeEventListener("mouseleave", onLeave);
      hero.removeEventListener("mouseout", onLeave);
      resizeObserver.disconnect();
    };
  }, [isNear, isTouchRef]);

  return (
    <div className="constellation" id="sku-network" aria-hidden={true}>
      <span className="constellation__cap">{caption}</span>
      <canvas ref={canvasRef} style={CANVAS_STYLE} />
    </div>
  );
}
