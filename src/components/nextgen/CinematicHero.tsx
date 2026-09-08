import { useEffect, useRef, useState } from "react";

export default function CinematicHero({ base }: { base: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const progress = useRef(0.5);
  const paused = useRef(false);
  const reduced = useRef(false);
  const [isPaused, setPaused] = useState(false);
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState("Revealing the intelligence inside…");

  useEffect(() => {
    const host = hostRef.current;
    if (!host) {
      return;
    }
    let cancelled = false;
    let cleanup: (() => void) | undefined;
    let hold = 0;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => {
      reduced.current = preference.matches;
      paused.current = preference.matches;
      setPaused(preference.matches);
    };
    syncPreference();
    preference.addEventListener("change", syncPreference);
    import("./productStoryScene")
      .then(async ({ createProductScene }) => {
        if (cancelled) {
          return;
        }
        cleanup = await createProductScene(
          host,
          base,
          () => progress.current,
          (dt) => {
            if (paused.current) {
              return;
            }
            hold += dt;
            if (hold > 3) {
              progress.current = (progress.current + dt / 24) % 1;
            }
          },
          () => {
            if (!cancelled) {
              setReady(true);
            }
          },
          () => {
            if (!cancelled) {
              setReady(false);
              setMessage("Explore the component story below.");
            }
          },
          () => cancelled,
          () => reduced.current,
          true
        );
        if (cancelled) {
          cleanup?.();
        }
      })
      .catch(() => {
        if (!cancelled) {
          setMessage("Explore the component story below.");
        }
      });
    return () => {
      cancelled = true;
      cleanup?.();
      preference.removeEventListener("change", syncPreference);
    };
  }, [base]);

  return (
    <div className="cinema-product">
      <div
        className="cinema-model"
        ref={hostRef}
        role="img"
        aria-label="A dramatically lit Cross Chair, its 13 components suspended apart before slowly assembling into the complete product"
      />
      {!ready && <output className="cinema-loading">{message}</output>}
      <div className="cinema-caption">
        <span className="cinema-index">01—13</span>
        <span>
          Every component.
          <br />
          <strong>Part of a bigger story.</strong>
        </span>
      </div>
      <div className="cinema-controls">
        <span>CROSS CHAIR / LIVE PRODUCT STUDY</span>
        <button
          type="button"
          disabled={!ready}
          aria-label={isPaused ? "Play product animation" : "Pause product animation"}
          onClick={() => {
            paused.current = !paused.current;
            setPaused(paused.current);
          }}
        >
          {isPaused ? "▶ Play" : "Ⅱ Pause"}
        </button>
      </div>
    </div>
  );
}
