/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import { Route, HashRouter as Router, Routes } from "react-router-dom";
import { BackToTop } from "./components/BackToTop";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { About } from "./pages/About";
import { DPP } from "./pages/DPP";
import { Home } from "./pages/Home";
import { Platform } from "./pages/Platform";
import { PricingPage } from "./pages/PricingPage";
import { THEME_NAMES, ThemeContext, type ThemeName } from "./theme";

function readStoredTheme(): ThemeName {
  const stored = localStorage.getItem("theme");
  if (stored && (THEME_NAMES as string[]).includes(stored)) {
    return stored as ThemeName;
  }
  return "proton";
}

export function App() {
  const [theme, setThemeState] = useState<ThemeName>(readStoredTheme);

  const setTheme = useCallback((next: ThemeName) => {
    setThemeState(next);
  }, []);

  useEffect(() => {
    if (theme === "proton") {
      delete document.documentElement.dataset.theme;
    } else {
      document.documentElement.dataset.theme = theme;
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const themeContextValue = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);

  return (
    <ThemeContext.Provider value={themeContextValue}>
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
    </ThemeContext.Provider>
  );
}
