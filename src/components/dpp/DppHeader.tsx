import { brandConfig } from "./dppBrandConfig";

function BrandLogo() {
  return (
    <img
      src={`${import.meta.env.BASE_URL}images/dpp/brand-logo.svg`}
      alt={brandConfig.name}
      draggable={false}
      style={{
        height: 52,
        width: "auto",
        display: "block",
        flexShrink: 0,
      }}
    />
  );
}

export function DppHeader({ isScrolled = false }: { isScrolled?: boolean }) {
  return (
    <header
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 40,
      }}
      role="banner"
    >
      {/* iOS Safari-style fade: 100% white at top → fully transparent at bottom */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 60,
          background:
            "linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Header content with padding to clear status bar */}
      <div style={{ position: "relative", padding: "52px 16px 0 16px" }}>
        <div
          style={{
            display: "flex",
            boxSizing: "border-box",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            padding: "12px 12px",
            position: "relative",
            overflow: "visible",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            backgroundColor: brandConfig.header.backgroundColor,
            border: "1px solid white",
            borderRadius: "1rem",
            boxShadow: isScrolled
              ? "0 2px 12px rgba(0, 0, 0, 0.15), 0 4px 24px rgba(0, 0, 0, 0.1)"
              : "0 2px 12px rgba(0, 0, 0, 0), 0 4px 24px rgba(0, 0, 0, 0)",
            transition: "box-shadow 300ms ease",
            minHeight: 58,
          }}
          aria-label={brandConfig.name}
        >
          <BrandLogo />
        </div>
      </div>
    </header>
  );
}
