export function About() {
  return (
    <main className="pt-32 pb-24">
      <div className="mx-auto mb-16 max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="mb-6 font-display font-semibold text-3xl text-brand-darkest tracking-tight sm:text-5xl md:text-6xl">
          About Product Connect
        </h1>
        <p className="max-w-3xl text-base text-brand-text sm:text-lg md:text-xl">
          We are building the infrastructure that gives intelligence to physical products.
        </p>
      </div>
      <div className="mx-auto max-w-3xl space-y-8 px-4 sm:px-6 lg:px-8">
        <p className="text-base text-brand-text leading-relaxed sm:text-lg">
          Product Connect exists to give manufacturers complete visibility across their entire value chain — and in the
          process, build lasting internal capability rather than expensive external dependency.
        </p>
        <h2 className="font-display font-semibold text-2xl text-brand-darkest tracking-tight sm:text-3xl">
          The Key Differentiator
        </h2>
        <p className="text-base text-brand-text leading-relaxed sm:text-lg">
          We don't profit from your dependency. We profit from your capability. Traditional consultants do the work for
          you and keep you weak. Product Connect builds the system that lets you do it yourself — and get strong.
        </p>
        <ul className="space-y-4 text-base text-brand-text leading-relaxed sm:text-lg">
          <li>
            <strong className="text-brand-dark">With consultants:</strong> You rent expertise. You learn nothing. You
            start from scratch every time.
          </li>
          <li>
            <strong className="text-brand-dark">With Product Connect:</strong> Your team does the reps. They call
            suppliers. They learn material flows. They understand impact. Twelve months in, they're not just compliant —
            they're competent.
          </li>
        </ul>
      </div>
    </main>
  );
}
