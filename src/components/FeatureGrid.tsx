import { ArrowUpRight, CheckCircle2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const features = [
  {
    id: "ingest",
    title: "Ingest your 3D models",
    shortDescription: "Most design companies already have 3D models. We use them as the foundation for everything.",
    longDescription:
      "Start with what you already have. Import your existing CAD files directly into Product Connect. Our system automatically splits the model into individual components, performs volume and weight analysis, and classifies materials to prepare for supplier mapping.",
    benefits: [
      "Import STEP, SolidWorks, Inventor, Rhino, Fusion",
      "Auto-detect components and sub-assemblies",
      "Automatic volume & weight analysis",
      "Initial material classification"
    ],
    color: "slate",
    visual: (
      <div className="flex w-full items-center justify-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="h-8 w-8 rotate-45 transform rounded-[4px] border-2 border-slate-300"></div>
        </div>
        <div className="h-px w-8 bg-slate-300"></div>
        <div className="grid grid-cols-2 gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-6 w-6 rounded-md bg-slate-200"></div>
          ))}
        </div>
        <div className="h-px w-8 bg-slate-300"></div>
        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-slate-800 shadow-sm">
          <div className="h-4 w-8 rounded-sm bg-slate-600"></div>
        </div>
      </div>
    )
  },
  {
    id: "harvest",
    title: "Harvest supply chain data",
    shortDescription: "We've made it incredibly easy for suppliers to verify component data on multiple platforms.",
    longDescription:
      "Stop chasing suppliers via email. Product Connect provides a secure, mobile-friendly portal for your suppliers to input and validate their material data, certifications, and origins directly into your product graph in minutes.",
    benefits: [
      "Suppliers validate specs via web + mobile app",
      "Capture material weight, origin & certifications",
      "Assign Product IDs per component",
      "Track grid mix, trade routes & raw material origins"
    ],
    color: "emerald",
    visual: (
      <div className="relative mx-auto flex h-48 w-32 flex-col overflow-hidden rounded-2xl border-4 border-slate-800 bg-slate-900">
        <div className="flex h-6 items-center justify-center border-slate-700 border-b">
          <div className="h-1.5 w-12 rounded-full bg-slate-800"></div>
        </div>
        <div className="flex flex-1 flex-col gap-2 p-3">
          <div className="mb-2 h-16 w-full rounded-lg bg-slate-800"></div>
          <div className="h-2 w-3/4 rounded bg-slate-700"></div>
          <div className="h-2 w-1/2 rounded bg-slate-700"></div>
          <div className="mt-auto h-6 w-full rounded-md bg-emerald-500"></div>
        </div>
      </div>
    )
  },
  {
    id: "lca",
    title: "Calculate the impact",
    shortDescription: "Turn supply chain data into verified CO₂ numbers for the whole product and every component.",
    longDescription:
      "Traditional Life Cycle Assessments are expensive and static. Our calculation engine uses your harvested supply chain data to dynamically generate EN 15804 compliant LCAs. As your supply chain changes, your impact metrics update in real-time.",
    benefits: [
      "EN 15804 compliant methodology",
      "Cradle-to-gate & cradle-to-grave analysis",
      "Transport, energy & end-of-life modelled",
      "Output: PDF, JSON, machine-readable EPD"
    ],
    color: "indigo",
    visual: (
      <div className="mx-auto flex w-full max-w-xs flex-col gap-3 rounded-xl border border-indigo-100 bg-white p-4 shadow-sm">
        <div className="mb-2 flex items-end justify-between border-slate-100 border-b pb-2">
          <div className="font-bold font-display text-3xl text-indigo-600">62.3</div>
          <div className="mb-1 text-slate-500 text-xs">kg CO₂e total</div>
        </div>
        {[
          { name: "Backrest frame", value: "18.7 kg" },
          { name: "5-Star base", value: "15.8 kg" },
          { name: "Seat cushion", value: "12.4 kg" }
        ].map((item) => (
          <div key={item.name} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-indigo-400"></div>
              <span className="text-slate-600">{item.name}</span>
            </div>
            <span className="font-medium text-slate-900">{item.value}</span>
          </div>
        ))}
      </div>
    )
  },
  {
    id: "map",
    title: "Supply Chain Mapping",
    shortDescription: "Visualize your entire global footprint and calculate exact transport distances.",
    longDescription:
      "Gain unprecedented visibility into your physical supply chain. Product Connect maps every node from raw material extraction to final assembly, automatically calculating transport distances and identifying geographic risks.",
    benefits: [
      "Interactive global supply chain visualization",
      "Automatic transport distance calculation",
      "Identify geographic bottlenecks and risks",
      "Verify trade routes and origins"
    ],
    color: "cyan",
    visual: (
      <div className="relative h-32 w-full overflow-hidden rounded-xl bg-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:10px_10px] opacity-30"></div>
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 200 100">
          <title>Supply chain route map</title>
          <path
            d="M 40 60 Q 80 20 120 50 T 180 30"
            fill="none"
            stroke="#06b6d4"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
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
    shortDescription: "One passport. Every product gets a verified, living document accessible to consumers.",
    longDescription:
      "Be ready for the 2026 ESPR mandate today. Generate beautiful, consumer-facing Digital Product Passports that host compliance documents, care instructions, and the complete environmental story of your product.",
    benefits: [
      "Full compliance with DPP, Right to Repair, CBAM",
      "Interactive 3D model viewer included",
      "Complete product history and impact data",
      "Verification certificates and ECO Labels"
    ],
    color: "rose",
    visual: (
      <div className="relative mx-auto flex h-32 w-32 flex-col gap-2 rounded-xl border border-rose-100 bg-white p-4 shadow-sm">
        <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-rose-100">
          <div className="h-4 w-4 rounded-full border-2 border-rose-500"></div>
        </div>
        <div className="h-2 w-full rounded bg-slate-100"></div>
        <div className="mx-auto h-2 w-3/4 rounded bg-slate-100"></div>
        <div className="mx-auto h-2 w-1/2 rounded bg-slate-100"></div>
      </div>
    )
  },
  {
    id: "commerce",
    title: "Spare Parts & Commerce",
    shortDescription: "Convert unknown product owners into life-long customers. Embed a web-shop in every product.",
    longDescription:
      "Don't let the customer relationship end at the retailer. Use the DPP as a direct-to-consumer channel. When a customer scans their product, offer them the exact spare parts, compatible accessories, and care products they need.",
    benefits: [
      "Embed a web-shop in every product",
      "Sell spare parts using existing infrastructure",
      "Improve products using actual usage data",
      "Extend product life span conveniently"
    ],
    color: "blue",
    visual: (
      <div className="flex w-full justify-center gap-4">
        {[1, 2].map((i) => (
          <motion.div
            key={i}
            whileHover={{ y: -5 }}
            className="flex h-28 w-20 flex-col rounded-lg border border-blue-100 bg-white p-2 shadow-sm"
          >
            <div className="mb-2 flex-1 rounded bg-slate-100"></div>
            <div className="mb-1 h-2 w-full rounded bg-slate-200"></div>
            <div className="mb-3 h-2 w-1/2 rounded bg-slate-200"></div>
            <div className="mt-auto h-6 w-full rounded bg-blue-500"></div>
          </motion.div>
        ))}
      </div>
    )
  }
];

