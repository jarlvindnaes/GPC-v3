/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { lazy, Suspense } from "react";
import { Route, HashRouter as Router, Routes } from "react-router-dom";
import { BackToTop } from "./components/BackToTop";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { SmoothScroll } from "./components/SmoothScroll";
import { Home } from "./pages/Home";

const Platform = lazy(() => import("./pages/Platform").then((m) => ({ default: m.Platform })));
const DPP = lazy(() => import("./pages/DPP").then((m) => ({ default: m.DPP })));
const PricingPage = lazy(() => import("./pages/PricingPage").then((m) => ({ default: m.PricingPage })));
const About = lazy(() => import("./pages/About").then((m) => ({ default: m.About })));
const DppTest = lazy(() => import("./pages/DppTest").then((m) => ({ default: m.DppTest })));
const HtmlPhoneTest = lazy(() => import("./pages/HtmlPhoneTest").then((m) => ({ default: m.HtmlPhoneTest })));

/** Main site layout with navbar, footer, and smooth scroll. */
function SiteLayout() {
  return (
    <SmoothScroll>
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
            <Route
              path="/platform"
              element={
                <Suspense fallback={null}>
                  <Platform />
                </Suspense>
              }
            />
            <Route
              path="/dpp"
              element={
                <Suspense fallback={null}>
                  <DPP />
                </Suspense>
              }
            />
            <Route
              path="/pricing"
              element={
                <Suspense fallback={null}>
                  <PricingPage />
                </Suspense>
              }
            />
            <Route
              path="/about"
              element={
                <Suspense fallback={null}>
                  <About />
                </Suspense>
              }
            />
          </Routes>
        </div>
        <Footer />
        <BackToTop />
      </div>
    </SmoothScroll>
  );
}

export function App() {
  return (
    <Router>
      <Routes>
        {/* Standalone DPP test page — no navbar/footer/smooth scroll */}
        <Route
          path="/dpp-test"
          element={
            <Suspense fallback={null}>
              <DppTest />
            </Suspense>
          }
        />
        {/* Experimental: Html transform occlude approach */}
        <Route
          path="/html-phone-test"
          element={
            <Suspense fallback={null}>
              <HtmlPhoneTest />
            </Suspense>
          }
        />
        {/* All other routes use the full site layout */}
        <Route path="*" element={<SiteLayout />} />
      </Routes>
    </Router>
  );
}
