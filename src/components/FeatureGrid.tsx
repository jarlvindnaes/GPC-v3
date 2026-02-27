import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, X, CheckCircle2 } from "lucide-react";

const features = [
  {
    id: "ingest",
    title: "Ingest your 3D models",
    shortDesc: "Most design companies already have 3D models. We use them as the foundation for everything.",
    longDesc: "Start with what you already have. Import your existing CAD files directly into Product Connect. Our system automatically splits the model into individual components, performs volume and weight analysis, and classifies materials to prepare for supplier mapping.",
    benefits: ["Import STEP, SolidWorks, Inventor, Rhino, Fusion", "Auto-detect components and sub-assemblies", "Automatic volume & weight analysis", "Initial material classification"],
    color: "slate",
    visual: (
      <div className="flex gap-4 items-center justify-center w-full">
        <div className="w-16 h-16 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-slate-300 rounded-[4px] transform rotate-45"></div>
        </div>
        <div className="h-px w-8 bg-slate-300"></div>
        <div className="grid grid-cols-2 gap-2">
          {[1,2,3,4].map(i => <div key={i} className="w-6 h-6 bg-slate-200 rounded-md"></div>)}
        </div>
        <div className="h-px w-8 bg-slate-300"></div>
        <div className="w-16 h-16 bg-slate-800 rounded-xl shadow-sm flex items-center justify-center">
          <div className="w-8 h-4 bg-slate-600 rounded-sm"></div>
        </div>
      </div>
    )
  },
  {
    id: "harvest",
    title: "Harvest supply chain data",
    shortDesc: "We've made it incredibly easy for suppliers to verify component data on multiple platforms.",
    longDesc: "Stop chasing suppliers via email. Product Connect provides a secure, mobile-friendly portal for your suppliers to input and validate their material data, certifications, and origins directly into your product graph in minutes.",
    benefits: ["Suppliers validate specs via web + mobile app", "Capture material weight, origin & certifications", "Assign Product IDs per component", "Track grid mix, trade routes & raw material origins"],
    color: "emerald",
    visual: (
      <div className="relative w-32 h-48 bg-slate-900 rounded-2xl border-4 border-slate-800 mx-auto overflow-hidden flex flex-col">
        <div className="h-6 border-b border-slate-700 flex items-center justify-center">
          <div className="w-12 h-1.5 bg-slate-800 rounded-full"></div>
        </div>
        <div className="flex-1 p-3 flex flex-col gap-2">
          <div className="w-full h-16 bg-slate-800 rounded-lg mb-2"></div>
          <div className="w-3/4 h-2 bg-slate-700 rounded"></div>
          <div className="w-1/2 h-2 bg-slate-700 rounded"></div>
          <div className="mt-auto w-full h-6 bg-emerald-500 rounded-md"></div>
        </div>
      </div>
    )
  },
  {
    id: "lca",
    title: "Calculate the impact",
    shortDesc: "Turn supply chain data into verified CO₂ numbers for the whole product and every component.",
    longDesc: "Traditional Life Cycle Assessments are expensive and static. Our calculation engine uses your harvested supply chain data to dynamically generate EN 15804 compliant LCAs. As your supply chain changes, your impact metrics update in real-time.",
    benefits: ["EN 15804 compliant methodology", "Cradle-to-gate & cradle-to-grave analysis", "Transport, energy & end-of-life modelled", "Output: PDF, JSON, machine-readable EPD"],
    color: "indigo",
    visual: (
      <div className="flex flex-col gap-3 w-full max-w-xs mx-auto bg-white p-4 rounded-xl shadow-sm border border-indigo-100">
        <div className="flex justify-between items-end border-b border-slate-100 pb-2 mb-2">
          <div className="text-3xl font-display font-bold text-indigo-600">62.3</div>
          <div className="text-xs text-slate-500 mb-1">kg CO₂e total</div>
        </div>
        {[
          { name: "Backrest frame", val: "18.7 kg" },
          { name: "5-Star base", val: "15.8 kg" },
          { name: "Seat cushion", val: "12.4 kg" }
        ].map((item, i) => (
          <div key={i} className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
              <span className="text-slate-600">{item.name}</span>
            </div>
            <span className="text-slate-900 font-medium">{item.val}</span>
          </div>
        ))}
      </div>
    )
  },
  {
    id: "map",
    title: "Supply Chain Mapping",
    shortDesc: "Visualize your entire global footprint and calculate exact transport distances.",
    longDesc: "Gain unprecedented visibility into your physical supply chain. Product Connect maps every node from raw material extraction to final assembly, automatically calculating transport distances and identifying geographic risks.",
    benefits: ["Interactive global supply chain visualization", "Automatic transport distance calculation", "Identify geographic bottlenecks and risks", "Verify trade routes and origins"],
    color: "cyan",
    visual: (
      <div className="w-full h-32 bg-slate-900 rounded-xl overflow-hidden relative">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:10px_10px]"></div>
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 100">
          <path d="M 40 60 Q 80 20 120 50 T 180 30" fill="none" stroke="#06b6d4" strokeWidth="2" strokeDasharray="4 4" />
          <circle cx="40" cy="60" r="4" fill="#fff" />
          <circle cx="120" cy="50" r="4" fill="#fff" />
          <circle cx="180" cy="30" r="4" fill="#fff" />
        </svg>
      </div>
    )
  },
  {
    id: "dpp",
    title: "The Digital Product Passport",
    shortDesc: "One passport. Every product gets a verified, living document accessible to consumers.",
    longDesc: "Be ready for the 2026 ESPR mandate today. Generate beautiful, consumer-facing Digital Product Passports that host compliance documents, care instructions, and the complete environmental story of your product.",
    benefits: ["Full compliance with DPP, Right to Repair, CBAM", "Interactive 3D model viewer included", "Complete product history and impact data", "Verification certificates and ECO Labels"],
    color: "rose",
    visual: (
      <div className="w-32 h-32 bg-white rounded-xl shadow-sm border border-rose-100 p-4 mx-auto relative flex flex-col gap-2">
        <div className="w-8 h-8 bg-rose-100 rounded-full mx-auto mb-2 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-rose-500 rounded-full"></div>
        </div>
        <div className="h-2 w-full bg-slate-100 rounded"></div>
        <div className="h-2 w-3/4 bg-slate-100 rounded mx-auto"></div>
        <div className="h-2 w-1/2 bg-slate-100 rounded mx-auto"></div>
      </div>
    )
  },
  {
    id: "commerce",
    title: "Spare Parts & Commerce",
    shortDesc: "Convert unknown product owners into life-long customers. Embed a web-shop in every product.",
    longDesc: "Don't let the customer relationship end at the retailer. Use the DPP as a direct-to-consumer channel. When a customer scans their product, offer them the exact spare parts, compatible accessories, and care products they need.",
    benefits: ["Embed a web-shop in every product", "Sell spare parts using existing infrastructure", "Improve products using actual usage data", "Extend product life span conveniently"],
    color: "blue",
    visual: (
      <div className="flex gap-4 justify-center w-full">
        {[1, 2].map((i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -5 }}
            className="w-20 h-28 bg-white rounded-lg shadow-sm border border-blue-100 flex flex-col p-2"
          >
            <div className="flex-1 bg-slate-100 rounded mb-2"></div>
            <div className="h-2 w-full bg-slate-200 rounded mb-1"></div>
            <div className="h-2 w-1/2 bg-slate-200 rounded mb-3"></div>
            <div className="h-6 w-full bg-blue-500 rounded mt-auto"></div>
          </motion.div>
        ))}
      </div>
    )
  }
];

