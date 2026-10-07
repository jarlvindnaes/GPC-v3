import type React from "react";
import { Factory, FileCheck2, Leaf, Route, Wrench } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ReuseChart } from "./ReuseChart";
import { OreThumb } from "./OreThumb";
import { getStoryFrame } from "./productStoryMath";

// Copy follows our "Component-level by design" section: one idea per step of the chair story.
const chapters = [
  {
    label: "The product",
    title: "Upload a product. We find its parts.",
    text: "Upload a 3D model and we detect its components automatically: a leg, a screw, a fabric.",
    points: [
      "Components detected from the 3D model",
      "Work at the component level, not just the finished product",
      "Shared parts recognised across your models",
    ],
  },
  {
    label: "The components",
    title: "Collect component data once.",
    text: "We gather data and calculate LCA per component, not product by product.",
    points: [
      "LCA calculated per component",
      "Suppliers verify the data on their own parts",
      "Every value tagged with its source",
    ],
  },
  {
    label: "The connection",
    title: "Reuse it everywhere.",
    text: "Every product that shares a component inherits its data automatically, with nothing re-typed.",
    points: [
      "Add data once; every product using it updates",
      "Coverage grows with every upload",
      "No re-typing. No re-calculating. No starting over.",
    ],
  },
];

// Labels around the close-up bolt (step 2), in two columns (see FACT_COLUMNS).
// `points` are the small grey bullets under each label's title, taken from copy on our other site
// versions (FeatureGrid, wireframes, NodeFlow, V4 home); packaging is translated from the Danish
// packaging demo. Spare-part sales are flagged "coming this fall" as elsewhere on the site.
const FACTS: {
  key: string;
  text: string;
  extra: boolean;
  points: string[];
}[] = [
  {
    key: "supplier",
    text: "Supplier data",
    extra: false,
    points: [
      "Primary data from the people who make it",
      "Supplier-verified, first-hand data",
      "Provenance tracked on every value",
    ],
  },
  {
    key: "material",
    text: "Material",
    extra: false,
    points: [
      "Origin",
      "Automatic weight calculation",
      "Recycled content",
      "Waste in production",
    ],
  },
  {
    key: "chain",
    text: "Supply chain calculated",
    extra: false,
    points: [
      "Automatic transport distance calculation",
      "Distances, modes and emissions per leg",
      "Trade routes and origins verified",
    ],
  },
  {
    key: "co2",
    text: "Impact data",
    extra: true,
    points: [
      "CO₂ emissions from manufacturing\nand transport",
      "Water consumption",
      "Energy used in manufacturing",
      "And much more",
    ],
  },
  {
    key: "certs",
    text: "Certificates & documents",
    extra: true,
    points: [
      "Certificates & test reports",
      "Eco labels and verification certificates",
      "EPD and DPP documentation",
    ],
  },
  {
    key: "packaging",
    text: "Packaging",
    extra: true,
    points: [
      "Each packaging material registered",
      "Weight per product",
      "Included in the product’s impact",
    ],
  },
  {
    key: "spare",
    text: "Spare part available",
    extra: true,
    points: [
      "Matched to the exact product",
      "Care and repair information",
      "Spare part sales: coming this fall",
    ],
  },
];

// Desktop label layout: a left and a right column, each aligned to its own edge, with equal gaps
// between the labels (measured from their closed sizes, so a label opening doesn't push the others).
// Material and Packaging head their columns at the same height; Certificates sits centred on the
// bottom line, below both columns (the columns end one gap above it).
const FACT_COLUMNS = {
  left: ["material", "spare", "chain"],
  right: ["packaging", "co2", "supplier"],
  center: ["certs"],
};
const COLUMN_TOP = 0.12; // fractions of the viewer height (clears the model pill at the top)
const COLUMN_BOTTOM = 0.1; // leaves room for the "Hover the cards" hint
const COLUMN_SIDE = 0.04; // fraction of the viewer width
const COLUMN_GAP = 0.05; // space between the columns and Certificates below them (viewer height)

