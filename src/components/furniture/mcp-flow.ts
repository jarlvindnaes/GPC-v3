import { reducedMotion } from "../../utilities/motion";
type Pt = { x: number; y: number };
type Curve = [Pt, Pt, Pt, Pt];
interface Strand { from: Pt; to: Pt; seed: number; amp: number; out: boolean; tool: number; port: number }
interface Chunk { strand: number; u: number; speed: number; back: boolean; size: number }
interface Tool { name: string; x: number; y: number }
interface Exchange { tool: number; ask: string; call: string; answer: string }

// Logical drawing space; scaled to fit the canvas (the graphic keeps this aspect ratio, so labels placed in % line up).
// The top band is left free for the exchange card.
const W = 640;
const H = 420;
const DB: Pt = { x: 105, y: 268 };
const DB_RX = 70;
const DB_HALF = 88;
const CORE: Pt = { x: 310, y: 268 };
const GATE_W = 28;
const GATE_H = 128;
const PORTS = [-46, -23, 0, 23, 46]; // connection ports on both sides of the MCP gateway
const TILE = 19; // half the size of an AI tool tile

// One exchange: the tool asks, the request travels tool -> MCP -> database, the orb looks it up, the answer returns.
const T_ASK = 0.9, T_REQ = 1.5, T_LOOK = 0.55, T_RES = 1.5, T_SHOW = 2.8, T_OUT = 0.45;
const T_TOTAL = T_ASK + T_REQ + T_LOOK + T_RES + T_SHOW + T_OUT;

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

const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

