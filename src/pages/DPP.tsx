import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  BarChart3,
  Database,
  Eye,
  FileCheck,
  FlaskConical,
  Globe,
  Leaf,
  Link2,
  QrCode,
  RefreshCw,
  ScanLine,
  Shield,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Smartphone,
  Store,
  TrendingUp,
  Users,
  Wrench
} from "lucide-react";
import { motion } from "motion/react";
import { DppInteractiveProduct } from "../components/Native3DModels";

export function DPP() {
  return (
    <main className="bg-white pt-32 pb-24">
      <div className="mx-auto mb-24 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 font-medium text-indigo-600 text-sm">
            <QrCode className="h-4 w-4" />
            Digital Product Passports
          </div>
          <h1 className="mb-6 font-display font-semibold text-3xl text-slate-900 leading-[1.1] tracking-tight sm:text-5xl md:text-7xl">
            The secure link to your end user.
          </h1>
          <p className="mb-10 max-w-2xl text-base text-slate-600 leading-relaxed sm:text-lg md:text-xl">
            A living, GS1-compliant passport. Ready for ESPR 2026. Monetize spare parts and prove your claims to the
            world directly through a secure, scannable interface.
          </p>
          <button
            type="button"
            className="flex items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3 font-medium text-base text-white transition-colors hover:bg-slate-800"
          >
            Create your first DPP <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mx-auto mb-24 max-w-7xl px-4 sm:px-6 lg:px-8">
        <DppInteractiveProduct />
      </div>

      <div className="mx-auto mb-32 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5 sm:p-6 md:p-8">
            <ShieldCheck className="mb-6 h-8 w-8 text-indigo-600" />
            <h3 className="mb-4 font-display font-semibold text-slate-900 text-xl sm:text-2xl">ESPR Compliant</h3>
            <p className="text-slate-600">
              Built from the ground up to meet the strict requirements of the Ecodesign for Sustainable Products
              Regulation coming in 2026.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5 sm:p-6 md:p-8">
            <Smartphone className="mb-6 h-8 w-8 text-indigo-600" />
            <h3 className="mb-4 font-display font-semibold text-slate-900 text-xl sm:text-2xl">Consumer Facing</h3>
            <p className="text-slate-600">
              A beautiful, mobile-optimized experience that tells your product's story, shows its impact, and builds
              brand trust.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5 sm:p-6 md:p-8">
            <Link2 className="mb-6 h-8 w-8 text-indigo-600" />
            <h3 className="mb-4 font-display font-semibold text-slate-900 text-xl sm:text-2xl">Direct Connection</h3>
            <p className="text-slate-600">
              Bypass retailers and connect directly with the end user. Offer spare parts, care instructions, and
              upgrades instantly.
            </p>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-slate-950 py-32 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-20 max-w-3xl text-center">
            <h2 className="mb-6 font-display font-semibold text-3xl tracking-tight sm:text-4xl md:text-5xl">
              Value for everyone in the chain.
            </h2>
            <p className="text-base text-slate-400 sm:text-lg md:text-xl">
              The Digital Product Passport isn't just a compliance tool. It's a new medium for customer relationship and
              circular economy.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 md:gap-12 lg:gap-24">
            {/* Manufacturer Benefits */}
            <div>
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/20 px-3 py-1 font-medium text-indigo-300 text-sm">
                For Manufacturers
              </div>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-800">
                    <TrendingUp className="h-6 w-6 text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="mb-2 font-semibold text-xl">Convert unknown owners</h4>
                    <p className="text-slate-400 leading-relaxed">
                      Turn anonymous secondary-market buyers into life-long customers through direct registration.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-800">
                    <ShoppingBag className="h-6 w-6 text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="mb-2 font-semibold text-xl">Embed a web-shop in every product</h4>
                    <p className="text-slate-400 leading-relaxed">
                      Sell spare parts and product upgrades using your existing infrastructure, directly from the
                      passport.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-800">
                    <Database className="h-6 w-6 text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="mb-2 font-semibold text-xl">Improve via usage data</h4>
                    <p className="text-slate-400 leading-relaxed">
                      Gather actual usage data and feedback to inform your next generation of product design.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-800">
                    <ShieldCheck className="h-6 w-6 text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="mb-2 font-semibold text-xl">Full regulatory compliance</h4>
                    <p className="text-slate-400 leading-relaxed">
                      Ready for DPP, "Right to repair", LEAN, CBAM, and ECO Label requirements.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Owner Benefits */}
            <div>
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/20 px-3 py-1 font-medium text-emerald-300 text-sm">
                For Product Owners
              </div>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-800">
                    <Wrench className="h-6 w-6 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="mb-2 font-semibold text-xl">Convenient repair & upgrade</h4>
                    <p className="text-slate-400 leading-relaxed">
                      Instantly find the exact spare parts, manuals, and service providers for your specific product.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-800">
                    <RefreshCw className="h-6 w-6 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="mb-2 font-semibold text-xl">Extend product life span</h4>
                    <p className="text-slate-400 leading-relaxed">
                      Access care instructions and official upgrades to keep the product in circulation longer.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-800">
                    <Leaf className="h-6 w-6 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="mb-2 font-semibold text-xl">Save resources</h4>
                    <p className="text-slate-400 leading-relaxed">
                      Make the sustainable choice by repairing instead of replacing, backed by verified environmental
                      data.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Analytics Section ── */}
      <div className="bg-white py-16 sm:py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-16 md:mb-20">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-100 bg-violet-50 px-3 py-1 font-medium text-sm text-violet-600">
              <BarChart3 className="h-4 w-4" />
              DPP Analytics
            </div>
            <h2 className="mb-6 font-display font-semibold text-3xl text-slate-900 tracking-tight sm:text-4xl md:text-5xl">
              Intelligence from every scan.
            </h2>
            <p className="text-base text-slate-600 leading-relaxed sm:text-lg md:text-xl">
              Every time a consumer, retailer, or recycler interacts with your product passport, you gain insight. Turn
              passive QR codes into an active feedback loop.
            </p>
          </div>

          {/* Analytics Dashboard Mock */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 rounded-3xl border border-slate-800 bg-slate-950 p-5 shadow-2xl sm:p-8 md:p-10"
          >
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg text-white">Product Analytics</h3>
                <p className="text-slate-500 text-sm">Last 30 days across all passports</p>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                <span className="font-semibold text-emerald-400 text-xs">Live</span>
              </div>
            </div>

            {/* Metric Cards */}
            <div className="mb-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
              {[
                {
                  label: "Total Scans",
                  value: "24,891",
                  change: "+18%",
                  icon: ScanLine,
                  iconClassName: "text-indigo-400",
                  badgeClassName: "text-indigo-400 bg-indigo-400/10"
                },
                {
                  label: "Unique Visitors",
                  value: "12,340",
                  change: "+24%",
                  icon: Eye,
                  iconClassName: "text-violet-400",
                  badgeClassName: "text-violet-400 bg-violet-400/10"
                },
                {
                  label: "Spare Parts Orders",
                  value: "847",
                  change: "+31%",
                  icon: ShoppingCart,
                  iconClassName: "text-emerald-400",
                  badgeClassName: "text-emerald-400 bg-emerald-400/10"
                },
                {
                  label: "Registration Rate",
                  value: "34.2%",
                  change: "+8%",
                  icon: Users,
                  iconClassName: "text-amber-400",
                  badgeClassName: "text-amber-400 bg-amber-400/10"
                }
              ].map((metric) => (
                <div key={metric.label} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5">
                  <metric.icon className={`mb-3 h-5 w-5 ${metric.iconClassName}`} />
                  <div className="mb-1 font-bold text-white text-xl sm:text-2xl">{metric.value}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 text-xs">{metric.label}</span>
                    <span className={`rounded-full px-1.5 py-0.5 font-bold text-[10px] ${metric.badgeClassName}`}>
                      {metric.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Chart Area Mock */}
            <div className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-4 sm:p-6">
              <div className="mb-6 flex items-center justify-between">
                <span className="font-medium text-slate-400 text-sm">Scan Activity</span>
                <div className="flex gap-4 text-slate-600 text-xs">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-indigo-500" /> Scans
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" /> Orders
                  </span>
                </div>
              </div>
              {/* Stylized bar chart */}
              <div className="flex h-32 items-end gap-[2px] sm:h-40 sm:gap-1">
                {[
                  { day: 1, height: 35 },
                  { day: 2, height: 52 },
                  { day: 3, height: 41 },
                  { day: 4, height: 68 },
                  { day: 5, height: 55 },
                  { day: 6, height: 72 },
                  { day: 7, height: 48 },
                  { day: 8, height: 85 },
                  { day: 9, height: 62 },
                  { day: 10, height: 78 },
                  { day: 11, height: 91 },
                  { day: 12, height: 65 },
                  { day: 13, height: 73 },
                  { day: 14, height: 88 },
                  { day: 15, height: 56 },
                  { day: 16, height: 94 },
                  { day: 17, height: 70 },
                  { day: 18, height: 82 },
                  { day: 19, height: 60 },
                  { day: 20, height: 75 },
                  { day: 21, height: 95 },
                  { day: 22, height: 68 },
                  { day: 23, height: 80 },
                  { day: 24, height: 58 },
                  { day: 25, height: 71 },
                  { day: 26, height: 86 },
                  { day: 27, height: 92 },
                  { day: 28, height: 78 },
                  { day: 29, height: 85 },
                  { day: 30, height: 100 }
                ].map((bar) => (
                  <div key={bar.day} className="flex h-full flex-1 flex-col items-stretch justify-end">
                    <div className="rounded-t-[2px] bg-indigo-500" style={{ height: `${bar.height}%` }} />
                    <div
                      className="mt-px rounded-t-[2px] bg-emerald-500/70"
                      style={{ height: `${Math.max(5, bar.height * 0.25)}%` }}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-3 flex justify-between font-medium text-[10px] text-slate-600">
                <span>1 Jun</span>
                <span>15 Jun</span>
                <span>30 Jun</span>
              </div>
            </div>
          </motion.div>

          {/* Analytics Feature Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Globe,
                title: "Geographic Insights",
                description:
                  "See where your products are being scanned worldwide. Identify secondary markets and grey market activity."
              },
              {
                icon: TrendingUp,
                title: "Engagement Trends",
                description:
                  "Track how scan rates change over time. Measure the impact of marketing campaigns and product launches."
              },
              {
                icon: Users,
                title: "Customer Segmentation",
                description:
                  "Understand who's scanning — first owners, second-hand buyers, retailers, or recyclers. Tailor your messaging."
              },
              {
                icon: ShoppingCart,
                title: "Commerce Analytics",
                description:
                  "Revenue per product, conversion rates, top-selling spare parts. Your DPP becomes a measurable sales channel."
              },
              {
                icon: RefreshCw,
                title: "Lifecycle Tracking",
                description:
                  "Monitor how long products stay in circulation. Track repair events, ownership transfers, and end-of-life."
              },
              {
                icon: Shield,
                title: "Compliance Reporting",
                description:
                  "Auto-generate regulatory reports for ESPR, DPP, and eco-labeling requirements with one click."
              }
            ].map((feature, featureIndex) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: featureIndex * 0.08 }}
                className="group rounded-2xl border border-slate-100 bg-slate-50 p-5 transition-all hover:border-slate-200 hover:shadow-md sm:p-6"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white transition-colors group-hover:border-indigo-200 group-hover:bg-indigo-50">
                  <feature.icon className="h-5 w-5 text-slate-600 transition-colors group-hover:text-indigo-600" />
                </div>
                <h4 className="mb-2 font-semibold text-lg text-slate-900">{feature.title}</h4>
                <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Modules Section ── */}
      <div className="border-slate-100 border-t bg-slate-50 py-16 sm:py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-16 md:mb-20">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 font-medium text-indigo-600 text-sm">
              Extend Your Platform
            </div>
            <h2 className="mb-6 font-display font-semibold text-3xl text-slate-900 tracking-tight sm:text-4xl md:text-5xl">
              Extend with powerful modules.
            </h2>
            <p className="text-base text-slate-600 leading-relaxed sm:text-lg md:text-xl">
              Transform compliance into competitive advantage. Activate what you need, when you need it. Each module
              plugs directly into your product graph — no separate tools, no data silos.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: ShoppingCart,
                title: "Spare Parts Webshop",
                description:
                  "Turn every Digital Product Passport into a sales channel. Customers scan, find the exact part, and order — directly from the DPP.",
                price: "€99/mo + GMV commission",
                plans: "Core, Pro & Enterprise",
                iconWrapperClassName: "bg-indigo-50 border-indigo-100",
                iconClassName: "text-indigo-600",
                soon: false
              },
              {
                icon: FlaskConical,
                title: "Impact Simulator",
                description:
                  "Swap suppliers, change materials, shift origin countries — simulate the environmental impact of design decisions before committing.",
                price: "Included",
                plans: "Pro & Enterprise",
                iconWrapperClassName: "bg-violet-50 border-violet-100",
                iconClassName: "text-violet-600",
                soon: false
              },
              {
                icon: BarChart3,
                title: "Supply Chain Analytics",
                description:
                  "Monitor supplier risk, concentration exposure, and geopolitical threats. Get alerts when a route or material becomes vulnerable.",
                price: "€300/mo",
                plans: "Pro & Enterprise",
                iconWrapperClassName: "bg-amber-50 border-amber-100",
                iconClassName: "text-amber-600",
                soon: true
              },
              {
                icon: FileCheck,
                title: "Customs & Cross-Border",
                description:
                  "Auto-generate customs docs when importing parts across borders. HS codes, origin certificates, and duty calculations from your product graph.",
                price: "Included",
                plans: "Pro & Enterprise",
                iconWrapperClassName: "bg-emerald-50 border-emerald-100",
                iconClassName: "text-emerald-600",
                soon: true
              },
              {
                icon: Store,
                title: "Supplier Marketplace",
                description:
                  "Discover verified suppliers and alternative components. Find lower-impact materials, compare certifications, and source replacements — all pre-validated.",
                price: "Included",
                plans: "All paid plans",
                iconWrapperClassName: "bg-blue-50 border-blue-100",
                iconClassName: "text-blue-600",
                soon: false
              },
              {
                icon: BadgeCheck,
                title: "Verification Concierge",
                description:
                  "Third-party verified EPDs and impact data. We manage the full certification process — you get the verified stamp. External fees billed to the verification body.",
                price: "€2,000 / batch",
                plans: "All paid plans",
                iconWrapperClassName: "bg-rose-50 border-rose-100",
                iconClassName: "text-rose-600",
                soon: false
              }
            ].map((platformModule, moduleIndex) => (
              <motion.div
                key={platformModule.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: moduleIndex * 0.08 }}
                className="group relative flex flex-col overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-slate-300 hover:shadow-lg sm:p-6 md:p-7"
              >
                {platformModule.soon && (
                  <div className="absolute top-4 right-4 rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 font-bold text-[10px] text-slate-500 uppercase tracking-wider">
                    Coming Soon
                  </div>
                )}

                <div
                  className={`mb-5 flex h-11 w-11 items-center justify-center rounded-xl border ${platformModule.iconWrapperClassName}`}
                >
                  <platformModule.icon className={`h-5 w-5 ${platformModule.iconClassName}`} />
                </div>

                <h3 className="mb-2 font-display font-semibold text-lg text-slate-900 sm:text-xl">
                  {platformModule.title}
                </h3>
                <p className="mb-6 flex-1 text-slate-600 text-sm leading-relaxed">{platformModule.description}</p>

                <div className="flex items-center justify-between border-slate-100 border-t pt-4">
                  <div>
                    <div className="font-semibold text-slate-900 text-sm">{platformModule.price}</div>
                    <div className="mt-0.5 text-[11px] text-slate-400">{platformModule.plans}</div>
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-slate-50 opacity-0 transition-opacity group-hover:opacity-100">
                    <ArrowUpRight className="h-4 w-4 text-slate-600" />
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
            <p className="mb-6 text-slate-600">Need a custom module or integration?</p>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-8 py-3.5 font-medium text-base text-white shadow-lg shadow-slate-200/50 transition-all hover:scale-105 hover:bg-slate-800 active:scale-95"
            >
              Talk to sales <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
