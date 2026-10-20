// Transport route story (How it works, #supply-chain): a globe we draw ourselves (canvas 2D, orthographic
// projection, Natural Earth outlines) that explains how Product Connect builds multi-segment transport routes.
// Scroll drives everything through `mk` (chapter progress, 0 → 7): hubs fly in, passenger-only hubs drop out,
// the networks are drawn, non-mainline track is filtered, then one example supply chain is routed leg by leg.
// Only renders while on screen, at most ~30 fps; with reduced motion / "Pause animations" the stars hold still.
import { geoDistance, geoInterpolate, geoLength, geoOrthographic, geoPath, type GeoPermissibleObjects } from "d3-geo";
import { mesh, feature } from "topojson-client";
import { reducedMotion } from "../../utilities/motion";
import { registerSnapPoints } from "../../utilities/storySnap";
import { MODE, airLanes, airports, example, localLines, ports, railLines, seaLanes, stations, type Hub, type LonLat } from "./route-data";

const KM_PER_RADIAN = 6371;
const clamp = (v: number) => Math.min(1, Math.max(0, v));
const span = (mk: number, a: number, b: number) => clamp((mk - a) / (b - a));
const ease = (t: number) => 1 - (1 - t) ** 3;
// deterministic pseudo-random per index, so the layout is the same on every visit
const rand = (i: number, salt = 0) => {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

// A line resampled every ~0.5°, with cumulative lengths, so it can be drawn partially along its true path.
type Track = { points: LonLat[]; cumulative: number[]; length: number };
function track(line: LonLat[]): Track {
  const points: LonLat[] = [line[0]];
  for (let i = 1; i < line.length; i++) {
    const a = line[i - 1];
    const b = line[i];
    const steps = Math.max(1, Math.ceil((geoDistance(a, b) * 180) / Math.PI / 0.5));
    const at = geoInterpolate(a, b);
    for (let s = 1; s <= steps; s++) points.push(at(s / steps) as LonLat);
  }
  const cumulative = [0];
  for (let i = 1; i < points.length; i++) cumulative.push(cumulative[i - 1] + geoDistance(points[i - 1], points[i]));
  return { points, cumulative, length: cumulative[cumulative.length - 1] };
}
function partial(t: Track, f: number): LonLat[] {
  if (f >= 1) return t.points;
  const target = t.length * f;
  const out: LonLat[] = [t.points[0]];
  for (let i = 1; i < t.points.length; i++) {
    if (t.cumulative[i] <= target) {
      out.push(t.points[i]);
      continue;
    }
    const prev = t.cumulative[i - 1];
    out.push(geoInterpolate(t.points[i - 1], t.points[i])((target - prev) / (t.cumulative[i] - prev)) as LonLat);
    break;
  }
  return out;
}

// Camera keyframes over the chapters: the whole network, a close-up of Europe while the passenger track is
// filtered out, then the example route, a close-up of the material extraction point while its road leg to the
// nearest rail freight terminal is drawn, and back out for the main rail and sea legs.
// Timed to the story's steps (each comes to rest at mk i + .5, utilities/storySnap.ts): what belongs to a step plays
// during the glide into it and is done as it rests, so no step stops half way through a move.
const KEYS: { mk: number; at: LonLat; zoom: number }[] = [
  { mk: 2.55, at: [66, 30], zoom: 1 },
  { mk: 2.95, at: [8.5, 50.6], zoom: 6.5 },
  { mk: 3.55, at: [8.5, 50.6], zoom: 6.5 },
  { mk: 3.85, at: [66, 30], zoom: 1 },
  { mk: 4.15, at: [68, 42], zoom: 1.22 },
  { mk: 4.6, at: [68, 42], zoom: 1.22 },
  { mk: 5.0, at: [77.4, 45.6], zoom: 4.6 },
  { mk: 5.6, at: [77.4, 45.6], zoom: 4.6 },
  { mk: 5.95, at: [68, 42], zoom: 1.22 }
];
function camera(mk: number) {
  if (mk <= KEYS[0].mk) return KEYS[0];
  for (let i = 1; i < KEYS.length; i++) {
    const a = KEYS[i - 1];
    const b = KEYS[i];
    if (mk <= b.mk) {
      const t = ease(clamp((mk - a.mk) / (b.mk - a.mk)));
      const smooth = t * t * (3 - 2 * t);
      return {
        at: geoInterpolate(a.at, b.at)(smooth) as LonLat,
        zoom: Math.exp(Math.log(a.zoom) + (Math.log(b.zoom) - Math.log(a.zoom)) * smooth)
      };
    }
  }
  return KEYS[KEYS.length - 1];
}

// A soft glowing dot pre-rendered once per colour, so the hundreds of hub dots are drawn with drawImage instead of
// canvas shadowBlur (which is very slow on phones).
const SPRITE = 64;
const CORE = 0.25; // the solid dot's radius as a share of the sprite size
const sprites = new Map<string, HTMLCanvasElement>();
function sprite(color: string, core = color) {
  const key = `${color}|${core}`;
  let c = sprites.get(key);
  if (c) return c;
  c = document.createElement("canvas");
  c.width = c.height = SPRITE;
  const g = c.getContext("2d")!;
  const m = SPRITE / 2;
  const halo = g.createRadialGradient(m, m, 0, m, m, m);
  halo.addColorStop(0.4, `${color}55`);
  halo.addColorStop(0.65, `${color}18`);
  halo.addColorStop(1, `${color}00`);
  g.fillStyle = halo;
  g.fillRect(0, 0, SPRITE, SPRITE);
  g.fillStyle = core;
  g.beginPath();
  g.arc(m, m, SPRITE * CORE, 0, Math.PI * 2);
  g.fill();
  sprites.set(key, c);
  return c;
}

export function initRouteStory(root: HTMLElement) {
  const canvas = root.querySelector<HTMLCanvasElement>("[data-route-canvas]");
  const ctx = canvas?.getContext("2d");
  if (!canvas || !ctx) return () => {};

  const pinnedQuery = matchMedia("(min-height: 600px)");
  const pin = root.querySelector<HTMLElement>(".route-pin");
  const dots = Array.from(root.querySelectorAll<HTMLElement>(".route-dots li"));
  const totals = root.querySelectorAll<HTMLElement>("[data-route-total]");
  const articles = Array.from(root.querySelectorAll(".route-steps article"));
  const steps = articles.length;

  const air = airLanes.map(([a, b]) => track([a, b]));
  const sea = seaLanes.map(track);
  const rail = railLines.map(track);
  const local = localLines.map(track);
  const route = {
    roads: example.roads.map(track),
    rail: track(example.rail),
    sea: track(example.sea)
  };
  // the whole journey as one line, extraction → rail → supplier → port → sea → home factory, with the mode per stretch
  // (the travelling dots at the end of the story follow it, coloured by the leg they are on)
  const legs: [Track, string][] = [
    [route.roads[0], MODE.road], [route.rail, MODE.rail], [route.roads[1], MODE.road], [route.roads[2], MODE.road],
    [route.sea, MODE.sea], [route.roads[3], MODE.road]
  ];
  const journey = (() => {
    const points: LonLat[] = [];
    const modes: string[] = [];
    for (const [t, color] of legs) {
      t.points.forEach((pt, i) => {
        if (i === 0 && points.length) return;
        points.push(pt);
        modes.push(color);
      });
    }
    const cumulative = [0];
    for (let i = 1; i < points.length; i++) cumulative.push(cumulative[i - 1] + geoDistance(points[i - 1], points[i]));
    return { points, modes, cumulative, length: cumulative[cumulative.length - 1] };
  })();
  const at = (f: number): [LonLat, string] => {
    const target = journey.length * f;
    let lo = 0;
    let hi = journey.cumulative.length - 1;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (journey.cumulative[mid] <= target) lo = mid;
      else hi = mid;
    }
    const gap = journey.cumulative[hi] - journey.cumulative[lo] || 1;
    return [geoInterpolate(journey.points[lo], journey.points[hi])((target - journey.cumulative[lo]) / gap) as LonLat, journey.modes[hi]];
  };

  // distances per mode for the example route, shown under the globe at the end
  const km = (t: Track) => t.length * KM_PER_RADIAN;
  const distance = {
    road: route.roads.reduce((sum, t) => sum + km(t), 0),
    rail: km(route.rail),
    sea: km(route.sea)
  };
  for (const el of totals) {
    const mode = el.dataset.routeTotal as "road" | "rail" | "sea" | "all";
    const value = mode === "all" ? distance.road + distance.rail + distance.sea : distance[mode];
    el.textContent = `${Math.round(value / 10) * 10 >= 1000 ? Math.round(value / 10) * 10 : Math.round(value)}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " km";
  }

  // two levels of detail: the 1:110m outlines while the camera moves or the globe is small, the 1:50m ones once
  // the view settles (re-rendering the detailed coastlines every frame is what made phones stutter)
  type Outlines = { land: GeoPermissibleObjects; borders: GeoPermissibleObjects };
  let coarse: Outlines | null = null;
  let fine: Outlines | null = null;
  let lastView = "";
  let movedAt = 0;
  let settle = 0;
  let w = 0;
  let h = 0;
  let dpr = 1;
  let mk = 0;
  let visible = false;
  let frame = 0;
  let last = 0;
  let time = 0;
  const base = document.createElement("canvas");
  const baseCtx = base.getContext("2d");
  let baseKey = "";

  const stars = Array.from({ length: 170 }, (_, i) => ({ x: rand(i, 1), y: rand(i, 2), r: 0.4 + rand(i, 3) * 1.1, p: rand(i, 4) * 6.28 }));

  // globe placement: on wide screens to the right of the captions, on narrow ones below them
  const layout = (zoom: number) => {
    const wide = w >= 900;
    const r = wide ? Math.min(w * 0.3, h * 0.42) : Math.min(w * 0.46, h * 0.3); // narrow: room for the whole route
    return { cx: wide ? w * 0.62 : w * 0.5, cy: wide ? h * 0.52 : h * 0.66, r: r * zoom };
  };

  function draw() {
    if (!w || !h) return;
    const view = camera(mk);
    const { cx, cy, r } = layout(view.zoom);
    const [lon, lat] = view.at;
    const projection = geoOrthographic().rotate([-lon, -lat]).scale(r).translate([cx, cy]).clipAngle(90).clipExtent([[-20, -20], [w + 20, h + 20]]);
    const centre: LonLat = [lon, lat];
    const onFront = (p: LonLat) => geoDistance(p, centre) < Math.PI / 2 - 0.02;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    // stars
    const still = reducedMotion.matches;
    for (const s of stars) {
      ctx.globalAlpha = 0.25 + 0.35 * (still ? 0.6 : 0.5 + 0.5 * Math.sin(time * 1.3 + s.p));
      ctx.fillStyle = "#cfd8ff";
      ctx.beginPath();
      ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // globe: atmosphere glow, ocean, land and borders (cached while the view holds still)
    const viewKey = `${w}|${h}|${dpr}|${r.toFixed(1)}|${lon.toFixed(2)}|${lat.toFixed(2)}`;
    const now = performance.now();
    if (viewKey !== lastView) {
      lastView = viewKey;
      movedAt = now;
    }
    const settled = now - movedAt > 150;
    if (r > 260 && coarse && !fine) loadFine(); // only a globe this large shows the detailed outlines
    const outlines = (settled && r > 260 && fine) || coarse || fine;
    const key = `${viewKey}|${outlines === fine ? 2 : outlines ? 1 : 0}`;
    if (outlines !== fine && fine && r > 260) {
      // upgrade to the detailed outlines once the camera has held still for a moment
      clearTimeout(settle);
      settle = window.setTimeout(draw, 170);
    }
    if (key !== baseKey && baseCtx) {
      baseKey = key;
      base.width = Math.round(w * dpr);
      base.height = Math.round(h * dpr);
      baseCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      baseCtx.clearRect(0, 0, w, h);
      const glow = baseCtx.createRadialGradient(cx, cy, r * 0.92, cx, cy, r * (r > h ? 1.02 : 1.32));
      glow.addColorStop(0, "#2f6bffaa");
      glow.addColorStop(0.35, "#1d4fd033");
      glow.addColorStop(1, "#0b1a4000");
      baseCtx.fillStyle = glow;
      baseCtx.beginPath();
      baseCtx.arc(cx, cy, r * 1.32, 0, Math.PI * 2);
      baseCtx.fill();
      const ocean = baseCtx.createRadialGradient(cx - r * 0.3, cy - r * 0.35, r * 0.1, cx, cy, r);
      ocean.addColorStop(0, "#0e2147");
      ocean.addColorStop(1, "#071331");
      baseCtx.fillStyle = ocean;
      baseCtx.beginPath();
      baseCtx.arc(cx, cy, r, 0, Math.PI * 2);
      baseCtx.fill();
      if (outlines) {
        const path = geoPath(projection, baseCtx);
        baseCtx.beginPath();
        path(outlines.land);
        baseCtx.fillStyle = "#1a3a72";
        baseCtx.fill();
        baseCtx.beginPath();
        path(outlines.borders);
        baseCtx.strokeStyle = "#3a62a8";
        baseCtx.lineWidth = 0.6;
        baseCtx.stroke();
      }
      baseCtx.beginPath();
      baseCtx.arc(cx, cy, r, 0, Math.PI * 2);
      baseCtx.strokeStyle = "#5b8cff55";
      baseCtx.lineWidth = 1;
      baseCtx.stroke();
    }
    ctx.drawImage(base, 0, 0, w, h);

    const path = geoPath(projection, ctx);
    const line = (coords: LonLat[], color: string, width: number, alpha: number, glow = 0) => {
      if (coords.length < 2 || alpha <= 0) return;
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      path({ type: "LineString", coordinates: coords });
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      if (glow) {
        // glow: a wide, faint stroke under the line (cheaper than shadowBlur)
        ctx.lineWidth = width + glow;
        ctx.globalAlpha = alpha * 0.22;
        ctx.stroke();
        ctx.lineWidth = width;
        ctx.globalAlpha = alpha;
      }
      ctx.stroke();
      ctx.globalAlpha = 1;
    };

    // chapters 1–4: the global network fades as the example route takes over
    const network = 1 - span(mk, 3.6, 3.95);
    if (network > 0) {
      // 3. networks drawn: air arcs, then sea lanes, then rail; 4. local passenger track filtered out
      const airF = ease(span(mk, 1.65, 2.05));
      const seaF = ease(span(mk, 1.85, 2.25));
      const railF = ease(span(mk, 2.05, 2.45));
      const localAlpha = 1 - span(mk, 3.0, 3.45);
      for (const t of air) line(partial(t, airF), MODE.air, 1, 0.7 * network);
      for (const t of sea) line(partial(t, seaF), MODE.sea, 1.4, 0.85 * network);
      for (const t of rail) line(partial(t, railF), MODE.rail, 1.3, 0.85 * network);
      for (const t of local) line(partial(t, railF), MODE.rail, 1.1, 0.85 * network * localAlpha);

      // 1. hubs fly in from the stars (ports, then airports, then rail terminals); 2. passenger-only ones drop out
      const groups: [Hub[], string, number][] = [[ports, MODE.sea, -0.15], [airports, MODE.air, 0], [stations, MODE.rail, 0.12]];
      const drop = span(mk, 1.0, 1.45);
      for (const [hubs, color, start] of groups) {
        const dot = sprite(color);
        hubs.forEach((hub, i) => {
          const q = ease(span(mk, start + (i / hubs.length) * 0.22, start + (i / hubs.length) * 0.22 + 0.16));
          if (q <= 0 || !onFront(hub.at)) return;
          const target = projection(hub.at);
          if (!target) return;
          const angle = rand(i, start * 10) * Math.PI * 2;
          const from = [cx + Math.cos(angle) * r * 1.9, cy + Math.sin(angle) * r * 1.9];
          const x = from[0] + (target[0] - from[0]) * q;
          const y = from[1] + (target[1] - from[1]) * q;
          let alpha = Math.min(1, q * 1.6) * network;
          let size = 2.4;
          if (!hub.freight) {
            alpha *= 1 - drop;
            size *= 1 + drop * 1.4;
          }
          if (alpha <= 0) return;
          ctx.globalAlpha = alpha;
          const d = size / CORE; // sprite size whose core has radius `size`
          ctx.drawImage(dot, x - d / 2, y - d / 2, d, d);
          if (!hub.freight && drop > 0 && drop < 1) {
            // a ring that opens up as the passenger-only hub is removed
            ctx.globalAlpha = (1 - drop) * 0.8 * network;
            ctx.strokeStyle = color;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(x, y, 3 + drop * 10, 0, Math.PI * 2);
            ctx.stroke();
          }
          ctx.globalAlpha = 1;
        });
      }
    }

    // 5–7: the example supply chain
    // road legs: the long Kazakh leg in the close-up of the extraction point, then the supplier's and the home
    // factory's short legs as the camera pulls back out
    const roadTimes: [number, number][] = [[5.05, 5.45], [5.65, 5.85], [5.7, 5.9], [5.75, 5.95]];
    const railF2 = ease(span(mk, 5.85, 6.2));
    const seaF2 = ease(span(mk, 6.05, 6.45));
    route.roads.forEach((t, i) => line(partial(t, ease(span(mk, roadTimes[i][0], roadTimes[i][1]))), MODE.road, 2.4, 1, 8));
    line(partial(route.rail, railF2), MODE.rail, 2.4, 1, 8);
    line(partial(route.sea, seaF2), MODE.sea, 2.4, 1, 8);

    // once the route is complete, goods keep travelling along it: dots from extraction to the home factory
    const travel = span(mk, 6.75, 7.0) * (reducedMotion.matches ? 0 : 1);
    if (travel > 0) {
      const COUNT = 9;
      for (let k = 0; k < COUNT; k++) {
        const f = (time * 0.035 + k / COUNT) % 1;
        const [pt, color] = at(f);
        const p = projection(pt);
        if (!p || !onFront(pt)) continue;
        ctx.globalAlpha = travel;
        const d = 3.2 / CORE;
        ctx.drawImage(sprite(color, "#ffffff"), p[0] - d / 2, p[1] - d / 2, d, d);
        ctx.globalAlpha = 1;
      }
    }

    // freight hubs found for the route (chapter 6 on)
    const hubAlpha = ease(span(mk, 4.95, 5.1));
    const hubs: [LonLat, string, string][] = [
      [example.railFrom, MODE.rail, "Rail freight terminal"],
      [example.railTo, MODE.rail, "Rail freight terminal"],
      [example.portFrom, MODE.sea, "Container port"],
      [example.portTo, MODE.sea, "Container port"]
    ];
    const closeUp = clamp((view.zoom - 2.5) / 1.5);
    for (const [at, color, label] of hubs) {
      const p = projection(at);
      if (!p || hubAlpha <= 0 || !onFront(at)) continue;
      if (closeUp > 0) {
        ctx.globalAlpha = hubAlpha * closeUp;
        ctx.font = "500 12px Inter, Arial, sans-serif";
        ctx.fillStyle = "#dfe6f6";
        ctx.textAlign = "left";
        ctx.shadowColor = "#050b18";
        ctx.shadowBlur = 6;
        ctx.fillText(label, p[0] + 12, p[1] + 4);
        ctx.shadowBlur = 0;
      }
      ctx.globalAlpha = hubAlpha;
      ctx.fillStyle = "#0b1631";
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(p[0], p[1], 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    // the three located points (chapter 5): material extraction, supplier factory, home factory
    const markers: [LonLat, string, string][] = [
      [example.extraction, "#c084fc", "Material extraction"],
      [example.supplier, "#a3c56a", "Supplier factory"],
      [example.home, "#60a5fa", "Home factory"]
    ];
    markers.forEach(([at, color, label], i) => {
      const q = ease(span(mk, 4.1 + i * 0.1, 4.3 + i * 0.1));
      const p = projection(at);
      if (!p || q <= 0) return;
      const drop = (1 - q) * 26;
      ctx.globalAlpha = q;
      const d = 6.5 / CORE;
      ctx.drawImage(sprite(color), p[0] - d / 2, p[1] - drop - d / 2, d, d);
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(p[0], p[1] - drop, 6.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#ffffffcc";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.font = "500 12px Inter, Arial, sans-serif";
      ctx.fillStyle = "#e8eefc";
      // labels sit beside their dot, flipping side when they would run off the edge of the screen
      const right = i === 2 ? p[0] - ctx.measureText(label).width - 12 > 8 : p[0] + 12 + ctx.measureText(label).width > w - 8;
      ctx.textAlign = right ? "right" : "left";
      ctx.shadowColor = "#050b18";
      ctx.shadowBlur = 6;
      ctx.fillText(label, p[0] + (right ? -12 : 12), p[1] - drop + (i === 1 ? 18 : -10));
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
    });
  }

  function resize() {
    const box = canvas!.getBoundingClientRect();
    w = box.width;
    h = box.height;
    dpr = Math.min(window.devicePixelRatio || 1, w < 900 ? 1.5 : 2); // phones: fewer pixels to fill per frame
    canvas!.width = Math.round(w * dpr);
    canvas!.height = Math.round(h * dpr);
    baseKey = "";
    draw();
  }

  function progress() {
    const rootBox = root.getBoundingClientRect();
    const pinned = pinnedQuery.matches;
    root.classList.toggle("is-pinned", pinned);
    if (!pinned) {
      mk = steps; // stacked: show the finished route
    } else {
      const box = rootBox;
      const run = Math.max(1, root.offsetHeight - (pin?.offsetHeight || window.innerHeight)); // the pinned panel's own run
      mk = clamp(-box.top / run) * (steps + 0.4) - 0.2;
    }
    root.style.setProperty("--rk", mk.toFixed(3));
    // the heading fades up as the section scrolls into view (from transparent, over the lower half of the screen)
    const enter = clamp((window.innerHeight - rootBox.top) / (window.innerHeight * 0.55));
    root.style.setProperty("--enter", enter.toFixed(3));
    const active = Math.min(steps - 1, Math.max(0, Math.floor(mk + 0.1)));
    // (with story steps on, storySnap lights the dots: the step chosen, not the one passed)
    if (!document.documentElement.classList.contains("story-snap")) dots.forEach((dot, i) => dot.classList.toggle("is-on", i === active));
    articles.forEach((a, i) => a.classList.toggle("is-on", i === active));
    draw();
  }

  function tick(now: number) {
    frame = 0;
    if (!visible || document.hidden) return;
    if (now - last >= 33) {
      time += Math.min((now - last) / 1000, 0.05);
      last = now;
      draw();
    }
    if (!reducedMotion.matches) frame = requestAnimationFrame(tick);
  }
  const start = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    draw();
    if (visible && !reducedMotion.matches) {
      last = performance.now();
      frame = requestAnimationFrame(tick);
    }
  };

  // scroll events can fire several times per frame on phones: update at most once per frame
  let queued = 0;
  const onScroll = () => {
    if (visible && !queued) queued = requestAnimationFrame(() => {
      queued = 0;
      progress();
    });
  };
  const sizeObserver = new ResizeObserver(resize);
  sizeObserver.observe(canvas);
  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) progress();
    start();
  });
  io.observe(root);
  // the outlines load once the section is near
  function outlinesOf(world: any): Outlines {
    return {
      land: feature(world, world.objects.land) as unknown as GeoPermissibleObjects,
      borders: mesh(world, world.objects.countries, (a: unknown, b: unknown) => a !== b) as unknown as GeoPermissibleObjects
    };
  }
  // the detailed outlines (a 756KB atlas, and topology work) only once a large globe needs them, so phones skip it
  let fineLoading = false;
  function loadFine() {
    if (fineLoading) return;
    fineLoading = true;
    import("world-atlas/countries-50m.json").then((m) => {
      fine = outlinesOf(m.default);
      baseKey = "";
      draw();
    });
  }
  const loader = new IntersectionObserver(async ([entry]) => {
    if (!entry.isIntersecting) return;
    loader.disconnect();
    coarse = outlinesOf((await import("world-atlas/countries-110m.json")).default);
    baseKey = "";
    draw();
  }, { rootMargin: "800px 0px" });
  loader.observe(root);
  window.addEventListener("scroll", onScroll, { passive: true });
  pinnedQuery.addEventListener("change", progress);
  reducedMotion.addEventListener("change", start);
  progress();
  // snap points (utilities/storySnap.ts): each caption fully shown, its step's animation done (--rk i + .5), then the
  // finished route with its totals; at five times the usual glide time, so the moves on the globe can be followed
  const removeSnapPoints = registerSnapPoints(() => {
    if (!pinnedQuery.matches) return [];
    const pin = root.querySelector<HTMLElement>(".route-pin");
    const run = Math.max(1, root.offsetHeight - (pin?.offsetHeight || window.innerHeight));
    const top = root.getBoundingClientRect().top + window.scrollY;
    const rests = [...Array.from({ length: steps }, (_, i) => i + 0.5), steps + 0.05];
    return { points: [...rests.map((rk) => top + run * ((rk + 0.2) / (steps + 0.4))), top + run], top, pace: 5, dots: root.querySelector<HTMLElement>(".route-dots") }; // (and its exit)
  });

  return () => {
    removeSnapPoints();
    cancelAnimationFrame(frame);
    cancelAnimationFrame(queued);
    clearTimeout(settle);
    sizeObserver.disconnect();
    io.disconnect();
    loader.disconnect();
    window.removeEventListener("scroll", onScroll);
    pinnedQuery.removeEventListener("change", progress);
    reducedMotion.removeEventListener("change", start);
  };
}
