/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Route, HashRouter as Router, Routes } from "react-router-dom";
import { BackToTop } from "./components/BackToTop";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { About } from "./pages/About";
import { DPP } from "./pages/DPP";
import { Home } from "./pages/Home";
import { Platform } from "./pages/Platform";
import { PricingPage } from "./pages/PricingPage";

export function App() {
  return (
    <Router>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:font-medium focus:text-slate-900 focus:shadow-lg"
      >
        Skip to main content
      </a>
      <div className="min-h-screen bg-white font-sans selection:bg-indigo-100 selection:text-indigo-900">
        <Navbar />
        <div id="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/platform" element={<Platform />} />
            <Route path="/dpp" element={<DPP />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
        <Footer />
        <BackToTop />
      </div>
    </Router>
  );
}
