// The homepage hero: the Soft Lounge Chair floating in pieces, slowly turning, with a few thin callouts that follow
// their parts. While the chair is apart, each callout names the part and where its data lives today (a spreadsheet,
// an email, the ERP, a certificate PDF: the mess); as the parts come back together, the callouts resolve into the
// part's actual data, then fade as the chair closes up. Loads only at desktop widths (the `media` query), like the
// How it works hero; phones get the copy alone.
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import type { ExplodingChair as Chair } from "./ExplodingChair";

const ExplodingChair = lazy(() => import("./ExplodingChair").then((m) => ({ default: m.ExplodingChair })));

interface Callout {
  key: string;
  prefix: string; // the model piece it follows (first piece whose name starts with this)
  part: string;
  system: string; // where the data lives today
  source: string; // the mess: the file, mail or record it is in
  value: string; // the resolved data (as the passport has it)
  side: 1 | -1; // label to the right (1) or left (-1) of the part
  dx: number; // label offset from the part, px
  dy: number;
}

// Values as the passport lists them (dppProductData.ts); the sources are illustrative.
const CALLOUTS: Callout[] = [
  { key: "seat", prefix: "Leather seat", part: "Seat", system: "Email", source: "Re: Fwd: foam density?", value: "Leather / HR foam · 1.4 kg", side: -1, dx: 90, dy: -64 },
  { key: "back", prefix: "Shell back", part: "Back shell", system: "ERP", source: "item 4471 · chair, oak", value: "Moulded oak veneer · 1.2 kg", side: 1, dx: 90, dy: -46 },
  { key: "arm", prefix: "Armrest right", part: "Armrest", system: "Spreadsheet", source: "supplier_prices_v7.xlsx", value: "Solid oak · 0.5 kg", side: 1, dx: 90, dy: 30 },
  { key: "leg", prefix: "Front leg left", part: "Front leg", system: "PDF", source: "FSC_cert_2023.pdf", value: "Solid oak · FSC · 0.6 kg", side: -1, dx: 90, dy: 64 },
  { key: "bolt", prefix: "Connector bolt left front", part: "Connector bolt", system: "CSV", source: "BOM_old.csv", value: "Steel", side: -1, dx: 90, dy: -10 },
];

const MEDIA = "(min-width: 721px)";
const NARROW = "(max-width: 1150px)"; // tablets: the chair smaller and further right, clear of the copy

