import { getSiteConfig } from "@/lib/queries";
import { HeroSection } from "@/components/sections/hero-section";
import { HomePopup } from "@/components/sections/home-popup";

export default async function HomePage() {
  const siteConfig = await getSiteConfig();

  return (
    <div className="pb-10">
      {siteConfig.showHomePopup ? (
        <HomePopup
          title={siteConfig.homePopupTitle}
          body={siteConfig.homePopupBody}
          buttonLabel={siteConfig.homePopupButtonLabel}
          buttonHref={siteConfig.homePopupButtonHref}
          videoUrl={siteConfig.homePopupVideoUrl}
          placement={siteConfig.homePopupPlacement}
        />
      ) : null}
      {siteConfig.showHeroSection ? <HeroSection config={siteConfig} /> : null}
    </div>
  );
}
