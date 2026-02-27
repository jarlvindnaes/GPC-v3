import { Check } from "lucide-react";

export function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-slate-50 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-semibold text-slate-900 tracking-tight mb-4">
            Component-based pricing
          </h2>
          <p className="text-lg text-slate-600">
            Pricing scales with actual product complexity, not arbitrary product counts.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {/* Free */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Free</h3>
            <div className="mb-4">
              <span className="text-3xl font-bold text-slate-900">€0</span>
            </div>
            <p className="text-sm text-slate-500 mb-6">Perfect for testing the platform.</p>
            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex items-start gap-2 text-sm text-slate-600">
                <Check className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                3 hosted products
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-600">
                <Check className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                Basic DPP generation
              </li>
            </ul>
            <button className="w-full py-2 px-4 rounded-lg border border-slate-200 text-slate-900 font-medium hover:bg-slate-50 transition-colors">
              Get started
            </button>
          </div>

          {/* Core */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Core</h3>
            <div className="mb-4">
              <span className="text-3xl font-bold text-slate-900">€199</span>
              <span className="text-slate-500">/mo</span>
            </div>
            <p className="text-sm text-slate-500 mb-6">For small manufacturers starting out.</p>
            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex items-start gap-2 text-sm text-slate-600">
                <Check className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                500 components included
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-600">
                <Check className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                €50 / 1K overage
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-600">
                <Check className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                €0.08 / calculation
              </li>
            </ul>
            <button className="w-full py-2 px-4 rounded-lg bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors">
              Start Core
            </button>
          </div>

          {/* Pro */}
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-col relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
              Most Popular
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Pro</h3>
            <div className="mb-4">
              <span className="text-3xl font-bold text-white">€799</span>
              <span className="text-slate-400">/mo</span>
            </div>
            <p className="text-sm text-slate-400 mb-6">For growing brands with complex supply chains.</p>
            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex items-start gap-2 text-sm text-slate-300">
                <Check className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                5,000 components included
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-300">
                <Check className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                €30 / 1K overage
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-300">
                <Check className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                €0.08 / calculation
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-300">
                <Check className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                Advanced analytics
              </li>
            </ul>
            <button className="w-full py-2 px-4 rounded-lg bg-indigo-500 text-white font-medium hover:bg-indigo-600 transition-colors">
              Start Pro
            </button>
          </div>

          {/* Enterprise */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Enterprise</h3>
            <div className="mb-4">
              <span className="text-3xl font-bold text-slate-900">€2,499</span>
              <span className="text-slate-500">/mo</span>
            </div>
            <p className="text-sm text-slate-500 mb-6">For large manufacturers with extensive catalogs.</p>
            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex items-start gap-2 text-sm text-slate-600">
                <Check className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                20,000 components included
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-600">
                <Check className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                €20 / 1K overage
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-600">
                <Check className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                €0.08 / calculation
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-600">
                <Check className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                Custom integrations
              </li>
            </ul>
            <button className="w-full py-2 px-4 rounded-lg border border-slate-200 text-slate-900 font-medium hover:bg-slate-50 transition-colors">
              Contact sales
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
