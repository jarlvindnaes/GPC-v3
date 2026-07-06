import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

/* ── Supplier Data Entry with typewriter animation ── */

const TYPED_FIELDS = [
  { label: "Material Composition", value: "FSC oak · 94%" },
  { label: "Manufacturing Origin", value: "Gdańsk, Poland" }
] as const;

const CALCULATED_FIELD = { label: "CO₂ per unit", value: "12.4 kg CO₂e" };

const TYPE_SPEED = 55; // ms per character
const PAUSE_BETWEEN = 600; // ms pause between fields
const PAUSE_BEFORE_CALC = 500; // ms before CO₂ fades in
const HOLD_DURATION = 2400; // ms to hold final state before restart

export function SupplierDataEntryVisual({ alignTop = false }: { alignTop?: boolean } = {}) {
  const [fieldIndex, setFieldIndex] = useState(0); // which field is typing (0 or 1)
  const [charIndex, setCharIndex] = useState(0); // chars revealed in current field
  const [showCalc, setShowCalc] = useState(false); // CO₂ faded in?
  const [phase, setPhase] = useState<"typing" | "pause" | "calc" | "hold">("typing");
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const reset = useCallback(() => {
    setFieldIndex(0);
    setCharIndex(0);
    setShowCalc(false);
    setPhase("typing");
  }, []);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (phase === "typing") {
      const fullText = TYPED_FIELDS[fieldIndex].value;
      if (charIndex < fullText.length) {
        timerRef.current = setTimeout(() => setCharIndex((c) => c + 1), TYPE_SPEED);
      } else if (fieldIndex < TYPED_FIELDS.length - 1) {
        // Move to next field after pause
        setPhase("pause");
      } else {
        // Both fields done → show calculated value
        setPhase("calc");
      }
    } else if (phase === "pause") {
      timerRef.current = setTimeout(() => {
        setFieldIndex((i) => i + 1);
        setCharIndex(0);
        setPhase("typing");
      }, PAUSE_BETWEEN);
    } else if (phase === "calc") {
      timerRef.current = setTimeout(() => {
        setShowCalc(true);
        setPhase("hold");
      }, PAUSE_BEFORE_CALC);
    } else if (phase === "hold") {
      timerRef.current = setTimeout(reset, HOLD_DURATION);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [phase, charIndex, fieldIndex, reset]);

  const content = (
    <div className="w-full max-w-[340px] sm:max-w-[400px]">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <span className="font-bold text-lg text-white">Supplier Data Entry</span>
        <span className="rounded-full border border-emerald-500/25 bg-emerald-500/15 px-2.5 py-1 font-bold text-emerald-400 text-xs">
          Live
        </span>
      </div>
      {/* Typed fields */}
      <div className="space-y-3">
        {TYPED_FIELDS.map((f, i) => {
          const isActive = i === fieldIndex && phase === "typing";
          const isDone =
            i < fieldIndex || (i === fieldIndex && phase !== "typing") || phase === "calc" || phase === "hold";
          const revealed = i === fieldIndex ? f.value.slice(0, charIndex) : isDone ? f.value : "";

          return (
            <div
              key={f.label}
              className="rounded-2xl border border-white/30 bg-white/20 px-4 py-3 shadow-2xl shadow-black/20 backdrop-blur-md"
            >
              <p className="mb-0.5 font-semibold text-[11px] text-slate-400 uppercase tracking-wide">{f.label}</p>
              <p className="font-medium text-sm text-white">
                {revealed}
                {isActive && (
                  <span
                    className="ml-px inline-block w-[2px] animate-pulse bg-white"
                    style={{ height: "1em", verticalAlign: "text-bottom" }}
                  />
                )}
                {!isDone && !isActive && (
                  <span
                    className="ml-px inline-block w-[2px] bg-white/30"
                    style={{ height: "1em", verticalAlign: "text-bottom" }}
                  />
                )}
              </p>
            </div>
          );
        })}

        {/* Calculated field — fades in */}
        <motion.div
          className="rounded-2xl border border-white/30 bg-white/20 px-4 py-3 shadow-2xl shadow-black/20 backdrop-blur-md"
          animate={{ opacity: showCalc ? 1 : 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <p className="mb-0.5 font-semibold text-[11px] text-slate-400 uppercase tracking-wide">
            {CALCULATED_FIELD.label}
          </p>
          <p className="font-medium text-sm text-white">{showCalc ? CALCULATED_FIELD.value : ""}</p>
        </motion.div>

        {/* Submit button */}
        <div className="flex h-11 cursor-pointer items-center justify-center rounded-2xl border border-white/10 bg-indigo-600/80 transition-colors hover:bg-indigo-500/80">
          <span className="font-semibold text-sm text-white">Submit & Verify</span>
        </div>
      </div>
    </div>
  );

  if (!alignTop) {
    return content;
  }

  return (
    <div className="h-full w-full" style={{ containerType: "size" }}>
      <div className="supplier-entry-inner flex h-full w-full items-start justify-center overflow-hidden px-4 pt-4">
        <style>{`
          @container (min-height: 360px) {
            .supplier-entry-inner { align-items: center; }
          }
        `}</style>
        {content}
      </div>
    </div>
  );
}
