export type CalendarEvent = {
  uid: string;
  title: string;
  description?: string;
  location?: string;
  start: Date;
  end: Date;
};

function unfoldIcsLines(input: string) {
  return input.replace(/\r?\n[ \t]/g, "");
}

function unescapeIcsText(value: string) {
  return value.replace(/\\n/g, "\n").replace(/\\,/g, ",").replace(/\\;/g, ";").replace(/\\\\/g, "\\").trim();
}

function getIcsValue(block: string, property: string) {
  const line = block.split(/\r?\n/).find((item) => item.startsWith(`${property}:`) || item.startsWith(`${property};`));
  if (!line) {
    return null;
  }

  return line.slice(line.indexOf(":") + 1);
}

function parseIcsDate(value: string | null) {
  if (!value) {
    return null;
  }

  const normalized = value.trim();
  if (/^\d{8}$/.test(normalized)) {
    return new Date(`${normalized.slice(0, 4)}-${normalized.slice(4, 6)}-${normalized.slice(6, 8)}T00:00:00`);
  }

  const match = normalized.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(Z?)$/);
  if (!match) {
    return null;
  }

  const [, year, month, day, hour, minute, second, utc] = match;
  const iso = `${year}-${month}-${day}T${hour}:${minute}:${second}${utc ? "Z" : ""}`;
  return new Date(iso);
}

export function toGoogleCalendarDate(date: Date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function escapeIcsText(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
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
  const calendarId = process.env.GOOGLE_CALENDAR_ID;

  if (!calendarId) {
    return [];
  }

  const calendarUrl = `https://calendar.google.com/calendar/ical/${encodeURIComponent(calendarId)}/public/basic.ics`;

  try {
    const response = await fetch(calendarUrl, {
      next: { revalidate: 900 }
    });

    if (!response.ok) {
      console.error("Google Calendar feed request failed", { status: response.status });
      return [];
    }

    const source = unfoldIcsLines(await response.text());
    const events = source.match(/BEGIN:VEVENT[\s\S]*?END:VEVENT/g) || [];
    const now = new Date();

    const parsedEvents: CalendarEvent[] = [];

    for (const block of events) {
      const start = parseIcsDate(getIcsValue(block, "DTSTART"));
      if (!start || start < now) {
        continue;
      }

      const uid = getIcsValue(block, "UID") || `${start.toISOString()}-${getIcsValue(block, "SUMMARY") || "event"}`;
      const title = unescapeIcsText(getIcsValue(block, "SUMMARY") || "Evento Industrial con J");
      const description = getIcsValue(block, "DESCRIPTION");
      const location = getIcsValue(block, "LOCATION");

      parsedEvents.push({
        uid,
        title,
        description: description ? unescapeIcsText(description) : undefined,
        location: location ? unescapeIcsText(location) : undefined,
        start,
        end: parseIcsDate(getIcsValue(block, "DTEND")) || start
      });
    }

    return parsedEvents
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
