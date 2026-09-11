import assert from "node:assert/strict";
import { calculate, normalize } from "../src/components/packaging/calculations.mjs";
const base = {
  layers: 3,
  perLayer: 6,
  mode: "single",
  boxes: 2,
  units: 6,
  inner: "LDPE-plast",
  weight: 12,
  protectionMaterial: "Papirbaseret indlæg",
  protection: 24,
  boxWeight: 320,
  wrap: 180
};
assert.ok(Math.abs(calculate(base).totalPerProduct - 91) < 1e-9);
assert.equal(calculate({ ...base, inner: "Ingen", protectionMaterial: "Ingen" }).innerMass, 0);
const partial = calculate({ ...base, mode: "multi", boxes: 4 });
assert.equal(partial.products, 4);
assert.equal(partial.totalBoxes, 16);
assert.equal(partial.palletMass, 5444);
const empty = calculate({ ...base, mode: "multi", boxes: 6, layers: 1, perLayer: 1 });
assert.equal(empty.products, 0);
assert.equal(empty.totalPerProduct, null);
assert.equal(empty.palletMass, 0);
for (let layers = 1; layers <= 5; layers++)
  for (let perLayer = 1; perLayer <= 9; perLayer++)
    for (let boxes = 2; boxes <= 12; boxes++) {
      const r = calculate({ ...base, mode: "multi", layers, perLayer, boxes });
      assert.equal(r.products, Math.floor((layers * perLayer) / boxes));
      assert.ok(r.totalBoxes <= r.capacity);
      assert.equal(r.totalBoxes % boxes, 0);
      if (r.products) assert.ok(Math.abs(r.totalPerProduct * r.products - r.palletMass) < 1e-8);
    }
assert.equal(normalize(-5, 1, 12), 1);
assert.equal(normalize(500, 1, 12), 12);
assert.equal(normalize(NaN, 1, 12), 1);
assert.equal(normalize(326, 50, 1000, 10), 330);
console.log("Packaging calculations: 495 pallet combinations and input boundary checks passed");
