import { useEffect, useState } from "react";

export function CountdownBanner() {
  const targetDate = new Date("2027-01-01T00:00:00Z").getTime();

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const tick = () => {
      const distance = targetDate - Date.now();
      if (distance < 0) {
        return;
      }
      setTimeLeft({
        days: Math.floor(distance / 86400000),
        hours: Math.floor((distance % 86400000) / 3600000),
        minutes: Math.floor((distance % 3600000) / 60000),
        seconds: Math.floor((distance % 60000) / 1000)
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const Unit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <span className="font-mono font-semibold text-3xl text-slate-900 tabular-nums leading-none tracking-tight sm:text-5xl md:text-6xl">
        {String(value).padStart(2, "0")}
      </span>
      <span className="mt-2 font-medium text-[11px] text-slate-400 uppercase tracking-widest">{label}</span>
    </div>
  );

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-slate-50 py-16 md:py-20">
      {/* Subtle top border accent */}
      <div className="absolute top-0 right-0 left-0 h-px bg-gradient-to-r from-transparent via-indigo-300/50 to-transparent" />

      {/* Background mesh — faint grid */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:48px_48px]" />

      {/* Soft gradient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/3 h-[300px] w-[min(100vw,600px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-100/60 blur-[100px]" />
        <div className="absolute top-1/2 right-1/4 h-[250px] w-[min(100vw,400px)] -translate-y-1/2 rounded-full bg-violet-100/40 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
            </span>
            <span className="text-center font-semibold text-slate-700 text-xs tracking-wide sm:text-sm">
              EU DPP Legislation — ESPR Deadline
            </span>
          </div>

          {/* Countdown */}
          <div className="flex items-start gap-3 sm:gap-6 md:gap-8">
            <Unit value={timeLeft.days} label="days" />
            <span className="mt-1.5 select-none font-light text-3xl text-slate-300 md:text-4xl">:</span>
            <Unit value={timeLeft.hours} label="hours" />
            <span className="mt-1.5 select-none font-light text-3xl text-slate-300 md:text-4xl">:</span>
            <Unit value={timeLeft.minutes} label="min" />
            <span className="mt-1.5 select-none font-light text-3xl text-slate-300 md:text-4xl">:</span>
            <Unit value={timeLeft.seconds} label="sec" />
          </div>

          {/* Sub-text */}
          <p className="max-w-lg text-center text-base text-slate-500 leading-relaxed">
            Non-compliance risks market exclusion across the EU.{" "}
            <span className="font-medium text-slate-900">Is your product passport strategy ready?</span>
          </p>
        </div>
      </div>

      {/* Subtle bottom border */}
      <div className="absolute right-0 bottom-0 left-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
    </section>
  );
}
