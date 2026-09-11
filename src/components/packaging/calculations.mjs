export function normalize(value, min, max, step = 1) {
  const number = Number(value);
  if (!Number.isFinite(number)) return min;
  return Math.min(max, Math.max(min, min + Math.round((number - min) / step) * step));
}
export function calculate({
  layers,
  perLayer,
  mode,
  boxes,
  units,
  inner,
  weight,
  protectionMaterial,
  protection,
  boxWeight,
  wrap
}) {
  const capacity = layers * perLayer;
  const products = mode === "single" ? capacity * units : Math.floor(capacity / boxes);
  const totalBoxes = mode === "single" ? capacity : products * boxes;
  const innerMass = (inner === "Ingen" ? 0 : weight) + (protectionMaterial === "Ingen" ? 0 : protection);
  const cartonPerProduct = mode === "single" ? boxWeight / units : boxWeight * boxes;
  const filmPerProduct = products > 0 ? wrap / products : null;
  const totalPerProduct = products > 0 ? innerMass + cartonPerProduct + filmPerProduct : null;
  const palletMass = products * innerMass + totalBoxes * boxWeight + (products > 0 ? wrap : 0);
  return { capacity, products, totalBoxes, innerMass, cartonPerProduct, filmPerProduct, totalPerProduct, palletMass };
}