export function FeatureGrid() {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  const activeFeature = features.find(f => f.id === selectedFeature);

  return (
    <section id="features" className="py-32 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-display font-semibold text-slate-900 tracking-tight mb-6">
            Everything you need to build intelligent products.
          </h2>
          <p className="text-xl text-slate-600">
            A modular platform designed to scale with your ambition. From 3D model ingestion to direct-to-consumer commerce.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <motion.div
              key={feature.id}
              layoutId={`card-${feature.id}`}
              onClick={() => setSelectedFeature(feature.id)}
              className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm flex flex-col relative overflow-hidden group cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="absolute top-6 right-6 w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowUpRight className="w-5 h-5 text-slate-600" />
              </div>
              <motion.div layoutId={`title-${feature.id}`} className="mb-6">
                <h3 className="text-2xl font-display font-semibold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.shortDesc}</p>
              </motion.div>
              <motion.div layoutId={`visual-${feature.id}`} className="mt-auto pt-8">
                <div className={`bg-gradient-to-br from-${feature.color}-50 to-${feature.color}-100/50 rounded-2xl p-8 border border-${feature.color}-100/50 flex items-center justify-center min-h-[200px]`}>
                  {feature.visual}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedFeature && activeFeature && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedFeature(null)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
              <motion.div
                layoutId={`card-${activeFeature.id}`}
                className="bg-white rounded-[2rem] w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl pointer-events-auto flex flex-col md:flex-row"
              >
                {/* Left side: Visual */}
                <motion.div 
                  layoutId={`visual-${activeFeature.id}`}
                  className={`md:w-1/2 bg-gradient-to-br from-${activeFeature.color}-50 to-${activeFeature.color}-100/50 p-12 flex items-center justify-center border-b md:border-b-0 md:border-r border-slate-100`}
                >
                  <div className="scale-125 md:scale-150 transform w-full max-w-sm">
                    {activeFeature.visual}
                  </div>
                </motion.div>
                
                {/* Right side: Content */}
                <div className="md:w-1/2 p-8 md:p-12 relative flex flex-col">
                  <button 
                    onClick={() => setSelectedFeature(null)}
                    className="absolute top-6 right-6 w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-600" />
                  </button>
                  
                  <motion.div layoutId={`title-${activeFeature.id}`}>
                    <h3 className="text-3xl font-display font-semibold text-slate-900 mb-6 pr-12">{activeFeature.title}</h3>
                  </motion.div>
                  
                  <p className="text-lg text-slate-600 leading-relaxed mb-8">
                    {activeFeature.longDesc}
                  </p>
                  
                  <div className="space-y-4 mb-12">
                    {activeFeature.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <CheckCircle2 className={`w-6 h-6 text-${activeFeature.color}-500 shrink-0`} />
                        <span className="text-slate-700 font-medium">{benefit}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-auto pt-8 border-t border-slate-100">
                    <button className="w-full bg-slate-900 text-white px-6 py-4 rounded-xl text-lg font-medium hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                      Explore {activeFeature.title} <ArrowUpRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
