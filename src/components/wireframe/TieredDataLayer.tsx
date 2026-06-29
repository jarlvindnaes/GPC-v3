import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  Box,
  ChartColumn,
  ClipboardList,
  Database,
  FileCheck,
  Leaf,
  Network,
  Ship,
  ShoppingCart
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { useIsNearViewport } from "../../utilities/useIsNearViewport";

// Variant 3 of the "data layer" diagram: a dark-mode mix of the engine (icon-labelled Data in / Value out
// around the Product Connect core) and the Keystone funnel (which illustrates "Multi-tier supplier data"
// well). The funnel feeds the multi-tier input; the other inputs stay as icon chips. Yellow pulses flow in
// (suppliers + inputs -> core), green pulses flow out (core -> value). One fixed-viewBox SVG; icons live in
// foreignObject so they stay crisp and aligned. Pauses off-screen, static under reduced motion.

const VB_W = 1320;
const VB_H = 520;
const MID_Y = 260;

const YELLOW = "#f2b43c";
const GREEN = "#41c98a";
const BAR_LIGHT = "#aebde6";
const BAR_BRIGHT = "#9db4ff";
const ICON = "#9db4ff";
const BASE = import.meta.env.BASE_URL;

interface Bar {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface Chip {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  icon: LucideIcon;
}

interface Flow {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  len: number;
  color: string;
}

const DATA_IN: { label: string; icon: LucideIcon }[] = [
  { label: "ERP / PLM / PIM systems", icon: Database },
  { label: "3D / CAD across product lines", icon: Box },
  { label: "Multi-tier supplier data", icon: Network },
  { label: "Bills of materials & materials", icon: ClipboardList },
  { label: "Certificates & test reports", icon: FileCheck }
];
const VALUE_OUT: { label: string; icon: LucideIcon }[] = [
  { label: "Component-level LCA at scale", icon: Leaf },
  { label: "GHG accounting & ESG reporting", icon: ChartColumn },
  { label: "ERP-minted, verified EPDs & DPPs", icon: BadgeCheck },
  { label: "Spare-parts commerce", icon: ShoppingCart },
  { label: "CBAM & customs reporting", icon: Ship }
];

const cy = (b: Bar): number => b.y + b.h / 2;
const flow = (x1: number, y1: number, x2: number, y2: number, color: string): Flow => {
  return { x1, y1, x2, y2, len: Math.hypot(x2 - x1, y2 - y1), color };
};

interface Layout {
  funnelBars: Bar[];
  inChips: Chip[];
  outChips: Chip[];
  core: Bar;
  flows: Flow[];
  funnelLabelY: number;
}

function buildLayout(): Layout {
  const flows: Flow[] = [];
  const chipW = 250;
  const chipH = 40;
  const rowGap = 16;
  const total = DATA_IN.length * chipH + (DATA_IN.length - 1) * rowGap;
  const startY = MID_Y - total / 2;

  const inChips: Chip[] = DATA_IN.map((d, i) => ({
    x: 300,
    y: startY + i * (chipH + rowGap),
    w: chipW,
    h: chipH,
    label: d.label,
    icon: d.icon
  }));
  const outChips: Chip[] = VALUE_OUT.map((d, i) => ({
    x: 880,
    y: startY + i * (chipH + rowGap),
    w: chipW,
    h: chipH,
    label: d.label,
    icon: d.icon
  }));
  const core: Bar = { x: 640, y: MID_Y - 78, w: 150, h: 156 };
  const multiTier = inChips[2];

  // funnel feeding the multi-tier chip: 6 -> 3 -> 1 -> chip
  const tier3: Bar[] = Array.from({ length: 6 }, (_, i) => ({ x: 20, y: 150 + i * 44, w: 46, h: 11 }));
  const tier2: Bar[] = Array.from({ length: 3 }, (_, i) => ({ x: 120, y: 190 + i * 70, w: 44, h: 12 }));
  const tier1: Bar = { x: 214, y: MID_Y - 7, w: 48, h: 14 };
  tier3.forEach((b, i) => {
    flows.push(flow(b.x + b.w, cy(b), tier2[Math.floor(i / 2)].x, cy(tier2[Math.floor(i / 2)]), YELLOW));
  });
  for (const b of tier2) {
    flows.push(flow(b.x + b.w, cy(b), tier1.x, cy(tier1), YELLOW));
  }
  flows.push(flow(tier1.x + tier1.w, cy(tier1), multiTier.x, cy(multiTier), YELLOW));

  // inputs -> core (spread across the core's left edge), core -> outputs (spread across the right edge)
  inChips.forEach((c, i) => {
    const yEnd = core.y + ((i + 0.5) / inChips.length) * core.h;
    flows.push(flow(c.x + c.w, cy(c), core.x, yEnd, YELLOW));
  });
  outChips.forEach((c, i) => {
    const yStart = core.y + ((i + 0.5) / outChips.length) * core.h;
    flows.push(flow(core.x + core.w, yStart, c.x, cy(c), GREEN));
  });

  return {
    funnelBars: [...tier3, ...tier2, tier1],
    inChips,
    outChips,
    core,
    flows,
    funnelLabelY: 150 + 6 * 44 + 6
  };
}

function ChipBox({ chip }: { chip: Chip }) {
  const Icon = chip.icon;
  return (
    <foreignObject x={chip.x} y={chip.y} width={chip.w} height={chip.h}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          height: "100%",
          padding: "0 14px",
          boxSizing: "border-box",
          background: "#1a2040",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: "10px",
          color: "#eef1fb",
          fontSize: "14px",
          lineHeight: 1.2
        }}
      >
        <Icon size={18} color={ICON} style={{ flex: "none" }} aria-hidden={true} />
        <span>{chip.label}</span>
      </div>
    </foreignObject>
  );
}

