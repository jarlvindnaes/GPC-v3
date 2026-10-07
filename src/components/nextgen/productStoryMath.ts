/** A complete journey opens the assembly, holds it apart, and closes it again. */
export function getStoryFrame(progress: number) {
  const p = Math.max(0, Math.min(1, progress));
  const smooth = (value: number) => value * value * (3 - 2 * value);
  // Opening starts almost as soon as the section is reached and moves at full pace from the first
  // scroll (ease-out), so the chair visibly responds right away; closing eases as before.
  const easeOut = (value: number) => value * (2 - value);
  let separation = 0;
  if (p > 0.03 && p < 0.42) {
    separation = easeOut((p - 0.03) / 0.39);
  } else if (p >= 0.42 && p <= 0.62) {
    separation = 1;
  } else if (p > 0.62 && p < 0.93) {
    separation = 1 - smooth((p - 0.62) / 0.31);
  }
  return { separation, chapter: p < 0.3 ? 0 : p < 0.72 ? 1 : 2 };
}
