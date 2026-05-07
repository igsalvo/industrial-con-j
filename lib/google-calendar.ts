export type CalendarEvent = {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  startsAt: Date;
  endsAt: Date | null;
  googleCalendarUrl: string;
  icsContent: string;
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

function toGoogleDate(date: Date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function escapeIcsText(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}

export function createGoogleCalendarUrl(event: {
  title: string;
  description: string | null;
  location: string | null;
  startsAt: Date;
  endsAt: Date | null;
}) {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${toGoogleDate(event.startsAt)}/${toGoogleDate(event.endsAt || event.startsAt)}`,
    details: event.description || "",
    location: event.location || ""
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function createIcsContent(event: {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  startsAt: Date;
  endsAt: Date | null;
}) {
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Industrial con J//Calendar//ES",
    "BEGIN:VEVENT",
    `UID:${event.id}`,
    `DTSTAMP:${toGoogleDate(new Date())}`,
    `DTSTART:${toGoogleDate(event.startsAt)}`,
    `DTEND:${toGoogleDate(event.endsAt || event.startsAt)}`,
    `SUMMARY:${escapeIcsText(event.title)}`,
    event.description ? `DESCRIPTION:${escapeIcsText(event.description)}` : null,
    event.location ? `LOCATION:${escapeIcsText(event.location)}` : null,
    "END:VEVENT",
    "END:VCALENDAR"
  ]
    .filter(Boolean)
    .join("\r\n");
}

export async function getGoogleCalendarEvents(limit = 6): Promise<CalendarEvent[]> {
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

    return events
      .map((block) => {
        const startsAt = parseIcsDate(getIcsValue(block, "DTSTART"));
        if (!startsAt || startsAt < now) {
          return null;
        }

        const id = getIcsValue(block, "UID") || `${startsAt.toISOString()}-${getIcsValue(block, "SUMMARY") || "event"}`;
        const title = unescapeIcsText(getIcsValue(block, "SUMMARY") || "Evento Industrial con J");
        const description = getIcsValue(block, "DESCRIPTION");
        const location = getIcsValue(block, "LOCATION");
        const event = {
          id,
          title,
          description: description ? unescapeIcsText(description) : null,
          location: location ? unescapeIcsText(location) : null,
          startsAt,
          endsAt: parseIcsDate(getIcsValue(block, "DTEND"))
        };

        return {
          ...event,
          googleCalendarUrl: createGoogleCalendarUrl(event),
          icsContent: createIcsContent(event)
        };
      })
      .filter((event): event is CalendarEvent => Boolean(event))
      .sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime())
      .slice(0, limit);
  } catch (error) {
    console.error("Google Calendar feed parsing failed", error);
    return [];
  }
}
