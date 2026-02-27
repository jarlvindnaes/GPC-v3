import { motion } from "motion/react";

export function TrustLogos() {
  const logos = [
    { name: "HermanMiller", className: "font-serif tracking-tighter" },
    { name: "HAY", className: "tracking-widest uppercase" },
    { name: "muuto", className: "font-medium tracking-tight" },
    { name: "Vitra.", className: "font-bold italic" },
    { name: "Fritz Hansen", className: "font-semibold tracking-wide uppercase" },
  ];

  return (
    <section className="py-20 border-y border-slate-100 bg-slate-50/50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-bold tracking-[0.2em] uppercase text-slate-400 mb-12">
          Partnering with World-Class Manufacturers
        </p>

        <div className="relative flex overflow-hidden group">
          <motion.div
            className="flex gap-16 md:gap-32 items-center whitespace-nowrap"
            animate={{ x: [0, -1000] }}
            transition={{
              repeat: Infinity,
              duration: 30,
              ease: "linear",
              repeatType: "loop"
            }}
          >
            {[...logos, ...logos, ...logos].map((logo, i) => (
              <div
                key={i}
                className={`text-xl md:text-2xl text-slate-300 hover:text-slate-900 transition-colors duration-500 cursor-default grayscale hover:grayscale-0 ${logo.className}`}
              >
                {logo.name}
              </div>
            ))}
          </motion.div>

          {/* Fades */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-slate-50/50 to-transparent z-10"></div>
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-slate-50/50 to-transparent z-10"></div>
        </div>
      </div>
    </section>
  );
}
