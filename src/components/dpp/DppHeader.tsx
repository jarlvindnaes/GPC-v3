import { brandConfig } from "./dppBrandConfig";

function BrandLogo() {
  return (
    <img
      src={`${import.meta.env.BASE_URL}images/dpp/brand-logo.svg`}
      alt={brandConfig.name}
      draggable={false}
      style={{
        height: 40,
        width: "auto",
        display: "block",
        flexShrink: 0,
      }}
    />
  );
}

export function DppHeader() {
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
          height: 160,
          background:
            "linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Header content with padding to clear status bar */}
      <div style={{ position: "relative", padding: "44px 8px 0 8px" }}>
        <a
          style={{
            display: "flex",
            boxSizing: "border-box",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            padding: "6px 12px",
            position: "relative",
            overflow: "visible",
            cursor: "pointer",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            backgroundColor: brandConfig.header.backgroundColor,
            borderTop: `9px solid ${brandConfig.header.borderColor}`,
            borderLeft: "1px solid white",
            borderRadius: "0.5rem",
            boxShadow: "0 0px 4px rgba(0, 0, 0, 0.2)",
            minHeight: 46,
            textDecoration: "none",
          }}
          href={brandConfig.website}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${brandConfig.name} — visit website`}
        >
          <BrandLogo />
        </a>
      </div>
    </header>
  );
}
