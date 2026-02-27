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
        <div className="flex flex-col items-center gap-1.5">
            <div className="relative">
                {/* Glow */}
                <div className="absolute inset-0 rounded-2xl blur-md opacity-30 bg-amber-400" />
                <div className="relative min-w-[72px] md:min-w-[88px] bg-white/10 border border-white/20 backdrop-blur-sm rounded-2xl px-3 py-3 md:py-4 text-center">
                    <span className="font-mono text-3xl md:text-4xl font-bold text-white tabular-nums leading-none">
                        {String(value).padStart(2, "0")}
                    </span>
                </div>
            </div>
            <span className="text-[11px] font-semibold tracking-widest uppercase text-amber-300/80">{label}</span>
        </div>
    );

    return (
        <section className="relative bg-slate-950 border-b border-white/5 overflow-hidden py-10 md:py-14">
            {/* Background gradient orbs */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[200px] bg-amber-500/10 blur-[80px] rounded-full" />
                <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[400px] h-[200px] bg-indigo-500/10 blur-[80px] rounded-full" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center gap-8">

                    {/* Label */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                            <span className="w-1 h-1 rounded-full bg-amber-400/60" />
                            <span className="w-1 h-1 rounded-full bg-amber-400/30" />
                        </div>
                        <span className="text-sm md:text-base font-semibold text-amber-300 tracking-wide">
                            EU DPP Legislation — ESPR Deadline
                        </span>
                        <div className="flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-amber-400/30" />
                            <span className="w-1 h-1 rounded-full bg-amber-400/60" />
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                        </div>
                    </div>

                    {/* Countdown */}
                    <div className="flex items-end gap-3 md:gap-4">
                        <Unit value={timeLeft.days} label="days" />
                        <span className="text-3xl md:text-4xl font-bold text-white/30 mb-6 leading-none">:</span>
                        <Unit value={timeLeft.hours} label="hours" />
                        <span className="text-3xl md:text-4xl font-bold text-white/30 mb-6 leading-none">:</span>
                        <Unit value={timeLeft.minutes} label="minutes" />
                        <span className="text-3xl md:text-4xl font-bold text-white/30 mb-6 leading-none">:</span>
                        <Unit value={timeLeft.seconds} label="seconds" />
                    </div>

                    {/* Sub-text */}
                    <p className="text-sm md:text-base text-slate-400 text-center max-w-xl leading-relaxed">
                        Non-compliance risks market exclusion across the EU.{" "}
                        <span className="text-white font-medium">Is your product passport strategy ready?</span>
                    </p>
                </div>
            </div>
        </section>
    );
}
