import { motion } from "motion/react";
import { ArrowRight, PlayCircle } from "lucide-react";

export function Hero() {
  return (
    <section className="pt-32 pb-20 md:pt-48 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden relative">
      {/* Background abstract shapes */}
      <div className="absolute top-0 right-0 -z-10 w-[800px] h-[800px] bg-gradient-to-br from-indigo-50 to-slate-100 rounded-full blur-3xl opacity-50 translate-x-1/3 -translate-y-1/4"></div>
      
      <div className="max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-sm font-medium mb-6 border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            ESPR 2026 Ready
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-semibold text-slate-900 tracking-tight leading-[1.1] mb-6">
            Revolutionize Your Furniture Manufacturing with Product Connect.
          </h1>
          <p className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl">
            Streamline your supply chain, integrate data seamlessly, and track environmental impact. The infrastructure that gives intelligence to physical products.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-slate-900 text-white px-6 py-3 rounded-full text-base font-medium hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
              Start now <ArrowRight className="w-4 h-4" />
            </button>
            <button className="bg-white text-slate-900 border border-slate-200 px-6 py-3 rounded-full text-base font-medium hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
              <PlayCircle className="w-5 h-5 text-slate-400" /> Book a demo
            </button>
          </div>
        </motion.div>
      </div>

      {/* Dashboard Mockup */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="mt-20 relative rounded-2xl border border-slate-200/60 bg-white shadow-2xl shadow-slate-200/50 overflow-hidden"
      >
        <div className="h-12 bg-slate-50 border-b border-slate-100 flex items-center px-4 gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-slate-200"></div>
            <div className="w-3 h-3 rounded-full bg-slate-200"></div>
            <div className="w-3 h-3 rounded-full bg-slate-200"></div>
          </div>
        </div>
        <div className="aspect-[16/9] bg-slate-50 p-8 flex items-center justify-center relative overflow-hidden">
          {/* Abstract representation of the dashboard */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="relative w-full max-w-4xl grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-6">
              <div className="h-64 bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col">
                <div className="h-4 w-32 bg-slate-100 rounded mb-4"></div>
                <div className="flex-1 flex items-end gap-2">
                  {[40, 70, 45, 90, 65, 85, 50].map((h, i) => (
                    <div key={i} className="flex-1 bg-indigo-50 rounded-t-sm" style={{ height: `${h}%` }}></div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="h-32 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                  <div className="h-4 w-24 bg-slate-100 rounded mb-4"></div>
                  <div className="h-8 w-16 bg-slate-800 rounded"></div>
                </div>
                <div className="h-32 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                  <div className="h-4 w-24 bg-slate-100 rounded mb-4"></div>
                  <div className="h-8 w-16 bg-slate-800 rounded"></div>
                </div>
              </div>
            </div>
            <div className="col-span-1 space-y-6">
              <div className="h-full bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col gap-4">
                <div className="h-4 w-24 bg-slate-100 rounded mb-2"></div>
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-2 w-full bg-slate-100 rounded"></div>
                      <div className="h-2 w-2/3 bg-slate-50 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