export function initMcpFlow() {
  const cleanups: (() => void)[] = [];
  document.querySelectorAll<HTMLElement>(".mcp-graphic").forEach((root) => {
    const found = root.querySelector<HTMLCanvasElement>("canvas.mcp-canvas");
    const context = found?.getContext("2d");
    if (!found || !context) return;
    const canvas = found;
    const g = context;
    const reduced = reducedMotion; // reduced motion, or the footer's Pause animations
    const sprites = { in: sprite("#8fa3ff"), out: sprite("#dfe6ff"), back: sprite("#D4EE9C"), req: sprite("#c3cdff", 48), res: sprite("#D4EE9C", 48) };
    const tools: Tool[] = JSON.parse(root.dataset.tools || "[]");
    const exchanges: Exchange[] = JSON.parse(root.dataset.exchanges || "[]");
    const card = root.querySelector<HTMLElement>(".mcp-card");
    const field = (name: string) => root.querySelector<HTMLElement>(`[data-mcp="${name}"]`);
    const toolLabels = Array.from(root.querySelectorAll<HTMLElement>("[data-mcp-tool]"));

    // Imperfect streams: database -> MCP, then MCP -> each AI tool.
    const strands: Strand[] = [];
    for (let i = 0; i < 46; i++) {
      const k = i / 45;
      const port = Math.min(PORTS.length - 1, Math.floor(k * PORTS.length));
      strands.push({ from: { x: DB.x + DB_RX - 2, y: DB.y - DB_HALF + 18 + k * (DB_HALF * 2 - 36) }, to: { x: CORE.x - GATE_W / 2, y: CORE.y + PORTS[port] }, seed: i * 1.37, amp: 4 + (i % 7) * 2.2, out: false, tool: -1, port });
    }
    tools.forEach((t, ti) => {
      for (let i = 0; i < 12; i++) {
        const k = i / 11;
        const port = (i + ti) % PORTS.length;
        strands.push({ from: { x: CORE.x + GATE_W / 2, y: CORE.y + PORTS[port] }, to: { x: t.x - TILE - 4, y: t.y - 9 + k * 18 }, seed: 60 + ti * 9 + i * 1.91, amp: 3 + (i % 4) * 2.5, out: true, tool: ti, port });
      }
    });
    const inIdx = strands.flatMap((s, i) => (s.out ? [] : [i]));
    const outIdx = strands.flatMap((s, i) => (s.out ? [i] : []));
    const pick = (list: number[]) => list[Math.floor(Math.random() * list.length)];
    const chunks: Chunk[] = Array.from({ length: 34 }, () => {
      const out = Math.random() < 0.5;
      return { strand: pick(out ? outIdx : inIdx), u: Math.random(), speed: 0.12 + Math.random() * 0.12, back: Math.random() < 0.15, size: 2.5 + Math.random() * 2 };
    });

    // The highlighted route for the current exchange: one tool strand and the database strand on the same port.
    let route = { out: 0, in: 0 };
    function chooseRoute(tool: number) {
      const outs = outIdx.filter((i) => strands[i].tool === tool && Math.abs(strands[i].to.y - tools[tool].y) < 4);
      const o = outs[Math.floor(outs.length / 2)] ?? pick(outIdx);
      const ins = inIdx.filter((i) => strands[i].port === strands[o].port);
      route = { out: o, in: ins[Math.floor(ins.length / 2)] ?? pick(inIdx) };
    }

    let time = 4, frame = 0, last = 0, visible = false, dbPulse = 0, corePulse = 0, orbFlare = 0;
    let clock = 0, current = -1, phase = "";
    const toolPulse = tools.map(() => 0);
    let scale = 1, ox = 0, oy = 0, dpr = 1;

    function shape(s: Strand): Curve {
      const dx = s.to.x - s.from.x;
      const w1 = Math.sin(time * 0.55 + s.seed) * s.amp + Math.sin(time * 0.23 + s.seed * 2.3) * s.amp * 0.6;
      const w2 = Math.cos(time * 0.47 + s.seed * 1.7) * s.amp * 1.1;
      return [s.from, { x: s.from.x + dx * 0.36, y: s.from.y + w1 }, { x: s.to.x - dx * 0.38, y: s.to.y + w2 }, s.to];
    }

    function setPhase(next: string) {
      if (next === phase || !card) return;
      phase = next;
      card.classList.toggle("is-call", next === "call" || next === "look" || next === "res");
      card.classList.toggle("is-answer", next === "show");
      card.classList.toggle("is-out", next === "out");
    }

    function startExchange(index: number) {
      current = index;
      const ex = exchanges[index];
      if (!ex) return;
      chooseRoute(ex.tool);
      const tool = field("tool"), ask = field("ask"), call = field("call"), answer = field("answer");
      if (tool) tool.textContent = tools[ex.tool]?.name ?? "";
      if (ask) ask.textContent = ex.ask;
      if (call) call.textContent = ex.call;
      if (answer) answer.textContent = ex.answer;
      toolLabels.forEach((l, i) => l.classList.toggle("is-active", i === ex.tool));
      phase = "";
      setPhase("ask");
    }

    // Where the current exchange is: request/response progress along the route (0..2), or -1 when nothing travels.
    function travel() {
      const t = clock;
      const a = T_ASK, b = a + T_REQ, c = b + T_LOOK, d = c + T_RES;
      if (t >= a && t < b) return { v: ease((t - a) / T_REQ) * 2, res: false };
      if (t >= c && t < d) return { v: ease((t - c) / T_RES) * 2, res: true };
      return null;
    }

    function stepExchange(dt: number) {
      if (!exchanges.length) return;
      if (current < 0) startExchange(0);
      clock += dt;
      if (clock >= T_TOTAL) {
        clock -= T_TOTAL;
        startExchange((current + 1) % exchanges.length);
      }
      const a = T_ASK, b = a + T_REQ, c = b + T_LOOK, d = c + T_RES, e = d + T_SHOW;
      const tool = exchanges[current].tool;
      const prev = phase;
      setPhase(clock < a ? "ask" : clock < b ? "call" : clock < c ? "look" : clock < d ? "res" : clock < e ? "show" : "out");
      if (phase === "ask") toolPulse[tool] = Math.max(toolPulse[tool], 0.6);
      if (phase === "look" && prev !== "look") { dbPulse = 1; orbFlare = 1; corePulse = 1; }
      if (phase === "show" && prev !== "show") { toolPulse[tool] = 1; corePulse = Math.max(corePulse, 0.6); }
      if ((phase === "call" || phase === "res")) corePulse = Math.max(corePulse, 0.35);
    }

    function step(dt: number) {
      time += dt;
      stepExchange(dt);
      for (const c of chunks) {
        const s = strands[c.strand];
        c.u += (c.back ? -1 : 1) * c.speed * dt;
        if (!c.back && c.u >= 1) {
          if (!s.out) {
            corePulse = Math.min(1, corePulse + 0.03);
            c.strand = pick(outIdx);
            c.u = 0;
          } else if (Math.random() < 0.4) {
            c.back = true; // the AI tool answers
            c.u = 1;
          } else {
            c.strand = pick(inIdx);
            c.u = 0;
          }
        } else if (c.back && c.u <= 0) {
          if (s.out) {
            c.strand = pick(inIdx);
            c.u = 1;
          } else {
            dbPulse = Math.min(1, dbPulse + 0.08);
            c.back = false;
            c.strand = pick(inIdx);
            c.u = 0;
          }
        }
      }
      const decay = Math.exp(-dt * 2.2);
      corePulse *= decay;
      dbPulse *= decay;
      orbFlare *= Math.exp(-dt * 1.4);
      for (let i = 0; i < toolPulse.length; i++) toolPulse[i] *= Math.exp(-dt * (phase === "show" && exchanges[current]?.tool === i ? 0.4 : 1.6));
    }

    function drawDatabase() {
      const cx = DB.x, rx = DB_RX, ry = 20, top = DB.y - DB_HALF, bot = DB.y + DB_HALF;
      const glass = g.createLinearGradient(cx - rx, 0, cx + rx, 0);
      glass.addColorStop(0, "rgba(120,140,190,.10)");
      glass.addColorStop(0.5, "rgba(120,140,190,.02)");
      glass.addColorStop(1, "rgba(120,140,190,.08)");
      g.fillStyle = glass;
      g.fillRect(cx - rx, top, rx * 2, bot - top);
      g.fillStyle = "rgba(169,190,212,.06)";
      g.beginPath();
      g.ellipse(cx, bot, rx, ry, 0, 0, Math.PI * 2);
      g.fill();
      g.lineWidth = 1;
      g.strokeStyle = "rgba(160,180,210,.42)";
      g.beginPath();
      g.moveTo(cx - rx, top);
      g.lineTo(cx - rx, bot);
      g.moveTo(cx + rx, top);
      g.lineTo(cx + rx, bot);
      g.stroke();
      g.beginPath();
      g.ellipse(cx, bot, rx, ry, 0, 0, Math.PI);
      g.stroke();
      // record layers; a scan line sweeps them while the orb looks up an answer
      const scan = orbFlare > 0.02 ? top + ((1 - orbFlare) * 1.6 % 1) * (bot - top) : -999;
      for (let i = 1; i < 8; i++) {
        const y = top + (i * (bot - top)) / 8;
        const near = Math.max(0, 1 - Math.abs(y - scan) / 24);
        g.strokeStyle = near > 0 ? `rgba(212,238,156,${0.15 + near * 0.55})` : `rgba(145,165,190,${0.12 + dbPulse * 0.25})`;
        g.beginPath();
        g.ellipse(cx, y, rx, ry, 0, 0, Math.PI);
        g.stroke();
      }
      g.strokeStyle = "rgba(170,190,215,.55)";
      g.beginPath();
      g.ellipse(cx, top, rx, ry, 0, 0, Math.PI * 2);
      g.stroke();
      drawOrb(cx, DB.y);
    }

    function drawOrb(cx: number, cy: number) {
      const R = 34;
      halo(g, cx, cy, R * 2.2, `rgba(143,163,255,${0.1 + orbFlare * 0.25})`);
      if (orbFlare > 0.02) halo(g, cx, cy, R * 1.6, `rgba(212,238,156,${orbFlare * 0.28})`);
      const orb = g.createRadialGradient(cx - 11, cy - 13, 2, cx, cy, R);
      orb.addColorStop(0, "#3a4d66");
      orb.addColorStop(0.55, "#121c2a");
      orb.addColorStop(1, "#03070b");
      g.fillStyle = orb;
      g.beginPath();
      g.arc(cx, cy, R, 0, Math.PI * 2);
      g.fill();
      // data orbiting the product model: two tilted rings of points, front half drawn over the orb
      for (const [tilt, speed, count, color] of [[-0.45, 0.5, 14, "199,208,255"], [0.6, -0.36, 10, "212,238,156"]] as const) {
        for (let k = 0; k < count; k++) {
          const a = time * speed + (k / count) * Math.PI * 2;
          const x = Math.cos(a) * R * 1.32, y = Math.sin(a) * R * 0.36;
          const px = cx + x * Math.cos(tilt) - y * Math.sin(tilt), py = cy + x * Math.sin(tilt) + y * Math.cos(tilt);
          const front = Math.sin(a) > 0;
          g.fillStyle = `rgba(${color},${front ? 0.85 : 0.25})`;
          g.beginPath();
          g.arc(px, py, front ? 1.5 : 1, 0, Math.PI * 2);
          g.fill();
        }
      }
      g.lineWidth = 1.2;
      g.strokeStyle = `rgba(157,176,255,${0.55 + dbPulse * 0.4})`;
      g.beginPath();
      g.arc(cx, cy, R, 0, Math.PI * 2);
      g.stroke();
      const spec = g.createRadialGradient(cx - 12, cy - 14, 0, cx - 12, cy - 14, 14);
      spec.addColorStop(0, "rgba(255,255,255,.22)");
      spec.addColorStop(1, "rgba(255,255,255,0)");
      g.fillStyle = spec;
      g.beginPath();
      g.arc(cx, cy, R, 0, Math.PI * 2);
      g.fill();
    }

    function drawTools() {
      const active = exchanges[current]?.tool ?? -1;
      tools.forEach((p, i) => {
        const e = toolPulse[i];
        const on = i === active;
        halo(g, p.x, p.y, 44, `rgba(212,238,156,${0.02 + e * 0.16})`);
        // app tile with a soft body and a hairline edge
        g.save();
        g.shadowColor = "rgba(0,0,0,.5)";
        g.shadowBlur = 16 * scale * dpr;
        g.shadowOffsetY = 6 * scale * dpr;
        const body = g.createLinearGradient(0, p.y - TILE, 0, p.y + TILE);
        body.addColorStop(0, on ? "#2e333f" : "#262a33");
        body.addColorStop(1, "#16181d");
        g.fillStyle = body;
        g.beginPath();
        g.roundRect(p.x - TILE, p.y - TILE, TILE * 2, TILE * 2, 10);
        g.fill();
        g.restore();
        g.lineWidth = 1 / scale;
        g.strokeStyle = `rgba(${on ? "212,238,156" : "200,210,235"},${0.18 + e * 0.6})`;
        g.beginPath();
        g.roundRect(p.x - TILE, p.y - TILE, TILE * 2, TILE * 2, 10);
        g.stroke();
        if (e > 0.05) {
          g.strokeStyle = `rgba(212,238,156,${e * 0.35})`;
          g.beginPath();
          g.roundRect(p.x - TILE - e * 7, p.y - TILE - e * 7, (TILE + e * 7) * 2, (TILE + e * 7) * 2, 10 + e * 7);
          g.stroke();
        }
        // a four-point spark: the AI tool's mark
        const s = 8 + e * 2;
        g.save();
        g.translate(p.x, p.y);
        g.rotate(time * 0.35 + i);
        g.beginPath();
        for (let k = 0; k < 4; k++) {
          const a = (k * Math.PI) / 2, b = a + Math.PI / 4;
          g.lineTo(Math.cos(a) * s, Math.sin(a) * s);
          g.lineTo(Math.cos(b) * s * 0.28, Math.sin(b) * s * 0.28);
        }
        g.closePath();
        g.fillStyle = on ? `rgba(232,246,205,${0.8 + e * 0.2})` : "rgba(205,214,238,.6)";
        g.fill();
        g.restore();
      });
    }

    function drawCore() {
      // MCP gateway: a clean capsule with hairline edges, pinpoint ports and one status light.
      const x = CORE.x - GATE_W / 2, y = CORE.y - GATE_H / 2, radius = GATE_W / 2;
      const hair = 1 / scale; // exactly one CSS pixel
      halo(g, CORE.x, CORE.y, 70 + corePulse * 20, `rgba(120,140,230,${0.06 + corePulse * 0.12})`);
      g.save();
      g.shadowColor = "rgba(0,0,0,.55)";
      g.shadowBlur = 22 * scale * dpr;
      g.shadowOffsetY = 8 * scale * dpr;
      const body = g.createLinearGradient(0, y, 0, y + GATE_H);
      body.addColorStop(0, "#2f3440");
      body.addColorStop(1, "#15171c");
      g.beginPath();
      g.roundRect(x, y, GATE_W, GATE_H, radius);
      g.fillStyle = body;
      g.fill();
      g.restore();
      g.lineWidth = hair;
      g.beginPath();
      g.roundRect(x + hair / 2, y + hair / 2, GATE_W - hair, GATE_H - hair, radius);
      g.strokeStyle = `rgba(255,255,255,${0.18 + corePulse * 0.3})`;
      g.stroke();
      const sheen = g.createLinearGradient(0, y, 0, y + GATE_H * 0.45);
      sheen.addColorStop(0, "rgba(255,255,255,.16)");
      sheen.addColorStop(1, "rgba(255,255,255,0)");
      g.beginPath();
      g.roundRect(x + 2, y + 2, GATE_W - 4, GATE_H - 4, radius - 2);
      g.strokeStyle = sheen;
      g.stroke();
      const routePort = PORTS[strands[route.out]?.port ?? 2];
      for (const py of PORTS) {
        const lit = travel() && py === routePort;
        g.fillStyle = lit ? "#D4EE9C" : "rgba(236,240,255,.9)";
        for (const px of [x, x + GATE_W]) {
          g.beginPath();
          g.arc(px, CORE.y + py, lit ? 2.2 : 1.5, 0, Math.PI * 2);
          g.fill();
        }
      }
      halo(g, CORE.x, CORE.y, 9 + corePulse * 7, `rgba(212,238,156,${0.25 + corePulse * 0.4})`);
      g.fillStyle = "#D4EE9C";
      g.beginPath();
      g.arc(CORE.x, CORE.y, 2.4, 0, Math.PI * 2);
      g.fill();
    }

    // The exchange's request (tool -> database) or response (database -> tool) as a comet along the route.
    function routePoint(curves: Curve[], v: number): Pt {
      // v 0..2 runs tool -> MCP -> database
      return v < 1 ? point(curves[route.out], 1 - v) : point(curves[route.in], 1 - (v - 1));
    }
    function drawRoute(curves: Curve[]) {
      const tr = travel();
      const glow = tr ? 1 : phase === "look" ? 0.7 : phase === "show" ? Math.max(0, 1 - (clock - (T_ASK + T_REQ + T_LOOK + T_RES)) / 1.2) : 0;
      if (glow > 0.01) {
        g.globalCompositeOperation = "lighter";
        for (const idx of [route.out, route.in]) {
          const c = curves[idx];
          g.beginPath();
          g.moveTo(c[0].x, c[0].y);
          g.bezierCurveTo(c[1].x, c[1].y, c[2].x, c[2].y, c[3].x, c[3].y);
          g.lineWidth = 1.5;
          g.strokeStyle = `rgba(${tr?.res || phase === "show" ? "212,238,156" : "180,195,255"},${0.55 * glow})`;
          g.stroke();
        }
        g.globalCompositeOperation = "source-over";
      }
      if (!tr) return;
      const head = tr.res ? 2 - tr.v : tr.v;
      const dir = tr.res ? -1 : 1;
      const spr = tr.res ? sprites.res : sprites.req;
      g.globalCompositeOperation = "lighter";
      for (let k = 14; k >= 0; k--) {
        const v = head - dir * k * 0.022;
        if (v < 0 || v > 2) continue;
        const p = routePoint(curves, v);
        const size = (k === 0 ? 16 : 9) * (1 - k / 16);
        g.globalAlpha = k === 0 ? 1 : 0.55 * (1 - k / 15);
        g.drawImage(spr, p.x - size / 2, p.y - size / 2, size, size);
      }
      g.globalAlpha = 1;
      g.globalCompositeOperation = "source-over";
    }

    function draw() {
      g.setTransform(1, 0, 0, 1, 0, 0);
      g.clearRect(0, 0, canvas.width, canvas.height);
      g.setTransform(dpr * scale, 0, 0, dpr * scale, dpr * ox, dpr * oy);
      const curves = strands.map(shape);
      halo(g, DB.x, DB.y, 120, "rgba(140,160,210,.05)");
      g.globalCompositeOperation = "lighter";
      curves.forEach((c, i) => {
        g.beginPath();
        g.moveTo(c[0].x, c[0].y);
        g.bezierCurveTo(c[1].x, c[1].y, c[2].x, c[2].y, c[3].x, c[3].y);
        g.lineWidth = 0.45;
        g.strokeStyle = strands[i].out ? "rgba(200,210,255,.15)" : "rgba(150,168,245,.16)";
        g.stroke();
      });
      g.globalCompositeOperation = "source-over";
      drawRoute(curves);
      drawDatabase();
      drawTools();
      drawCore();
      g.globalCompositeOperation = "lighter";
      for (const c of chunks) {
        const curve = curves[c.strand];
        const spr = c.back ? sprites.back : strands[c.strand].out ? sprites.out : sprites.in;
        const p = point(curve, c.u);
        g.globalAlpha = 0.6;
        g.drawImage(spr, p.x - c.size / 2, p.y - c.size / 2, c.size, c.size);
      }
      g.globalAlpha = 1;
      g.globalCompositeOperation = "source-over";
    }

    // Reduced motion: one still frame with the first exchange answered.
    function still() {
      if (current < 0) startExchange(0);
      clock = T_ASK + T_REQ + T_LOOK + T_RES + 0.4;
      setPhase("show");
      toolPulse[exchanges[current]?.tool ?? 0] = 0.8;
      draw();
    }

    function resize() {
      const r = canvas.getBoundingClientRect();
      if (!r.width || !r.height) return;
      dpr = Math.min(window.devicePixelRatio || 1, r.width < 700 ? 1.5 : 2); // phones: fewer pixels per frame
      canvas.width = Math.round(r.width * dpr);
      canvas.height = Math.round(r.height * dpr);
      scale = Math.min(r.width / W, r.height / H);
      ox = (r.width - W * scale) / 2;
      oy = (r.height - H * scale) / 2;
      if (reduced.matches) still();
      else draw();
    }

    function loop(now: number) {
      frame = requestAnimationFrame(loop);
      if (document.documentElement.dataset.overlayOpen) return; // hold still under the full-screen passport
      if (now - last < 30) return; // ~33 fps cap
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
    const onMotion = () => (reduced.matches ? (stop(), still()) : start());
    document.addEventListener("visibilitychange", onVisibility);
    reduced.addEventListener("change", onMotion);
    if (exchanges.length) startExchange(0);
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
