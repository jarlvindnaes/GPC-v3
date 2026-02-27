/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home";
import { Platform } from "./pages/Platform";
import { DPP } from "./pages/DPP";
import { PricingPage } from "./pages/PricingPage";
import { About } from "./pages/About";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white font-sans selection:bg-indigo-100 selection:text-indigo-900">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/platform" element={<Platform />} />
          <Route path="/dpp" element={<DPP />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/about" element={<About />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}