// Icons for the labels without a 3D thumbnail (Material and Packaging show a model instead).
const FACT_ICONS: Record<string, typeof Factory> = {
  supplier: Factory,
  chain: Route,
  co2: Leaf,
  certs: FileCheck2,
  spare: Wrench,
};

export default function ProductStory({ base }: { base: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const modeRef = useRef<"scroll" | "manual" | "play">("scroll");
  const reducedRef = useRef(false);
  const [progress, setProgress] = useState(0);
  const [mode, setMode] = useState<"scroll" | "manual" | "play">("scroll");
  const [status, setStatus] = useState("Loading the product model…");
  const [ready, setReady] = useState(false);
  const { chapter, separation } = getStoryFrame(progress);
  // Labels around the screw while it is centre stage (step 2, fully apart); gone again in step 3.
  const showFacts = chapter === 1 && separation > 0.85;
  const factsRef = useRef<HTMLDivElement>(null);
  // Measure each label's bullet list at its natural size, so the open animation runs exactly to it
  // (one smooth motion instead of overshooting a fixed max and "settling"). Re-measured on resize.
  useEffect(() => {
    const box = factsRef.current;
    if (!box) {
      return;
    }
    const layout = () => {
      const desktop = window.matchMedia("(min-width: 701px)").matches;
      const H = box.clientHeight;
      const W = box.clientWidth;
      const find = (key: string) => box.querySelector<HTMLElement>(`[data-fact="${key}"]`);
      const column = (keys: string[]) => keys.map(find).filter((el): el is HTMLElement => el !== null);
      const left = column(FACT_COLUMNS.left);
      const right = column(FACT_COLUMNS.right);
      const center = column(FACT_COLUMNS.center);
      const all = [...left, ...right, ...center];
      if (!desktop) {
        // Phones keep their own stylesheet positions.
        for (const el of all) {
          for (const prop of ["top", "left", "right", "bottom", "scale", "transform-origin"]) {
            el.style.removeProperty(prop);
          }
        }
        return;
      }
      // On a narrow viewer the two columns would collide: shrink every label by the same factor until
      // the widest row (left label + right label + margins) fits. Sizes below are the unscaled ones.
      const side = W * COLUMN_SIDE;
      let widestRow = 0;
      for (let i = 0; i < Math.max(left.length, right.length); i++) {
        widestRow = Math.max(widestRow, (left[i]?.offsetWidth ?? 0) + (right[i]?.offsetWidth ?? 0));
      }
      const k = Math.min(1, (W - side * 2 - 16) / Math.max(1, widestRow));
      const certs = center[0];
      const certsH = certs ? certs.offsetHeight * k : 0;
      const columnsBottom = H * (1 - COLUMN_BOTTOM) - (certs ? certsH + H * COLUMN_GAP : 0);
      const place = (el: HTMLElement, y: number, x: "left" | "right" | "center") => {
        el.style.top = `${Math.round(y)}px`;
        el.style.bottom = "auto";
        el.style.left =
          x === "left" ? `${Math.round(side)}px` : x === "center" ? `${Math.round((W - el.offsetWidth) / 2)}px` : "auto";
        el.style.right = x === "right" ? `${Math.round(side)}px` : "auto";
        if (k < 1) {
          el.style.scale = String(k);
          el.style.transformOrigin = x === "left" ? "0 0" : x === "right" ? "100% 0" : "50% 0";
        } else {
          el.style.removeProperty("scale");
          el.style.removeProperty("transform-origin");
        }
      };
      for (const [labels, x] of [
        [left, "left"],
        [right, "right"],
      ] as const) {
        const heights = labels.map((el) => el.offsetHeight * k);
        const top = H * COLUMN_TOP;
        const avail = columnsBottom - top;
        const gap =
          labels.length > 1 ? (avail - heights.reduce((a, b) => a + b, 0)) / (labels.length - 1) : 0;
        let y = top;
        labels.forEach((el, i) => {
          place(el, y, x);
          y += heights[i] + gap;
        });
      }
      if (certs) {
        place(certs, H * (1 - COLUMN_BOTTOM) - certsH, "center");
      }
    };
    const measure = () => {
      for (const label of box.querySelectorAll<HTMLElement>(".screw-fact")) {
        measureFact(label);
      }
      layout();
    };
    measure();
    // Web fonts can arrive after the first measure and change the text width.
    document.fonts?.ready.then(measure).catch(() => {});
    const resize = new ResizeObserver(measure);
    resize.observe(box);
    return () => resize.disconnect();
  }, []);
  // Labels can be dragged around inside the viewer. Offsets are kept for the visit, applied through
  // --dx/--dy so the fade-in still works.
  const dragRef = useRef<{
    el: HTMLElement;
    x: number;
    y: number;
    dx: number;
    dy: number;
  } | null>(null);
  const onFactDown = (event: React.PointerEvent<HTMLElement>) => {
    const el = event.currentTarget;
    measureFact(el);
    try {
      el.setPointerCapture(event.pointerId);
    } catch {
      // Pointer already released (e.g. a synthetic event); dragging still works while over the label.
    }
    el.classList.add("is-dragging");
    dragRef.current = {
      el,
      x: event.clientX,
      y: event.clientY,
      dx: Number.parseFloat(el.style.getPropertyValue("--dx")) || 0,
      dy: Number.parseFloat(el.style.getPropertyValue("--dy")) || 0,
    };
    event.stopPropagation();
  };
  const onFactMove = (event: React.PointerEvent<HTMLElement>) => {
    const drag = dragRef.current;
    const box = factsRef.current;
    if (!drag || !box || drag.el !== event.currentTarget) {
      return;
    }
    // Keep the label inside the viewer.
    const b = box.getBoundingClientRect();
    const r = drag.el.getBoundingClientRect();
    const curDx =
      Number.parseFloat(drag.el.style.getPropertyValue("--dx")) || 0;
    const curDy =
      Number.parseFloat(drag.el.style.getPropertyValue("--dy")) || 0;
    const baseLeft = r.left - curDx;
    const baseTop = r.top - curDy;
    const dx = Math.min(
      Math.max(drag.dx + event.clientX - drag.x, b.left - baseLeft),
      b.right - r.width - baseLeft,
    );
    const dy = Math.min(
      Math.max(drag.dy + event.clientY - drag.y, b.top - baseTop),
      b.bottom - r.height - baseTop,
    );
    drag.el.style.setProperty("--dx", `${dx}px`);
    drag.el.style.setProperty("--dy", `${dy}px`);
  };
  const onFactUp = (event: React.PointerEvent<HTMLElement>) => {
    const el = event.currentTarget;
    const drag = dragRef.current;
    el.classList.remove("is-dragging");
    dragRef.current = null;
    // A click/tap (no real drag) opens this label's bullets and closes any other open one.
    if (
      event.type === "pointerup" &&
      drag &&
      Math.hypot(event.clientX - drag.x, event.clientY - drag.y) < 4
    ) {
      const open = !el.classList.contains("is-open");
      for (const other of factsRef.current?.querySelectorAll(
        ".screw-fact.is-open",
      ) ?? []) {
        other.classList.remove("is-open");
      }
      el.classList.toggle("is-open", open);
    }
  };
  const current = chapters[chapter];

  useEffect(() => {
    const host = hostRef.current;
    const section = sectionRef.current;
    if (!host || !section) {
      return;
    }
    let cancelled = false;
    let cleanup: (() => void) | undefined;
    let uiElapsed = 0;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onPreference = () => {
      reducedRef.current = media.matches;
      if (media.matches) {
        modeRef.current = "manual";
        setMode("manual");
      }
    };
    onPreference();
    media.addEventListener("change", onPreference);
    const scroll = () => {
      if (modeRef.current !== "scroll" || reducedRef.current) {
        return;
      }
      const rect = section.getBoundingClientRect();
      const travel = Math.max(1, rect.height - window.innerHeight);
      progressRef.current = Math.max(0, Math.min(1, -rect.top / travel));
    };
    window.addEventListener("scroll", scroll, { passive: true });
    scroll();
    // Our exploding chair (copied from the hero, then tweaked for the story); Jarl's original scene
    // stays in productStoryScene.ts.
    import("./chairStoryScene")
      .then(async ({ createChairStoryScene }) => {
        if (cancelled) {
          return;
        }
        cleanup = await createChairStoryScene(
          host,
          base,
          () => progressRef.current,
          (dt) => {
            if (modeRef.current === "play") {
              progressRef.current = Math.min(1, progressRef.current + dt / 15);
              if (progressRef.current === 1) {
                modeRef.current = "manual";
                setMode("manual");
              }
            }
            uiElapsed += dt;
            if (uiElapsed > 0.05) {
              setProgress(progressRef.current);
              uiElapsed = 0;
            }
          },
          () => {
            if (!cancelled) {
              setReady(true);
              setStatus("");
            }
          },
          () => {
            if (!cancelled) {
              setReady(false);
              setStatus(
                "The 3D view is unavailable. You can still explore the component story below.",
              );
            }
          },
          () => cancelled,
          () => reducedRef.current,
          undefined, // no leader lines from the labels to the bolt
          "soft", // the passport's Soft Lounge Chair; "cross" brings back the Cross Chair
        );
        if (cancelled) {
          cleanup?.();
        }
      })
      .catch(() => {
        if (!cancelled) {
          setStatus(
            "The 3D view is unavailable. Explore the component story below.",
          );
        }
      });
    return () => {
      cancelled = true;
      cleanup?.();
      window.removeEventListener("scroll", scroll);
      media.removeEventListener("change", onPreference);
    };
  }, [base]);

  // Slider and tabs stay in sync with scrolling: seeking scrolls the page to the matching point in
  // the (sticky) section, so the user can mix scrolling and dragging freely. With reduced motion the
  // story is driven by the controls only.
  const seek = (value: number, behavior: ScrollBehavior = "instant") => {
    progressRef.current = value;
    setProgress(value);
    const section = sectionRef.current;
    if (reducedRef.current || !section) {
      modeRef.current = "manual";
      setMode("manual");
      return;
    }
    const top = window.scrollY + section.getBoundingClientRect().top;
    const travel = Math.max(1, section.offsetHeight - window.innerHeight);
    window.scrollTo({ top: top + value * travel, behavior });
  };

  return (
    <section
      className="product-story"
      id="inside"
      ref={sectionRef}
      aria-labelledby="inside-heading"
    >
      <div className="story-sticky">
        <div className="story-layout">
          <div className="story-visual">
            <p className="eyebrow">COMPONENT-LEVEL BY DESIGN</p>
            <div className="story-viewer">
              <div className="story-viewer-top">
                <span
                  className={`viewer-pill ${separation > 0.2 ? "is-components" : "is-assembled"}`}
                  aria-live="polite"
                >
                  <i aria-hidden="true" />
                  Soft Lounge Chair /{" "}
                  <b>
                    {separation > 0.2 ? "Component view" : "Assembled view"}
                  </b>
                </span>
              </div>
              <div
                className="story-canvas"
                ref={hostRef}
                role="img"
                aria-label="Interactive Soft Lounge Chair model separating into its leather seat, shells, legs, rails, armrests and bolts, then assembling again"
              />
              {!ready && <output className="story-loading">{status}</output>}
              <div
                className={`screw-facts${showFacts ? " is-on" : ""}`}
                aria-hidden={!showFacts}
                ref={factsRef}
              >
                <p
                  className={`facts-hint in-viewer${showFacts ? " is-on" : ""}`}
                  aria-hidden="true"
                >
                  <span className="hint-hover">
                    Hover the cards for more information
                  </span>
                  <span className="hint-touch">
                    Tap the cards for more information
                  </span>
                </p>
                {FACTS.map((fact) => (
                  <span
                    key={fact.key}
                    data-fact={fact.key}
                    className={`screw-fact fact-${fact.key}${fact.extra ? " is-extra" : ""}`}
                    onPointerEnter={(event) => measureFact(event.currentTarget)}
                    onPointerDown={onFactDown}
                    onPointerMove={onFactMove}
                    onPointerUp={onFactUp}
                    onPointerCancel={onFactUp}
                  >
                    {fact.key === "material" ? (
                      <OreThumb base={base} active={showFacts} />
                    ) : fact.key === "packaging" ? (
                      <OreThumb
                        base={base}
                        active={showFacts}
                        model="models/cardboard-box-open.glb"
                      />
                    ) : (
                      <FactIcon kind={fact.key} />
                    )}
                    <span className="fact-body">
                      <b>{fact.text}</b>
                      {fact.points.length > 0 && (
                        <ul>
                          {fact.points.map((point) => (
                            <li key={point}>{point}</li>
                          ))}
                        </ul>
                      )}
                    </span>
                  </span>
                ))}
              </div>
              {/* Hidden for now: in the component step the camera is close on a screw and the legend would cover it. */}
              <div
                className="part-legend"
                style={{ opacity: 0 }}
                aria-hidden={true}
              >
                <span>
                  <b>01</b> Seat + back
                </span>
                <span>
                  <b>02</b> Structure
                </span>
                <span>
                  <b>03</b> Fixings
                </span>
              </div>
            </div>
          </div>
          <div className="story-narrative">
            {/* "Scroll to explore", the chapter tabs, and the line under them is the slider: it fills
                up as the story progresses and can be dragged or clicked. */}
            <div className="chapter-nav">
              <span className="chapter-hint">
                {mode === "scroll"
                  ? "Scroll to explore"
                  : "You control the story"}
              </span>
              <fieldset
                className="chapter-tabs"
                aria-label="Product story chapters"
              >
                {chapters.map((item, index) => (
                  <button
                    key={item.label}
                    type="button"
                    className={chapter === index ? "selected" : ""}
                    aria-pressed={chapter === index}
                    onClick={() => seek([0, 0.52, 1][index], "smooth")}
                  >
                    <span>0{index + 1}</span>
                    {item.label}
                  </button>
                ))}
              </fieldset>
              <input
                id="assembly-progress"
                aria-label="Product story progress: product, components, connected product"
                className="chapter-progress"
                type="range"
                min="0"
                max="100"
                value={Math.round(progress * 100)}
                style={{ "--p": `${progress * 100}%` } as React.CSSProperties}
                onChange={(event) => seek(Number(event.target.value) / 100)}
                aria-valuetext={`${current.label}, ${Math.round(progress * 100)} percent of story`}
              />
            </div>
            <div className="chapter-copy">
              <h2 id="inside-heading">{current.title}</h2>
              <p>{current.text}</p>
            </div>
            <ul className="chapter-points">
              {current.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            {chapter === 2 && <ReuseChart />}
            <p
              className={`facts-hint${showFacts ? " is-on" : ""}`}
              aria-hidden={!showFacts}
            >
              <span className="hint-hover">
                Hover the cards for more information
              </span>
              <span className="hint-touch">
                Tap the cards for more information
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// Natural size of a label's bullet list, used as the open-animation target. Measured on load, on
// resize, and again right before the label opens, so the card always fits its current text.
function measureFact(label: HTMLElement) {
  const list = label.querySelector<HTMLElement>(".fact-body ul");
  if (!list) {
    return;
  }
  list.style.setProperty("--open-w", `${list.scrollWidth}px`);
  list.style.setProperty("--open-h", `${list.scrollHeight}px`);
}

function FactIcon({ kind }: { kind: string }) {
  const Icon = FACT_ICONS[kind];
  return (
    <span className="fact-icon" aria-hidden="true">
      {Icon ? <Icon size={15} strokeWidth={2} /> : null}
    </span>
  );
}
