import { EventGrid } from "@/components/sections/event-grid";
import { SectionHeading } from "@/components/sections/section-heading";
import { getEventsFromICS } from "@/lib/google-calendar";
import { getMediaItems, getPublicSectionsData, getSiteConfig } from "@/lib/queries";
import { notFound } from "next/navigation";

type CalendarEventItem = {
  uid: string;
  title: string;
  description?: string;
  location?: string;
  start: string;
  end: string | null;
  imageUrl?: string | null;
  imagePositionX?: string | null;
  imagePositionY?: string | null;
  ctaLink?: string | null;
  ctaText?: string | null;
};

function getEventKey(event: Pick<CalendarEventItem, "title" | "start">) {
  const start = new Date(event.start);
  return `${event.title.trim().toLowerCase()}::${Number.isNaN(start.getTime()) ? event.start : start.toISOString()}`;
}

export default async function EventsPage() {
  const [siteConfig, icsEvents, publicData, mediaItems] = await Promise.all([getSiteConfig(), getEventsFromICS(), getPublicSectionsData(), getMediaItems("events.featured")]);
  if (!siteConfig.showEventsSection) {
    notFound();
  }
  const now = new Date();
  const adminEvents = publicData.events
    .filter((event) => event.startsAt >= now || Boolean(event.endsAt && event.endsAt >= now))
    .map((event) => ({
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
      ctaText: event.ctaText,
      isFeatured: event.isFeatured
    }));
  const seen = new Set<string>();
  const calendarEvents = [
    ...adminEvents,
    ...icsEvents.map((event) => ({
      ...event,
      start: event.start.toISOString(),
      end: event.end?.toISOString() || null
    }))
  ].filter((event) => {
    const key = getEventKey(event);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
  const hasUpcomingEvents = calendarEvents.some((event) => {
    const start = new Date(event.start);
    const end = event.end ? new Date(event.end) : null;
    return start >= now || Boolean(end && end >= now);
  });

  return (
    <main className="dark relative overflow-hidden bg-[#111312] py-9 text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_78%_8%,rgba(226,33,28,0.16),transparent_34%)]" />
      <div className="shell relative">
      <SectionHeading
        eyebrow={siteConfig.eventsSectionEyebrow || "EVENTOS"}
        title={hasUpcomingEvents ? siteConfig.eventsSectionTitle || "Próximas actividades" : "Actividades recientes"}
        description={siteConfig.eventsSectionDescription || "Encuentros, conversaciones y actividades del calendario de Vinculación DII."}
      />
      <EventGrid events={calendarEvents} fallbackImage={mediaItems[0]} />
      </div>
    </main>
  );
}
