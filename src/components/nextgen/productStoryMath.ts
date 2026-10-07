/** A complete journey opens the assembly, holds it apart, and closes it again. */
export function getStoryFrame(progress: number) {
  const p = Math.max(0, Math.min(1, progress));
  const smooth = (value: number) => value * value * (3 - 2 * value);
  // Opening starts almost as soon as the section is reached and moves at full pace from the first
  // scroll (ease-out), so the chair visibly responds right away; closing eases as before.
  const easeOut = (value: number) => value * (2 - value);
  const CLOSE_START = 0.62;
  const CLOSE_END = 0.94;
  let separation = 0;
  if (p > 0.03 && p < 0.42) {
    separation = easeOut((p - 0.03) / 0.39);
  } else if (p >= 0.42 && p <= CLOSE_START) {
    separation = 1;
  } else if (p > CLOSE_START && p < CLOSE_END) {
    separation = 1 - smooth((p - CLOSE_START) / (CLOSE_END - CLOSE_START));
  }
  // Close-up amount (0 = start framing, 1 = on the bolt). Opening: follows the separation, flying in
  // once the chair is mostly apart. Closing: stays on the bolt until it is back in (the Soft chair's
  // return puts its front bolts in at separation 0.2, see softChairStages.ts), then zooms out while
  // the rest of the chair finishes coming together.
  const BOLT_HOME = 0.2;
  const releaseAt =
    CLOSE_START + (CLOSE_END - CLOSE_START) * smoothInverse(1 - BOLT_HOME);
  let focus: number;
  if (p <= CLOSE_START) {
    focus = smooth(Math.min(Math.max((separation - 0.35) / 0.65, 0), 1));
  } else if (p < releaseAt) {
    focus = 1;
  } else {
    focus = 1 - smooth((p - releaseAt) / (1 - releaseAt));
  }
  return {
    separation,
    focus,
    returning: p > CLOSE_START, // on the way back together (the Soft chair uses its return order)
    chapter: p < 0.3 ? 0 : p < 0.72 ? 1 : 2,
  };
}

/** x in [0, 1] where smoothstep(x) = y (bisection; smoothstep is monotonic there). */
function smoothInverse(y: number) {
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 30; i++) {
    const mid = (lo + hi) / 2;
    if (mid * mid * (3 - 2 * mid) < y) {
      lo = mid;
    } else {
      hi = mid;
    }
  }
  return (lo + hi) / 2;
}
