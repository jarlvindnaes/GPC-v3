import { Hero } from "../components/Hero";
import { CountdownBanner } from "../components/CountdownBanner";
import { TrustLogos } from "../components/TrustLogos";
import { FeatureGrid } from "../components/FeatureGrid";
import { StatsSection } from "../components/StatsSection";
import { IntegrationSection } from "../components/IntegrationSection";
import { StorytellingScroll } from "../components/StorytellingScroll";
import { Pricing } from "../components/Pricing";
import { Testimonials } from "../components/Testimonials";

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
