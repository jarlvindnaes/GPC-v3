// The model story's last two visuals (data-scenes.ts draws them, visible-only and frame-rate limited), in the Input
// interface lens's language: hairline streams, travelling points, the dark orb with its spectral rim, small labels.
//  supply · materials, components and suppliers mapped into the finished product; one path at a time is traced
//  impact · product data flows into the model, which keeps its impact breakdown current (illustrative figures)

const LINE = "rgba(151,180,213,0.24)";
const POINT = "#c5ddf2";
const TRACE = "#d4ee9c";
const LABEL = "#949daa";
const KEY = "#d9e2ef";
const TAG = "#a4b6ca80";
// the sphere's atmosphere, warm to cool
const SPECTRAL = ["#c77a55", "#c4b763", "#b3cbb8", "#739dbf", "#7269b6"];

const ease = (q: number) => (q < 0.5 ? 2 * q * q : 1 - (-2 * q + 2) ** 2 / 2);
const clamp = (v: number) => Math.min(1, Math.max(0, v));

function dot(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string | CanvasGradient) {
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

/** The product model's orb, as the lens scene draws it. */
function orb(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, pulse = 0) {
  const glow = ctx.createRadialGradient(x, y, r * 0.8, x, y, r * (2.1 + pulse * 0.5));
  glow.addColorStop(0, `rgba(174,201,219,${0.27 + pulse * 0.2})`);
  glow.addColorStop(1, "#9ec5ec00");
  dot(ctx, x, y, r * (2.1 + pulse * 0.5), glow);
  const body = ctx.createRadialGradient(x - r * 0.35, y - r * 0.4, 0, x, y, r);
  body.addColorStop(0, "#243442");
  body.addColorStop(0.6, "#0b121b");
  body.addColorStop(1, "#030609");
  dot(ctx, x, y, r, body);
  const rim = ctx.createLinearGradient(x - r, y, x + r, y);
  rim.addColorStop(0, "#c59865");
  rim.addColorStop(0.45, "#bfccb2");
  rim.addColorStop(0.75, "#8cb8cf");
  rim.addColorStop(1, "#8981ba");
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.strokeStyle = rim;
  ctx.lineWidth = 1;
  ctx.stroke();
}

function text(ctx: CanvasRenderingContext2D, s: string, x: number, y: number, color: string, font: string, align: CanvasTextAlign = "center") {
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.fillText(s, x, y);
}

// an S-curve from (x1, y1) to (x2, y2), and a point along it
type Edge = [number, number, number, number];
const along = ([x1, y1, x2, y2]: Edge, q: number) => {
  const u = 1 - q, mx = (x1 + x2) / 2;
  return {
    x: u * u * u * x1 + 3 * u * u * q * mx + 3 * u * q * q * mx + q * q * q * x2,
    y: u * u * u * y1 + 3 * u * u * q * y1 + 3 * u * q * q * y2 + q * q * q * y2
  };
};
function curve(ctx: CanvasRenderingContext2D, [x1, y1, x2, y2]: Edge) {
  const mx = (x1 + x2) / 2;
  ctx.moveTo(x1, y1);
  ctx.bezierCurveTo(mx, y1, mx, y2, x2, y2);
}

// supply chain: each node's parent in the next tier (materials → components → suppliers → the product)
const MATERIALS = ["OAK", "STEEL", "PET", "FOAM", "WOOL", "ALU"];
const TO_COMPONENT = [0, 0, 1, 2, 2, 3];
const TO_SUPPLIER = [0, 1, 1, 2];
const TRACE_S = 4.2; // (seconds each traced path holds)

export function drawSupply(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  const top = h * 0.1, bottom = h * 0.74, cy = (top + bottom) / 2;
  const col = [w * 0.1, w * 0.37, w * 0.62], px = w * 0.87;
  const spread = (n: number, i: number, k: number) => cy + ((i - (n - 1) / 2) * (bottom - top) * k) / Math.max(1, n - 1);
  const nodes = [
    MATERIALS.map((_, i) => ({ x: col[0], y: spread(6, i, 1) })),
    TO_SUPPLIER.map((_, i) => ({ x: col[1], y: spread(4, i, 0.82) })),
    [0, 1, 2].map((i) => ({ x: col[2], y: spread(3, i, 0.6) }))
  ];
  const orbR = Math.max(13, Math.min(h * 0.12, w * 0.035));
  const edges: Edge[][] = [
    nodes[0].map((n, i) => [n.x, n.y, nodes[1][TO_COMPONENT[i]].x, nodes[1][TO_COMPONENT[i]].y]),
    nodes[1].map((n, i) => [n.x, n.y, nodes[2][TO_SUPPLIER[i]].x, nodes[2][TO_SUPPLIER[i]].y]),
    nodes[2].map((n) => [n.x, n.y, px - orbR - 4, cy])
  ];
  // the path traced now: one material through its component and supplier into the product
  const leaf = Math.floor(t / TRACE_S) % MATERIALS.length;
  const phase = (t % TRACE_S) / TRACE_S;
  const glow = Math.sin(Math.PI * clamp((phase - 0.05) / 0.9));
  const comp = TO_COMPONENT[leaf], sup = TO_SUPPLIER[comp];
  const path = [edges[0][leaf], edges[1][comp], edges[2][sup]];
  const lit = [new Set([leaf]), new Set([comp]), new Set([sup])];

  edges.forEach((tier, ti) =>
    tier.forEach((edge, i) => {
      ctx.beginPath();
      curve(ctx, edge);
      ctx.strokeStyle = LINE;
      ctx.lineWidth = 0.8;
      ctx.stroke();
      const q = (t * 0.2 + i * 0.37 + ti * 0.21) % 1;
      const p = along(edge, q);
      dot(ctx, p.x, p.y, 1.4, POINT);
    })
  );
  // the traced path over it, and a point running along it into the product
  ctx.save();
  ctx.globalAlpha = glow;
  for (const edge of path) {
    ctx.beginPath();
    curve(ctx, edge);
    ctx.strokeStyle = "rgba(212,238,156,0.75)";
    ctx.lineWidth = 1.3;
    ctx.stroke();
  }
  const run = clamp((phase - 0.1) / 0.7) * 3;
  const seg = Math.min(2, Math.floor(run));
  const head = along(path[seg], run - seg);
  dot(ctx, head.x, head.y, 2.2, TRACE);
  ctx.restore();

  nodes.forEach((tier, ti) =>
    tier.forEach((n, i) => {
      const on = lit[ti].has(i) ? glow : 0;
      dot(ctx, n.x, n.y, ti === 0 ? 3 : 3.6, "#111214");
      ctx.beginPath();
      ctx.arc(n.x, n.y, ti === 0 ? 3 : 3.6, 0, Math.PI * 2);
      ctx.strokeStyle = on > 0.05 ? `rgba(212,238,156,${0.35 + on * 0.65})` : "#5b6573";
      ctx.lineWidth = 1.2;
      ctx.stroke();
      if (ti === 0) text(ctx, MATERIALS[i], n.x - 9, n.y + 3, on > 0.05 ? `rgba(212,238,156,${0.5 + on * 0.5})` : TAG, "9px monospace", "right");
    })
  );
  orb(ctx, px, cy, orbR, glow * clamp((phase - 0.7) / 0.15));

  const base = h - 8;
  text(ctx, "Materials", col[0], base, LABEL, "11px Inter, sans-serif");
  text(ctx, "Components", col[1], base, LABEL, "11px Inter, sans-serif");
  text(ctx, "Suppliers", col[2], base, LABEL, "11px Inter, sans-serif");
  text(ctx, "Finished product", px, base, KEY, "12px Inter, sans-serif");
}

// impact: the breakdown (kg CO₂e, illustrative) as recorded changes come in, one at a time, then round again
const STAGES = ["Materials", "Production", "Transport", "End of life"];
const STATES = [
  [14.2, 5.1, 2.3, 3.2],
  [13.1, 5.1, 2.3, 3.2],
  [13.1, 4.4, 2.3, 3.2],
  [13.1, 4.4, 1.8, 3.2],
  [13.1, 4.4, 1.8, 2.7]
];
const STATE_S = 3.6;
const SOURCES = ["PARTS", "MAT", "kWh", "km"]; // (not "BOM": in Dutch it reads as "bomb")

export function drawImpact(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  const cy = h * 0.46;
  const ox = w * 0.38;
  const orbR = Math.max(13, Math.min(h * 0.13, w * 0.04));
  const ringR = orbR * 1.75;
  // where we are: the state, and how far the latest change has settled
  const n = Math.floor(t / STATE_S), phase = (t % STATE_S) / STATE_S;
  const cur = STATES[n % STATES.length], prev = STATES[(n + STATES.length - 1) % STATES.length];
  const settle = ease(clamp(phase / 0.3));
  const values = cur.map((v, i) => prev[i] + (v - prev[i]) * settle);
  const changed = cur.findIndex((v, i) => v !== prev[i]);
  const flash = changed < 0 ? 0 : 1 - clamp((phase - 0.3) / 0.6);
  const total = values.reduce((a, b) => a + b, 0);

  // product data running in from the left, into the model
  for (let i = 0; i < SOURCES.length; i++) {
    const y = cy + (i - (SOURCES.length - 1) / 2) * h * 0.18;
    const edge: Edge = [w * 0.06, y, ox - ringR - 6, cy];
    ctx.beginPath();
    curve(ctx, edge);
    ctx.strokeStyle = LINE;
    ctx.lineWidth = 0.8;
    ctx.stroke();
    for (let j = 0; j < 2; j++) {
      const p = along(edge, (t * 0.24 + i * 0.29 + j * 0.5) % 1);
      dot(ctx, p.x, p.y, 1.4, POINT);
    }
    text(ctx, SOURCES[i], w * 0.06 - 8, y + 3, TAG, "9px monospace", "right");
  }

  // the breakdown as a ring around the model, each stage's share of the total
  let a = -Math.PI / 2;
  const gap = 0.07;
  values.forEach((v, i) => {
    const span = (v / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(ox, cy, ringR, a + gap / 2, a + span - gap / 2);
    ctx.strokeStyle = SPECTRAL[i];
    ctx.globalAlpha = 0.85;
    ctx.lineWidth = i === changed ? 2.6 + flash * 1.2 : 2.6;
    ctx.stroke();
    ctx.globalAlpha = 1;
    a += span;
  });
  orb(ctx, ox, cy, orbR, flash * 0.6);

  // the figures, each in its arc's colour
  const rx = w * 0.6, vx = Math.min(w - 12, rx + Math.max(150, w * 0.3));
  const rowGap = Math.min(24, h * 0.15);
  const rows = STAGES.map((_, i) => cy + (i - 1.5) * rowGap + rowGap * 0.55);
  ctx.font = "500 20px Inter, sans-serif";
  ctx.fillStyle = KEY;
  ctx.textAlign = "left";
  const sum = total.toFixed(1);
  ctx.fillText(sum, rx - 4, rows[0] - rowGap * 0.95);
  text(ctx, "kg CO₂e", rx - 4 + ctx.measureText(sum).width + 6, rows[0] - rowGap * 0.95, LABEL, "11px Inter, sans-serif", "left");
  STAGES.forEach((stage, i) => {
    const y = rows[i];
    dot(ctx, rx - 4, y - 4, 2.6, SPECTRAL[i]);
    text(ctx, stage, rx + 6, y, LABEL, "11px Inter, sans-serif", "left");
    const on = i === changed ? flash : 0;
    text(ctx, values[i].toFixed(1), vx, y, on > 0.02 ? `rgba(212,238,156,${0.55 + on * 0.45})` : KEY, "12px Inter, sans-serif", "right");
    if (on > 0.02) {
      ctx.globalAlpha = on;
      text(ctx, (cur[i] - prev[i]).toFixed(1).replace("-", "−"), vx - 34, y, TRACE, "10px Inter, sans-serif", "right");
      ctx.globalAlpha = 1;
    }
  });

  const base = h - 8;
  text(ctx, "Product data", w * 0.14, base, LABEL, "11px Inter, sans-serif");
  text(ctx, "Product model", ox, base, KEY, "12px Inter, sans-serif");
  text(ctx, "Illustrative data", vx, base, "#6f7580", "10px Inter, sans-serif", "right");
}