export function FeatureGrid() {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  const activeFeature = features.find((feature) => feature.id === selectedFeature);

  return (
    <section id="features" className="relative bg-slate-50 py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 max-w-3xl">
          <h2 className="mb-6 font-display font-semibold text-3xl text-slate-900 tracking-tight sm:text-4xl md:text-5xl">
            Everything you need to build intelligent products.
          </h2>
          <p className="text-lg text-slate-600 md:text-xl">
            A modular platform designed to scale with your ambition. From 3D model ingestion to direct-to-consumer
            commerce.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <motion.div
              key={feature.id}
              layoutId={`card-${feature.id}`}
              onClick={() => setSelectedFeature(feature.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  setSelectedFeature(feature.id);
                }
              }}
              className="group relative flex cursor-pointer flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6 md:p-8"
            >
              <div className="absolute top-6 right-6 flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 opacity-0 transition-opacity group-hover:opacity-100">
                <ArrowUpRight className="h-5 w-5 text-slate-600" />
              </div>
              <motion.div layoutId={`title-${feature.id}`} className="mb-6">
                <h3 className="mb-3 font-display font-semibold text-2xl text-slate-900">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.shortDescription}</p>
              </motion.div>
              <motion.div layoutId={`visual-${feature.id}`} className="mt-auto pt-8">
                <div
                  className={`bg-gradient-to-br from-${feature.color}-50 to-${feature.color}-100/50 rounded-2xl border p-6 md:p-8 border-${feature.color}-100/50 flex min-h-[150px] items-center justify-center md:min-h-[200px]`}
                >
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
              aria-hidden="true"
              className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm"
            />
            <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
              <motion.div
                layoutId={`card-${activeFeature.id}`}
                role="dialog"
                aria-modal="true"
                aria-label={activeFeature.title}
                className="pointer-events-auto flex max-h-[90vh] w-full max-w-5xl flex-col overflow-y-auto rounded-[2rem] bg-white shadow-2xl md:flex-row"
              >
                {/* Left side: Visual */}
                <motion.div
                  layoutId={`visual-${activeFeature.id}`}
                  className={`bg-gradient-to-br md:w-1/2 from-${activeFeature.color}-50 to-${activeFeature.color}-100/50 flex items-center justify-center border-slate-100 border-b p-6 sm:p-8 md:border-r md:border-b-0 md:p-12`}
                >
                  <div className="w-full max-w-sm scale-125 transform md:scale-150">{activeFeature.visual}</div>
                </motion.div>

                {/* Right side: Content */}
                <div className="relative flex flex-col p-5 sm:p-8 md:w-1/2 md:p-12">
                  <button
                    type="button"
                    onClick={() => setSelectedFeature(null)}
                    aria-label="Close feature details"
                    className="absolute top-6 right-6 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 transition-colors hover:bg-slate-200"
                  >
                    <X className="h-5 w-5 text-slate-600" />
                  </button>

                  <motion.div layoutId={`title-${activeFeature.id}`}>
                    <h3 className="mb-6 pr-12 font-display font-semibold text-2xl text-slate-900 sm:text-3xl">
                      {activeFeature.title}
                    </h3>
                  </motion.div>

                  <p className="mb-8 text-lg text-slate-600 leading-relaxed">{activeFeature.longDescription}</p>

                  <div className="mb-12 space-y-4">
                    {activeFeature.benefits.map((benefit) => (
                      <div key={benefit} className="flex items-start gap-3">
                        <CheckCircle2 className={`h-6 w-6 text-${activeFeature.color}-500 shrink-0`} />
                        <span className="font-medium text-slate-700">{benefit}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-auto border-slate-100 border-t pt-8">
                    <button
                      type="button"
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-4 font-medium text-lg text-white transition-colors hover:bg-slate-800"
                    >
                      Explore {activeFeature.title} <ArrowUpRight className="h-5 w-5" />
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
