import { ChevronRight, Menu, X } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { Link } from "react-router-dom";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className="fixed top-0 right-0 left-0 z-50 border-slate-200/50 border-b bg-white/70 backdrop-blur-xl transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="group flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 transition-colors duration-300 group-hover:bg-indigo-600">
              <span className="font-bold text-sm text-white">PC</span>
            </div>
            <span className="font-semibold text-lg text-slate-900 tracking-tight transition-colors duration-300 group-hover:text-indigo-600">
              Product Connect
            </span>
          </Link>
          <div className="hidden items-center gap-8 md:flex">
            <Link
              to="/platform"
              className="group relative font-medium text-slate-600 text-sm transition-colors hover:text-indigo-600"
            >
              Platform
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-indigo-600 transition-all group-hover:w-full"></span>
            </Link>
            <Link
              to="/dpp"
              className="group relative font-medium text-slate-600 text-sm transition-colors hover:text-indigo-600"
            >
              DPP
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-indigo-600 transition-all group-hover:w-full"></span>
            </Link>
            <Link
              to="/pricing"
              className="group relative font-medium text-slate-600 text-sm transition-colors hover:text-indigo-600"
            >
              Pricing
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-indigo-600 transition-all group-hover:w-full"></span>
            </Link>
            <Link
              to="/about"
              className="group relative font-medium text-slate-600 text-sm transition-colors hover:text-indigo-600"
            >
              About
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-indigo-600 transition-all group-hover:w-full"></span>
            </Link>
          </div>
          <div className="hidden items-center gap-4 md:flex">
            <Link to="/login" className="font-medium text-slate-600 text-sm transition-colors hover:text-slate-900">
              Sign in
            </Link>
            <Link
              to="/contact"
              className="flex items-center gap-1 rounded-full bg-slate-900 px-5 py-2.5 font-medium text-sm text-white shadow-sm transition-all hover:scale-105 hover:bg-slate-800 hover:shadow-md active:scale-95"
            >
              Start now <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="flex items-center md:hidden">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={isOpen}
              className="-mr-2 flex min-h-[44px] min-w-[44px] items-center justify-center p-3 text-slate-600 transition-colors hover:text-slate-900"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 border-slate-200 border-b bg-white px-4 py-6 shadow-xl md:hidden"
        >
          <Link
            to="/platform"
            onClick={() => setIsOpen(false)}
            className="font-medium text-lg text-slate-600 hover:text-indigo-600"
          >
            Platform
          </Link>
          <Link
            to="/dpp"
            onClick={() => setIsOpen(false)}
            className="font-medium text-lg text-slate-600 hover:text-indigo-600"
          >
            DPP
          </Link>
          <Link
            to="/pricing"
            onClick={() => setIsOpen(false)}
            className="font-medium text-lg text-slate-600 hover:text-indigo-600"
          >
            Pricing
          </Link>
          <Link
            to="/about"
            onClick={() => setIsOpen(false)}
            className="font-medium text-lg text-slate-600 hover:text-indigo-600"
          >
            About
          </Link>
          <hr className="my-2 border-slate-100" />
          <Link to="/login" onClick={() => setIsOpen(false)} className="font-medium text-lg text-slate-600">
            Sign in
          </Link>
          <Link
            to="/contact"
            onClick={() => setIsOpen(false)}
            className="rounded-2xl bg-slate-900 px-4 py-4 text-center font-medium text-lg text-white shadow-lg active:scale-[0.98]"
          >
            Get Started
          </Link>
        </motion.div>
      )}
    </nav>
  );
}
