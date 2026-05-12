const APP_TIME_ZONE = "America/Santiago";

function getZonedParts(date: Date, timeZone = APP_TIME_ZONE) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23"
  }).formatToParts(date);

  const value = (type: string) => Number(parts.find((part) => part.type === type)?.value || 0);

  return {
    year: value("year"),
    month: value("month"),
    day: value("day"),
    hour: value("hour"),
    minute: value("minute")
  };
}

export function parseChileDateTimeLocal(value: string) {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
  if (!match) {
    return new Date(value);
  }

  const [, year, month, day, hour, minute] = match;
  const target = {
    year: Number(year),
    month: Number(month),
    day: Number(day),
    hour: Number(hour),
    minute: Number(minute)
  };

  let timestamp = Date.UTC(target.year, target.month - 1, target.day, target.hour, target.minute);

  for (let index = 0; index < 3; index += 1) {
    const actual = getZonedParts(new Date(timestamp));
    const actualAsUtc = Date.UTC(actual.year, actual.month - 1, actual.day, actual.hour, actual.minute);
    const targetAsUtc = Date.UTC(target.year, target.month - 1, target.day, target.hour, target.minute);
    timestamp -= actualAsUtc - targetAsUtc;
  }

  return new Date(timestamp);
}

export function formatChileDateTimeLocal(date: Date) {
  const parts = getZonedParts(date);
  return `${parts.year.toString().padStart(4, "0")}-${parts.month.toString().padStart(2, "0")}-${parts.day.toString().padStart(2, "0")}T${parts.hour.toString().padStart(2, "0")}:${parts.minute.toString().padStart(2, "0")}`;
}

export function formatChileEventDate(date: Date) {
  return new Intl.DateTimeFormat("es-CL", { day: "2-digit", month: "short", timeZone: APP_TIME_ZONE }).format(date);
}

export function formatChileEventTime(date: Date) {
  return new Intl.DateTimeFormat("es-CL", { hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZone: APP_TIME_ZONE }).format(date);
}

export function formatChileMonth(date: Date) {
  return new Intl.DateTimeFormat("es-CL", { month: "long", year: "numeric", timeZone: APP_TIME_ZONE }).format(date);
}
