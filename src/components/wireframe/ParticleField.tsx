import { useEffect, useRef } from "react";

import { useIsNearViewport } from "../../utilities/useIsNearViewport";
import { useIsTouchDevice } from "../../utilities/useIsTouchDevice";

// Connected-particle background island for dark "data layer" sections.
// Ported from the static wireframe's particles.js to a hydrated React island:
// dots drift and bounce off the edges, link to nearby dots, and repel + grow + brighten near the mouse.
// Reads the brand colour token so it tracks the design system, pauses off-screen, skips mouse
// physics on touch devices, and renders a single static frame when reduced motion is requested.

const DENSITY = 11000; // larger = fewer particles (area / DENSITY * 2)
const MAX_DOTS = 170;
const SPEED = 0.08;
const INTERACT = 90; // cursor repel radius in px
const BRIGHTEN_TARGET = 235; // colour channel value to brighten toward near the cursor
const LINE_OPACITY = 0.32; // dimmed so it stays a background
const FALLBACK_COLOR = { r: 120, g: 150, b: 245 };

interface Particle {
  x: number;
  y: number;
  dx: number;
  dy: number;
  size: number;
  base: number;
  color: string;
}

function readBrandColor(): { r: number; g: number; b: number } {
  const value = getComputedStyle(document.documentElement).getPropertyValue("--color-brand-light").trim();
  const match = /^#?([0-9a-f]{6})$/i.exec(value);
  if (!match) {
    return FALLBACK_COLOR;
  }
  const hex = match[1];
  return {
    r: Number.parseInt(hex.slice(0, 2), 16),
    g: Number.parseInt(hex.slice(2, 4), 16),
    b: Number.parseInt(hex.slice(4, 6), 16)
  };
}

const CANVAS_STYLE = {
  position: "absolute",
  inset: "0",
  width: "100%",
  height: "100%",
  display: "block"
} as const;

export function ParticleField() {
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
    const color = readBrandColor();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const baseColor = `rgb(${color.r},${color.g},${color.b})`;

    let width = 0;
    let height = 0;
    let raf = 0;
    let particles: Particle[] = [];
    const mouse = { x: null as number | null, y: null as number | null, radius: 0 };

    function init() {
      particles = [];
      const count = Math.min(MAX_DOTS, Math.round((width * height) / DENSITY) * 2);
      for (let i = 0; i < count; i++) {
        const size = Math.random() * 2.4 + 0.8;
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          dx: Math.random() * 5 - 2.5,
          dy: Math.random() * 5 - 2.5,
          size,
          base: size,
          color: baseColor
        });
      }
    }

    function resize() {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      if (!width || !height) {
        return;
      }
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      mouse.radius = (height / 100) * (width / 100);
      init();
    }

    function connect() {
      const threshold = (width / 7) * (height / 7);
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const pa = particles[a];
          const pb = particles[b];
          const distanceSquared = (pa.x - pb.x) ** 2 + (pa.y - pb.y) ** 2;
          if (distanceSquared >= threshold) {
            continue;
          }
          const opacity = (1 - distanceSquared / 20000) * LINE_OPACITY;
          if (opacity <= 0) {
            continue;
          }
          ctx.strokeStyle = `rgba(${color.r},${color.g},${color.b},${opacity})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(pa.x, pa.y);
          ctx.lineTo(pb.x, pb.y);
          ctx.stroke();
        }
      }
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      connect();
      for (const particle of particles) {
        if (particle.x > width || particle.x < 0) {
          particle.dx = -particle.dx;
        }
        if (particle.y > height || particle.y < 0) {
          particle.dy = -particle.dy;
        }

        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - particle.x;
          const dy = mouse.y - particle.y;
          const distance = Math.hypot(dx, dy);
          if (distance < INTERACT) {
            const angle = Math.atan2(dy, dx);
            const force = (INTERACT - distance) / INTERACT;
            particle.x -= Math.cos(angle) * force * 3;
            particle.y -= Math.sin(angle) * force * 3;
          }
          if (distance < mouse.radius) {
            const factor = 1 - distance / mouse.radius;
            particle.size = particle.base + factor * 4;
            const r = Math.min(BRIGHTEN_TARGET, color.r + factor * (BRIGHTEN_TARGET - color.r));
            const g = Math.min(BRIGHTEN_TARGET, color.g + factor * (BRIGHTEN_TARGET - color.g));
            const b = Math.min(BRIGHTEN_TARGET, color.b + factor * (BRIGHTEN_TARGET - color.b));
            particle.color = `rgb(${r | 0},${g | 0},${b | 0})`;
          } else {
            particle.size = particle.base;
            particle.color = baseColor;
          }
        }

        particle.x += particle.dx * SPEED;
        particle.y += particle.dy * SPEED;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
      }
    }

    function loop() {
      raf = requestAnimationFrame(loop);
      if (!isNear.current || !width) {
        return;
      }
      draw();
    }

    const onMove = (event: MouseEvent) => {
      if (isTouchRef.current) {
        return;
      }
      const rect = canvas.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
    };
    const onLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    resize();
    draw(); // always paint one frame, even under reduced motion
    if (!reduceMotion) {
      raf = requestAnimationFrame(loop);
    }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseout", onLeave);
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onLeave);
      resizeObserver.disconnect();
    };
  }, [isNear, isTouchRef]);

  return (
    <div className="particle-field" aria-hidden={true}>
      <canvas ref={canvasRef} style={CANVAS_STYLE} />
    </div>
  );
}
