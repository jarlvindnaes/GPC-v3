import { Box, Calculator, QrCode, Smartphone } from "lucide-react";
import { FeatureGrid } from "../components/FeatureGrid";
import { IntegrationSection } from "../components/IntegrationSection";

export function Platform() {
  return (
    <main className="pt-32 pb-24">
      <div className="mx-auto mb-16 max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="mb-6 font-display font-semibold text-3xl text-slate-900 tracking-tight sm:text-5xl md:text-6xl">
          The Product Connect Platform
        </h1>
        <p className="max-w-3xl text-base text-slate-600 sm:text-lg md:text-xl">
          A comprehensive suite of tools designed to trace, prove, and monetize your physical products. From raw
          materials to the end consumer.
        </p>
      </div>

      {/* Workflow Section */}
      <div className="mb-24 bg-slate-900 py-24 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-4 font-display font-semibold text-3xl tracking-tight md:text-4xl">How it works</h2>
            <p className="text-lg text-slate-400">
              A seamless flow from your existing CAD files to a consumer-facing Digital Product Passport.
            </p>
          </div>

          <div className="relative grid gap-8 sm:grid-cols-2 md:grid-cols-4">
            {/* Connecting Line (Desktop) */}
            <div className="absolute top-12 right-[12.5%] left-[12.5%] z-0 hidden h-0.5 bg-slate-800 md:block"></div>

            {/* Step 1 */}
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-2xl border border-slate-700 bg-slate-800 shadow-xl">
                <Box className="h-10 w-10 text-indigo-400" />
              </div>
              <div className="mb-2 font-bold text-indigo-400 text-sm uppercase tracking-widest">Step 01</div>
              <h3 className="mb-3 font-semibold text-xl">Ingest 3D Model</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Import STEP, SolidWorks, or Rhino files. We auto-detect components, analyze volume, and classify
                materials.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-2xl border border-slate-700 bg-slate-800 shadow-xl">
                <Smartphone className="h-10 w-10 text-emerald-400" />
              </div>
              <div className="mb-2 font-bold text-emerald-400 text-sm uppercase tracking-widest">Step 02</div>
              <h3 className="mb-3 font-semibold text-xl">Harvest Data</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Suppliers validate specs via web or mobile app. Capture material weight, origin, and certifications
                instantly.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-2xl border border-slate-700 bg-slate-800 shadow-xl">
                <Calculator className="h-10 w-10 text-cyan-400" />
              </div>
              <div className="mb-2 font-bold text-cyan-400 text-sm uppercase tracking-widest">Step 03</div>
              <h3 className="mb-3 font-semibold text-xl">Calculate Impact</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Turn supply chain data into verified CO₂ numbers. EN 15804 compliant, cradle-to-grave analysis.
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-2xl border border-slate-700 bg-slate-800 shadow-xl">
                <QrCode className="h-10 w-10 text-rose-400" />
              </div>
              <div className="mb-2 font-bold text-rose-400 text-sm uppercase tracking-widest">Step 04</div>
              <h3 className="mb-3 font-semibold text-xl">Generate DPP</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Publish a verified, living document accessible to consumers. Ready for ESPR, Right to Repair, and
                commerce.
              </p>
            </div>
          </div>
        </div>
      </div>

      <FeatureGrid />
      <IntegrationSection />
    </main>
  );
}
