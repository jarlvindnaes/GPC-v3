import { motion } from "motion/react";

export function TrustLogos() {
  const logos = [
    { name: "HermanMiller", className: "font-serif tracking-tighter" },
    { name: "HAY", className: "tracking-widest uppercase" },
    { name: "muuto", className: "font-medium tracking-tight" },
    { name: "Vitra.", className: "font-bold italic" },
    { name: "Fritz Hansen", className: "font-semibold tracking-wide uppercase" }
  ];

  const repeatedLogos = [1, 2, 3].flatMap((set) => logos.map((logo) => ({ ...logo, key: `${logo.name}-${set}` })));

  return (
    <section className="overflow-hidden border-slate-100 border-y bg-slate-50/50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-12 text-center font-bold text-slate-400 text-xs uppercase tracking-[0.2em]">
          Partnering with World-Class Manufacturers
        </p>

        <div className="group relative flex overflow-hidden">
          <motion.div
            className="flex items-center gap-8 whitespace-nowrap sm:gap-16 md:gap-32"
            animate={{ x: [0, -1000] }}
            transition={{
              repeat: Infinity,
              duration: 30,
              ease: "linear",
              repeatType: "loop"
            }}
          >
            {repeatedLogos.map((logo) => (
              <div
                key={logo.key}
                className={`cursor-default text-base text-slate-300 grayscale transition-colors duration-500 hover:text-slate-900 hover:grayscale-0 sm:text-xl md:text-2xl ${logo.className}`}
              >
                {logo.name}
              </div>
            ))}
          </motion.div>

          {/* Fades */}
          <div className="absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-slate-50/50 to-transparent"></div>
          <div className="absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-slate-50/50 to-transparent"></div>
        </div>
      </div>
    </section>
  );
}
