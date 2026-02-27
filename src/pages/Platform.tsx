import { FeatureGrid } from "../components/FeatureGrid";
import { IntegrationSection } from "../components/IntegrationSection";
import { Box, Smartphone, Calculator, QrCode, ArrowRight } from "lucide-react";

export function Platform() {
  return (
    <main className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <h1 className="text-5xl md:text-6xl font-display font-semibold text-slate-900 tracking-tight mb-6">
          The Product Connect Platform
        </h1>
        <p className="text-xl text-slate-600 max-w-3xl">
          A comprehensive suite of tools designed to trace, prove, and monetize your physical products. From raw materials to the end consumer.
        </p>
      </div>

      {/* Workflow Section */}
      <div className="bg-slate-900 py-24 mb-24 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-semibold tracking-tight mb-4">
              How it works
            </h2>
            <p className="text-lg text-slate-400">
              A seamless flow from your existing CAD files to a consumer-facing Digital Product Passport.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[12.5%] right-[12.5%] h-0.5 bg-slate-800 z-0"></div>

            {/* Step 1 */}
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-6 shadow-xl">
                <Box className="w-10 h-10 text-indigo-400" />
              </div>
              <div className="text-sm font-bold text-indigo-400 tracking-widest uppercase mb-2">Step 01</div>
              <h3 className="text-xl font-semibold mb-3">Ingest 3D Model</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Import STEP, SolidWorks, or Rhino files. We auto-detect components, analyze volume, and classify materials.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-6 shadow-xl">
                <Smartphone className="w-10 h-10 text-emerald-400" />
              </div>
              <div className="text-sm font-bold text-emerald-400 tracking-widest uppercase mb-2">Step 02</div>
              <h3 className="text-xl font-semibold mb-3">Harvest Data</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Suppliers validate specs via web or mobile app. Capture material weight, origin, and certifications instantly.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-6 shadow-xl">
                <Calculator className="w-10 h-10 text-cyan-400" />
              </div>
              <div className="text-sm font-bold text-cyan-400 tracking-widest uppercase mb-2">Step 03</div>
              <h3 className="text-xl font-semibold mb-3">Calculate Impact</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Turn supply chain data into verified CO₂ numbers. EN 15804 compliant, cradle-to-grave analysis.
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-6 shadow-xl">
                <QrCode className="w-10 h-10 text-rose-400" />
              </div>
              <div className="text-sm font-bold text-rose-400 tracking-widest uppercase mb-2">Step 04</div>
              <h3 className="text-xl font-semibold mb-3">Generate DPP</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Publish a verified, living document accessible to consumers. Ready for ESPR, Right to Repair, and commerce.
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
