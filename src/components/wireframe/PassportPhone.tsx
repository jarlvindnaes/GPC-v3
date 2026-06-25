import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { DppPhoneScreen } from "../dpp/DppPhoneScreen";
import { HtmlPhoneCanvas } from "../Native3DModels";

// 3D iPhone showing the Digital Product Passport, ported from the main site's ChairPhoneShowcase
// but without the click-to-open chair: the phone is shown open, with the same expand-to-fullscreen
// control (a portalled overlay that escapes all stacking contexts and locks body scroll).
export function PassportPhone() {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (expanded) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [expanded]);

  useEffect(() => {
    if (!expanded) {
      return;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setExpanded(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [expanded]);

  return (
    <div className="relative mx-auto h-[460px] w-full max-w-[300px]">
      <HtmlPhoneCanvas noChrome={true} rotation={[0.05, 0.4, 0]}>
        <DppPhoneScreen />
      </HtmlPhoneCanvas>

      <button
        type="button"
        aria-label="Expand passport to fullscreen"
        onClick={() => {
          setExpanded(true);
        }}
        className="absolute top-2 left-2 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-slate-400/40 bg-white/70 text-slate-700 backdrop-blur-md transition-all duration-300 hover:bg-white/90"
      >
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden={true}
        >
          <polyline points="15 3 21 3 21 9" />
          <polyline points="9 21 3 21 3 15" />
          <line x1="21" y1="3" x2="14" y2="10" />
          <line x1="3" y1="21" x2="10" y2="14" />
        </svg>
      </button>

      {expanded &&
        createPortal(
          <div className="fixed inset-0 z-[99999] flex flex-col items-center" style={{ paddingTop: 8 }}>
            <button
              type="button"
              aria-label="Close fullscreen passport"
              onClick={() => {
                setExpanded(false);
              }}
              className="absolute inset-0 cursor-default border-0 bg-black/40 backdrop-blur-xl"
            />
            <div
              className="relative z-10 cursor-grab active:cursor-grabbing"
              style={{ height: "calc(100vh - 8px)", aspectRatio: "375 / 812", maxWidth: "100vw" }}
            >
              <HtmlPhoneCanvas isPlaying={true} noChrome={true} resetKey={1}>
                <DppPhoneScreen />
              </HtmlPhoneCanvas>
              <button
                type="button"
                aria-label="Close fullscreen passport"
                onClick={() => {
                  setExpanded(false);
                }}
                className="absolute top-2 right-2 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/20 text-white backdrop-blur-md transition-all duration-300 hover:bg-white/30"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  aria-hidden={true}
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
