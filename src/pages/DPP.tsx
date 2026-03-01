import { motion } from "motion/react";
import {
  QrCode, ArrowRight, ShieldCheck, Link2, Smartphone, RefreshCw, Wrench, Leaf,
  TrendingUp, ShoppingBag, Database, BarChart3, Eye, Users, Globe, ScanLine,
  ShoppingCart, FlaskConical, Shield, FileCheck, Store, BadgeCheck, ArrowUpRight,
} from "lucide-react";
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
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-display font-semibold text-slate-900 tracking-tight leading-[1.1] mb-6">
            The secure link to your end user.
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl">
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
          <div className="bg-slate-50 rounded-3xl p-5 sm:p-6 md:p-8 border border-slate-100">
            <ShieldCheck className="w-8 h-8 text-indigo-600 mb-6" />
            <h3 className="text-xl sm:text-2xl font-display font-semibold text-slate-900 mb-4">ESPR Compliant</h3>
            <p className="text-slate-600">Built from the ground up to meet the strict requirements of the Ecodesign for Sustainable Products Regulation coming in 2026.</p>
          </div>
          <div className="bg-slate-50 rounded-3xl p-5 sm:p-6 md:p-8 border border-slate-100">
            <Smartphone className="w-8 h-8 text-indigo-600 mb-6" />
            <h3 className="text-xl sm:text-2xl font-display font-semibold text-slate-900 mb-4">Consumer Facing</h3>
            <p className="text-slate-600">A beautiful, mobile-optimized experience that tells your product's story, shows its impact, and builds brand trust.</p>
          </div>
          <div className="bg-slate-50 rounded-3xl p-5 sm:p-6 md:p-8 border border-slate-100">
            <Link2 className="w-8 h-8 text-indigo-600 mb-6" />
            <h3 className="text-xl sm:text-2xl font-display font-semibold text-slate-900 mb-4">Direct Connection</h3>
            <p className="text-slate-600">Bypass retailers and connect directly with the end user. Offer spare parts, care instructions, and upgrades instantly.</p>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-slate-950 py-32 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-semibold tracking-tight mb-6">
              Value for everyone in the chain.
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-slate-400">
              The Digital Product Passport isn't just a compliance tool. It's a new medium for customer relationship and circular economy.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-24">
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

      {/* ── Analytics Section ── */}
      <div className="py-16 sm:py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 md:mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 text-violet-600 text-sm font-medium mb-6 border border-violet-100">
              <BarChart3 className="w-4 h-4" />
              DPP Analytics
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-semibold text-slate-900 tracking-tight mb-6">
              Intelligence from every scan.
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-slate-600 leading-relaxed">
              Every time a consumer, retailer, or recycler interacts with your product passport, you gain insight. Turn passive QR codes into an active feedback loop.
            </p>
          </div>

          {/* Analytics Dashboard Mock */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-slate-950 rounded-3xl p-5 sm:p-8 md:p-10 border border-slate-800 shadow-2xl mb-16"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-semibold text-white">Product Analytics</h3>
                <p className="text-sm text-slate-500">Last 30 days across all passports</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-semibold text-emerald-400">Live</span>
              </div>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
              {[
                { label: "Total Scans", value: "24,891", change: "+18%", icon: ScanLine, iconCls: "text-indigo-400", badgeCls: "text-indigo-400 bg-indigo-400/10" },
                { label: "Unique Visitors", value: "12,340", change: "+24%", icon: Eye, iconCls: "text-violet-400", badgeCls: "text-violet-400 bg-violet-400/10" },
                { label: "Spare Parts Orders", value: "847", change: "+31%", icon: ShoppingCart, iconCls: "text-emerald-400", badgeCls: "text-emerald-400 bg-emerald-400/10" },
                { label: "Registration Rate", value: "34.2%", change: "+8%", icon: Users, iconCls: "text-amber-400", badgeCls: "text-amber-400 bg-amber-400/10" },
              ].map((m, i) => (
                <div key={i} className="bg-slate-900/60 rounded-2xl p-4 sm:p-5 border border-slate-800">
                  <m.icon className={`w-5 h-5 mb-3 ${m.iconCls}`} />
                  <div className="text-xl sm:text-2xl font-bold text-white mb-1">{m.value}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">{m.label}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${m.badgeCls}`}>{m.change}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Chart Area Mock */}
            <div className="bg-slate-900/40 rounded-2xl p-4 sm:p-6 border border-slate-800/60">
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm font-medium text-slate-400">Scan Activity</span>
                <div className="flex gap-4 text-xs text-slate-600">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-indigo-500" /> Scans</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Orders</span>
                </div>
              </div>
              {/* Stylized bar chart */}
              <div className="flex items-end gap-[2px] sm:gap-1 h-32 sm:h-40">
                {[35,52,41,68,55,72,48,85,62,78,91,65,73,88,56,94,70,82,60,75,95,68,80,58,71,86,92,78,85,100].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-stretch justify-end h-full">
                    <div className="bg-indigo-500 rounded-t-[2px]" style={{ height: `${h}%` }} />
                    <div className="bg-emerald-500/70 rounded-t-[2px] mt-px" style={{ height: `${Math.max(5, h * 0.25)}%` }} />
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-3 text-[10px] text-slate-600 font-medium">
                <span>1 Jun</span>
                <span>15 Jun</span>
                <span>30 Jun</span>
              </div>
            </div>
          </motion.div>

          {/* Analytics Feature Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Globe, title: "Geographic Insights", desc: "See where your products are being scanned worldwide. Identify secondary markets and grey market activity." },
              { icon: TrendingUp, title: "Engagement Trends", desc: "Track how scan rates change over time. Measure the impact of marketing campaigns and product launches." },
              { icon: Users, title: "Customer Segmentation", desc: "Understand who's scanning — first owners, second-hand buyers, retailers, or recyclers. Tailor your messaging." },
              { icon: ShoppingCart, title: "Commerce Analytics", desc: "Revenue per product, conversion rates, top-selling spare parts. Your DPP becomes a measurable sales channel." },
              { icon: RefreshCw, title: "Lifecycle Tracking", desc: "Monitor how long products stay in circulation. Track repair events, ownership transfers, and end-of-life." },
              { icon: Shield, title: "Compliance Reporting", desc: "Auto-generate regulatory reports for ESPR, DPP, and eco-labeling requirements with one click." },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-slate-50 rounded-2xl p-5 sm:p-6 border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center mb-4 group-hover:border-indigo-200 group-hover:bg-indigo-50 transition-colors">
                  <f.icon className="w-5 h-5 text-slate-600 group-hover:text-indigo-600 transition-colors" />
                </div>
                <h4 className="text-lg font-semibold text-slate-900 mb-2">{f.title}</h4>
                <p className="text-sm text-slate-600 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Modules Section ── */}
      <div className="py-16 sm:py-24 md:py-32 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 md:mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-sm font-medium mb-6 border border-indigo-100">
              Extend Your Platform
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-semibold text-slate-900 tracking-tight mb-6">
              Extend with powerful modules.
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-slate-600 leading-relaxed">
              Transform compliance into competitive advantage. Activate what you need, when you need it. Each module plugs directly into your product graph — no separate tools, no data silos.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: ShoppingCart,
                title: "Spare Parts Webshop",
                desc: "Turn every Digital Product Passport into a sales channel. Customers scan, find the exact part, and order — directly from the DPP.",
                price: "€99/mo + GMV commission",
                plans: "Core, Pro & Enterprise",
                iconWrap: "bg-indigo-50 border-indigo-100",
                iconCls: "text-indigo-600",
                soon: false,
              },
              {
                icon: FlaskConical,
                title: "Impact Simulator",
                desc: "Swap suppliers, change materials, shift origin countries — simulate the environmental impact of design decisions before committing.",
                price: "Included",
                plans: "Pro & Enterprise",
                iconWrap: "bg-violet-50 border-violet-100",
                iconCls: "text-violet-600",
                soon: false,
              },
              {
                icon: BarChart3,
                title: "Supply Chain Analytics",
                desc: "Monitor supplier risk, concentration exposure, and geopolitical threats. Get alerts when a route or material becomes vulnerable.",
                price: "€300/mo",
                plans: "Pro & Enterprise",
                iconWrap: "bg-amber-50 border-amber-100",
                iconCls: "text-amber-600",
                soon: true,
              },
              {
                icon: FileCheck,
                title: "Customs & Cross-Border",
                desc: "Auto-generate customs docs when importing parts across borders. HS codes, origin certificates, and duty calculations from your product graph.",
                price: "Included",
                plans: "Pro & Enterprise",
                iconWrap: "bg-emerald-50 border-emerald-100",
                iconCls: "text-emerald-600",
                soon: true,
              },
              {
                icon: Store,
                title: "Supplier Marketplace",
                desc: "Discover verified suppliers and alternative components. Find lower-impact materials, compare certifications, and source replacements — all pre-validated.",
                price: "Included",
                plans: "All paid plans",
                iconWrap: "bg-blue-50 border-blue-100",
                iconCls: "text-blue-600",
                soon: false,
              },
              {
                icon: BadgeCheck,
                title: "Verification Concierge",
                desc: "Third-party verified EPDs and impact data. We manage the full certification process — you get the verified stamp. External fees billed to the verification body.",
                price: "€2,000 / batch",
                plans: "All paid plans",
                iconWrap: "bg-rose-50 border-rose-100",
                iconCls: "text-rose-600",
                soon: false,
              },
            ].map((mod, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-white rounded-[1.5rem] p-5 sm:p-6 md:p-7 border border-slate-200 shadow-sm hover:shadow-lg hover:border-slate-300 transition-all group relative overflow-hidden flex flex-col"
              >
                {mod.soon && (
                  <div className="absolute top-4 right-4 text-[10px] font-bold tracking-wider uppercase bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full border border-slate-200">
                    Coming Soon
                  </div>
                )}

                <div className={`w-11 h-11 rounded-xl border flex items-center justify-center mb-5 ${mod.iconWrap}`}>
                  <mod.icon className={`w-5 h-5 ${mod.iconCls}`} />
                </div>

                <h3 className="text-lg sm:text-xl font-display font-semibold text-slate-900 mb-2">{mod.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-6 flex-1">{mod.desc}</p>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{mod.price}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{mod.plans}</div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight className="w-4 h-4 text-slate-600" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <p className="text-slate-600 mb-6">Need a custom module or integration?</p>
            <button className="bg-slate-900 text-white px-8 py-3.5 rounded-full text-base font-medium hover:bg-slate-800 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-slate-200/50 inline-flex items-center gap-2">
              Talk to sales <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
