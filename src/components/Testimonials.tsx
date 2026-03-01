import { motion } from "motion/react";

export function Testimonials() {
  const testimonials = [
    {
      quote: "Product Connect didn't just give us a tool; they gave us a framework. We went from spending €15k per LCA to calculating it internally in minutes. Our team is now fully capable of managing our own supply chain data.",
      author: "Sarah Jenkins",
      role: "Head of Sustainability, Nordica Design",
      image: "https://picsum.photos/seed/sarah/100/100"
    },
    {
      quote: "The DPP feature is incredible. We can now offer spare parts directly to our customers, bypassing the retail markup and building a direct relationship. It's transformed our post-purchase experience.",
      author: "Marcus Thorne",
      role: "CEO, Thorne Furniture Makers",
      image: "https://picsum.photos/seed/marcus/100/100"
    },
    {
      quote: "We were dreading the 2026 ESPR regulations. Product Connect made it a non-issue. Their platform is so intuitive that our suppliers actually enjoy using it to input their data.",
      author: "Elena Rostova",
      role: "Supply Chain Director, Veloce",
      image: "https://picsum.photos/seed/elena/100/100"
    }
  ];

  return (
    <section className="py-16 sm:py-24 md:py-32 bg-slate-50 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 md:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-semibold text-slate-900 tracking-tight mb-6">
            Trusted by the next generation of makers.
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-slate-600">
            Don't just take our word for it. See how leading furniture manufacturers are using Product Connect to take control of their data.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-5 sm:p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-200 flex flex-col"
            >
              <div className="flex-1 mb-8">
                <svg className="w-8 h-8 text-indigo-200 mb-6" fill="currentColor" viewBox="0 0 32 32">
                  <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                </svg>
                <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-medium">"{t.quote}"</p>
              </div>
              <div className="flex items-center gap-4 mt-auto">
                <img src={t.image} alt={t.author} className="w-12 h-12 rounded-full object-cover" referrerPolicy="no-referrer" />
                <div>
                  <div className="font-semibold text-slate-900">{t.author}</div>
                  <div className="text-sm text-slate-500">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
