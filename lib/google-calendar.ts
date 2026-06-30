export type CalendarEvent = {
  uid: string;
  title: string;
  description: string;
  location: string;
  start: Date;
  end: Date | null;
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
  organizer?: unknown;
  attendees?: unknown;
};

const DEFAULT_CALENDAR_ICS_URL = "https://calendar.google.com/calendar/ical/vinculacion.dii%40uchile.cl/public/basic.ics";

function decodeGoogleCalendarCid(value: string) {
  try {
    const decoded = Buffer.from(value, "base64url").toString("utf8").trim();
    return decoded.includes("@") ? decoded : value;
  } catch {
    return value;
  }
}

function normalizeEmail(value: string) {
  return value.trim().replace(/^mailto:/i, "").toLowerCase();
}

function getCalendarOwnerEmail() {
  const explicitEmail = process.env.GOOGLE_CALENDAR_ACCEPTED_EMAIL?.trim();
  if (explicitEmail) {
    return normalizeEmail(explicitEmail);
  }

  const calendarId = process.env.GOOGLE_CALENDAR_ID?.trim();
  if (!calendarId) {
    return "";
  }

  if (calendarId.startsWith("http")) {
    try {
      const url = new URL(calendarId);
      const src = url.searchParams.get("src");
      const cid = url.searchParams.get("cid");
      const pathCalendarId = decodeURIComponent(url.pathname.match(/\/calendar\/ical\/([^/]+)/)?.[1] || "");
      const decodedCalendarId = src || (cid ? decodeGoogleCalendarCid(cid) : "") || pathCalendarId;
      return decodedCalendarId.includes("@") ? normalizeEmail(decodedCalendarId) : "";
    } catch {
      return "";
    }
  }

  return calendarId.includes("@") ? normalizeEmail(calendarId) : "";
}

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

function unfoldIcsLines(input: string) {
  return input.replace(/\r?\n[ \t]/g, "");
}

function getIcsField(block: string, name: string) {
  const line = block
    .split(/\r?\n/)
    .find((item) => item.startsWith(`${name}:`) || item.startsWith(`${name};`));

  if (!line) {
    return "";
  }

  return line.slice(line.indexOf(":") + 1).trim();
}

function getIcsLines(block: string, name: string) {
  return block
    .split(/\r?\n/)
    .filter((item) => item.startsWith(`${name}:`) || item.startsWith(`${name};`));
}

function getIcsLineValue(line: string) {
  return line.slice(line.indexOf(":") + 1).trim();
}

function unescapeIcsText(value: string) {
  return value
    .replace(/\\n/g, "\n")
    .replace(/\\,/g, ",")
    .replace(/\\;/g, ";")
    .replace(/\\\\/g, "\\");
}

function parseIcsDate(value: string, allDay: boolean) {
  if (!value) {
    return null;
  }

  if (allDay || /^\d{8}$/.test(value)) {
    const year = Number(value.slice(0, 4));
    const month = Number(value.slice(4, 6)) - 1;
    const day = Number(value.slice(6, 8));
    return new Date(Date.UTC(year, month, day, 4, 0, 0));
  }

  const normalized = value.endsWith("Z") ? value : `${value}Z`;
  const date = new Date(
    normalized.replace(
      /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/,
      "$1-$2-$3T$4:$5:$6Z"
    )
  );

  return Number.isNaN(date.getTime()) ? null : date;
}

function lineHasAcceptedAttendee(line: string, calendarEmail: string) {
  const normalizedLine = line.toLowerCase();
  const attendeeEmail = normalizeEmail(getIcsLineValue(line));

  return attendeeEmail === calendarEmail && normalizedLine.includes("partstat=accepted");
}

function isRelevantIcsBlock(block: string, calendarEmail: string) {
  if (!calendarEmail) {
    return true;
  }

  const organizer = normalizeEmail(getIcsField(block, "ORGANIZER"));
  if (organizer === calendarEmail) {
    return true;
  }

  const attendeeLines = getIcsLines(block, "ATTENDEE");
  if (attendeeLines.length === 0) {
    return true;
  }

  return attendeeLines.some((line) => lineHasAcceptedAttendee(line, calendarEmail));
}

function extractEmailFromUnknown(value: unknown) {
  if (typeof value === "string") {
    return normalizeEmail(value);
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    for (const key of ["email", "mailto", "val"]) {
      if (typeof record[key] === "string") {
        return normalizeEmail(String(record[key]));
      }
    }
  }

  return "";
}

function attendeeIsAccepted(value: unknown, calendarEmail: string) {
  if (typeof value === "string") {
    return false;
  }

  if (!value || typeof value !== "object") {
    return false;
  }

  const email = extractEmailFromUnknown(value);
  const partstat = "params" in value && value.params && typeof value.params === "object" && "PARTSTAT" in value.params
    ? String(value.params.PARTSTAT).toLowerCase()
    : "partstat" in value
      ? String(value.partstat).toLowerCase()
      : "";

  return email === calendarEmail && partstat === "accepted";
}

function isRelevantParsedEvent(event: IcalEventLike, calendarEmail: string) {
  if (!calendarEmail) {
    return true;
  }

  const organizer = extractEmailFromUnknown(event.organizer);
  if (organizer === calendarEmail) {
    return true;
  }

  const attendees = event.attendees;
  const attendeeList = Array.isArray(attendees) ? attendees : attendees ? Object.values(attendees as Record<string, unknown>) : [];
  if (attendeeList.length === 0) {
    return true;
  }

  return attendeeList.some((attendee) => attendeeIsAccepted(attendee, calendarEmail));
}

