// Builds the supply chain route story's map (src/components/nextgen/route-map.json): the 1:50m Natural Earth outlines
// (world-atlas) inside one box around where the story zooms in (Central Europe and Kazakhstan, with room to spare),
// the 1:110m ones everywhere else, cut to fit together along the box's edges; so the globe has one map, sharp where it
// is seen up close, light to draw, and never swaps between two.
// Run after changing the box: node scripts/build-route-map.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { feature, mesh } from "topojson-client";
import { geoArea, geoCentroid, geoContains } from "d3-geo";

// the box, [west, south, east, north] in degrees: its edges kept to sea, or to land far from the zoomed views
// (west of the box: Iceland and the Atlantic; east: the Yellow Sea, short of Korea and Japan; south: the Sahara,
// Arabia and India; north: the Arctic coast)
export const BOX = [-12, 20, 125, 72];
const STEP = 1; // (long straight edges are densified to this, in degrees: d3 draws edges as great circles)
const ROUND = 100; // (coordinates to 0.01°, about a kilometre)
const MIN_GAP = 0.05; // (points closer than this to the last one kept are dropped: about 5km, 2px at the story's
// closest zoom, so the globe stays light to redraw while it moves)

const atlas = (name) => JSON.parse(readFileSync(new URL(`../node_modules/world-atlas/${name}.json`, import.meta.url)));
let W, S, E, N; // (the rectangle being clipped to)
const inside = ([x, y], edge) => (edge === 0 ? x >= W : edge === 1 ? x <= E : edge === 2 ? y >= S : y <= N);
const cross = ([x1, y1], [x2, y2], edge) => {
  if (edge < 2) {
    const x = edge === 0 ? W : E;
    return [x, y1 + ((y2 - y1) * (x - x1)) / (x2 - x1)];
  }
  const y = edge === 2 ? S : N;
  return [x1 + ((x2 - x1) * (y - y1)) / (y2 - y1), y];
};

// Sutherland–Hodgman: a ring clipped to the box (the box is convex, so one pass per edge)
function clipRing(ring) {
  let out = ring.slice(0, -1);
  for (let edge = 0; edge < 4 && out.length; edge++) {
    const input = out;
    out = [];
    for (let i = 0; i < input.length; i++) {
      const a = input[i], b = input[(i + 1) % input.length];
      const ia = inside(a, edge), ib = inside(b, edge);
      if (ia && ib) out.push(b);
      else if (ia && !ib) out.push(cross(a, b, edge));
      else if (!ia && ib) out.push(cross(a, b, edge), b);
    }
  }
  if (out.length < 3) return null;
  out.push(out[0]);
  return out;
}

// a line clipped to the box: the parts inside, split where it leaves (Liang–Barsky per segment)
function clipLine(line) {
  const parts = [];
  let current = [];
  for (let i = 0; i < line.length - 1; i++) {
    const [x1, y1] = line[i], [x2, y2] = line[i + 1];
    let t0 = 0, t1 = 1;
    const dx = x2 - x1, dy = y2 - y1;
    let ok = true;
    for (const [p, q] of [[-dx, x1 - W], [dx, E - x1], [-dy, y1 - S], [dy, N - y1]]) {
      if (p === 0) { if (q < 0) ok = false; continue; }
      const r = q / p;
      if (p < 0) { if (r > t1) ok = false; else if (r > t0) t0 = r; }
      else { if (r < t0) ok = false; else if (r < t1) t1 = r; }
    }
    if (!ok) { if (current.length > 1) parts.push(current); current = []; continue; }
    const a = [x1 + t0 * dx, y1 + t0 * dy], b = [x1 + t1 * dx, y1 + t1 * dy];
    if (!current.length) current.push(a);
    current.push(b);
    if (t1 < 1) { parts.push(current); current = []; }
  }
  if (current.length > 1) parts.push(current);
  return parts;
}

