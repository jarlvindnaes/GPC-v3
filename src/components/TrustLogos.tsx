import { motion } from "motion/react";

import benchmarkSvg from "../assets/logos/benchmark.svg?raw";
import dansaniSvg from "../assets/logos/dansani.svg?raw";
import loungersSvg from "../assets/logos/loungers.svg?raw";
import materSvg from "../assets/logos/mater.svg?raw";
import muutoSvg from "../assets/logos/muuto.svg?raw";
import taktSvg from "../assets/logos/takt.svg?raw";

const logos = [
  { name: "Benchmark", svg: benchmarkSvg },
  { name: "Dansani", svg: dansaniSvg },
  { name: "Loungers", svg: loungersSvg },
  { name: "Mater", svg: materSvg },
  { name: "Muuto", svg: muutoSvg },
  { name: "Takt", svg: taktSvg }
];

const repeatedLogos = [1, 2, 3].flatMap((set) => logos.map((logo) => ({ ...logo, key: `${logo.name}-${set}` })));

export function TrustLogos() {
  return (
    <section className="relative overflow-hidden bg-brand-surface/50 py-20">
      <div className="absolute top-0 right-0 left-0 h-px bg-gradient-to-r from-transparent via-brand/50 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-12 text-center font-bold text-slate-400 text-xs uppercase tracking-[0.2em]">
          Partnering with World-Class Manufacturers
        </p>

        <div className="group relative flex overflow-hidden">
          <motion.div
            className="flex shrink-0 items-center gap-16 sm:gap-24 md:gap-32"
            animate={{ x: [0, "-50%"] }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 30,
              ease: "linear",
              repeatType: "loop"
            }}
          >
            {repeatedLogos.map((logo) => (
              <div
                key={logo.key}
                className="h-6 text-brand-dark opacity-40 transition-opacity duration-500 hover:opacity-100 sm:h-8 [&>svg]:h-full [&>svg]:w-auto"
                // biome-ignore lint/security/noDangerouslySetInnerHtml: trusted static SVGs bundled at build time
                dangerouslySetInnerHTML={{
                  // biome-ignore lint/style/useNamingConvention: React API
                  __html: logo.svg
                }}
              />
            ))}
          </motion.div>

          {/* Fades */}
          <div className="absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-brand-surface to-transparent" />
          <div className="absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-brand-surface to-transparent" />
        </div>
      </div>
    </section>
  );
}
