import { useCallback, useRef, useState } from "react";
import { DppHeader } from "./DppHeader";
import DppImpactView from "./DppImpactView";
import DppInfoView from "./DppInfoView";
import { DppMaintenanceView } from "./DppMaintenanceView";
import { DppNavigation } from "./DppNavigation";
import { DppProductView } from "./DppProductView";

type TabId = "about" | "maintenance" | "impact" | "parts";

/** Header: 44px status bar + ~46px header content + 9px border = ~99px; round to 90 for comfortable overlap */
const HEADER_HEIGHT = 90;
/** Navigation bar height + Safari bottom chrome clearance */
const NAV_HEIGHT = 134;

/**
 * DppApp -- Root component for the DPP phone screen shell.
 *
 * Renders inside a 375x812 container that matches the phone screen
 * dimensions used by the marketing site's homography overlay.
 * Uses absolute positioning for header/nav since the parent container
 * applies CSS matrix3d transforms (making fixed == absolute).
 */
export function DppApp() {
  const [activeTab, setActiveTab] = useState<TabId>("about");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleTabChange = useCallback((tab: TabId) => {
    setActiveTab(tab);
    // Reset scroll position when switching tabs
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, []);

  /**
   * Prevent touch scroll events from propagating out of the phone screen
   * container, which could trigger scroll on the marketing page behind it.
   */
  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation();
  }, []);

  return (
    <div
      style={{
        width: 375,
        height: 812,
        position: "relative",
        overflow: "hidden",
        background: "#fff"
      }}
    >
      {/* Fixed header */}
      <DppHeader />

      {/* Scrollable content area */}
      <div
        ref={scrollContainerRef}
        onTouchMove={handleTouchMove}
        style={{
          position: "absolute",
          inset: 0,
          overflowY: "auto",
          overflowX: "hidden",
          paddingTop: HEADER_HEIGHT,
          paddingBottom: NAV_HEIGHT,
          WebkitOverflowScrolling: "touch"
        }}
        id="main-content"
        role="tabpanel"
        aria-label={`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} tab content`}
      >
        {activeTab === "about" && <DppInfoView scrollRef={scrollContainerRef} />}
        {activeTab === "maintenance" && <DppMaintenanceView scrollRef={scrollContainerRef} />}
        {activeTab === "impact" && <DppImpactView scrollRef={scrollContainerRef} />}
        {activeTab === "parts" && <DppProductView scrollRef={scrollContainerRef} />}
      </div>

      {/* Fixed bottom navigation */}
      <DppNavigation activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Bottom fade: transparent → solid white, anchored to phone bottom */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 160,
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)",
          pointerEvents: "none",
          zIndex: 39,
        }}
      />
    </div>
  );
}
