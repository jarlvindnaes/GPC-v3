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
              <span className="font-semibold text-slate-900">Product Connect</span>
            </div>
            <p className="mb-6 max-w-xs text-slate-500 text-sm">
              The infrastructure platform for product manufacturers who want full visibility — from raw materials to
              end-of-life.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-slate-900 text-sm">Platform</h4>
            <ul className="space-y-3">
              <li>
                <a href="#/dpp" className="text-slate-500 text-sm hover:text-slate-900">
                  Digital Product Passports
                </a>
              </li>
              <li>
                <a href="#/platform" className="text-slate-500 text-sm hover:text-slate-900">
                  LCA Engine
                </a>
              </li>
              <li>
                <a href="#/platform" className="text-slate-500 text-sm hover:text-slate-900">
                  Supplier Portal
                </a>
              </li>
              <li>
                <a href="#/platform" className="text-slate-500 text-sm hover:text-slate-900">
                  Spare Parts Commerce
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-slate-900 text-sm">Resources</h4>
            <ul className="space-y-3">
              <li>
                {/* Placeholder URL until ESPR guide page is created */}
                <a href="https://example.com" className="text-slate-500 text-sm hover:text-slate-900">
                  ESPR Guide 2026
                </a>
              </li>
              <li>
                {/* Placeholder URL until documentation page is created */}
                <a href="https://example.com" className="text-slate-500 text-sm hover:text-slate-900">
                  Documentation
                </a>
              </li>
              <li>
                {/* Placeholder URL until API reference page is created */}
                <a href="https://example.com" className="text-slate-500 text-sm hover:text-slate-900">
                  API Reference
                </a>
              </li>
              <li>
                {/* Placeholder URL until case studies page is created */}
                <a href="https://example.com" className="text-slate-500 text-sm hover:text-slate-900">
                  Case Studies
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-slate-900 text-sm">Company</h4>
            <ul className="space-y-3">
              <li>
                <a href="#/about" className="text-slate-500 text-sm hover:text-slate-900">
                  About
                </a>
              </li>
              <li>
                {/* Placeholder URL until blog page is created */}
                <a href="https://example.com" className="text-slate-500 text-sm hover:text-slate-900">
                  Blog
                </a>
              </li>
              <li>
                {/* Placeholder URL until careers page is created */}
                <a href="https://example.com" className="text-slate-500 text-sm hover:text-slate-900">
                  Careers
                </a>
              </li>
              <li>
                {/* Placeholder URL until contact page is created */}
                <a href="https://example.com" className="text-slate-500 text-sm hover:text-slate-900">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-slate-100 border-t pt-8 md:flex-row">
          <p className="text-slate-400 text-sm">© 2026 Product Connect. All rights reserved.</p>
          <div className="flex gap-6">
            {/* Placeholder URL until privacy policy page is created */}
            <a href="https://example.com" className="text-slate-400 text-sm hover:text-slate-900">
              Privacy Policy
            </a>
            {/* Placeholder URL until terms of service page is created */}
            <a href="https://example.com" className="text-slate-400 text-sm hover:text-slate-900">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
