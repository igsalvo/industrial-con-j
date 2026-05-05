import { getSiteConfig } from "@/lib/queries";
import { HeroSection } from "@/components/sections/hero-section";

export default async function HomePage() {
  const siteConfig = await getSiteConfig();

  return (
    <div className="pb-10">
      {siteConfig.showHeroSection ? <HeroSection config={siteConfig} /> : null}
    </div>
  );
}
