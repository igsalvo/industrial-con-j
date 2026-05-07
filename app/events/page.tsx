import { EventGrid } from "@/components/sections/public-section-cards";
import { GoogleCalendarEvents } from "@/components/sections/google-calendar-events";
import { SectionHeading } from "@/components/sections/section-heading";
import { getGoogleCalendarEvents } from "@/lib/google-calendar";
import { getPublicSectionsData, getSiteConfig } from "@/lib/queries";
import { notFound } from "next/navigation";

export default async function EventsPage() {
  const [{ events }, siteConfig, calendarEvents] = await Promise.all([getPublicSectionsData(), getSiteConfig(), getGoogleCalendarEvents()]);
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
      <EventGrid events={events} />
      <GoogleCalendarEvents events={calendarEvents} />
    </main>
  );
}
