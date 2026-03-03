import { Check } from "lucide-react";

export function Pricing() {
  return (
    <section id="pricing" className="border-slate-100 border-t bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-4 font-display font-semibold text-3xl text-slate-900 tracking-tight md:text-4xl">
            Component-based pricing
          </h2>
          <p className="text-lg text-slate-600">
            Pricing scales with actual product complexity, not arbitrary product counts.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Free */}
          <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-2 font-semibold text-lg text-slate-900">Free</h3>
            <div className="mb-4">
              <span className="font-bold text-3xl text-slate-900">€0</span>
            </div>
            <p className="mb-6 text-slate-500 text-sm">Perfect for testing the platform.</p>
            <ul className="mb-8 flex-1 space-y-3">
              <li className="flex items-start gap-2 text-slate-600 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />3 hosted products
              </li>
              <li className="flex items-start gap-2 text-slate-600 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />
                Basic DPP generation
              </li>
            </ul>
            <button
              type="button"
              className="w-full rounded-lg border border-slate-200 px-4 py-3 font-medium text-slate-900 transition-colors hover:bg-slate-50"
            >
              Get started
            </button>
          </div>

          {/* Core */}
          <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-2 font-semibold text-lg text-slate-900">Core</h3>
            <div className="mb-4">
              <span className="font-bold text-3xl text-slate-900">€199</span>
              <span className="text-slate-500">/mo</span>
            </div>
            <p className="mb-6 text-slate-500 text-sm">For small manufacturers starting out.</p>
            <ul className="mb-8 flex-1 space-y-3">
              <li className="flex items-start gap-2 text-slate-600 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />
                500 components included
              </li>
              <li className="flex items-start gap-2 text-slate-600 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />
                €50 / 1K overage
              </li>
              <li className="flex items-start gap-2 text-slate-600 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />
                €0.08 / calculation
              </li>
            </ul>
            <button
              type="button"
              className="w-full rounded-lg bg-slate-900 px-4 py-3 font-medium text-white transition-colors hover:bg-slate-800"
            >
              Start Core
            </button>
          </div>

          {/* Pro */}
          <div className="relative flex flex-col rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500 px-3 py-1 font-bold text-white text-xs uppercase tracking-wide">
              Most Popular
            </div>
            <h3 className="mb-2 font-semibold text-lg text-white">Pro</h3>
            <div className="mb-4">
              <span className="font-bold text-3xl text-white">€799</span>
              <span className="text-slate-400">/mo</span>
            </div>
            <p className="mb-6 text-slate-400 text-sm">For growing brands with complex supply chains.</p>
            <ul className="mb-8 flex-1 space-y-3">
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-indigo-400" />
                5,000 components included
              </li>
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-indigo-400" />
                €30 / 1K overage
              </li>
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-indigo-400" />
                €0.08 / calculation
              </li>
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-indigo-400" />
                Advanced analytics
              </li>
            </ul>
            <button
              type="button"
              className="w-full rounded-lg bg-indigo-500 px-4 py-3 font-medium text-white transition-colors hover:bg-indigo-600"
            >
              Start Pro
            </button>
          </div>

          {/* Enterprise */}
          <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-2 font-semibold text-lg text-slate-900">Enterprise</h3>
            <div className="mb-4">
              <span className="font-bold text-3xl text-slate-900">€2,499</span>
              <span className="text-slate-500">/mo</span>
            </div>
            <p className="mb-6 text-slate-500 text-sm">For large manufacturers with extensive catalogs.</p>
            <ul className="mb-8 flex-1 space-y-3">
              <li className="flex items-start gap-2 text-slate-600 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />
                20,000 components included
              </li>
              <li className="flex items-start gap-2 text-slate-600 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />
                €20 / 1K overage
              </li>
              <li className="flex items-start gap-2 text-slate-600 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />
                €0.08 / calculation
              </li>
              <li className="flex items-start gap-2 text-slate-600 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />
                Custom integrations
              </li>
            </ul>
            <button
              type="button"
              className="w-full rounded-lg border border-slate-200 px-4 py-3 font-medium text-slate-900 transition-colors hover:bg-slate-50"
            >
              Contact sales
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
