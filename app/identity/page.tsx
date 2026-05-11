import { getPublicSectionsData, getSiteConfig } from "@/lib/queries";
import { IdentityGrid } from "@/components/sections/public-section-cards";
import { SectionHeading } from "@/components/sections/section-heading";
import { notFound } from "next/navigation";

export default async function IdentityPage() {
  const [{ identityItems }, siteConfig] = await Promise.all([getPublicSectionsData(), getSiteConfig()]);
  if (!siteConfig.showIdentitySection) {
    notFound();
  }

  return (
    <main className="shell py-10">
      <SectionHeading
        eyebrow={siteConfig.identitySectionEyebrow || "Identidad"}
        title={siteConfig.identitySectionTitle || "Lo que mueve Industrial con J"}
        description={siteConfig.identitySectionDescription || "Propósito, visión, misión y valores editables desde el administrador."}
      />
      <IdentityGrid items={identityItems} />
    </main>
  );
}
