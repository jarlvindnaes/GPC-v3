import { Cpu } from "lucide-react";
import { motion } from "motion/react";

/**
 * Animated LCA Engine visualisation — concentric rotating rings, orbiting data
 * nodes, data-stream lines and floating metric labels around a pulsing core.
 *
 * Used in both StorytellingScroll (step 6) and the FeatureGrid "Calculate the
 * impact" card so the illustration stays in sync across the two surfaces.
 */
export function LcaEngineVisual() {
  return (
    <div className="relative flex aspect-square w-full max-w-[280px] items-center justify-center sm:max-w-[350px] md:max-w-[420px]">
      {/* Outer ring — solid circle, rotation invisible so plain div with CSS hover */}
      <div className="absolute inset-0 rounded-full border-2 border-white/20 transition-[border-color] duration-[400ms] hover:border-white" />
      {/* Second ring — group wrapper handles hover, inner svg rotates */}
      <div className="group absolute inset-6 h-[calc(100%-3rem)] w-[calc(100%-3rem)]">
        <motion.svg
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 28, ease: "linear" }}
          className="h-full w-full opacity-40 transition-opacity duration-[400ms] group-hover:opacity-100"
          viewBox="0 0 100 100"
        >
          <circle cx="50" cy="50" r="49" fill="none" stroke="white" strokeWidth="0.8" strokeDasharray="1.5 2.5" strokeLinecap="round" />
        </motion.svg>
      </div>
      {/* Third ring */}
      <div className="group absolute inset-16 h-[calc(100%-8rem)] w-[calc(100%-8rem)]">
        <motion.svg
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="h-full w-full opacity-35 transition-opacity duration-[400ms] group-hover:opacity-100"
          viewBox="0 0 100 100"
        >
          <circle cx="50" cy="50" r="49" fill="none" stroke="white" strokeWidth="0.8" strokeDasharray="1.5 2.5" strokeLinecap="round" />
        </motion.svg>
      </div>
      {/* Inner ring — solid circle, rotation invisible so plain div with CSS hover */}
      <div className="absolute inset-24 rounded-full border-2 border-white/15 transition-[border-color] duration-[400ms] hover:border-white" />

      {/* Outer orbiting data nodes */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <motion.div
          key={`outer-${deg}`}
          className="absolute h-1.5 w-1.5 rounded-full bg-indigo-400"
          style={{
            left: `calc(50% + ${Math.cos((deg * Math.PI) / 180) * 46}% - 3px)`,
            top: `calc(50% + ${Math.sin((deg * Math.PI) / 180) * 46}% - 3px)`
          }}
          animate={{ opacity: [0.12, 0.48, 0.12], scale: [0.8, 1.3, 0.8] }}
          whileHover={{ opacity: 1, scale: 1.5, transition: { duration: 0.4 } }}
          transition={{ repeat: Infinity, duration: 3, delay: (deg / 360) * 3 }}
        />
      ))}

      {/* Mid orbiting data nodes */}
      {[0, 72, 144, 216, 288].map((deg) => (
        <motion.div
          key={`mid-${deg}`}
          className="absolute h-2.5 w-2.5 rounded-full bg-indigo-400 shadow-[0_0_12px_#6366f1]"
          style={{
            left: `calc(50% + ${Math.cos((deg * Math.PI) / 180) * 33}% - 5px)`,
            top: `calc(50% + ${Math.sin((deg * Math.PI) / 180) * 33}% - 5px)`
          }}
          animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.4, 1] }}
          whileHover={{ opacity: 1, scale: 1.6, transition: { duration: 0.4 } }}
          transition={{ repeat: Infinity, duration: 2.5, delay: (deg / 360) * 2.5 }}
        />
      ))}

      {/* Inner orbiting nodes */}
      {[30, 150, 270].map((deg) => (
        <motion.div
          key={`inner-${deg}`}
          className="absolute h-2 w-2 rounded-full bg-violet-400 shadow-[0_0_10px_#8b5cf6]"
          style={{
            left: `calc(50% + ${Math.cos((deg * Math.PI) / 180) * 20}% - 4px)`,
            top: `calc(50% + ${Math.sin((deg * Math.PI) / 180) * 20}% - 4px)`
          }}
          animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.5, 1] }}
          whileHover={{ opacity: 1, scale: 1.8, transition: { duration: 0.4 } }}
          transition={{ repeat: Infinity, duration: 2, delay: (deg / 360) * 2 }}
        />
      ))}

      {/* Data streams — lines flowing toward center */}
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <motion.div
          key={`stream-${deg}`}
          className="absolute w-px bg-gradient-to-b from-transparent via-indigo-400/40 to-transparent"
          style={{
            height: "14%",
            left: `calc(50% + ${Math.cos((deg * Math.PI) / 180) * 28}%)`,
            top: `calc(50% + ${Math.sin((deg * Math.PI) / 180) * 28}% - 7%)`,
            transform: `rotate(${deg + 90}deg)`
          }}
          animate={{ opacity: [0, 0.8, 0] }}
          whileHover={{ opacity: 1, transition: { duration: 0.4 } }}
          transition={{ repeat: Infinity, duration: 1.8, delay: (deg / 360) * 1.8 }}
        />
      ))}

      {/* Pulsing core glow */}
      <motion.div
        className="absolute aspect-square w-[28%] rounded-full bg-indigo-500/10"
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
        whileHover={{ opacity: 1, transition: { duration: 0.4 } }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute aspect-square w-[19%] rounded-full bg-violet-500/10"
        animate={{ scale: [1.1, 1.5, 1.1], opacity: [0.4, 0.7, 0.4] }}
        whileHover={{ opacity: 1, transition: { duration: 0.4 } }}
        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut", delay: 0.5 }}
      />

      {/* Core */}
      <motion.div
        className="z-10 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 shadow-[0_0_60px_rgba(99,102,241,0.5)] sm:h-20 sm:w-20 md:h-24 md:w-24"
        animate={{ scale: [1, 1.05, 1] }}
        whileHover={{ scale: 1.12, transition: { duration: 0.4 } }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
      >
        <Cpu className="h-6 w-6 text-white sm:h-8 sm:w-8 md:h-10 md:w-10" />
      </motion.div>

      {/* Floating metric labels */}
      <motion.div
        className="absolute top-6 right-8 hidden select-none rounded-2xl border border-white/30 bg-white/20 px-3.5 py-2.5 backdrop-blur-md sm:block"
        animate={{ y: [0, -6, 0], opacity: [0.7, 1, 0.7] }}
        whileHover={{ opacity: 1, transition: { duration: 0.4 } }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
      >
        <div className="flex items-start gap-2">
          <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--color-brand-emerald)]" />
          <div>
            <p className="font-semibold text-[10px] text-white uppercase tracking-wide">CO₂ Impact</p>
            <p className="font-bold text-white text-sm">12.4 kg</p>
          </div>
        </div>
      </motion.div>
      <motion.div
        className="absolute bottom-12 left-4 hidden select-none rounded-2xl border border-white/30 bg-white/20 px-3.5 py-2.5 backdrop-blur-md sm:block"
        animate={{ y: [0, 6, 0], opacity: [0.6, 1, 0.6] }}
        whileHover={{ opacity: 1, transition: { duration: 0.4 } }}
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
      >
        <div className="flex items-start gap-2">
          <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--color-brand-cyan)]" />
          <div>
            <p className="font-semibold text-[10px] text-white uppercase tracking-wide">PEF Score</p>
            <p className="font-bold text-white text-sm">A+</p>
          </div>
        </div>
      </motion.div>
      <motion.div
        className="absolute top-16 left-2 hidden select-none rounded-2xl border border-white/30 bg-white/20 px-3.5 py-2.5 backdrop-blur-md sm:block"
        animate={{ y: [0, -4, 0], opacity: [0.5, 1, 0.5] }}
        whileHover={{ opacity: 1, transition: { duration: 0.4 } }}
        transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 2 }}
      >
        <div className="flex items-start gap-2">
          <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--color-brand-violet)]" />
          <div>
            <p className="font-semibold text-[10px] text-white uppercase tracking-wide">Components</p>
            <p className="font-bold text-sm text-white">24 analysed</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
