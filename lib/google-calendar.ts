export type CalendarEvent = {
  uid: string;
  title: string;
  description: string;
  location: string;
  start: Date;
  end: Date | null;
  sourceName?: string | null;
  sourceLogoUrl?: string | null;
  sourceCalendarUrl?: string | null;
};

type IcalEventLike = {
  type?: string;
  summary?: unknown;
  description?: unknown;
  location?: unknown;
  start?: Date;
  end?: Date;
  uid?: string;
  rrule?: unknown;
};

const DEFAULT_CALENDAR_ICS_URL = "https://calendar.google.com/calendar/ical/vinculacion.dii%40uchile.cl/public/basic.ics";

export function toGoogleCalendarDate(date: Date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function escapeIcsText(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}

function toEventText(value: unknown, fallback = "") {
  if (typeof value === "string") {
    return value;
  }

  if (value && typeof value === "object" && "val" in value && typeof value.val === "string") {
    return value.val;
  }

  return fallback;
}

function toGoogleCalendarIcsUrl(value: string) {
  return `https://calendar.google.com/calendar/ical/${encodeURIComponent(value)}/public/basic.ics`;
}

export function getCalendarFeedUrl(calendarIdOrUrl?: string | null) {
  const value = calendarIdOrUrl?.trim() || process.env.GOOGLE_CALENDAR_ID?.trim();

  if (!value) {
    console.error("Missing GOOGLE_CALENDAR_ID. Using default Industrial con J calendar feed.");
    return DEFAULT_CALENDAR_ICS_URL;
  }

  if (value.startsWith("http")) {
    try {
      const url = new URL(value);
      const src = url.searchParams.get("src");
      if (url.hostname.includes("calendar.google.com") && src) {
        return toGoogleCalendarIcsUrl(src);
      }

      if (url.hostname.includes("calendar.google.com") && url.pathname.includes("/calendar/embed")) {
        console.error("Google Calendar embed URL is missing src parameter.", value);
        return DEFAULT_CALENDAR_ICS_URL;
      }
    } catch {
      return value;
    }

    return value;
  }

  return toGoogleCalendarIcsUrl(value);
}

async function loadCalendarData(ical: any, url: string) {
  try {
    return await ical.async.fromURL(url);
  } catch (fromUrlError) {
    console.error("Google Calendar fromURL failed, retrying with fetch", fromUrlError);
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Calendar feed failed with ${response.status}`);
    }
    const body = await response.text();
    if (!body.trim()) {
      return {};
    }
    return await ical.async.parseICS(body);
  }
}

function toCalendarEvent(
  event: IcalEventLike,
  start: Date | null,
  end: Date | null,
  source?: { name?: string | null; logoUrl?: string | null; calendarIdOrUrl?: string | null }
): CalendarEvent | null {
  if (!start) {
    return null;
  }

  return {
    title: toEventText(event.summary, "Sin título"),
    description: toEventText(event.description),
    location: toEventText(event.location),
    start,
    end,
    sourceName: source?.name || null,
    sourceLogoUrl: source?.logoUrl || null,
    sourceCalendarUrl: source?.calendarIdOrUrl || null,
    uid: event.uid || `${start.toISOString()}-${toEventText(event.summary, "sin-titulo")}`
  };
}

export function createGoogleCalendarUrl(event: {
  title: string;
  description?: string;
  location?: string;
  start: Date;
  end: Date | null;
}) {
  const params = new URLSearchParams({
    text: event.title,
    dates: `${toGoogleCalendarDate(event.start)}/${toGoogleCalendarDate(event.end || event.start)}`,
    details: event.description || "",
    location: event.location || ""
  });

  return `https://calendar.google.com/calendar/u/0/r/eventedit?${params.toString()}`;
}

export function createIcsContent(event: {
  uid: string;
  title: string;
  description?: string;
  location?: string;
  start: Date;
  end: Date | null;
}) {
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Industrial con J//Calendar//ES",
    "BEGIN:VEVENT",
    `UID:${event.uid}`,
    `DTSTAMP:${toGoogleCalendarDate(new Date())}`,
    `DTSTART:${toGoogleCalendarDate(event.start)}`,
    `DTEND:${toGoogleCalendarDate(event.end || event.start)}`,
    `SUMMARY:${escapeIcsText(event.title)}`,
    event.description ? `DESCRIPTION:${escapeIcsText(event.description)}` : null,
    event.location ? `LOCATION:${escapeIcsText(event.location)}` : null,
    "END:VEVENT",
    "END:VCALENDAR"
  ]
    .filter(Boolean)
    .join("\r\n");
}

export async function getEventsFromICS(
  limit = 12,
  source?: { name?: string | null; logoUrl?: string | null; calendarIdOrUrl?: string | null }
): Promise<CalendarEvent[]> {
  const url = getCalendarFeedUrl(source?.calendarIdOrUrl);

  try {
    const icalModule = await import("node-ical");
    const ical = icalModule.default ?? icalModule;
    const data = await loadCalendarData(ical, url);
    const now = new Date();
    const rangeEnd = new Date(now);
    rangeEnd.setMonth(rangeEnd.getMonth() + 18);
    const parsedEvents: CalendarEvent[] = [];
    const sourceEvents = (Object.values(data) as IcalEventLike[]).filter((entry) => entry?.type === "VEVENT");

    for (const event of sourceEvents) {
      if (event.rrule) {
        const instances = ical.expandRecurringEvent(event as never, {
          from: now,
          to: rangeEnd,
          expandOngoing: true
        });

        for (const instance of instances) {
          const instanceEvent = toCalendarEvent(instance.event as IcalEventLike, new Date(instance.start), instance.end ? new Date(instance.end) : null, source);
          if (instanceEvent) {
            parsedEvents.push({
              ...instanceEvent,
              uid: `${instanceEvent.uid}-${instanceEvent.start.toISOString()}`
            });
          }
        }

        continue;
      }

      const parsedEvent = toCalendarEvent(event, event.start ? new Date(event.start) : null, event.end ? new Date(event.end) : null, source);
      if (parsedEvent) {
        parsedEvents.push(parsedEvent);
      }
    }

    const events = parsedEvents
      .filter((event) => event.start >= now || Boolean(event.end && event.end >= now))
      .sort((a, b) => a.start.getTime() - b.start.getTime())
      .slice(0, limit);

    console.log("Eventos detectados:", events.length, "VEVENT fuente:", sourceEvents.length);

    return events;
  } catch (error) {
    console.error("Google Calendar feed parsing failed", error);
    return [];
  }
}

export async function getCalendarEventByUid(uid: string) {
  const events = await getEventsFromICS(50);
  return events.find((event) => event.uid === uid) || null;
}
