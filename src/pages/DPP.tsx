import { QrCode, ArrowRight, ShieldCheck, Link2, Smartphone, RefreshCw, Wrench, Leaf, TrendingUp, ShoppingBag, Database } from "lucide-react";
import { DPPInteractiveProduct } from "../components/Native3DModels";

export function DPP() {
  return (
    <main className="pt-32 pb-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-sm font-medium mb-6 border border-indigo-100">
            <QrCode className="w-4 h-4" />
            Digital Product Passports
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-semibold text-slate-900 tracking-tight leading-[1.1] mb-6">
            The secure link to your end user.
          </h1>
          <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl">
            A living, GS1-compliant passport. Ready for ESPR 2026. Monetize spare parts and prove your claims to the world directly through a secure, scannable interface.
          </p>
          <button className="bg-slate-900 text-white px-6 py-3 rounded-full text-base font-medium hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
            Create your first DPP <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <DPPInteractiveProduct />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
            <ShieldCheck className="w-8 h-8 text-indigo-600 mb-6" />
            <h3 className="text-2xl font-display font-semibold text-slate-900 mb-4">ESPR Compliant</h3>
            <p className="text-slate-600">Built from the ground up to meet the strict requirements of the Ecodesign for Sustainable Products Regulation coming in 2026.</p>
          </div>
          <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
            <Smartphone className="w-8 h-8 text-indigo-600 mb-6" />
            <h3 className="text-2xl font-display font-semibold text-slate-900 mb-4">Consumer Facing</h3>
            <p className="text-slate-600">A beautiful, mobile-optimized experience that tells your product's story, shows its impact, and builds brand trust.</p>
          </div>
          <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
            <Link2 className="w-8 h-8 text-indigo-600 mb-6" />
            <h3 className="text-2xl font-display font-semibold text-slate-900 mb-4">Direct Connection</h3>
            <p className="text-slate-600">Bypass retailers and connect directly with the end user. Offer spare parts, care instructions, and upgrades instantly.</p>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-slate-950 py-32 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-display font-semibold tracking-tight mb-6">
              Value for everyone in the chain.
            </h2>
            <p className="text-xl text-slate-400">
              The Digital Product Passport isn't just a compliance tool. It's a new medium for customer relationship and circular economy.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 lg:gap-24">
            {/* Manufacturer Benefits */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-sm font-medium mb-8 border border-indigo-500/30">
                For Manufacturers
              </div>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-2">Convert unknown owners</h4>
                    <p className="text-slate-400 leading-relaxed">Turn anonymous secondary-market buyers into life-long customers through direct registration.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                    <ShoppingBag className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-2">Embed a web-shop in every product</h4>
                    <p className="text-slate-400 leading-relaxed">Sell spare parts and product upgrades using your existing infrastructure, directly from the passport.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                    <Database className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-2">Improve via usage data</h4>
                    <p className="text-slate-400 leading-relaxed">Gather actual usage data and feedback to inform your next generation of product design.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-2">Full regulatory compliance</h4>
                    <p className="text-slate-400 leading-relaxed">Ready for DPP, "Right to repair", LEAN, CBAM, and ECO Label requirements.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Owner Benefits */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-sm font-medium mb-8 border border-emerald-500/30">
                For Product Owners
              </div>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                    <Wrench className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-2">Convenient repair & upgrade</h4>
                    <p className="text-slate-400 leading-relaxed">Instantly find the exact spare parts, manuals, and service providers for your specific product.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                    <RefreshCw className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-2">Extend product life span</h4>
                    <p className="text-slate-400 leading-relaxed">Access care instructions and official upgrades to keep the product in circulation longer.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                    <Leaf className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-2">Save resources</h4>
                    <p className="text-slate-400 leading-relaxed">Make the sustainable choice by repairing instead of replacing, backed by verified environmental data.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
