import { motion } from "motion/react";

export function StatsSection() {
  return (
    <section className="py-32 md:py-48 bg-slate-950 text-white overflow-hidden relative">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-5xl md:text-7xl lg:text-8xl font-display font-semibold tracking-tight mb-24 max-w-4xl mx-auto leading-[1.1]"
        >
          The backbone of sustainable manufacturing.
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 relative">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center"
          >
            <div className="text-6xl md:text-7xl font-display font-semibold mb-4 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">10M+</div>
            <div className="text-lg font-medium text-slate-400 max-w-[200px] leading-relaxed">
              components tracked across supply chains
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center"
          >
            <div className="text-6xl md:text-7xl font-display font-semibold mb-4 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">€50M+</div>
            <div className="text-lg font-medium text-slate-400 max-w-[200px] leading-relaxed">
              in consulting fees saved by manufacturers
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center"
          >
            <div className="text-6xl md:text-7xl font-display font-semibold mb-4 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">99.9%</div>
            <div className="text-lg font-medium text-slate-400 max-w-[200px] leading-relaxed">
              data accuracy for LCA calculations
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex flex-col items-center"
          >
            <div className="text-6xl md:text-7xl font-display font-semibold mb-4 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">2026</div>
            <div className="text-lg font-medium text-slate-400 max-w-[200px] leading-relaxed">
              ESPR compliance ready today
            </div>
          </motion.div>
        </div>
      </div>

      {/* Abstract visual representation at the bottom */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1200px] h-[400px] opacity-30 pointer-events-none mix-blend-screen">
        <svg viewBox="0 0 1200 400" className="w-full h-full text-indigo-500">
          <g stroke="currentColor" strokeWidth="1.5" fill="none">
            {Array.from({ length: 150 }).map((_, i) => {
              const x = 600 + (Math.random() - 0.5) * 1200;
              const y = 400 - Math.random() * 350;
              return (
                <path 
                  key={i} 
                  d={`M600,400 Q${(600+x)/2},${(400+y)/2} ${x},${y}`} 
                  className="opacity-40"
                />
              );
            })}
            {Array.from({ length: 150 }).map((_, i) => {
              const x = 600 + (Math.random() - 0.5) * 1200;
              const y = 400 - Math.random() * 350;
              return (
                <circle 
                  key={`c-${i}`} 
                  cx={x} 
                  cy={y} 
                  r={Math.random() * 3 + 1} 
                  fill="currentColor" 
                  className="opacity-80"
                />
              );
            })}
          </g>
        </svg>
      </div>
    </section>
  );
}
