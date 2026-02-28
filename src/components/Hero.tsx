import { motion } from "motion/react";
import { ArrowRight, PlayCircle } from "lucide-react";

export function Hero() {
  return (
    <section className="pt-32 pb-20 md:pt-48 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden relative">
      {/* Background abstract shapes */}
      <div className="absolute top-0 right-0 -z-10 w-[800px] h-[800px] bg-gradient-to-br from-indigo-50 via-slate-50 to-white rounded-full blur-[120px] opacity-70 translate-x-1/3 -translate-y-1/4"></div>
      <div className="absolute bottom-0 left-0 -z-10 w-[600px] h-[600px] bg-gradient-to-tr from-blue-50/50 via-transparent to-transparent rounded-full blur-[100px] opacity-40 -translate-x-1/2 translate-y-1/2"></div>

      <div className="max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50/50 text-indigo-700 text-sm font-semibold mb-8 border border-indigo-100/50 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
            </span>
            ESPR 2026 Ready
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-[5rem] font-display font-bold text-slate-900 tracking-tight leading-[1.05] mb-8">
            Revolutionize Furniture Manufacturing with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">Product Connect.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 mb-12 leading-relaxed max-w-2xl font-medium">
            Streamline your supply chain, integrate data seamlessly, and track environmental impact. The infrastructure that gives intelligence to physical products.
          </p>
          <div className="flex flex-col sm:flex-row gap-5">
            <button className="group bg-slate-900 text-white px-8 py-4 rounded-full text-base font-semibold hover:bg-slate-800 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-slate-200/50 flex items-center justify-center gap-2">
              Start Building <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="group bg-white text-slate-900 border border-slate-200 px-8 py-4 rounded-full text-base font-semibold hover:bg-slate-50 transition-all hover:border-slate-300 flex items-center justify-center gap-2">
              <PlayCircle className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-colors" /> Book a Demo
            </button>
          </div>
        </motion.div>
      </div>

      {/* Dashboard Mockup */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="mt-20 relative rounded-3xl border border-slate-200/60 bg-white/50 backdrop-blur-md shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden group"
      >
        <div className="h-14 bg-slate-50/80 border-b border-slate-100/50 flex items-center px-6 justify-between">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-400/30"></div>
            <div className="w-3 h-3 rounded-full bg-amber-400/30"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-400/30"></div>
          </div>
          <div className="px-3 py-1 rounded bg-slate-100/50 text-[10px] font-bold text-slate-400 tracking-widest uppercase">Product Analytics v1.0</div>
        </div>
        <div className="aspect-[16/9] bg-white p-10 flex items-center justify-center relative overflow-hidden">
          {/* Abstract representation of the dashboard */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]"></div>
          <div className="relative w-full max-w-5xl grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8">
            <div className="md:col-span-3 space-y-4 md:space-y-8">
              <div className="h-48 md:h-72 bg-white rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-4 md:p-8 flex flex-col hover:border-indigo-100 transition-colors duration-500">
                <div className="flex justify-between items-center mb-8">
                  <div className="h-5 w-48 bg-slate-50 rounded-full"></div>
                  <div className="h-8 w-24 bg-indigo-50/50 rounded-lg"></div>
                </div>
                <div className="flex-1 flex items-end gap-3 px-4">
                  {[35, 65, 45, 85, 55, 75, 95, 65, 80, 50, 70, 40].map((h, i) => (
                    <motion.div
                      key={i}
                      className="flex-1 bg-gradient-to-t from-indigo-500 to-indigo-400 rounded-t-[4px]"
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ delay: 0.5 + i * 0.05, duration: 0.8, ease: "easeOut" }}
                    />
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 md:gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-36 bg-white rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-6 hover:border-indigo-100 transition-colors duration-500">
                    <div className="h-3 w-20 bg-slate-50 rounded-full mb-6"></div>
                    <div className="h-10 w-16 bg-slate-900/5 rounded-xl"></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden md:block md:col-span-1 space-y-8">
              <div className="h-full bg-slate-900/5 rounded-2xl p-8 flex flex-col gap-6">
                <div className="h-4 w-28 bg-slate-900/10 rounded-full mb-2"></div>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center">
                      <div className="w-5 h-5 bg-indigo-50 rounded-full"></div>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="h-2 w-full bg-slate-900/10 rounded-full"></div>
                      <div className="h-2 w-2/3 bg-slate-900/5 rounded-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40"
      >
        <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Scroll to explore</span>
        <div className="w-px h-12 bg-gradient-to-b from-indigo-500 to-transparent"></div>
      </motion.div>
    </section>
  );
}
