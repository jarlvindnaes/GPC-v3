import { motion } from "motion/react";
import { useState } from "react";
import { WebsiteCard } from "./WebsiteCard";
import { WebsiteCardDialog } from "./WebsiteCardDialog";

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
            <WebsiteCard
              key={feature.id}
              expandableIdentifier={feature.id}
              onPress={() => setSelectedFeature(feature.id)}
              showArrow={true}
              illustration={feature.visual}
              illustrationColor={feature.color}
            >
              <motion.div layoutId={`title-${feature.id}`} className="mb-6">
                <h3 className="mb-3 font-display font-semibold text-2xl text-slate-900">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.shortDescription}</p>
              </motion.div>
            </WebsiteCard>
          ))}
        </div>
      </div>

      {activeFeature && (
        <WebsiteCardDialog
          identifier={activeFeature.id}
          isOpen={selectedFeature !== null}
          onClose={() => setSelectedFeature(null)}
          title={activeFeature.title}
          visual={activeFeature.visual}
          color={activeFeature.color}
          description={activeFeature.longDescription}
          benefits={activeFeature.benefits}
        />
      )}
    </section>
  );
}
