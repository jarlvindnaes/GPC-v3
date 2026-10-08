type Pt = { x: number; y: number };
type Curve = [Pt, Pt, Pt, Pt];
interface Strand { from: Pt; to: Pt; seed: number; amp: number; out: boolean; tool: number }
interface Chunk { strand: number; u: number; speed: number; back: boolean; size: number }

// Logical drawing space; scaled to fit the canvas.
const W = 560;
const H = 360;
const DB: Pt = { x: 100, y: 164 };
const DB_RX = 72; // bigger database
const DB_HALF = 88;
const CORE: Pt = { x: 300, y: 164 };
const GATE_W = 26;
const GATE_H = 128;
const PORTS = [-46, -23, 0, 23, 46]; // connection ports on both sides of the MCP gateway
const TOOLS: Pt[] = [{ x: 478, y: 74 }, { x: 478, y: 164 }, { x: 478, y: 254 }];

function point(c: Curve, u: number): Pt {
  const m = 1 - u, a = m * m * m, b = 3 * m * m * u, d = 3 * m * u * u, e = u * u * u;
  return { x: a * c[0].x + b * c[1].x + d * c[2].x + e * c[3].x, y: a * c[0].y + b * c[1].y + d * c[2].y + e * c[3].y };
}

function sprite(color: string, size = 32): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d")!;
  const r = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  r.addColorStop(0, color);
  r.addColorStop(0.45, color + "66");
  r.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = r;
  g.fillRect(0, 0, size, size);
  return c;
}

function halo(g: CanvasRenderingContext2D, x: number, y: number, r: number, color: string) {
  const h = g.createRadialGradient(x, y, 0, x, y, r);
  h.addColorStop(0, color);
  h.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = h;
  g.beginPath();
  g.arc(x, y, r, 0, Math.PI * 2);
  g.fill();
}

