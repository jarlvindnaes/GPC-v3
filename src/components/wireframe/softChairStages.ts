import type * as Three from "three";

// Soft Lounge Chair disassembly, in an order where solid parts never pass through each other
// (checked against the real geometry): bolts out (the ones in the back of the rear legs backwards),
// leather seat up a little, arm covers up, then rear legs (with the back rail) slide backwards and
// front legs (with the front rail) forwards off the armrests and side rails, the backrest lifts and
// the side rails drop, armrests move out, the legs step off the cross rails, and the leather seat
// rises clear above the armrests. The stages overlap so it flows as one movement: each piece starts
// once the ones holding it have moved far enough. dx is outward (away from the chair's centre line);
// played in reverse on the way back together.
export const SOFT_STAGES: [string, number[][]][] = [
  ["Connector bolt left top", [[0.0, 0.3, 0, 0, -0.26]]],
  ["Connector bolt right top", [[0.0, 0.3, 0, 0, -0.26]]],
  ["Connector bolt", [[0.0, 0.3, 0.1, 0, 0]]],
  ["Leather seat", [[0.05, 0.35, 0, 0.08, 0], [0.5, 0.95, 0, 0.12, 0]]],
  ["Shell arm wrap", [[0.1, 0.4, 0, 0.08, 0], [0.33, 0.7, 0.05, 0, 0]]],
  ["Back leg", [[0.15, 0.55, 0, 0, -0.14], [0.4, 0.8, 0.06, 0, 0]]],
  ["Back rail", [[0.15, 0.55, 0, 0, -0.14]]],
  ["Front leg", [[0.15, 0.55, 0, 0, 0.14], [0.4, 0.8, 0.06, 0, 0]]],
  ["Front rail", [[0.15, 0.55, 0, 0, 0.14]]],
  ["Shell back", [[0.3, 0.7, 0, 0.18, 0]]],
  ["Side seat rail", [[0.3, 0.7, 0, -0.1, 0]]],
  ["Armrest", [[0.33, 0.7, 0.05, 0, 0]]],
];
export const SOFT_EXPLODE_SECONDS = 10; // more steps than the Cross Chair, so a longer out-and-back
const smoothstep = (x: number) => {
  const t = Math.min(Math.max(x, 0), 1);
  return t * t * (3 - 2 * t);
};
/** Staged moves for a Soft Lounge Chair piece, with dx turned outward for the piece's side. */
export function softMovesFor(pieceName: string, outward: number) {
  const stage = SOFT_STAGES.find(([prefix]) => pieceName.startsWith(prefix));
  return (stage?.[1] ?? []).map(([t0, t1, dx, dy, dz]) => [t0, t1, dx * outward, dy, dz]);
}

/** Place a staged piece at disassembly progress u (0 = assembled, 1 = fully apart). */
export function placeStaged(part: Three.Object3D, basePos: Three.Vector3, moves: number[][], u: number, scale: number) {
  part.position.copy(basePos);
  for (const [t0, t1, dx, dy, dz] of moves) {
    const s = smoothstep((u - t0) / (t1 - t0)) * scale;
    part.position.x += dx * s;
    part.position.y += dy * s;
    part.position.z += dz * s;
  }
}
