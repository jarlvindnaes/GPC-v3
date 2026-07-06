import { motion } from "motion/react";
import { brandConfig } from "./dppBrandConfig";
import { uiIcons } from "./dppIcons";

type TabId = "about" | "maintenance" | "impact" | "parts";

interface DppNavigationProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

function InfoIcon({ isActive }: { isActive: boolean }) {
  return (
    <svg aria-hidden="true" style={{ display: "block", width: 24, height: 24 }} fill="none" viewBox="0 0 24 24">
      <path clipRule="evenodd" d={uiIcons.p2709c3f0} fill={isActive ? "black" : "#1C2024"} fillRule="evenodd" />
    </svg>
  );
}

function WrenchIcon({ isActive }: { isActive: boolean }) {
  return (
    <svg aria-hidden="true" style={{ display: "block", width: 24, height: 24 }} fill="none" viewBox="0 0 24 24">
      <path clipRule="evenodd" d={uiIcons.p17e348c0} fill={isActive ? "black" : "#5D5D5D"} fillRule="evenodd" />
    </svg>
  );
}

function TreesIcon({ isActive }: { isActive: boolean }) {
  return (
    <svg aria-hidden="true" style={{ display: "block", width: 24, height: 24 }} fill="none" viewBox="0 0 24 24">
      <path d={uiIcons.p4a6da80} fill={isActive ? "black" : "#1C2024"} />
    </svg>
  );
}

function PartsIcon({ isActive }: { isActive: boolean }) {
  return (
    <svg aria-hidden="true" style={{ display: "block", width: 24, height: 24 }} fill="none" viewBox="0 0 16 16">
      <path clipRule="evenodd" d={uiIcons.partsIcon} fill={isActive ? "black" : "#5D5D5D"} fillRule="evenodd" />
    </svg>
  );
}

const tabs: TabId[] = ["about", "maintenance", "impact", "parts"];

const menuItems: {
  id: TabId;
  label: string;
  icon: React.FC<{ isActive: boolean }>;
}[] = [
  { id: "about", label: "About", icon: InfoIcon },
  { id: "maintenance", label: "Maintenance", icon: WrenchIcon },
  { id: "impact", label: "Impact", icon: TreesIcon },
  { id: "parts", label: "Parts", icon: PartsIcon }
];

// Position multipliers for the active indicator (center of each tab)
const tabPositions: Record<TabId, number> = {
  about: 0.125,
  maintenance: 0.375,
  impact: 0.625,
  parts: 0.875
};

export function DppNavigation({ activeTab, onTabChange }: DppNavigationProps) {
  return (
    <nav
      style={{
        position: "absolute",
        bottom: 84,
        left: 0,
        right: 0,
        zIndex: 40
      }}
      aria-label="Product passport sections"
    >
      <div style={{ position: "relative", padding: "0 16px" }}>
        <div
          style={{
            display: "flex",
            boxSizing: "border-box",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 12px",
            position: "relative",
            overflow: "hidden",
            borderRadius: "1rem",
            borderTop: "1px solid white",
            borderLeft: "1px solid white",
            boxShadow: "0 -2px 12px rgba(0, 0, 0, 0.15), 0 -4px 24px rgba(0, 0, 0, 0.1)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            backgroundColor: "rgba(255, 255, 255, 0.8)"
          }}
          role="tablist"
          aria-label="Product sections"
        >
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                type="button"
                key={item.id}
                id={`tab-${item.id}`}
                role="tab"
                aria-selected={isActive}
                aria-controls="main-content"
                tabIndex={isActive ? 0 : -1}
                onClick={() => onTabChange(item.id)}
                onKeyDown={(event) => {
                  const currentIndex = tabs.indexOf(item.id);
                  if (event.key === "ArrowRight") {
                    const nextIndex = (currentIndex + 1) % tabs.length;
                    onTabChange(tabs[nextIndex]);
                    document.getElementById(`tab-${tabs[nextIndex]}`)?.focus();
                  } else if (event.key === "ArrowLeft") {
                    const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
                    onTabChange(tabs[prevIndex]);
                    document.getElementById(`tab-${tabs[prevIndex]}`)?.focus();
                  }
                }}
                style={{
                  flex: "1 0 0",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                  padding: "12px 0",
                  position: "relative",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  opacity: isActive ? 1 : 0.65,
                  transition: "opacity 150ms ease",
                  minWidth: 0,
                  minHeight: 1
                }}
              >
                <div
                  style={{
                    width: 24,
                    height: 24,
                    overflow: "hidden",
                    position: "relative",
                    flexShrink: 0
                  }}
                  aria-hidden="true"
                >
                  <Icon isActive={isActive} />
                </div>
                <span
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: 12,
                    lineHeight: "16px",
                    color: isActive ? "black" : "#1c2024",
                    whiteSpace: "nowrap"
                  }}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
          {/* Active tab indicator (animated colored line at bottom) */}
          <motion.div
            style={{
              position: "absolute",
              bottom: 0,
              height: 2,
              width: 73,
              backgroundColor: brandConfig.colors.primary
            }}
            animate={{
              left: `calc(12px + (100% - 24px) * ${tabPositions[activeTab]} - 36.5px)`
            }}
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
          />
        </div>
      </div>
    </nav>
  );
}
