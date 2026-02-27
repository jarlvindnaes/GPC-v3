import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Box, Layers, Users, Truck, TreePine, Cpu, QrCode } from "lucide-react";

export function StorytellingScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const lineProgress = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const op1 = useTransform(scrollYProgress, [0, 0.05, 0.1, 0.15], [0, 1, 1, 0]);
  const op2 = useTransform(scrollYProgress, [0.14, 0.19, 0.24, 0.29], [0, 1, 1, 0]);
  const op3 = useTransform(scrollYProgress, [0.28, 0.33, 0.38, 0.43], [0, 1, 1, 0]);
  const op4 = useTransform(scrollYProgress, [0.42, 0.47, 0.52, 0.57], [0, 1, 1, 0]);
  const op5 = useTransform(scrollYProgress, [0.57, 0.62, 0.67, 0.72], [0, 1, 1, 0]);
  const op6 = useTransform(scrollYProgress, [0.71, 0.76, 0.81, 0.86], [0, 1, 1, 0]);
  const op7 = useTransform(scrollYProgress, [0.85, 0.9, 0.95, 1], [0, 1, 1, 1]);

  const vOp1 = useTransform(scrollYProgress, [0, 0.1, 0.15], [1, 1, 0]);
  const vOp2 = useTransform(scrollYProgress, [0.1, 0.15, 0.25, 0.3], [0, 1, 1, 0]);
  const vOp3 = useTransform(scrollYProgress, [0.25, 0.3, 0.4, 0.45], [0, 1, 1, 0]);
  const vOp4 = useTransform(scrollYProgress, [0.4, 0.45, 0.55, 0.6], [0, 1, 1, 0]);
  const vOp5 = useTransform(scrollYProgress, [0.55, 0.6, 0.7, 0.75], [0, 1, 1, 0]);
  const vOp6 = useTransform(scrollYProgress, [0.7, 0.75, 0.85, 0.9], [0, 1, 1, 0]);
  const vOp7 = useTransform(scrollYProgress, [0.85, 0.9, 1], [0, 1, 1]);

  return (
    <section id="story" ref={containerRef} className="relative h-[700vh] bg-slate-900 text-white">
      <div className="sticky top-0 h-screen overflow-hidden flex items-center">
        
        {/* Metro Line */}
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-slate-800 md:-translate-x-1/2 z-0">
          <motion.div 
            className="absolute top-0 left-0 right-0 bg-indigo-500"
            style={{ height: lineProgress }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 flex flex-col md:flex-row items-center">
          
          {/* Text Content */}
          <div className="w-full md:w-1/2 pl-12 md:pl-0 md:pr-16 relative h-[400px] flex items-center">
            <motion.div style={{ opacity: op1 }} className="absolute inset-y-0 flex flex-col justify-center">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-6 text-indigo-400">
                <Box className="w-6 h-6" />
              </div>
              <h2 className="text-3xl md:text-5xl font-semibold mb-4 tracking-tight">The Finished Product</h2>
              <p className="text-lg text-slate-400">Your products have a story. Most of it is hidden. We start with the physical object—a chair, a table, a textile.</p>
            </motion.div>

            <motion.div style={{ opacity: op2 }} className="absolute inset-y-0 flex flex-col justify-center">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-6 text-indigo-400">
                <Layers className="w-6 h-6" />
              </div>
              <h2 className="text-3xl md:text-5xl font-semibold mb-4 tracking-tight">Exploded View</h2>
              <p className="text-lg text-slate-400">Upload your 3D models or BOMs. The product breaks down into its core components. Every screw, every sheet of plywood.</p>
            </motion.div>

            <motion.div style={{ opacity: op3 }} className="absolute inset-y-0 flex flex-col justify-center">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-6 text-indigo-400">
                <Users className="w-6 h-6" />
              </div>
              <h2 className="text-3xl md:text-5xl font-semibold mb-4 tracking-tight">Supplier Collaboration</h2>
              <p className="text-lg text-slate-400">Suppliers input their own data directly. No middlemen. No telephone game. Real transparency across the chain.</p>
            </motion.div>

            <motion.div style={{ opacity: op4 }} className="absolute inset-y-0 flex flex-col justify-center">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-6 text-indigo-400">
                <Truck className="w-6 h-6" />
              </div>
              <h2 className="text-3xl md:text-5xl font-semibold mb-4 tracking-tight">Material Transport</h2>
              <p className="text-lg text-slate-400">Track the journey. From the plywood factory to the assembly line, mapping the true environmental cost of logistics.</p>
            </motion.div>

            <motion.div style={{ opacity: op5 }} className="absolute inset-y-0 flex flex-col justify-center">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-6 text-indigo-400">
                <TreePine className="w-6 h-6" />
              </div>
              <h2 className="text-3xl md:text-5xl font-semibold mb-4 tracking-tight">Raw Materials</h2>
              <p className="text-lg text-slate-400">All the way back to the source. The wooden log, the raw ore. Complete visibility from the very beginning.</p>
            </motion.div>

            <motion.div style={{ opacity: op6 }} className="absolute inset-y-0 flex flex-col justify-center">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-6 text-indigo-400">
                <Cpu className="w-6 h-6" />
              </div>
              <h2 className="text-3xl md:text-5xl font-semibold mb-4 tracking-tight">The Engine</h2>
              <p className="text-lg text-slate-400">Our PEF-aligned LCA engine crunches the numbers and certificates. Automated impact calculation without the €15K consultant fee.</p>
            </motion.div>

            <motion.div style={{ opacity: op7 }} className="absolute inset-y-0 flex flex-col justify-center">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-6 text-indigo-400">
                <QrCode className="w-6 h-6" />
              </div>
              <h2 className="text-3xl md:text-5xl font-semibold mb-4 tracking-tight">Digital Product Passport</h2>
              <p className="text-lg text-slate-400">A living, GS1-compliant passport. Ready for ESPR 2026. Monetize spare parts and prove your claims to the world.</p>
            </motion.div>
          </div>

          {/* Visual Content */}
          <div className="hidden md:flex w-1/2 pl-16 relative h-[500px] items-center justify-center">
            
            {/* Visual 1: Chair */}
            <motion.div style={{ opacity: vOp1 }} className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 bg-slate-800 rounded-2xl border border-slate-700 flex items-center justify-center shadow-2xl">
                <Box className="w-32 h-32 text-slate-600" />
              </div>
            </motion.div>

            {/* Visual 2: Exploded */}
            <motion.div style={{ opacity: vOp2 }} className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-64 h-64">
                <motion.div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-16 bg-slate-700 rounded-lg border border-slate-600" />
                <motion.div className="absolute top-20 left-1/2 -translate-x-1/2 w-40 h-8 bg-slate-700 rounded-lg border border-slate-600" />
                <motion.div className="absolute bottom-4 left-4 w-4 h-24 bg-slate-700 rounded-full border border-slate-600" />
                <motion.div className="absolute bottom-4 right-4 w-4 h-24 bg-slate-700 rounded-full border border-slate-600" />
              </div>
            </motion.div>

            {/* Visual 3: Supplier */}
            <motion.div style={{ opacity: vOp3 }} className="absolute inset-0 flex items-center justify-center">
              <div className="w-72 bg-slate-800 rounded-xl border border-slate-700 p-6 shadow-2xl">
                <div className="h-4 w-24 bg-slate-700 rounded mb-6"></div>
                <div className="space-y-4">
                  <div className="h-10 w-full bg-slate-900 rounded border border-slate-700 flex items-center px-3"><span className="text-xs text-slate-500">Material Composition</span></div>
                  <div className="h-10 w-full bg-slate-900 rounded border border-slate-700 flex items-center px-3"><span className="text-xs text-slate-500">Origin</span></div>
                  <div className="h-10 w-full bg-indigo-500/20 rounded border border-indigo-500/50 flex items-center justify-center"><span className="text-xs text-indigo-400 font-medium">Submit Data</span></div>
                </div>
              </div>
            </motion.div>

            {/* Visual 4: Transport */}
            <motion.div style={{ opacity: vOp4 }} className="absolute inset-0 flex items-center justify-center">
              <div className="w-full max-w-sm">
                <div className="h-1 w-full bg-slate-800 rounded-full relative">
                  <motion.div 
                    className="absolute top-1/2 -translate-y-1/2 w-12 h-8 bg-slate-700 rounded border border-slate-600 flex items-center justify-center"
                    animate={{ left: ["0%", "80%"] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                  >
                    <Truck className="w-4 h-4 text-slate-400" />
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Visual 5: Raw Material */}
            <motion.div style={{ opacity: vOp5 }} className="absolute inset-0 flex items-center justify-center">
              <div className="w-48 h-48 bg-slate-800 rounded-full border border-slate-700 flex items-center justify-center shadow-2xl">
                <TreePine className="w-24 h-24 text-slate-600" />
              </div>
            </motion.div>

            {/* Visual 6: Engine */}
            <motion.div style={{ opacity: vOp6 }} className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 relative flex items-center justify-center">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                  className="absolute inset-0 border-2 border-dashed border-indigo-500/30 rounded-full"
                />
                <motion.div 
                  animate={{ rotate: -360 }}
                  transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                  className="absolute inset-4 border-2 border-dashed border-slate-600 rounded-full"
                />
                <div className="w-24 h-24 bg-indigo-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.3)]">
                  <Cpu className="w-10 h-10 text-white" />
                </div>
              </div>
            </motion.div>

            {/* Visual 7: DPP */}
            <motion.div style={{ opacity: vOp7 }} className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 bg-white rounded-2xl p-6 shadow-2xl transform rotate-3">
                <div className="w-full aspect-square bg-slate-100 rounded-xl mb-4 flex items-center justify-center">
                  <QrCode className="w-24 h-24 text-slate-900" />
                </div>
                <div className="h-4 w-3/4 bg-slate-200 rounded mb-2"></div>
                <div className="h-3 w-1/2 bg-slate-100 rounded mb-6"></div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-12 bg-slate-50 rounded border border-slate-100"></div>
                  <div className="h-12 bg-slate-50 rounded border border-slate-100"></div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}
