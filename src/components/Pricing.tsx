import { Check } from "lucide-react";
import { WebsiteButton } from "./WebsiteButton";

export function Pricing() {
  return (
    <section id="pricing" className="relative bg-brand-surface py-24">
      <div className="absolute top-0 right-0 left-0 h-px bg-gradient-to-r from-transparent via-brand/50 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-4 font-display font-semibold text-3xl text-balance text-brand-darkest tracking-tight md:text-4xl">
            Component-based pricing
          </h2>
          <p className="text-pretty text-brand-text text-lg">
            Pricing scales with actual product complexity, not arbitrary product counts.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <article className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-2 font-semibold text-brand-darkest text-lg">Free</h3>
            <div className="mb-4">
              <span className="font-bold text-3xl text-brand-darkest">€0</span>
            </div>
            <p className="mb-6 text-pretty text-slate-500 text-sm">Perfect for testing the platform.</p>
            <ul className="mb-8 flex-1 space-y-3">
              <li className="flex items-start gap-2 text-brand-text text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />3 hosted products
              </li>
              <li className="flex items-start gap-2 text-brand-text text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                Basic DPP generation
              </li>
            </ul>
            <WebsiteButton variant="outline" size="small" className="w-full">
              Get started
            </WebsiteButton>
          </article>

          <article className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-2 font-semibold text-brand-darkest text-lg">Core</h3>
            <div className="mb-4">
              <span className="font-bold text-3xl text-brand-darkest">€199</span>
              <span className="text-slate-500">/mo</span>
            </div>
            <p className="mb-6 text-pretty text-slate-500 text-sm">For small manufacturers starting out.</p>
            <ul className="mb-8 flex-1 space-y-3">
              <li className="flex items-start gap-2 text-brand-text text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                500 components included
              </li>
              <li className="flex items-start gap-2 text-brand-text text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                €50 / 1K overage
              </li>
              <li className="flex items-start gap-2 text-brand-text text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                €0.08 / calculation
              </li>
            </ul>
            <WebsiteButton variant="primary" size="small" className="w-full">
              Start Core
            </WebsiteButton>
          </article>

          <article className="relative flex flex-col rounded-2xl border border-brand-dark/40 bg-brand-deep p-6 shadow-xl">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand px-3 py-1 font-bold text-white text-xs uppercase tracking-wide">
              Most Popular
            </div>
            <h3 className="mb-2 font-semibold text-lg text-white">Pro</h3>
            <div className="mb-4">
              <span className="font-bold text-3xl text-white">€799</span>
              <span className="text-slate-400">/mo</span>
            </div>
            <p className="mb-6 text-pretty text-slate-400 text-sm">For growing brands with complex supply chains.</p>
            <ul className="mb-8 flex-1 space-y-3">
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-light" />
                5,000 components included
              </li>
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-light" />
                €30 / 1K overage
              </li>
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-light" />
                €0.08 / calculation
              </li>
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-light" />
                Advanced analytics
              </li>
            </ul>
            <WebsiteButton variant="primary" size="small" className="w-full">
              Start Pro
            </WebsiteButton>
          </article>

          <article className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-2 font-semibold text-brand-darkest text-lg">Enterprise</h3>
            <div className="mb-4">
              <span className="font-bold text-3xl text-brand-darkest">€2,499</span>
              <span className="text-slate-500">/mo</span>
            </div>
            <p className="mb-6 text-pretty text-slate-500 text-sm">For large manufacturers with extensive catalogs.</p>
            <ul className="mb-8 flex-1 space-y-3">
              <li className="flex items-start gap-2 text-brand-text text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                20,000 components included
              </li>
              <li className="flex items-start gap-2 text-brand-text text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                €20 / 1K overage
              </li>
              <li className="flex items-start gap-2 text-brand-text text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                €0.08 / calculation
              </li>
              <li className="flex items-start gap-2 text-brand-text text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                Custom integrations
              </li>
            </ul>
            <WebsiteButton variant="outline" size="small" className="w-full">
              Contact sales
            </WebsiteButton>
          </article>
        </div>
      </div>
    </section>
  );
}