async function getEventsFromGoogleIcs(url: string, limit: number) {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Calendar feed failed with ${response.status}`);
  }

  const body = unfoldIcsLines(await response.text());
  const calendarEmail = getCalendarOwnerEmail();
  const now = new Date();
  const blocks = body.match(/BEGIN:VEVENT[\s\S]*?END:VEVENT/g) || [];

  const events = blocks
    .filter((block) => isRelevantIcsBlock(block, calendarEmail))
    .map((block): CalendarEvent | null => {
      const startLine = block.split(/\r?\n/).find((line) => line.startsWith("DTSTART")) || "";
      const endLine = block.split(/\r?\n/).find((line) => line.startsWith("DTEND")) || "";
      const isAllDay = startLine.includes("VALUE=DATE");
      const start = parseIcsDate(getIcsField(block, "DTSTART"), isAllDay);
      const end = parseIcsDate(getIcsField(block, "DTEND"), isAllDay);

      if (!start) {
        return null;
      }

      return {
        uid: getIcsField(block, "UID") || `${start.toISOString()}-${getIcsField(block, "SUMMARY") || "evento"}`,
        title: unescapeIcsText(getIcsField(block, "SUMMARY") || "Sin título"),
        description: unescapeIcsText(getIcsField(block, "DESCRIPTION")),
        location: unescapeIcsText(getIcsField(block, "LOCATION")),
        start,
        end
      };
    })
    .filter((event): event is CalendarEvent => Boolean(event));

  const upcoming = events
    .filter((event) => event.start >= now || Boolean(event.end && event.end >= now))
    .sort((a, b) => a.start.getTime() - b.start.getTime());

  if (upcoming.length > 0) {
    return upcoming.slice(0, limit);
  }

  return events
    .filter((event) => event.start < now)
    .sort((a, b) => b.start.getTime() - a.start.getTime())
    .slice(0, limit);
}

function toGoogleCalendarIcsUrl(calendarId: string) {
  return `https://calendar.google.com/calendar/ical/${encodeURIComponent(calendarId)}/public/basic.ics`;
}

function getCalendarFeedUrl() {
  const value = process.env.GOOGLE_CALENDAR_ID?.trim();

  if (!value) {
    console.error("Missing GOOGLE_CALENDAR_ID. Using default Industrial con J calendar feed.");
    return DEFAULT_CALENDAR_ICS_URL;
  }

  if (value.startsWith("http")) {
    try {
      const url = new URL(value);
      const src = url.searchParams.get("src");
      const cid = url.searchParams.get("cid");
      const calendarId = src || (cid ? decodeGoogleCalendarCid(cid) : null);

      if (url.hostname.includes("calendar.google.com") && calendarId) {
        return toGoogleCalendarIcsUrl(calendarId);
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
    return body.trim() ? ical.async.parseICS(body) : {};
  }
}

function toCalendarEvent(event: IcalEventLike, start: Date | null, end: Date | null): CalendarEvent | null {
  if (!start) {
    return null;
  }

  return {
    title: toEventText(event.summary, "Sin título"),
    description: toEventText(event.description),
    location: toEventText(event.location),
    start,
    end,
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

export async function getEventsFromICS(limit = 12): Promise<CalendarEvent[]> {
  const url = getCalendarFeedUrl();

  try {
    const directEvents = await getEventsFromGoogleIcs(url, limit);
    if (directEvents.length > 0) {
      console.log("Eventos detectados:", directEvents.length, "desde ICS directo");
      return directEvents;
    }

    const icalModule = await import("node-ical");
    const ical = icalModule.default ?? icalModule;
    const data = await loadCalendarData(ical, url);
    const now = new Date();
    const calendarEmail = getCalendarOwnerEmail();
    const rangeEnd = new Date(now);
    rangeEnd.setMonth(rangeEnd.getMonth() + 18);
    const parsedEvents: CalendarEvent[] = [];
    const sourceEvents = (Object.values(data) as IcalEventLike[]).filter((entry) => entry?.type === "VEVENT" && isRelevantParsedEvent(entry, calendarEmail));

    for (const event of sourceEvents) {
      if (event.rrule) {
        const instances = ical.expandRecurringEvent(event as never, {
          from: now,
          to: rangeEnd,
          expandOngoing: true
        });

        for (const instance of instances) {
          const instanceEvent = toCalendarEvent(instance.event as IcalEventLike, new Date(instance.start), instance.end ? new Date(instance.end) : null);
          if (instanceEvent) {
            parsedEvents.push({
              ...instanceEvent,
              uid: `${instanceEvent.uid}-${instanceEvent.start.toISOString()}`
            });
          }
        }

        continue;
      }

      const parsedEvent = toCalendarEvent(event, event.start ? new Date(event.start) : null, event.end ? new Date(event.end) : null);
      if (parsedEvent) {
        parsedEvents.push(parsedEvent);
      }
    }

    const upcomingEvents = parsedEvents
      .filter((event) => event.start >= now || Boolean(event.end && event.end >= now))
      .sort((a, b) => a.start.getTime() - b.start.getTime());
    const events = (upcomingEvents.length > 0
      ? upcomingEvents
      : parsedEvents.filter((event) => event.start < now).sort((a, b) => b.start.getTime() - a.start.getTime())
    ).slice(0, limit);

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
