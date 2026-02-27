import { motion } from "motion/react";
import { Menu, X, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200/50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center group-hover:bg-indigo-600 transition-colors duration-300">
              <span className="text-white font-bold text-sm">PC</span>
            </div>
            <span className="font-semibold text-slate-900 text-lg tracking-tight group-hover:text-indigo-600 transition-colors duration-300">Product Connect</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link to="/platform" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors relative group">
              Platform
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all group-hover:w-full"></span>
            </Link>
            <Link to="/dpp" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors relative group">
              DPP
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all group-hover:w-full"></span>
            </Link>
            <Link to="/pricing" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors relative group">
              Pricing
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all group-hover:w-full"></span>
            </Link>
            <Link to="/about" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors relative group">
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all group-hover:w-full"></span>
            </Link>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Sign in</Link>
            <Link to="/contact" className="bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-slate-800 transition-all hover:scale-105 active:scale-95 shadow-sm hover:shadow-md flex items-center gap-1">
              Start now <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 -mr-2 text-slate-600 hover:text-slate-900 transition-colors">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white border-b border-slate-200 px-4 py-6 flex flex-col gap-4 shadow-xl"
        >
          <Link to="/platform" onClick={() => setIsOpen(false)} className="text-lg font-medium text-slate-600 hover:text-indigo-600">Platform</Link>
          <Link to="/dpp" onClick={() => setIsOpen(false)} className="text-lg font-medium text-slate-600 hover:text-indigo-600">DPP</Link>
          <Link to="/pricing" onClick={() => setIsOpen(false)} className="text-lg font-medium text-slate-600 hover:text-indigo-600">Pricing</Link>
          <Link to="/about" onClick={() => setIsOpen(false)} className="text-lg font-medium text-slate-600 hover:text-indigo-600">About</Link>
          <hr className="border-slate-100 my-2" />
          <Link to="/login" onClick={() => setIsOpen(false)} className="text-lg font-medium text-slate-600">Sign in</Link>
          <Link to="/contact" onClick={() => setIsOpen(false)} className="bg-slate-900 text-white px-4 py-4 rounded-2xl text-lg font-medium text-center shadow-lg active:scale-[0.98]">Get Started</Link>
        </motion.div>
      )}
    </nav>
  );
}
