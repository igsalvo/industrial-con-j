import { getPublicSectionsData, getSiteConfig } from "@/lib/queries";
import { IdentityGrid } from "@/components/sections/public-section-cards";
import { SectionHeading } from "@/components/sections/section-heading";

export default async function IdentityPage() {
  const [{ identityItems }, siteConfig] = await Promise.all([getPublicSectionsData(), getSiteConfig()]);

  return (
    <main className="shell py-10">
      <SectionHeading
        eyebrow={siteConfig.identitySectionEyebrow || "Identidad"}
        title={siteConfig.identitySectionTitle || "Lo que mueve Industrial con J"}
        description={siteConfig.identitySectionDescription || "Proposito, vision, mision y valores editables desde el administrador."}
      />
      <IdentityGrid items={identityItems} />
    </main>
  );
}
