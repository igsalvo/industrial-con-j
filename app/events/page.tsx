import { EventGrid } from "@/components/sections/event-grid";
import { SectionHeading } from "@/components/sections/section-heading";
import { getEventsFromICS } from "@/lib/google-calendar";
import { getCalendarSources, getMediaItems, getPublicSectionsData, getSiteConfig } from "@/lib/queries";
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
  sourceName?: string | null;
  sourceLogoUrl?: string | null;
  sourceCalendarUrl?: string | null;
  ctaLink?: string | null;
  ctaText?: string | null;
};

function normalizeEventKey(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ");
}

function getEventDedupeKey(event: Pick<CalendarEventItem, "title" | "start">) {
  const startDate = new Date(event.start);
  const startKey = Number.isNaN(startDate.getTime()) ? event.start : startDate.toISOString();
  return `${normalizeEventKey(event.title)}::${startKey}`;
}

function mergeCalendarEvents(adminEvents: CalendarEventItem[], icsEvents: CalendarEventItem[]) {
  const seen = new Set<string>();
  const now = new Date();

  return [...adminEvents, ...icsEvents]
    .filter((event) => {
      const start = new Date(event.start);
      const end = event.end ? new Date(event.end) : null;
      return start >= now || Boolean(end && end >= now);
    })
    .filter((event) => {
      const key = getEventDedupeKey(event);
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    })
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
}

export default async function EventsPage() {
  const [siteConfig, publicData, mediaItems, calendarSources] = await Promise.all([getSiteConfig(), getPublicSectionsData(), getMediaItems("events.featured"), getCalendarSources()]);
  if (!siteConfig.showEventsSection) {
    notFound();
  }
  const sourceEvents = calendarSources.length
    ? (await Promise.all(calendarSources.map((source) => getEventsFromICS(50, source)))).flat()
    : await getEventsFromICS(50);
  const adminEvents: CalendarEventItem[] = publicData.events.map((event) => ({
    uid: event.id,
    title: event.title,
    description: event.description,
    location: event.location || undefined,
    start: event.startsAt.toISOString(),
    end: event.endsAt?.toISOString() || null,
    imageUrl: event.imageUrl,
    imagePositionX: event.imagePositionX,
    imagePositionY: event.imagePositionY,
    sourceName: event.sourceName,
    sourceLogoUrl: event.sourceLogoUrl,
    sourceCalendarUrl: event.sourceCalendarUrl,
    ctaLink: event.ctaLink,
    ctaText: event.ctaText
  }));
  const googleCalendarEvents: CalendarEventItem[] = sourceEvents.map((event) => ({
    ...event,
    start: event.start.toISOString(),
    end: event.end?.toISOString() || null
  }));
  const calendarEvents = mergeCalendarEvents(adminEvents, googleCalendarEvents);

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