export function TieredDataLayer() {
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

    const progress = layout.flows.map(() => Math.random());
    const speed = 70;
    let last = 0;
    let raf = 0;
    const frame = (time: number) => {
      raf = requestAnimationFrame(frame);
      const dt = last ? Math.min((time - last) / 1000, 0.05) : 0;
      last = time;
      if (!isNear.current) {
        return;
      }
      layout.flows.forEach((f, i) => {
        progress[i] = (progress[i] + (speed * dt) / f.len) % 1;
        const dot = dotRefs.current[i];
        if (dot) {
          dot.setAttribute("cx", String(f.x1 + (f.x2 - f.x1) * progress[i]));
          dot.setAttribute("cy", String(f.y1 + (f.y2 - f.y1) * progress[i]));
        }
      });
    };
    raf = requestAnimationFrame(frame);
    return () => {
      clearTimeout(drawTimer);
      cancelAnimationFrame(raf);
    };
  }, [isNear, layout]);

  return (
    <div ref={wrapRef} className="tiered-data-layer">
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        role="img"
        aria-label="Multi-tier supplier data and other inputs feed the Product Connect graph, which outputs every report and passport"
      >
        {layout.flows.map((f) => (
          <line
            key={`f-${f.x1}-${f.y1}-${f.x2}-${f.y2}`}
            x1={f.x1}
            y1={f.y1}
            x2={f.x2}
            y2={f.y2}
            stroke={f.color}
            strokeWidth={1.4}
            strokeOpacity={0.42}
            style={{
              strokeDasharray: f.len,
              strokeDashoffset: drawn ? 0 : f.len,
              transition: `stroke-dashoffset 700ms ease ${Math.min(f.x1, 320)}ms`
            }}
          />
        ))}

        {layout.funnelBars.map((b, i) => (
          <rect
            key={`fb-${b.x}-${b.y}`}
            x={b.x}
            y={b.y}
            width={b.w}
            height={b.h}
            rx={2.5}
            fill={i === layout.funnelBars.length - 1 ? BAR_BRIGHT : BAR_LIGHT}
          />
        ))}

        {layout.inChips.map((c) => (
          <ChipBox key={`in-${c.label}`} chip={c} />
        ))}
        {layout.outChips.map((c) => (
          <ChipBox key={`out-${c.label}`} chip={c} />
        ))}

        <foreignObject x={layout.core.x} y={layout.core.y} width={layout.core.w} height={layout.core.h}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              boxSizing: "border-box",
              padding: "18px 12px",
              textAlign: "center",
              background: "#1a2040",
              border: "1px solid rgba(255,255,255,0.14)",
              borderRadius: "14px"
            }}
          >
            <span
              style={{
                width: "42px",
                height: "42px",
                marginBottom: "12px",
                backgroundColor: "#fff",
                WebkitMask: `url(${BASE}wireframes/logo.svg) center / contain no-repeat`,
                mask: `url(${BASE}wireframes/logo.svg) center / contain no-repeat`
              }}
            />
            <b style={{ color: "#eef1fb", fontSize: "13px", letterSpacing: "0.06em" }}>PRODUCT CONNECT</b>
            <span style={{ color: "#aab2cf", fontSize: "11.5px", marginTop: "5px", lineHeight: 1.3 }}>
              one product graph, every SKU
            </span>
          </div>
        </foreignObject>

        {drawn
          ? layout.flows.map((f, i) => (
              <circle
                key={`d-${f.x1}-${f.y1}-${f.x2}-${f.y2}`}
                ref={(el) => {
                  dotRefs.current[i] = el;
                }}
                r={3.4}
                fill={f.color}
              />
            ))
          : null}

        <g fontSize={11} fontWeight={700} letterSpacing={1.4} fill="#aab2cf" textAnchor="middle">
          <text x={425} y={96}>
            DATA IN
          </text>
          <text x={1005} y={96}>
            VALUE OUT
          </text>
          <text x={92} y={layout.funnelLabelY} fontSize={9.5} fill="#8794b5">
            MULTI-TIER SUPPLIERS
          </text>
        </g>
      </svg>
    </div>
  );
}
