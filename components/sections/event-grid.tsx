"use client";

import { useMemo, useState } from "react";
import { ArrowRight, CalendarDays, CalendarPlus, ChevronLeft, ChevronRight, Clock3, MapPin } from "lucide-react";

export type PublicCalendarEvent = {
  uid: string;
  title: string;
  description?: string;
  location?: string;
  start: string;
  end?: string | null;
  imageUrl?: string | null;
  imagePositionX?: string | null;
  imagePositionY?: string | null;
  ctaLink?: string | null;
  ctaText?: string | null;
};

function toDate(value: string | null | undefined) {
  return value ? new Date(value) : null;
}

function formatEventDate(date: Date) {
  return new Intl.DateTimeFormat("es-CL", { day: "2-digit", month: "short" }).format(date);
}

function formatEventTime(date: Date) {
  return new Intl.DateTimeFormat("es-CL", { hour: "2-digit", minute: "2-digit" }).format(date);
}

function formatMonth(date: Date) {
  return new Intl.DateTimeFormat("es-CL", { month: "long", year: "numeric" }).format(date);
}

function toGoogleCalendarDate(date: Date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function createGoogleCalendarUrl(event: { title: string; description?: string; location?: string; start: Date; end: Date | null }) {
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

  return [...Array.from({ length: leadingEmptyDays }, () => null), ...Array.from({ length: daysInMonth }, (_, index) => index + 1)];
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
  const featured = eventsInMonth[0] || eventItems[0];

  if (eventItems.length === 0) {
    return <p className="rounded-2xl border border-[color:var(--line)] p-5 text-sm text-[color:var(--muted)]">Aún no hay eventos publicados.</p>;
  }

  const changeMonth = (offset: number) => {
    setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1));
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-5 lg:grid-cols-[0.78fr_1.22fr]">
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
              const isSelected = featured && day === featured.startDate.getDate() && isSameMonth(featured.startDate, visibleMonth);
              return (
                <div key={`${day || "empty"}-${index}`} className={`relative aspect-square rounded-xl border border-[color:var(--line)] p-2 ${isSelected ? "bg-[color:var(--accent)] text-white" : hasEvent ? "bg-[color:var(--accent-soft)] text-[color:var(--accent)]" : ""}`}>
                  {day || ""}
                  {hasEvent && day ? <span className={`absolute bottom-2 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full ${isSelected ? "bg-white" : "bg-[color:var(--accent)]"}`} /> : null}
                </div>
              );
            })}
          </div>
          <div className="mt-5 flex flex-wrap gap-4 text-xs text-[color:var(--muted)]">
            <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[color:var(--accent)]" />Con actividades</span>
            <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full border border-[color:var(--line)]" />Sin actividades</span>
          </div>
        </div>

        <article className="card overflow-hidden">
          <div className="relative min-h-64 bg-[linear-gradient(135deg,#d70904,#2b2b2b)]">
            {featured.imageUrl ? (
              <img src={featured.imageUrl} alt={featured.title} className="h-full min-h-64 w-full object-cover opacity-85" style={{ objectPosition: `${featured.imagePositionX || "center"} ${featured.imagePositionY || "center"}` }} />
            ) : (
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(226,33,28,0.38),transparent_28%),linear-gradient(135deg,#333,#151515)]" />
            )}
            <div className="absolute inset-0 bg-black/35" />
            <div className="absolute bottom-5 left-5 right-5 text-white">
              <p className="pill !border-white/20 !bg-black/40 !text-white">Evento destacado</p>
              <h2 className="mt-4 text-4xl font-black">{featured.title}</h2>
            </div>
          </div>
          <div className="p-6">
            {featured.description ? <p className="whitespace-pre-line text-sm leading-7 text-[color:var(--muted)]">{featured.description}</p> : null}
            <div className="mt-5 grid gap-3 text-sm text-[color:var(--muted)] sm:grid-cols-3">
              <span className="inline-flex items-center gap-2"><CalendarDays size={16} />{formatEventDate(featured.startDate)}</span>
              <span className="inline-flex items-center gap-2"><Clock3 size={16} />{formatEventTime(featured.startDate)}</span>
              {featured.location ? <span className="inline-flex items-center gap-2"><MapPin size={16} />{featured.location}</span> : null}
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <a className="btn-primary gap-2 !px-4 !py-2 text-sm" href={createGoogleCalendarUrl({ ...featured, start: featured.startDate, end: featured.endDate })} target="_blank" rel="noreferrer">
                <CalendarPlus size={16} />
                Agregar a mi calendario
              </a>
              {featured.ctaLink ? (
                <a className="btn-secondary gap-2 !px-4 !py-2 text-sm" href={featured.ctaLink} target="_blank" rel="noreferrer">
                  {featured.ctaText || "Ver detalles"}
                  <ArrowRight size={15} />
                </a>
              ) : null}
            </div>
          </div>
        </article>
      </div>

      <section className="space-y-4">
        <h2 className="text-3xl font-black">Próximos eventos</h2>
        <div className="space-y-4">
          {eventsInMonth.length ? (
            eventsInMonth.map((event) => (
              <article key={event.uid} className="card grid gap-4 overflow-hidden p-5 md:grid-cols-[150px_1fr_auto] md:items-center">
                <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-strong)] p-4">
                  <CalendarDays className="text-[color:var(--accent)]" />
                  <p className="mt-4 text-lg font-black">{formatEventDate(event.startDate)}</p>
                  <p className="mt-1 text-xs text-[color:var(--muted)]">{formatEventTime(event.startDate)}</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{event.title}</h3>
                  {event.description ? <p className="mt-3 line-clamp-2 whitespace-pre-line text-sm leading-6 text-[color:var(--muted)]">{event.description}</p> : null}
                  {event.location ? <p className="mt-4 flex items-center gap-2 text-sm text-[color:var(--muted)]"><MapPin size={16} />{event.location}</p> : null}
                </div>
                {event.ctaLink ? (
                  <a className="btn-secondary !px-4 !py-2 text-sm" href={event.ctaLink} target="_blank" rel="noreferrer">Ver detalles</a>
                ) : null}
              </article>
            ))
          ) : (
            <p className="rounded-2xl border border-[color:var(--line)] p-5 text-sm text-[color:var(--muted)]">No hay eventos publicados para este mes.</p>
          )}
        </div>
      </section>
    </div>
  );
}
