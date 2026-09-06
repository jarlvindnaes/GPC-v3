import { useEffect, useRef, useState } from "react";
import { getStoryFrame } from "./productStoryMath";

const chapters = [
  {
    label: "The product",
    title: "More than meets the eye.",
    text: "A chair is the sum of many decisions. Its shape is visible. The knowledge behind it should be, too.",
    details: [
      ["Product", "Cross Chair"],
      ["Structure", "13 modelled parts"],
      ["Explore", "Drag to turn the chair"]
    ]
  },
  {
    label: "The components",
    title: "Every part has a story.",
    text: "A seat. A back. A fixing. Connect each component to its materials, its source and the data behind its impact.",
    details: [
      ["01 / Seat & back", "Materials + manufacturing"],
      ["02 / Frame & legs", "Origin + shared components"],
      ["03 / Fixings", "Assembly + repair"]
    ]
  },
  {
    label: "The connection",
    title: "One product. All its knowledge.",
    text: "Bring the parts back together. Their information stays connected — ready for carbon calculations, product passports and the next chapter of the product’s life.",
    details: [
      ["Understand", "Carbon footprint"],
      ["Communicate", "Digital Product Passport"],
      ["Keep in use", "Care + repair knowledge"]
    ]
  }
];

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
    import("./productStoryScene")
      .then(async ({ createProductScene }) => {
        if (cancelled) {
          return;
        }
        cleanup = await createProductScene(
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
              setStatus("The 3D view is unavailable. You can still explore the component story below.");
            }
          },
          () => cancelled,
          () => reducedRef.current
        );
        if (cancelled) {
          cleanup?.();
        }
      })
      .catch(() => {
        if (!cancelled) {
          setStatus("The 3D view is unavailable. Explore the component story below.");
        }
      });
    return () => {
      cancelled = true;
      cleanup?.();
      window.removeEventListener("scroll", scroll);
      media.removeEventListener("change", onPreference);
    };
  }, [base]);

  const seek = (value: number) => {
    modeRef.current = "manual";
    setMode("manual");
    progressRef.current = value;
    setProgress(value);
  };
  const togglePlay = () => {
    if (modeRef.current === "play") {
      modeRef.current = "manual";
      setMode("manual");
      return;
    }
    if (progressRef.current >= 0.98) {
      progressRef.current = 0;
    }
    modeRef.current = "play";
    setMode("play");
  };

  return (
    <section className="product-story" id="inside" ref={sectionRef} aria-labelledby="inside-heading">
      <div className="story-sticky">
        <div className="story-heading">
          <p className="eyebrow">
            <span className="signal-mark" aria-hidden="true">
              ✳
            </span>{" "}
            THE INTELLIGENCE INSIDE
          </p>
          <span className="story-edition">INTERACTIVE PRODUCT STUDY / 001</span>
        </div>
        <div className="story-layout">
          <div className="story-viewer">
            <div className="story-viewer-top">
              <span>Cross Chair / Component study</span>
              <span className="viewer-state">{separation > 0.2 ? "COMPONENT VIEW" : "ASSEMBLED VIEW"}</span>
            </div>
            <div
              className="story-canvas"
              ref={hostRef}
              role="img"
              aria-label="Interactive Cross Chair model separating into its seat, back, legs, support and fixings, then assembling again"
            />
            {!ready && <output className="story-loading">{status}</output>}
            <div className="part-legend" style={{ opacity: separation > 0.5 ? 1 : 0 }} aria-hidden={separation <= 0.5}>
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
            <div className="viewer-bottom">
              <span>3D study · Supplied product model</span>
              <span>↔ Drag to rotate</span>
            </div>
          </div>
          <div className="story-narrative">
            <fieldset className="chapter-tabs" aria-label="Product story chapters">
              {chapters.map((item, index) => (
                <button
                  key={item.label}
                  type="button"
                  className={chapter === index ? "selected" : ""}
                  aria-pressed={chapter === index}
                  onClick={() => seek([0, 0.52, 1][index])}
                >
                  <span>0{index + 1}</span>
                  {item.label}
                </button>
              ))}
            </fieldset>
            <div className="chapter-copy">
              <p className="chapter-kicker">
                0{chapter + 1} / {current.label}
              </p>
              <h2 id="inside-heading">{current.title}</h2>
              <p>{current.text}</p>
            </div>
            <dl className="chapter-data">
              {current.details.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
            <div className="story-controls">
              <button type="button" onClick={togglePlay} disabled={!ready}>
                {mode === "play" ? "Ⅱ Pause" : progress >= 0.98 ? "↻ Replay story" : "▶ Play story"}
              </button>
              <span>{mode === "scroll" ? "Or scroll to explore" : "You control the story"}</span>
            </div>
            <label className="scrubber-label" htmlFor="assembly-progress">
              Product → Components → Connected product
            </label>
            <input
              id="assembly-progress"
              className="assembly-scrubber"
              type="range"
              min="0"
              max="100"
              value={Math.round(progress * 100)}
              onChange={(event) => seek(Number(event.target.value) / 100)}
              aria-valuetext={`${current.label}, ${Math.round(progress * 100)} percent of story`}
            />
            <p className="story-note">Illustrative data relationships; no measured footprint is claimed.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
