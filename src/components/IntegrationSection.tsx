import { Database, Link2, Box, Cpu, Package, Globe, Users } from "lucide-react";

export function IntegrationSection() {
  return (
    <section className="py-32 bg-slate-950 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mb-24">
          <h2 className="text-4xl md:text-5xl font-display font-semibold tracking-tight mb-6">
            Connect to existing systems.
          </h2>
          <p className="text-xl text-slate-400 leading-relaxed">
            Orchestrate data across multiple ERPs, build custom workflows, and connect to third parties using APIs, partner apps or pre-built integrations. Securely connect directly to your end users.
          </p>
        </div>

        {/* Integration Diagram */}
        <div className="relative h-[700px] w-full max-w-5xl mx-auto flex items-center justify-center">
          {/* Background grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          
          {/* Central Hub */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="w-32 h-32 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-[0_0_50px_rgba(79,70,229,0.4)] border border-indigo-400/30">
              <span className="text-xl font-bold tracking-tight text-center leading-tight">Product<br/>Connect</span>
            </div>
          </div>

          {/* Top Nodes (ERPs / PIMs) */}
          <div className="absolute top-16 left-1/2 -translate-x-1/2 flex gap-4 z-10">
            <div className="px-6 py-3 bg-slate-800/80 backdrop-blur border border-slate-700 rounded-lg text-sm font-medium text-slate-300">
              Business Central
            </div>
            <div className="px-6 py-3 bg-slate-800/80 backdrop-blur border border-slate-700 rounded-lg text-sm font-medium text-slate-300">
              SAP
            </div>
            <div className="px-6 py-3 bg-slate-800/80 backdrop-blur border border-slate-700 rounded-lg text-sm font-medium text-slate-300">
              PIM Systems
            </div>
          </div>

          {/* Left Nodes (Suppliers / Data Sources) */}
          <div className="absolute top-1/2 left-16 -translate-y-1/2 flex flex-col gap-4 z-10">
            <div className="px-6 py-3 bg-indigo-500/20 border border-indigo-500/30 rounded-lg text-sm font-medium text-indigo-300 flex items-center gap-2">
              <Database className="w-4 h-4" /> Ecoinvent
            </div>
            <div className="px-6 py-3 bg-indigo-500/20 border border-indigo-500/30 rounded-lg text-sm font-medium text-indigo-300 flex items-center gap-2">
              <Globe className="w-4 h-4" /> Supplier Portal
            </div>
          </div>

          {/* Right Nodes (Outputs) */}
          <div className="absolute top-1/2 right-16 -translate-y-1/2 flex flex-col gap-4 z-10">
            <div className="px-6 py-3 bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-sm font-medium text-emerald-300 flex items-center gap-2">
              <Box className="w-4 h-4" /> EPD Reports
            </div>
            <div className="px-6 py-3 bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-sm font-medium text-emerald-300 flex items-center gap-2">
              <Link2 className="w-4 h-4" /> Public DPP
            </div>
          </div>

          {/* Bottom Nodes (Commerce) */}
          <div className="absolute bottom-32 left-1/2 -translate-x-1/2 flex gap-4 z-10">
            <div className="px-6 py-3 bg-rose-500/20 border border-rose-500/30 rounded-lg text-sm font-medium text-rose-300 flex items-center gap-2">
              <Package className="w-4 h-4" /> Spare Parts
            </div>
            <div className="px-6 py-3 bg-rose-500/20 border border-rose-500/30 rounded-lg text-sm font-medium text-rose-300 flex items-center gap-2">
              <Cpu className="w-4 h-4" /> Analytics
            </div>
          </div>

          {/* End User Node (Far Bottom) */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
            <div className="px-8 py-4 bg-amber-500/20 border border-amber-500/50 rounded-xl text-base font-semibold text-amber-300 flex items-center gap-3 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
              <Users className="w-5 h-5" /> End Consumers
            </div>
          </div>

          {/* Connecting Lines (SVG) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <g stroke="rgba(99, 102, 241, 0.3)" strokeWidth="2" strokeDasharray="4 4" fill="none">
              {/* Top lines */}
              <path d="M 500 350 Q 500 200 400 120" />
              <path d="M 500 350 L 500 120" />
              <path d="M 500 350 Q 500 200 600 120" />
              
              {/* Left lines */}
              <path d="M 500 350 L 250 300" />
              <path d="M 500 350 L 250 400" />
              
              {/* Right lines */}
              <path d="M 500 350 L 750 300" />
              <path d="M 500 350 L 750 400" />
              
              {/* Bottom lines to Commerce */}
              <path d="M 500 350 Q 500 450 400 530" />
              <path d="M 500 350 Q 500 450 600 530" />

              {/* Line to End Consumers (Secure DPP) */}
              <path d="M 500 350 L 500 650" stroke="rgba(245, 158, 11, 0.5)" strokeWidth="3" strokeDasharray="none" />
            </g>
            
            {/* Label for End Consumer line */}
            <text x="515" y="580" fill="rgba(245, 158, 11, 0.8)" fontSize="12" fontWeight="600" letterSpacing="1">SECURE DPP CONNECTION</text>
          </svg>
        </div>
      </div>
    </section>
  );
}
