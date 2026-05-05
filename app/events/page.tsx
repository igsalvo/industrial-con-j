import { EventGrid } from "@/components/sections/public-section-cards";
import { SectionHeading } from "@/components/sections/section-heading";
import { getPublicSectionsData, getSiteConfig } from "@/lib/queries";

export default async function EventsPage() {
  const [{ events }, siteConfig] = await Promise.all([getPublicSectionsData(), getSiteConfig()]);

  return (
    <main className="shell py-10">
      <SectionHeading
        eyebrow={siteConfig.eventsSectionEyebrow || "Eventos"}
        title={siteConfig.eventsSectionTitle || "Próximas actividades"}
        description={siteConfig.eventsSectionDescription || "Calendario de encuentros, hitos y actividades abiertas para la comunidad."}
      />
      <EventGrid events={events} />
    </main>
  );
}
