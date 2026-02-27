export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-slate-900 rounded flex items-center justify-center">
                <span className="text-white font-bold text-[10px]">PC</span>
              </div>
              <span className="font-semibold text-slate-900">Product Connect</span>
            </div>
            <p className="text-sm text-slate-500 max-w-xs mb-6">
              The infrastructure platform for product manufacturers who want full visibility — from raw materials to end-of-life.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-slate-900 mb-4 text-sm">Platform</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-slate-500 hover:text-slate-900">Digital Product Passports</a></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-slate-900">LCA Engine</a></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-slate-900">Supplier Portal</a></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-slate-900">Spare Parts Commerce</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-4 text-sm">Resources</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-slate-500 hover:text-slate-900">ESPR Guide 2026</a></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-slate-900">Documentation</a></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-slate-900">API Reference</a></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-slate-900">Case Studies</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-4 text-sm">Company</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-slate-500 hover:text-slate-900">About</a></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-slate-900">Blog</a></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-slate-900">Careers</a></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-slate-900">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-400">© 2026 Product Connect. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-slate-400 hover:text-slate-900">Privacy Policy</a>
            <a href="#" className="text-sm text-slate-400 hover:text-slate-900">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