export function HeroChairScene() {
  const [active, setActive] = useState(() => typeof window !== "undefined" && window.matchMedia(MEDIA).matches);
  const [narrow, setNarrow] = useState(() => typeof window !== "undefined" && window.matchMedia(NARROW).matches);
  useEffect(() => {
    const query = window.matchMedia(MEDIA), narrowQuery = window.matchMedia(NARROW);
    const onChange = () => setActive(query.matches);
    const onNarrow = () => setNarrow(narrowQuery.matches);
    query.addEventListener("change", onChange);
    narrowQuery.addEventListener("change", onNarrow);
    return () => { query.removeEventListener("change", onChange); narrowQuery.removeEventListener("change", onNarrow); };
  }, []);

  const rootRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef(new Map<string, HTMLDivElement>());
  const lineRefs = useRef(new Map<string, SVGLineElement>());
  const dotRefs = useRef(new Map<string, SVGCircleElement>());
  const stateRef = useRef("");

  const onFrame = useCallback(({ progress, parts }: { progress: number; parts: { name: string; x: number; y: number; z: number }[] }) => {
    const root = rootRef.current;
    if (!root) return;
    // apart: the sources; coming together: the data; closed up: nothing
    const state = progress > 0.62 ? "raw" : progress > 0.3 ? "resolved" : "hidden";
    if (state !== stateRef.current) {
      stateRef.current = state;
      root.dataset.callouts = state;
    }
    if (state === "hidden") return;
    const w = root.clientWidth, h = root.clientHeight;
    // the chair's extent on screen, so labels always sit clear of it
    let chairLeft = Infinity, chairRight = -Infinity;
    for (const p of parts) { if (p.x < chairLeft) chairLeft = p.x; if (p.x > chairRight) chairRight = p.x; }
    chairLeft -= 70; chairRight += 70;
    // and the copy's: labels on the left never run into the headline
    const copy = document.querySelector(".hero-space .hero-editorial")?.getBoundingClientRect();
    const copyRight = copy ? copy.right - root.getBoundingClientRect().left + 20 : 0;
    const placed: { c: Callout; part: { x: number; y: number }; label: HTMLDivElement; lx: number; ly: number; lw: number; lh: number }[] = [];
    for (const c of CALLOUTS) {
      const part = parts.find((p) => p.name.startsWith(c.prefix));
      const label = labelRefs.current.get(c.key);
      if (!part || !label) continue;
      // the label sits a little way off its part, clear of the chair where there is room, inside the stage
      const lw = label.offsetWidth, lh = label.offsetHeight;
      let lx = c.side > 0 ? Math.max(part.x + c.dx, chairRight + 18) : Math.min(part.x - c.dx, chairLeft - 18) - lw;
      if (c.side < 0) lx = Math.max(lx, copyRight);
      let ly = part.y + c.dy - lh / 2;
      lx = Math.min(Math.max(lx, 12), w - lw - 12);
      ly = Math.min(Math.max(ly, 12), h - lh - 12);
      placed.push({ c, part, label, lx, ly, lw, lh });
    }
    // labels on one side never overlap: lower ones move down
    for (const side of [1, -1]) {
      const column = placed.filter((p) => p.c.side === side).sort((a, b) => a.ly - b.ly);
      for (let i = 1; i < column.length; i++) column[i].ly = Math.max(column[i].ly, column[i - 1].ly + column[i - 1].lh + 8);
    }
    for (const { c, part, label, lx, ly, lw } of placed) {
      const line = lineRefs.current.get(c.key), dot = dotRefs.current.get(c.key);
      if (!line || !dot) continue;
      label.style.transform = `translate(${lx.toFixed(1)}px, ${ly.toFixed(1)}px)`;
      // the leader runs from the part to the label's near edge, at its first line
      const ex = c.side > 0 ? lx : lx + lw;
      const ey = ly + 13;
      line.setAttribute("x1", part.x.toFixed(1));
      line.setAttribute("y1", part.y.toFixed(1));
      line.setAttribute("x2", ex.toFixed(1));
      line.setAttribute("y2", ey.toFixed(1));
      dot.setAttribute("cx", part.x.toFixed(1));
      dot.setAttribute("cy", part.y.toFixed(1));
    }
  }, []);

  if (!active) return null;
  return (
    <div className="hero-space-scene" ref={rootRef} data-callouts="hidden">
      <Suspense fallback={null}>
        <ExplodingChair
          variant="soft"
          framePad={narrow ? 1.22 : 1.02}
          autoRotate
          offsetX={narrow ? 0.3 : 0.21}
          offsetY={0.03}
          explodeAmount={0.2}
          view={[0.8, 0.32, 1]}
          depthOfField={0.006}
          restApart
          holdSeconds={7}
          onFrame={onFrame}
        />
      </Suspense>
      <svg className="hero-callout-lines" aria-hidden="true">
        {CALLOUTS.map((c) => (
          <g key={c.key}>
            <line ref={(el) => { if (el) lineRefs.current.set(c.key, el); }} />
            <circle r="2.5" ref={(el) => { if (el) dotRefs.current.set(c.key, el); }} />
          </g>
        ))}
      </svg>
      {CALLOUTS.map((c) => (
        <div key={c.key} className="hero-callout" data-side={c.side > 0 ? "right" : "left"} ref={(el) => { if (el) labelRefs.current.set(c.key, el); }} aria-hidden="true">
          <span className="hc-part">{c.part}</span>
          <span className="hc-raw"><b>{c.system}</b>{c.source}</span>
          <span className="hc-value">{c.value}</span>
        </div>
      ))}
    </div>
  );
}
