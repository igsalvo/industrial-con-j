export type CalendarEvent = {
  uid: string;
  title: string;
  description?: string;
  location?: string;
  start: Date;
  end: Date;
};

type IcalEventLike = {
  type?: string;
  summary?: unknown;
  description?: unknown;
  location?: unknown;
  start?: Date;
  end?: Date;
  uid?: string;
};

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

export function createGoogleCalendarUrl(event: {
  title: string;
  description?: string;
  location?: string;
  start: Date;
  end: Date;
}) {
  const params = new URLSearchParams({
    text: event.title,
    dates: `${toGoogleCalendarDate(event.start)}/${toGoogleCalendarDate(event.end)}`,
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
  end: Date;
}) {
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Industrial con J//Calendar//ES",
    "BEGIN:VEVENT",
    `UID:${event.uid}`,
    `DTSTAMP:${toGoogleCalendarDate(new Date())}`,
    `DTSTART:${toGoogleCalendarDate(event.start)}`,
    `DTEND:${toGoogleCalendarDate(event.end)}`,
    `SUMMARY:${escapeIcsText(event.title)}`,
    event.description ? `DESCRIPTION:${escapeIcsText(event.description)}` : null,
    event.location ? `LOCATION:${escapeIcsText(event.location)}` : null,
    "END:VEVENT",
    "END:VCALENDAR"
  ]
    .filter(Boolean)
    .join("\r\n");
}

export async function getEventsFromICS(limit = 12): Promise<CalendarEvent[]> {
  const url = process.env.GOOGLE_CALENDAR_ID;

  if (!url) {
    return [];
  }

  try {
    const ical = await import("node-ical");
    const data = await ical.async.fromURL(url);
    const now = new Date();

    return (Object.values(data) as IcalEventLike[])
      .filter((entry) => entry?.type === "VEVENT")
      .map((event) => ({
        title: toEventText(event.summary, "Sin título"),
        description: toEventText(event.description),
        location: toEventText(event.location),
        start: event.start as Date,
        end: (event.end || event.start) as Date,
        uid: event.uid || `${event.start?.toISOString() || "event"}-${event.summary || "sin-titulo"}`
      }))
      .filter((event) => event.start && new Date(event.start) > now)
      .sort((a, b) => a.start.getTime() - b.start.getTime())
      .slice(0, limit);
  } catch (error) {
    console.error("Google Calendar feed parsing failed", error);
    return [];
  }
}

export async function getCalendarEventByUid(uid: string) {
  const events = await getEventsFromICS(50);
  return events.find((event) => event.uid === uid) || null;
}
