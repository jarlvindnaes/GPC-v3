// "Reuse it everywhere" step: how much time each new product takes once its components are already in
// the library. Visual-first take on our "Calculate each component once" chart, drawn in the style of
// Jarl's Product memory chart (light version). Bars grow one by one, then a dashed blue→green curve
// draws through their tops. Pure CSS animation, so it replays every time the step mounts.
// Times are illustrative.
const BARS = [
  { label: "Product 1", value: 5, text: "≈ 1 week", first: true },
  { label: "Product 2", value: 2, text: "2 days" },
  { label: "Product 3", value: 1, text: "1 day" },
  { label: "Product 4", value: 0.5, text: "≈ 4 hrs" },
  { label: "Product 5+", value: 0.25, text: "≈ 2 hrs" },
];
const VW = 520;
const BASE = 168; // baseline y
const MAX_H = 128; // bar height for the largest value
const SLOT = VW / BARS.length;
const BAR_W = 22;
const MAX = BARS[0].value;

const bars = BARS.map((b, i) => {
  const h = Math.max(4, (b.value / MAX) * MAX_H);
  const cx = SLOT * i + SLOT / 2;
  return { ...b, i, h, cx, x: cx - BAR_W / 2, top: BASE - h };
});
// One smooth curve from the first bar top to the last: the time roughly halves with each product, so
// it follows a single exponential decay (sampled densely) rather than bending at every bar.
const FIRST = bars[0];
const END = bars.at(-1)!;
const DECAY = END.h / FIRST.h;
let CURVE = "";
for (let s = 0; s <= 60; s++) {
  const f = s / 60;
  const x = FIRST.cx + (END.cx - FIRST.cx) * f;
  const y = BASE - FIRST.h * DECAY ** f;
  CURVE += `${s ? " L" : "M"} ${x.toFixed(1)} ${y.toFixed(1)}`;
}
// Height of the curve at a given x, so a value label can sit above whichever is higher there: the bar
// top or the curve (the smooth curve passes a little above some bars, e.g. Product 2).
const curveY = (x: number) =>
  BASE - FIRST.h * DECAY ** ((x - FIRST.cx) / (END.cx - FIRST.cx));
// Lift each value label above the bar top and above the curve across the label's whole width
// (the curve is steep near Product 2, so checking only the centre isn't enough).
const LABEL_HALF = 30;
const labelY = (cx: number, top: number) => {
  let highest = top;
  for (let x = cx - LABEL_HALF; x <= cx + LABEL_HALF; x += 3) {
    if (x >= FIRST.cx && x <= END.cx) {
      highest = Math.min(highest, curveY(x) - 4);
    }
  }
  return highest - 8;
};
// Bars: rounded top corners only, square at the baseline.
const R = 5;
const barPath = (x: number, top: number, h: number) => {
  const r = Math.min(R, h / 2, BAR_W / 2);
  return `M ${x} ${BASE} V ${top + r} Q ${x} ${top} ${x + r} ${top} H ${x + BAR_W - r} Q ${x + BAR_W} ${top} ${x + BAR_W} ${top + r} V ${BASE} Z`;
};
const last = bars.at(-1)!;

export function ReuseChart() {
  return (
    <figure className="reuse-chart">
      <figcaption>
        <span className="reuse-chart-title">Time to add each product</span>
        <span className="reuse-chart-note">Illustrative</span>
      </figcaption>
      <svg
        viewBox={`0 0 ${VW} 200`}
        role="img"
        aria-label="The first product takes about a week to add. Each later product reuses its components and takes less time: two days, one day, then a few hours."
      >
        <defs>
          <linearGradient id="rc-curve" x1="0" x2="1">
            <stop stopColor="#6378e8" />
            <stop offset="1" stopColor="#1f9d6b" />
          </linearGradient>
          <mask id="rc-reveal">
            <path className="rc-reveal" d={CURVE} pathLength={1} />
          </mask>
        </defs>
        <line className="rc-base" x1="0" x2={VW} y1={BASE} y2={BASE} />
        {bars.map((b) => (
          <g key={b.label} style={{ ["--i" as string]: b.i }}>
            <path
              className={`rc-bar${b.first ? " is-first" : ""}`}
              d={barPath(b.x, b.top, b.h)}
            />
            <text className="rc-value" x={b.cx} y={labelY(b.cx, b.top)}>
              {b.text}
            </text>
            <text className="rc-label" x={b.cx} y={BASE + 22}>
              {b.label}
            </text>
          </g>
        ))}
        <path className="rc-curve" d={CURVE} mask="url(#rc-reveal)" />
        <circle className="rc-start" cx={FIRST.cx} cy={FIRST.top} r="5" />
        <circle className="rc-head" cx={last.cx} cy={last.top} r="5" />
      </svg>
    </figure>
  );
}
