"use client";

import { useMemo, useState } from "react";
import { CalendarDays, CalendarPlus, ChevronLeft, ChevronRight, MapPin } from "lucide-react";

export type PublicCalendarEvent = {
  uid: string;
  title: string;
  description?: string;
  location?: string;
  start: string;
  end?: string | null;
};

function toDate(value: string | null | undefined) {
  return value ? new Date(value) : null;
}

function formatEventDate(date: Date) {
  return new Intl.DateTimeFormat("es-CL", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

function formatMonth(date: Date) {
  return new Intl.DateTimeFormat("es-CL", {
    month: "long",
    year: "numeric"
  }).format(date);
}

function toGoogleCalendarDate(date: Date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function createGoogleCalendarUrl(event: {
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

function getMonthDays(monthDate: Date) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leadingEmptyDays = (firstDay.getDay() + 6) % 7;

  return [
    ...Array.from({ length: leadingEmptyDays }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1)
  ];
}

function isSameMonth(date: Date, monthDate: Date) {
  return date.getFullYear() === monthDate.getFullYear() && date.getMonth() === monthDate.getMonth();
}

export function EventGrid({ events }: { events: PublicCalendarEvent[] }) {
  const eventItems = useMemo(
    () =>
      events
        .map((event) => ({ ...event, startDate: toDate(event.start), endDate: toDate(event.end) }))
        .filter((event): event is PublicCalendarEvent & { startDate: Date; endDate: Date | null } => Boolean(event.startDate)),
    [events]
  );
  const firstEventDate = eventItems[0]?.startDate;
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const baseDate = firstEventDate || new Date();
    return new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
  });

  const monthDays = getMonthDays(visibleMonth);
  const eventsInMonth = eventItems.filter((event) => isSameMonth(event.startDate, visibleMonth));

  if (eventItems.length === 0) {
    return <p className="rounded-2xl border border-[color:var(--line)] p-5 text-sm text-[color:var(--muted)]">Aún no hay eventos publicados.</p>;
  }

  const changeMonth = (offset: number) => {
    setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1));
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
      <div className="card p-5">
        <div className="mb-5 flex items-center justify-between gap-3">
          <button type="button" className="btn-secondary !p-3" onClick={() => changeMonth(-1)} aria-label="Mes anterior">
            <ChevronLeft size={18} />
          </button>
          <p className="text-center text-lg font-black capitalize">{formatMonth(visibleMonth)}</p>
          <button type="button" className="btn-secondary !p-3" onClick={() => changeMonth(1)} aria-label="Mes siguiente">
            <ChevronRight size={18} />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-[color:var(--muted)]">
          {["L", "M", "M", "J", "V", "S", "D"].map((day, index) => (
            <span key={`${day}-${index}`}>{day}</span>
          ))}
          {monthDays.map((day, index) => {
            const hasEvent = day ? eventsInMonth.some((event) => event.startDate.getDate() === day) : false;
            return (
              <div key={`${day || "empty"}-${index}`} className={`aspect-square rounded-xl border border-[color:var(--line)] p-2 ${hasEvent ? "bg-[color:var(--accent-soft)] text-[color:var(--accent)]" : ""}`}>
                {day || ""}
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        {eventsInMonth.length ? (
          eventsInMonth.map((event) => (
            <article key={event.uid} className="card grid gap-4 overflow-hidden p-5 md:grid-cols-[160px_1fr]">
              <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-strong)] p-4">
                <CalendarDays className="text-[color:var(--accent)]" />
                <p className="mt-4 text-lg font-black">{formatEventDate(event.startDate)}</p>
              </div>
              <div>
                <h3 className="text-2xl font-bold">{event.title}</h3>
                {event.description ? <p className="mt-3 whitespace-pre-line text-sm leading-6 text-[color:var(--muted)]">{event.description}</p> : null}
                {event.location ? (
                  <p className="mt-4 flex items-center gap-2 text-sm text-[color:var(--muted)]">
                    <MapPin size={16} />
                    {event.location}
                  </p>
                ) : null}
                <div className="mt-5 flex flex-wrap gap-2">
                  <a className="btn-primary gap-2 !px-4 !py-2 text-sm" href={createGoogleCalendarUrl({ ...event, start: event.startDate, end: event.endDate })} target="_blank" rel="noreferrer">
                    <CalendarPlus size={16} />
                    Agregar a mi calendario
                  </a>
                </div>
              </div>
            </article>
          ))
        ) : (
          <p className="rounded-2xl border border-[color:var(--line)] p-5 text-sm text-[color:var(--muted)]">No hay eventos publicados para este mes.</p>
        )}
      </div>
    </div>
  );
}
