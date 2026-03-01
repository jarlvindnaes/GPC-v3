import { useState, useEffect } from "react";

export function CountdownBanner() {
    const targetDate = new Date("2027-01-01T00:00:00Z").getTime();

    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const tick = () => {
            const distance = targetDate - Date.now();
            if (distance < 0) return;
            setTimeLeft({
                days: Math.floor(distance / 86400000),
                hours: Math.floor((distance % 86400000) / 3600000),
                minutes: Math.floor((distance % 3600000) / 60000),
                seconds: Math.floor((distance % 60000) / 1000),
            });
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, [targetDate]);

    const Unit = ({ value, label }: { value: number; label: string }) => (
        <div className="flex flex-col items-center">
            <span className="font-mono text-3xl sm:text-5xl md:text-6xl font-semibold text-slate-900 tabular-nums leading-none tracking-tight">
                {String(value).padStart(2, "0")}
            </span>
            <span className="text-[11px] font-medium tracking-widest uppercase text-slate-400 mt-2">{label}</span>
        </div>
    );

    return (
        <section className="relative bg-gradient-to-b from-white to-slate-50 overflow-hidden py-16 md:py-20">
            {/* Subtle top border accent */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-300/50 to-transparent" />

            {/* Background mesh — faint grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

            {/* Soft gradient orbs */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/2 left-1/3 -translate-y-1/2 -translate-x-1/2 w-[min(100vw,600px)] h-[300px] bg-indigo-100/60 blur-[100px] rounded-full" />
                <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[min(100vw,400px)] h-[250px] bg-violet-100/40 blur-[100px] rounded-full" />
            </div>

            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center gap-10">

                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                        </span>
                        <span className="text-xs sm:text-sm font-semibold text-slate-700 tracking-wide text-center">
                            EU DPP Legislation — ESPR Deadline
                        </span>
                    </div>

                    {/* Countdown */}
                    <div className="flex items-start gap-3 sm:gap-6 md:gap-8">
                        <Unit value={timeLeft.days} label="days" />
                        <span className="text-3xl md:text-4xl font-light text-slate-300 mt-1.5 select-none">:</span>
                        <Unit value={timeLeft.hours} label="hours" />
                        <span className="text-3xl md:text-4xl font-light text-slate-300 mt-1.5 select-none">:</span>
                        <Unit value={timeLeft.minutes} label="min" />
                        <span className="text-3xl md:text-4xl font-light text-slate-300 mt-1.5 select-none">:</span>
                        <Unit value={timeLeft.seconds} label="sec" />
                    </div>

                    {/* Sub-text */}
                    <p className="text-base text-slate-500 text-center max-w-lg leading-relaxed">
                        Non-compliance risks market exclusion across the EU.{" "}
                        <span className="text-slate-900 font-medium">Is your product passport strategy ready?</span>
                    </p>
                </div>
            </div>

            {/* Subtle bottom border */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        </section>
    );
}
