import { getAllSponsors, getSiteConfig } from "@/lib/queries";
import { SectionHeading } from "@/components/sections/section-heading";
import { SponsorGrid } from "@/components/ui/sponsor-grid";
import { EmptyState } from "@/components/ui/empty-state";

export default async function SponsorsPage() {
  const [sponsors, config] = await Promise.all([getAllSponsors(), getSiteConfig()]);

  return (
    <section className="shell py-12">
      <SectionHeading
        eyebrow={config.sponsorsPageEyebrow || "ALIADOS"}
        title={config.sponsorsPageTitle || "Aliados de Industrial con J"}
        description={config.sponsorsPageDescription || "Organizaciones que impulsan esta comunidad de conversaciones, eventos e iniciativas en torno a la Ingeniería Industrial."}
      />
      {sponsors.length === 0 ? (
        <EmptyState title="Aún no hay aliados publicados" description="Pronto destacaremos a las organizaciones que impulsan esta comunidad." />
      ) : (
        <SponsorGrid sponsors={sponsors} />
      )}
    </section>
  );
}
