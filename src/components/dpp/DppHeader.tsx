import { brandConfig } from "./dppBrandConfig";

// Manufacturer logo for the Soft Lounge Chair passport (public/wireframes/logos/takt.svg).
function BrandLogo() {
  return (
    <img
      src={`${import.meta.env.BASE_URL}wireframes/logos/takt.svg`}
      alt="TAKT"
      style={{
        height: 20,
        width: "auto",
        display: "block",
        flexShrink: 0
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
        zIndex: 40
      }}
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
          background: "linear-gradient(to bottom, rgba(248,247,245,1) 0%, rgba(248,247,245,0) 100%)", // TAKT off-white
          pointerEvents: "none",
          zIndex: 0
        }}
      />

      {/* Header content with padding to clear status bar */}
      <div style={{ position: "relative", padding: "52px 16px 0 16px" }}>
        <div
          style={{
            position: "relative",
            minHeight: 58,
            borderRadius: "1rem"
          }}
        >
          {/* Backdrop-blur background — separate layer so GPU compositing
              doesn't degrade SVG anti-aliasing in the logo above */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "inherit",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
              // At the top of the page the card is invisible (no background, border or shadow); once the
              // content scrolls under it, all three fade in together.
              backgroundColor: isScrolled ? brandConfig.header.backgroundColor : "rgba(248, 247, 245, 0)",
              border: `1px solid ${isScrolled ? "rgba(255, 255, 255, 1)" : "rgba(255, 255, 255, 0)"}`,
              boxShadow: isScrolled
                ? "0 2px 12px rgba(0, 0, 0, 0.15), 0 4px 24px rgba(0, 0, 0, 0.1)"
                : "0 2px 12px rgba(0, 0, 0, 0), 0 4px 24px rgba(0, 0, 0, 0)",
              transition: "box-shadow 300ms ease, background-color 300ms ease, border-color 300ms ease"
            }}
          />
          {/* Logo — sits outside the compositing layer for crisp SVG rendering.
              Explicit zIndex needed because matrix3d homography flattens stacking contexts. */}
          <div
            style={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 58, // the card's height, so the logo sits in its vertical centre
              padding: "0 12px"
            }}
          >
            <BrandLogo />
          </div>
        </div>
      </div>
    </header>
  );
}
