import { useEffect, useMemo, useRef, useState } from "react";

import { useIsNearViewport } from "../../utilities/useIsNearViewport";

// "Keystone" data-flow illustration (our take on the Studio 9 / Product Connect story): multi-tier
// suppliers funnel inward to one product graph, which fans out to every downstream use case. Built as a
// single fixed-viewBox SVG (scales with its container). Lines draw in on mount, then indigo pulses travel
// left -> right along every connector (suppliers -> Product Connect -> use cases). Pauses off-screen and
// respects reduced motion (lines shown, no pulses).

const VB_W = 1320;
const VB_H = 640;
const MID_Y = 286;

const BAR_LIGHT = "#cdd8f0"; // upstream supplier bars
const BAR_MED = "#7fa6da"; // tier-1 / keystone / hub bars
const LINE = "#aab4c9";
const PILL_FILL = "#eef2fa";
const PILL_STROKE = "#dde4f1";
const INK = "#1f2433";
const SUBCAP = "#5d6373";
const KICKER = "#3e63dd";
const DOT = "#3e63dd";
const CIRCLE_STROKE = "#cfd6e4";

interface Bar {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface Pill {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
}

interface Line {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  len: number;
}

interface Layout {
  tier3: Bar[];
  tier2: Bar[];
  tier1: Bar[];
  keystone: Bar;
  hubs: Bar[];
  pills: Pill[];
  groups: { label: string; y: number }[];
  lines: Line[];
}

const GROUPS = [
  { label: "Compliance", items: ["Regulatory reporting", "Risk assessment", "Audit management"] },
  { label: "Sustainability", items: ["ESG strategy & goals", "Impact measurement", "Stakeholder engagement"] },
  {
    label: "Development",
    items: ["Product design & engineering", "Lifecycle assessment (LCA)", "Production certification"]
  },
  { label: "Operations", items: ["Product planning", "Quality control", "Resource efficiency"] },
  { label: "Procurement", items: ["Supplier onboarding", "Contract management", "Spend analysis"] }
];

const cy = (bar: Bar): number => bar.y + bar.h / 2;
const line = (x1: number, y1: number, x2: number, y2: number): Line => {
  return { x1, y1, x2, y2, len: Math.hypot(x2 - x1, y2 - y1) };
};

function buildLayout(): Layout {
  const lines: Line[] = [];

  // upstream tiers (8 -> 4 -> 2 -> keystone), each row converging toward the mid-line
  const tier3: Bar[] = Array.from({ length: 8 }, (_, i) => ({ x: 44, y: 60 + i * 56, w: 72, h: 14 }));
  const tier2: Bar[] = Array.from({ length: 4 }, (_, i) => ({ x: 204, y: 150 + i * 84, w: 66, h: 16 }));
  const tier1: Bar[] = [
    { x: 354, y: 250, w: 70, h: 18 },
    { x: 354, y: 332, w: 70, h: 18 }
  ];
  const keystone: Bar = { x: 566, y: MID_Y - 9, w: 68, h: 18 };

  tier3.forEach((b, i) => {
    const t = tier2[Math.floor(i / 2)];
    lines.push(line(b.x + b.w, cy(b), t.x, cy(t)));
  });
  tier2.forEach((b, j) => {
    const t = tier1[Math.floor(j / 2)];
    lines.push(line(b.x + b.w, cy(b), t.x, cy(t)));
  });
  for (const b of tier1) {
    lines.push(line(b.x + b.w, cy(b), keystone.x, cy(keystone)));
  }

  // downstream fan-out: keystone -> 5 hubs -> 15 pills
  const pillH = 26;
  const pillGap = 7;
  const groupGap = 20;
  const groupH = 3 * pillH + 2 * pillGap;
  const totalH = 5 * groupH + 4 * groupGap;
  const startY = MID_Y - totalH / 2;
  const pillX = 1000;
  const pillW = 306;

  const hubs: Bar[] = [];
  const pills: Pill[] = [];
  const groups: { label: string; y: number }[] = [];

  GROUPS.forEach((group, g) => {
    const groupTop = startY + g * (groupH + groupGap);
    const hub: Bar = { x: 812, y: groupTop + groupH / 2 - 8, w: 72, h: 16 };
    hubs.push(hub);
    groups.push({ label: group.label, y: groupTop - 8 });
    lines.push(line(keystone.x + keystone.w, cy(keystone), hub.x, cy(hub)));
    group.items.forEach((label, p) => {
      const pill: Pill = { x: pillX, y: groupTop + p * (pillH + pillGap), w: pillW, h: pillH, label };
      pills.push(pill);
      lines.push(line(hub.x + hub.w, cy(hub), pill.x, cy(pill)));
    });
  });

  return { tier3, tier2, tier1, keystone, hubs, pills, groups, lines };
}

export function KeystoneFlow() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const isNear = useIsNearViewport(wrapRef);
  const layout = useMemo(buildLayout, []);
  const dotRefs = useRef<(SVGCircleElement | null)[]>([]);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const drawTimer = setTimeout(() => {
      setDrawn(true);
    }, 60);
    if (reduceMotion) {
      return () => {
        clearTimeout(drawTimer);
      };
    }

