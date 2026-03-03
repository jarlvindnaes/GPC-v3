import { motion } from "motion/react";

export function Testimonials() {
  const testimonials = [
    {
      quote:
        "Product Connect didn't just give us a tool; they gave us a framework. We went from spending €15k per LCA to calculating it internally in minutes. Our team is now fully capable of managing our own supply chain data.",
      author: "Sarah Jenkins",
      role: "Head of Sustainability, Nordica Design",
      image: "https://picsum.photos/seed/sarah/100/100"
    },
    {
      quote:
        "The DPP feature is incredible. We can now offer spare parts directly to our customers, bypassing the retail markup and building a direct relationship. It's transformed our post-purchase experience.",
      author: "Marcus Thorne",
      role: "CEO, Thorne Furniture Makers",
      image: "https://picsum.photos/seed/marcus/100/100"
    },
    {
      quote:
        "We were dreading the 2026 ESPR regulations. Product Connect made it a non-issue. Their platform is so intuitive that our suppliers actually enjoy using it to input their data.",
      author: "Elena Rostova",
      role: "Supply Chain Director, Veloce",
      image: "https://picsum.photos/seed/elena/100/100"
    }
  ];

  return (
    <section className="border-slate-100 border-t bg-slate-50 py-16 sm:py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-16 md:mb-20">
          <h2 className="mb-6 font-display font-semibold text-3xl text-slate-900 tracking-tight sm:text-4xl md:text-5xl">
            Trusted by the next generation of makers.
          </h2>
          <p className="text-base text-slate-600 sm:text-lg md:text-xl">
            Don't just take our word for it. See how leading furniture manufacturers are using Product Connect to take
            control of their data.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((t, testimonialIndex) => (
            <motion.div
              key={t.author}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: testimonialIndex * 0.1 }}
              className="flex flex-col rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6 md:p-8"
            >
              <div className="mb-8 flex-1">
                <svg className="mb-6 h-8 w-8 text-indigo-200" fill="currentColor" viewBox="0 0 32 32">
                  <title>Quote icon</title>
                  <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                </svg>
                <p className="font-medium text-base text-slate-700 leading-relaxed sm:text-lg">"{t.quote}"</p>
              </div>
              <div className="mt-auto flex items-center gap-4">
                <img
                  src={t.image}
                  alt={t.author}
                  className="h-12 w-12 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="font-semibold text-slate-900">{t.author}</div>
                  <div className="text-slate-500 text-sm">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
