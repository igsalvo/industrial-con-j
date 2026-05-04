import { getPublicSectionsData, getSiteConfig } from "@/lib/queries";
import { HonorGrid } from "@/components/sections/public-section-cards";
import { SectionHeading } from "@/components/sections/section-heading";

export default async function HonorPage() {
  const [{ honorMembers }, siteConfig] = await Promise.all([getPublicSectionsData(), getSiteConfig()]);

  return (
    <main className="shell py-10">
      <SectionHeading
        eyebrow={siteConfig.honorSectionEyebrow || "Circulo de Honor"}
        title={siteConfig.honorSectionTitle || "Personas que abren camino"}
        description={siteConfig.honorSectionDescription || "Reconocimientos y perfiles destacados del ecosistema industrial."}
      />
      <HonorGrid members={honorMembers} />
    </main>
  );
}
