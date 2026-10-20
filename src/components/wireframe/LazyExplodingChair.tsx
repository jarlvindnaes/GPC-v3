// The How it works hero chair, loaded only where it runs: ExplodingChair's `media` query (desktop widths) keeps the
// scene from starting on phones, but its three.js code was still downloaded there. This shell checks the query
// first and imports the scene only while it matches (same props).
import { lazy, Suspense, useEffect, useState, type ComponentProps } from "react";
import type { ExplodingChair as Chair } from "./ExplodingChair";

const ExplodingChair = lazy(() => import("./ExplodingChair").then((m) => ({ default: m.ExplodingChair })));

export function LazyExplodingChair(props: ComponentProps<typeof Chair>) {
  const { media } = props;
  const [active, setActive] = useState(() => !media || window.matchMedia(media).matches);
  useEffect(() => {
    if (!media || active) return;
    const query = window.matchMedia(media);
    const onChange = () => setActive(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, [media, active]);
  return active ? (
    <Suspense fallback={null}>
      <ExplodingChair {...props} />
    </Suspense>
  ) : null;
}
