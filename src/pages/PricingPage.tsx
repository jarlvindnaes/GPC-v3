import { Pricing } from "../components/Pricing";

export function PricingPage() {
  return (
    <main className="pt-32 pb-24">
      <div className="mx-auto mb-16 max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <h1 className="mb-6 font-display font-semibold text-3xl text-slate-900 tracking-tight sm:text-5xl md:text-6xl">
          Simple, transparent pricing
        </h1>
        <p className="mx-auto max-w-2xl text-base text-slate-600 sm:text-lg md:text-xl">
          We don't profit from your dependency. We profit from your capability.
        </p>
      </div>
      <Pricing />
    </main>
  );
}
