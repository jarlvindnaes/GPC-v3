import { motion } from "motion/react";
import { useState } from "react";
import { useTheme } from "../theme";
import { FinishedProductCanvas, IphoneCommerceCanvas } from "./Native3DModels";
import { SupplyChainGlobe } from "./SupplyChainGlobe";
import { WebsiteCard } from "./WebsiteCard";
import { WebsiteCardDialog } from "./WebsiteCardDialog";

function ThemedSupplyChainGlobe() {
  const { theme } = useTheme();
  return <SupplyChainGlobe key={theme} />;
}

function ThemedFinishedProductCanvas() {
  const { theme } = useTheme();
  return <FinishedProductCanvas key={theme} />;
}

function ThemedIphoneCommerceCanvas() {
  const { theme } = useTheme();
  return <IphoneCommerceCanvas key={theme} />;
}

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
    fillVisual: true,
    fadeVisualOnResize: true,
    visual: <ThemedFinishedProductCanvas />
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
      <div className="relative mx-auto flex h-48 w-32 flex-col overflow-hidden rounded-2xl border-4 border-brand-dark bg-brand-deep">
        <div className="flex h-6 items-center justify-center border-brand-dark border-b">
          <div className="h-1.5 w-12 rounded-full bg-brand-dark"></div>
        </div>
        <div className="flex flex-1 flex-col gap-2 p-3">
          <div className="mb-2 h-16 w-full rounded-lg bg-brand-dark"></div>
          <div className="h-2 w-3/4 rounded bg-brand-dark/60"></div>
          <div className="h-2 w-1/2 rounded bg-brand-dark/60"></div>
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
      "Traditional Life Cycle Assessments are expensive and static. Our calculation engine uses your harvested supply chain data to dynamically generate EN 15804+A2 compliant LCAs. As your supply chain changes, your impact metrics update in real-time.",
    benefits: [
      "EN 15804+A2 / ISO 14025 / ISO 14040/44 · PEF-aligned",
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
              <span className="text-brand-text">{item.name}</span>
            </div>
            <span className="font-medium text-brand-dark">{item.value}</span>
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
    fillVisual: true,
    visual: <ThemedSupplyChainGlobe />
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
    fillVisual: true,
    fadeVisualOnResize: true,
    visual: <ThemedIphoneCommerceCanvas />
  }
];

const compactFeatureOrder = ["map", "lca", "dpp", "commerce"];

export function FeatureGrid({ variant = "full" }: { variant?: "full" | "compact" }) {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  const displayFeatures =
    variant === "compact" ? compactFeatureOrder.flatMap((id) => features.filter((f) => f.id === id)) : features;
  const activeFeature = displayFeatures.find((feature) => feature.id === selectedFeature);
  const activeIdx = activeFeature ? displayFeatures.indexOf(activeFeature) : -1;
  const dialogBadge =
    activeFeature == null
      ? ""
      : variant === "compact"
        ? `Gain ${activeIdx + 1}`
        : activeIdx < 3
          ? `Step ${activeIdx + 1}`
          : `Gain ${activeIdx - 2}`;
  const dialogBadgeClassName =
    variant === "compact" || activeIdx >= 3 ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600" : undefined;
  const gridClassName =
    variant === "compact"
      ? "grid grid-cols-1 gap-6 md:grid-cols-2"
      : "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3";

  return (
    <section id="features" className="relative bg-brand-surface py-32">
      <div className="absolute top-0 right-0 left-0 h-px bg-gradient-to-r from-transparent via-brand/50 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 max-w-3xl">
          <h2 className="mb-6 font-display font-semibold text-3xl text-brand-darkest tracking-tight sm:text-4xl md:text-5xl">
            Everything you need to build intelligent products.
          </h2>
          <p className="text-brand-text text-lg md:text-xl">
            A modular platform designed to scale with your ambition. From 3D model ingestion to direct-to-consumer
            commerce.
          </p>
        </div>

        <div className={gridClassName}>
          {displayFeatures.map((feature, featureIndex) => {
            const badge =
              variant === "compact"
                ? `Gain ${featureIndex + 1}`
                : featureIndex < 3
                  ? `Step ${featureIndex + 1}`
                  : `Gain ${featureIndex - 2}`;
            const badgeClassName =
              variant === "compact" || featureIndex >= 3
                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600"
                : undefined;

            return (
              <WebsiteCard
                key={feature.id}
                expandableIdentifier={feature.id}
                onPress={() => setSelectedFeature(feature.id)}
                showArrow={true}
                badge={badge}
                badgeClassName={badgeClassName}
                illustration={feature.visual}
                illustrationColor={feature.color}
                fillVisual={feature.fillVisual}
                fadeVisualOnResize={feature.fadeVisualOnResize}
              >
                <motion.div layoutId={`title-${feature.id}`} className="mb-6">
                  <h3 className="mb-3 font-display font-semibold text-2xl text-brand-darkest">{feature.title}</h3>
                  <p className="text-brand-text leading-relaxed">{feature.shortDescription}</p>
                </motion.div>
              </WebsiteCard>
            );
          })}
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
          badge={dialogBadge}
          badgeClassName={dialogBadgeClassName}
          fillVisual={activeFeature.fillVisual}
          fadeVisualOnResize={activeFeature.fadeVisualOnResize}
        />
      )}
    </section>
  );
}
