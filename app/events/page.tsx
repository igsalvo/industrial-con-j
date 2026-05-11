import { EventGrid } from "@/components/sections/event-grid";
import { SectionHeading } from "@/components/sections/section-heading";
import { getEventsFromICS } from "@/lib/google-calendar";
import { getMediaItems, getPublicSectionsData, getSiteConfig } from "@/lib/queries";
import { notFound } from "next/navigation";

export default async function EventsPage() {
  const [siteConfig, icsEvents, publicData, mediaItems] = await Promise.all([getSiteConfig(), getEventsFromICS(), getPublicSectionsData(), getMediaItems("events.featured")]);
  if (!siteConfig.showEventsSection) {
    notFound();
  }
  const adminEvents = publicData.events.map((event) => ({
    uid: event.id,
    title: event.title,
    description: event.description,
    location: event.location || undefined,
    start: event.startsAt.toISOString(),
    end: event.endsAt?.toISOString() || null,
    imageUrl: event.imageUrl,
    imagePositionX: event.imagePositionX,
    imagePositionY: event.imagePositionY,
    ctaLink: event.ctaLink,
    ctaText: event.ctaText
  }));
  const calendarEvents = adminEvents.length
    ? adminEvents
    : icsEvents.map((event) => ({
        ...event,
        start: event.start.toISOString(),
        end: event.end?.toISOString() || null
      }));

  return (
    <main className="dark relative overflow-hidden bg-[#111312] py-9 text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_78%_8%,rgba(226,33,28,0.16),transparent_34%)]" />
      <div className="shell relative">
      <SectionHeading
        eyebrow={siteConfig.eventsSectionEyebrow || "EVENTOS"}
        title={siteConfig.eventsSectionTitle || "Próximas actividades"}
        description={siteConfig.eventsSectionDescription || "Encuentros, conversaciones y actividades para reunir a la comunidad de Ingeniería Industrial."}
      />
      <EventGrid events={calendarEvents} fallbackImage={mediaItems[0]} />
      </div>
    </main>
  );
}
