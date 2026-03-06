import Lenis from "lenis";
import { cancelFrame, frame } from "motion/react";
import { createContext, useContext, useEffect, useRef } from "react";

const LenisContext = createContext<Lenis | null>(null);

export function useLenisInstance(): Lenis | null {
  return useContext(LenisContext);
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisReference = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({ autoRaf: false });
    lenisReference.current = lenis;

    function update(data: { timestamp: number }) {
      lenis.raf(data.timestamp);
    }
    frame.update(update, true);

    return () => {
      cancelFrame(update);
      lenis.destroy();
      lenisReference.current = null;
    };
  }, []);

  return <LenisContext.Provider value={lenisReference.current}>{children}</LenisContext.Provider>;
}
