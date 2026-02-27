import { Pricing } from "../components/Pricing";

export function PricingPage() {
  return (
    <main className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
        <h1 className="text-5xl md:text-6xl font-display font-semibold text-slate-900 tracking-tight mb-6">
          Simple, transparent pricing
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          We don't profit from your dependency. We profit from your capability.
        </p>
      </div>
      <Pricing />
    </main>
  );
}