// long straight runs (the clipped edges along the box) get points every STEP degrees; then rounded, repeats dropped
function tidy(points) {
  const out = [];
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    if (i) {
      const q = points[i - 1];
      const n = Math.floor(Math.max(Math.abs(p[0] - q[0]), Math.abs(p[1] - q[1])) / STEP);
      for (let k = 1; k <= n; k++) out.push([q[0] + ((p[0] - q[0]) * k) / (n + 1), q[1] + ((p[1] - q[1]) * k) / (n + 1)]);
    }
    out.push(p);
  }
  const rounded = out.map(([x, y]) => [Math.round(x * ROUND) / ROUND, Math.round(y * ROUND) / ROUND]);
  const kept = [];
  rounded.forEach((p, i) => {
    const q = kept.at(-1);
    // (the last point always stays: a ring closes on its first)
    if (!q || i === rounded.length - 1 || Math.hypot(p[0] - q[0], p[1] - q[1]) >= MIN_GAP) kept.push(p);
  });
  return kept.filter((p, i) => !i || p[0] !== kept[i - 1][0] || p[1] !== kept[i - 1][1]);
}

// a ring that goes all the way round the globe (Antarctica's coast) encloses the pole only on the sphere: on the flat
// lon/lat plane the clipping works in, it is closed over the pole explicitly, where it jumps across the antimeridian
function closeOverPole(ring) {
  const out = [];
  for (let i = 0; i < ring.length; i++) {
    out.push(ring[i]);
    const next = ring[i + 1];
    if (!next || Math.abs(next[0] - ring[i][0]) < 180) continue;
    const side = Math.sign(ring[i][0]);
    const pole = ring[i][1] < 0 ? -90 : 90;
    out.push([side * 180, ring[i][1]], [side * 180, pole], [-side * 180, pole], [-side * 180, next[1]]);
  }
  return out;
}

// one map's land and borders, clipped to a rectangle
function clipTo(world, [w, s, e, n]) {
  [W, S, E, N] = [w, s, e, n];
  const land = feature(world, world.objects.land);
  const geometries = (land.features ?? [land]).map((f) => f.geometry);
  const polygons = [];
  for (const polygon of geometries.flatMap((g) => (g.type === "Polygon" ? [g.coordinates] : g.coordinates))) {
    const flat = polygon.map(closeOverPole);
    const rings = flat.map(clipRing).filter(Boolean).map(tidy).filter((ring) => ring.length >= 4);
    if (!rings.length || !clipRing(flat[0])) continue;
    // (on the sphere a ring's direction says which side is inside: a piece that comes out the wrong way round covers
    // the whole globe but itself. Turned round, it is either a real piece of land, cut along the edge (Antarctica,
    // Greenland), or a sliver the clipping made along the edge, lying over sea; the original map tells which)
    const area = geoArea({ type: "Polygon", coordinates: rings });
    if (area < 2 * Math.PI) {
      if (area > 1e-9) polygons.push(rings);
      continue;
    }
    const turned = rings.map((ring) => ring.slice().reverse());
    if (geoContains(land, geoCentroid({ type: "Polygon", coordinates: turned }))) polygons.push(turned);
  }
  const borders = mesh(world, world.objects.countries, (a, b) => a !== b);
  const lines = borders.coordinates.flatMap(clipLine).map(tidy).filter((line) => line.length > 1);
  return { polygons, lines };
}

// inside the box: the 1:50m map; outside it (four rectangles around it, meeting along its edges): the 1:110m one
const [bw, bs, be, bn] = BOX;
const parts = [
  clipTo(atlas("countries-50m"), BOX),
  ...[
    [-180, -90, bw, 90],
    [be, -90, 180, 90],
    [bw, -90, be, bs],
    [bw, bn, be, 90]
  ].map((rect) => clipTo(atlas("countries-110m"), rect))
];
const polygons = parts.flatMap((p) => p.polygons);
const lines = parts.flatMap((p) => p.lines);

const out = {
  land: { type: "MultiPolygon", coordinates: polygons },
  borders: { type: "MultiLineString", coordinates: lines }
};
const target = new URL("../src/components/nextgen/route-map.json", import.meta.url);
writeFileSync(target, JSON.stringify(out));
console.log(`${polygons.length} land polygons, ${lines.length} border lines, ${(JSON.stringify(out).length / 1024).toFixed(0)} KB`);
