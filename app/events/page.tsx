import { EventGrid } from "@/components/sections/event-grid";
import { SectionHeading } from "@/components/sections/section-heading";
import { getEventsFromICS } from "@/lib/google-calendar";
import { getSiteConfig } from "@/lib/queries";
import { notFound } from "next/navigation";

export default async function EventsPage() {
  const [siteConfig, events] = await Promise.all([getSiteConfig(), getEventsFromICS()]);
  if (!siteConfig.showEventsSection) {
    notFound();
  }

  return (
    <main className="shell py-10">
      <SectionHeading
        eyebrow={siteConfig.eventsSectionEyebrow || "Eventos"}
        title={siteConfig.eventsSectionTitle || "Próximas actividades"}
        description={siteConfig.eventsSectionDescription || "Calendario de encuentros, hitos y actividades abiertas para la comunidad."}
      />
      <EventGrid
        events={events.map((event) => ({
          ...event,
          start: event.start.toISOString(),
          end: event.end?.toISOString() || null
        }))}
      />
    </main>
  );
}
