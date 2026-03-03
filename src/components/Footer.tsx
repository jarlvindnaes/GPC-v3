export function Footer() {
  return (
    <footer className="border-slate-200 border-t bg-white pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-slate-900">
                <span className="font-bold text-[10px] text-white">PC</span>
              </div>
              <span className="font-semibold text-brand-dark">Product Connect</span>
            </div>
            <p className="mb-6 max-w-xs text-slate-500 text-sm">
              The infrastructure platform for product manufacturers who want full visibility — from raw materials to
              end-of-life.
            </p>
          </div>

          <nav aria-label="Platform">
            <h4 className="mb-4 font-semibold text-brand-dark text-sm">Platform</h4>
            <ul className="space-y-3">
              <li>
                <a href="#/dpp" className="text-slate-500 text-sm hover:text-brand-dark">
                  Digital Product Passports
                </a>
              </li>
              <li>
                <a href="#/platform" className="text-slate-500 text-sm hover:text-brand-dark">
                  LCA Engine
                </a>
              </li>
              <li>
                <a href="#/platform" className="text-slate-500 text-sm hover:text-brand-dark">
                  Supplier Portal
                </a>
              </li>
              <li>
                <a href="#/platform" className="text-slate-500 text-sm hover:text-brand-dark">
                  Spare Parts Commerce
                </a>
              </li>
            </ul>
          </nav>

          <nav aria-label="Resources">
            <h4 className="mb-4 font-semibold text-brand-dark text-sm">Resources</h4>
            <ul className="space-y-3">
              <li>
                <a href="https://example.com" className="text-slate-500 text-sm hover:text-brand-dark">
                  ESPR Guide 2026
                </a>
              </li>
              <li>
                <a href="https://example.com" className="text-slate-500 text-sm hover:text-brand-dark">
                  Documentation
                </a>
              </li>
              <li>
                <a href="https://example.com" className="text-slate-500 text-sm hover:text-brand-dark">
                  API Reference
                </a>
              </li>
              <li>
                <a href="https://example.com" className="text-slate-500 text-sm hover:text-brand-dark">
                  Case Studies
                </a>
              </li>
            </ul>
          </nav>

          <nav aria-label="Company">
            <h4 className="mb-4 font-semibold text-brand-dark text-sm">Company</h4>
            <ul className="space-y-3">
              <li>
                <a href="#/about" className="text-slate-500 text-sm hover:text-brand-dark">
                  About
                </a>
              </li>
              <li>
                <a href="https://example.com" className="text-slate-500 text-sm hover:text-brand-dark">
                  Blog
                </a>
              </li>
              <li>
                <a href="https://example.com" className="text-slate-500 text-sm hover:text-brand-dark">
                  Careers
                </a>
              </li>
              <li>
                <a href="https://example.com" className="text-slate-500 text-sm hover:text-brand-dark">
                  Contact
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-slate-100 border-t pt-8 md:flex-row">
          <p className="text-slate-400 text-sm">&copy; 2026 Product Connect. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="https://example.com" className="text-slate-400 text-sm hover:text-brand-dark">
              Privacy Policy
            </a>
            <a href="https://example.com" className="text-slate-400 text-sm hover:text-brand-dark">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
