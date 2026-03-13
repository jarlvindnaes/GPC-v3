import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { brandConfig } from "./dppBrandConfig";
import { DppCheckoutOverlay } from "./DppCheckoutOverlay";
import { DppHeader } from "./DppHeader";
import DppImpactView from "./DppImpactView";
import DppInfoView from "./DppInfoView";
import { DppMaintenanceView } from "./DppMaintenanceView";
import { DppNavigation } from "./DppNavigation";
import { BasketIcon, DppProductView, parts } from "./DppProductView";
import type { CartItem } from "./dppTypes";

type TabId = "about" | "maintenance" | "impact" | "parts";

/** Header: 52px top pad + 1px border + 12px pad + 52px logo + 12px pad = 129px; plus 16px gap */
const HEADER_HEIGHT = 145;
/** Navigation bar height + Safari bottom chrome clearance */
const NAV_HEIGHT = 94;

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
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  const handleAddToCart = useCallback((partId: string, quantity: number) => {
    setCartItems((prev) => {
      const idx = prev.findIndex((i) => i.partId === partId);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity };
        return next;
      }
      return [...prev, { partId, quantity }];
    });
  }, []);

  const handleRemoveFromCart = useCallback((partId: string) => {
    setCartItems((prev) => prev.filter((i) => i.partId !== partId));
  }, []);

  const handleTabChange = useCallback((tab: TabId) => {
    setActiveTab(tab);
    // Reset scroll position when switching tabs
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
    setIsScrolled(false);
  }, []);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const onScroll = () => setIsScrolled(el.scrollTop > 10);
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
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
      className="dpp-phone"
      style={{
        width: 375,
        height: 812,
        position: "relative",
        overflow: "hidden",
        borderRadius: 62,
        background: "#fff"
      }}
    >
      {/* Fixed header */}
      <DppHeader isScrolled={isScrolled} />

      {/* Scrollable content area */}
      <div
        ref={scrollContainerRef}
        data-phone-scroll
        onTouchMove={handleTouchMove}
        style={{
          position: "absolute",
          inset: 0,
          overflowY: "auto",
          overflowX: "hidden",
          paddingTop: HEADER_HEIGHT,
          paddingBottom: NAV_HEIGHT,
          WebkitOverflowScrolling: "touch",
          overscrollBehavior: "none"
        }}
        id="main-content"
        role="tabpanel"
        aria-label={`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} tab content`}
      >
        {activeTab === "about" && <DppInfoView scrollRef={scrollContainerRef} />}
        {activeTab === "maintenance" && <DppMaintenanceView scrollRef={scrollContainerRef} />}
        {activeTab === "impact" && <DppImpactView scrollRef={scrollContainerRef} />}
        {activeTab === "parts" && <DppProductView scrollRef={scrollContainerRef} overlayRef={overlayRef} onAddToCart={handleAddToCart} />}
      </div>

      {/* Overlay container for bottom sheets — sits outside the scroll
           container so content isn't clipped by overflow:auto.
           z-index 50 sits above header (40) and nav (40). */}
      <div
        ref={overlayRef}
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 50,
        }}
      />

      {/* Checkout button — lives in overlay so it persists across tabs */}
      <AnimatePresence>
        {cartCount > 0 && !checkoutOpen && (
          <motion.button
            key={cartCount}
            type="button"
            onClick={() => setCheckoutOpen(true)}
            className="absolute flex items-center gap-[16px] rounded-[10px] shadow-[0_2px_8px_rgba(0,0,0,0.18)] pointer-events-auto cursor-pointer h-[40px] px-[12px]"
            style={{
              top: 161,
              right: 16,
              zIndex: 51,
              backgroundColor: brandConfig.colors.primary,
            }}
            initial={{ x: 120, opacity: 0, scale: 0.8 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            <div className="relative shrink-0">
              <BasketIcon size={24} />
              <div
                className="absolute -top-[6px] -right-[8px] flex items-center justify-center min-w-[16px] h-[16px] rounded-full bg-white px-[3px]"
                style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }}
              >
                <span
                  className="font-['SF_Pro:Bold',sans-serif] font-bold text-[9px] leading-[10px]"
                  style={{ color: brandConfig.colors.primary }}
                >
                  {cartCount}
                </span>
              </div>
            </div>
            <span className="font-['SF_Pro:Medium',sans-serif] font-[510] text-[13px] text-white leading-[16px]">
              Checkout
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Checkout overlay */}
      <AnimatePresence>
        {checkoutOpen && (
          <div style={{ position: "absolute", inset: 0, zIndex: 52, pointerEvents: "none" }}>
            <DppCheckoutOverlay
              cartItems={cartItems}
              parts={parts}
              onClose={() => setCheckoutOpen(false)}
              onRemoveItem={handleRemoveFromCart}
              onOrderPlaced={() => {
                setCartItems([]);
                setCheckoutOpen(false);
              }}
            />
          </div>
        )}
      </AnimatePresence>

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
          height: 60,
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)",
          pointerEvents: "none",
          zIndex: 39,
        }}
      />
    </div>
  );
}