export function initMcpFlow() {
  const cleanups: (() => void)[] = [];
  document.querySelectorAll<HTMLElement>(".mcp-graphic").forEach((root) => {
    const found = root.querySelector<HTMLCanvasElement>("canvas.mcp-canvas");
    const context = found?.getContext("2d");
    if (!found || !context) return;
    const canvas = found;
    const g = context;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const sprites = { in: sprite("#8fa3ff"), out: sprite("#dfe6ff"), back: sprite("#D4EE9C") };

    // Imperfect streams: database -> MCP, then MCP -> each AI tool.
    const strands: Strand[] = [];
    for (let i = 0; i < 46; i++) {
      const k = i / 45;
      const port = PORTS[Math.min(PORTS.length - 1, Math.floor(k * PORTS.length))];
      strands.push({ from: { x: DB.x + DB_RX - 2, y: DB.y - DB_HALF + 18 + k * (DB_HALF * 2 - 36) }, to: { x: CORE.x - GATE_W / 2, y: CORE.y + port }, seed: i * 1.37, amp: 4 + (i % 7) * 2.2, out: false, tool: -1 });
    }
    TOOLS.forEach((t, ti) => {
      for (let i = 0; i < 12; i++) {
        const k = i / 11;
        strands.push({ from: { x: CORE.x + GATE_W / 2, y: CORE.y + PORTS[(i + ti) % PORTS.length] }, to: { x: t.x - 26, y: t.y - 9 + k * 18 }, seed: 60 + ti * 9 + i * 1.91, amp: 3 + (i % 4) * 2.5, out: true, tool: ti });
      }
    });
    const inIdx = strands.flatMap((s, i) => (s.out ? [] : [i]));
    const outIdx = strands.flatMap((s, i) => (s.out ? [i] : []));
    const pick = (list: number[]) => list[Math.floor(Math.random() * list.length)];
    const chunks: Chunk[] = Array.from({ length: 46 }, () => {
      const out = Math.random() < 0.5;
      return { strand: pick(out ? outIdx : inIdx), u: Math.random(), speed: 0.14 + Math.random() * 0.14, back: Math.random() < 0.15, size: 3 + Math.random() * 2.5 };
    });

    let time = 4, frame = 0, last = 0, visible = false, dbPulse = 0, corePulse = 0;
    const toolPulse = [0, 0, 0];
    let scale = 1, ox = 0, oy = 0, dpr = 1;

    function shape(s: Strand): Curve {
      const dx = s.to.x - s.from.x;
      const w1 = Math.sin(time * 0.55 + s.seed) * s.amp + Math.sin(time * 0.23 + s.seed * 2.3) * s.amp * 0.6;
      const w2 = Math.cos(time * 0.47 + s.seed * 1.7) * s.amp * 1.1;
      return [s.from, { x: s.from.x + dx * 0.36, y: s.from.y + w1 }, { x: s.to.x - dx * 0.38, y: s.to.y + w2 }, s.to];
    }

    function step(dt: number) {
      time += dt;
      for (const c of chunks) {
        const s = strands[c.strand];
        c.u += (c.back ? -1 : 1) * c.speed * dt;
        if (!c.back && c.u >= 1) {
          if (!s.out) {
            corePulse = Math.min(1, corePulse + 0.06);
            c.strand = pick(outIdx);
            c.u = 0;
          } else {
            toolPulse[s.tool] = Math.min(1, toolPulse[s.tool] + 0.18);
            if (Math.random() < 0.4) {
              c.back = true; // the AI tool answers
              c.u = 1;
            } else {
              c.strand = pick(inIdx);
              c.u = 0;
            }
          }
        } else if (c.back && c.u <= 0) {
          if (s.out) {
            corePulse = Math.min(1, corePulse + 0.04);
            c.strand = pick(inIdx);
            c.u = 1;
          } else {
            dbPulse = Math.min(1, dbPulse + 0.15);
            c.back = false;
            c.strand = pick(inIdx);
            c.u = 0;
          }
        }
      }
      const decay = Math.exp(-dt * 2.2);
      corePulse *= decay;
      dbPulse *= decay;
      for (let i = 0; i < 3; i++) toolPulse[i] *= decay;
    }

    function drawDatabase() {
      const cx = DB.x, rx = DB_RX, ry = 20, top = DB.y - DB_HALF, bot = DB.y + DB_HALF;
      g.fillStyle = "rgba(169,190,212,.05)";
      g.beginPath();
      g.ellipse(cx, bot, rx, ry, 0, 0, Math.PI * 2);
      g.fill();
      g.lineWidth = 1;
      g.strokeStyle = "rgba(145,165,190,.35)";
      g.beginPath();
      g.moveTo(cx - rx, top);
      g.lineTo(cx - rx, bot);
      g.moveTo(cx + rx, top);
      g.lineTo(cx + rx, bot);
      g.stroke();
      g.beginPath();
      g.ellipse(cx, bot, rx, ry, 0, 0, Math.PI);
      g.stroke();
      for (let i = 1; i < 8; i++) {
        g.strokeStyle = `rgba(145,165,190,${0.1 + dbPulse * 0.25})`;
        g.beginPath();
        g.ellipse(cx, top + (i * (bot - top)) / 8, rx, ry, 0, 0, Math.PI);
        g.stroke();
      }
      g.strokeStyle = "rgba(160,180,205,.45)";
      g.beginPath();
      g.ellipse(cx, top, rx, ry, 0, 0, Math.PI * 2);
      g.stroke();
      const orb = g.createRadialGradient(cx - 10, DB.y - 12, 2, cx, DB.y, 36);
      orb.addColorStop(0, "#2b3b48");
      orb.addColorStop(0.7, "#0c151c");
      orb.addColorStop(1, "#03070b");
      g.fillStyle = orb;
      g.beginPath();
      g.arc(cx, DB.y, 34, 0, Math.PI * 2);
      g.fill();
      g.lineWidth = 1.2;
      g.strokeStyle = `rgba(157,176,255,${0.5 + dbPulse * 0.4})`;
      g.stroke();
    }

    function drawTools() {
      TOOLS.forEach((p, i) => {
        const e = toolPulse[i];
        halo(g, p.x, p.y, 34, `rgba(212,238,156,${0.03 + e * 0.12})`);
        g.lineWidth = 1;
        g.strokeStyle = `rgba(160,176,200,${0.4 + e * 0.4})`;
        g.beginPath();
        g.arc(p.x, p.y, 22, 0, Math.PI * 2);
        g.stroke();
        if (e > 0.02) {
          g.strokeStyle = `rgba(212,238,156,${e * 0.6})`;
          g.beginPath();
          g.arc(p.x, p.y, 22 + e * 10, 0, Math.PI * 2);
          g.stroke();
        }
        const s = 9 + e * 2;
        g.save();
        g.translate(p.x, p.y);
        g.rotate(time * 0.4 + i);
        g.beginPath();
        for (let k = 0; k < 4; k++) {
          const a = (k * Math.PI) / 2, b = a + Math.PI / 4;
          g.lineTo(Math.cos(a) * s, Math.sin(a) * s);
          g.lineTo(Math.cos(b) * s * 0.28, Math.sin(b) * s * 0.28);
        }
        g.closePath();
        g.fillStyle = `rgba(225,232,255,${0.75 + e * 0.25})`;
        g.fill();
        g.restore();
      });
    }

    function drawCore() {
      // MCP gateway: a clean capsule with hairline edges, pinpoint ports and one status light.
      const x = CORE.x - GATE_W / 2, y = CORE.y - GATE_H / 2, radius = GATE_W / 2;
      const hair = 1 / scale; // exactly one CSS pixel
      g.save();
      g.shadowColor = "rgba(0,0,0,.55)";
      g.shadowBlur = 22 * scale * dpr;
      g.shadowOffsetY = 8 * scale * dpr;
      const body = g.createLinearGradient(0, y, 0, y + GATE_H);
      body.addColorStop(0, "#2b2f39");
      body.addColorStop(1, "#15171c");
      g.beginPath();
      g.roundRect(x, y, GATE_W, GATE_H, radius);
      g.fillStyle = body;
      g.fill();
      g.restore();
      g.lineWidth = hair;
      g.beginPath();
      g.roundRect(x + hair / 2, y + hair / 2, GATE_W - hair, GATE_H - hair, radius);
      g.strokeStyle = `rgba(255,255,255,${0.16 + corePulse * 0.18})`;
      g.stroke();
      const sheen = g.createLinearGradient(0, y, 0, y + GATE_H * 0.45);
      sheen.addColorStop(0, "rgba(255,255,255,.14)");
      sheen.addColorStop(1, "rgba(255,255,255,0)");
      g.beginPath();
      g.roundRect(x + 2, y + 2, GATE_W - 4, GATE_H - 4, radius - 2);
      g.strokeStyle = sheen;
      g.stroke();
      g.fillStyle = "rgba(236,240,255,.9)";
      for (const py of PORTS) {
        for (const px of [x, x + GATE_W]) {
          g.beginPath();
          g.arc(px, CORE.y + py, 1.5, 0, Math.PI * 2);
          g.fill();
        }
      }
      halo(g, CORE.x, CORE.y, 8 + corePulse * 5, `rgba(212,238,156,${0.22 + corePulse * 0.3})`);
      g.fillStyle = "#D4EE9C";
      g.beginPath();
      g.arc(CORE.x, CORE.y, 2.2, 0, Math.PI * 2);
      g.fill();
    }

    function draw() {
      g.setTransform(1, 0, 0, 1, 0, 0);
      g.clearRect(0, 0, canvas.width, canvas.height);
      g.setTransform(dpr * scale, 0, 0, dpr * scale, dpr * ox, dpr * oy);
      const curves = strands.map(shape);
      halo(g, CORE.x, CORE.y, 90, `rgba(120,140,230,${0.05 + corePulse * 0.08})`);
      halo(g, DB.x, DB.y, 110, "rgba(140,160,210,.05)");
      g.globalCompositeOperation = "lighter";
      curves.forEach((c, i) => {
        g.beginPath();
        g.moveTo(c[0].x, c[0].y);
        g.bezierCurveTo(c[1].x, c[1].y, c[2].x, c[2].y, c[3].x, c[3].y);
        g.lineWidth = 0.45;
        g.strokeStyle = strands[i].out ? "rgba(200,210,255,.16)" : "rgba(150,168,245,.17)";
        g.stroke();
      });
      g.globalCompositeOperation = "source-over";
      drawDatabase();
      drawTools();
      drawCore();
      g.globalCompositeOperation = "lighter";
      for (const c of chunks) {
        const curve = curves[c.strand];
        const spr = c.back ? sprites.back : strands[c.strand].out ? sprites.out : sprites.in;
        const p = point(curve, c.u);
        g.globalAlpha = 0.75;
        g.drawImage(spr, p.x - c.size / 2, p.y - c.size / 2, c.size, c.size);
      }
      g.globalAlpha = 1;
      g.globalCompositeOperation = "source-over";
    }

    function resize() {
      const r = canvas.getBoundingClientRect();
      if (!r.width || !r.height) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(r.width * dpr);
      canvas.height = Math.round(r.height * dpr);
      scale = Math.min(r.width / W, r.height / H);
      ox = (r.width - W * scale) / 2;
      oy = (r.height - H * scale) / 2;
      draw();
    }

    function loop(now: number) {
      frame = requestAnimationFrame(loop);
      if (now - last < 30) return; // ~33 fps cap
      if (document.documentElement.dataset.overlayOpen) return; // hold still under the full-screen passport
      const dt = last ? Math.min((now - last) / 1000, 0.06) : 0;
      last = now;
      step(dt);
      draw();
    }
    function start() {
      if (frame || !visible || document.hidden || reduced.matches) return;
      last = 0;
      frame = requestAnimationFrame(loop);
    }
    function stop() {
      cancelAnimationFrame(frame);
      frame = 0;
    }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(root);
    const onVisibility = () => (document.hidden ? stop() : start());
    const onMotion = () => (reduced.matches ? (stop(), draw()) : start());
    document.addEventListener("visibilitychange", onVisibility);
    reduced.addEventListener("change", onMotion);
    resize();
    cleanups.push(() => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      reduced.removeEventListener("change", onMotion);
    });
  });
  return () => cleanups.forEach((c) => c());
}
