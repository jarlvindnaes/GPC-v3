/** A complete journey opens the assembly, holds it apart, and closes it again. */
export function getStoryFrame(progress: number) {
  const p = Math.max(0, Math.min(1, progress));
  const smooth = (value: number) => value * value * (3 - 2 * value);
  let separation = 0;
  if (p > 0.12 && p < 0.42) {
    separation = smooth((p - 0.12) / 0.3);
  } else if (p >= 0.42 && p <= 0.62) {
    separation = 1;
  } else if (p > 0.62 && p < 0.93) {
    separation = 1 - smooth((p - 0.62) / 0.31);
  }
  return { separation, chapter: p < 0.3 ? 0 : p < 0.72 ? 1 : 2 };
}