    const progress = layout.lines.map(() => Math.random());
    const speed = 70; // px per second
    let last = 0;
    let raf = 0;
    const frame = (time: number) => {
      raf = requestAnimationFrame(frame);
      const dt = last ? Math.min((time - last) / 1000, 0.05) : 0;
      last = time;
      if (!isNear.current) {
        return;
      }
      layout.lines.forEach((l, i) => {
        progress[i] = (progress[i] + (speed * dt) / l.len) % 1;
        const dot = dotRefs.current[i];
        if (dot) {
          dot.setAttribute("cx", String(l.x1 + (l.x2 - l.x1) * progress[i]));
          dot.setAttribute("cy", String(l.y1 + (l.y2 - l.y1) * progress[i]));
        }
      });
    };
    raf = requestAnimationFrame(frame);

    return () => {
      clearTimeout(drawTimer);
      cancelAnimationFrame(raf);
    };
  }, [isNear, layout]);

  const allBars = [...layout.tier3, ...layout.tier2, ...layout.tier1];

  return (
    <div ref={wrapRef} className="keystone-flow">
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        role="img"
        aria-label="Multi-tier supplier data flows into one Product Connect graph and out to every downstream use case"
      >
        <circle cx={600} cy={MID_Y} r={132} fill="rgba(63,99,221,0.04)" stroke={CIRCLE_STROKE} strokeWidth={1} />

        {layout.lines.map((l) => (
          <line
            key={`l-${l.x1}-${l.y1}-${l.x2}-${l.y2}`}
            x1={l.x1}
            y1={l.y1}
            x2={l.x2}
            y2={l.y2}
            stroke={LINE}
            strokeWidth={1}
            strokeOpacity={0.6}
            style={{
              strokeDasharray: l.len,
              strokeDashoffset: drawn ? 0 : l.len,
              transition: `stroke-dashoffset 700ms ease ${Math.min(l.x1, 300)}ms`
            }}
          />
        ))}

        {allBars.map((b, i) => (
          <rect
            key={`b-${b.x}-${b.y}`}
            x={b.x}
            y={b.y}
            width={b.w}
            height={b.h}
            rx={3}
            fill={i >= layout.tier3.length + layout.tier2.length ? BAR_MED : BAR_LIGHT}
          />
        ))}
        <rect
          x={layout.keystone.x}
          y={layout.keystone.y}
          width={layout.keystone.w}
          height={layout.keystone.h}
          rx={3}
          fill={BAR_MED}
        />
        {layout.hubs.map((b) => (
          <rect key={`h-${b.y}`} x={b.x} y={b.y} width={b.w} height={b.h} rx={3} fill={BAR_MED} />
        ))}

        {layout.pills.map((p) => (
          <g key={`p-${p.label}`}>
            <rect
              x={p.x}
              y={p.y}
              width={p.w}
              height={p.h}
              rx={5}
              fill={PILL_FILL}
              stroke={PILL_STROKE}
              strokeWidth={1}
            />
            <text x={p.x + 14} y={p.y + p.h / 2 + 4} fontSize={13} fill={INK}>
              {p.label}
            </text>
          </g>
        ))}

        {layout.groups.map((grp) => (
          <text
            key={`g-${grp.label}`}
            x={1000}
            y={grp.y}
            fontSize={11}
            fontWeight={700}
            letterSpacing={1.4}
            fill={KICKER}
          >
            {grp.label.toUpperCase()}
          </text>
        ))}

        {!drawn
          ? null
          : layout.lines.map((l, i) => (
              <circle
                key={`d-${l.x1}-${l.y1}-${l.x2}-${l.y2}`}
                ref={(el) => {
                  dotRefs.current[i] = el;
                }}
                r={3}
                fill={DOT}
              />
            ))}

        <text x={600} y={MID_Y + 44} fontSize={13} fontWeight={700} letterSpacing={1.2} textAnchor="middle" fill={INK}>
          PRODUCT CONNECT
        </text>
        <text x={600} y={MID_Y + 64} fontSize={11.5} textAnchor="middle" fill={SUBCAP}>
          Collect data once,
        </text>
        <text x={600} y={MID_Y + 80} fontSize={11.5} textAnchor="middle" fill={SUBCAP}>
          use it everywhere.
        </text>

        <g fontSize={11} fontWeight={700} letterSpacing={1.2} fill={INK} textAnchor="middle">
          <text x={80} y={500}>
            TIER 3 SUPPLIERS
          </text>
          <text x={237} y={500}>
            TIER 2 SUPPLIERS
          </text>
          <text x={389} y={500}>
            TIER 1 SUPPLIERS
          </text>
          <text x={848} y={500}>
            USE ACROSS
          </text>
        </g>
        <g fontSize={12} fill={SUBCAP} textAnchor="middle">
          <text x={80} y={522}>
            Raw material
          </text>
          <text x={80} y={539}>
            data is collected
          </text>
          <text x={237} y={522}>
            Material data
          </text>
          <text x={237} y={539}>
            is collected
          </text>
          <text x={389} y={522}>
            Product data
          </text>
          <text x={389} y={539}>
            is collected
          </text>
          <text x={848} y={522}>
            Every team, report,
          </text>
          <text x={848} y={539}>
            and passport
          </text>
        </g>
      </svg>
    </div>
  );
}
