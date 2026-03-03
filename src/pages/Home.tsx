import { CountdownBanner } from "../components/CountdownBanner";
import { FeatureGrid } from "../components/FeatureGrid";
import { Hero } from "../components/Hero";
import { IntegrationSection } from "../components/IntegrationSection";
import { Pricing } from "../components/Pricing";
import { StatsSection } from "../components/StatsSection";
import { StorytellingScroll } from "../components/StorytellingScroll";
import { Testimonials } from "../components/Testimonials";
import { TrustLogos } from "../components/TrustLogos";

export function Home() {
  return (
    <main>
      <Hero />
      <CountdownBanner />
      <TrustLogos />
      <FeatureGrid />
      <StatsSection />
      <IntegrationSection />
      <StorytellingScroll />
      <Testimonials />
      <Pricing />
    </main>
  );
}
