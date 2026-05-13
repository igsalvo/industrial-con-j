"use client";

import { useMemo, useState } from "react";
import { ArrowRight, CalendarDays, CalendarPlus, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { formatChileEventDate, formatChileEventTime, formatChileMonth } from "@/lib/date-time";
import type { PublicMediaItem } from "@/lib/queries";

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
  return formatChileEventDate(date);
}

function formatEventTime(date: Date) {
  return formatChileEventTime(date);
}

function formatMonth(date: Date) {
  return formatChileMonth(date);
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

function getDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function EventGrid({ events, fallbackImage }: { events: PublicCalendarEvent[]; fallbackImage?: PublicMediaItem }) {
  const eventItems = useMemo(
    () =>
      events
        .map((event) => ({ ...event, startDate: toDate(event.start), endDate: toDate(event.end) }))
        .filter((event): event is PublicCalendarEvent & { startDate: Date; endDate: Date | null } => Boolean(event.startDate))
        .sort((a, b) => a.startDate.getTime() - b.startDate.getTime()),
    [events]
  );
  const now = new Date();
  const nextEvent = eventItems.find((event) => event.startDate >= now) || eventItems[0];
  const firstEventDate = nextEvent?.startDate;
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const baseDate = firstEventDate || new Date();
    return new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
  });
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);

  const monthDays = getMonthDays(visibleMonth);
  const eventsInMonth = eventItems.filter((event) => isSameMonth(event.startDate, visibleMonth));
  const selectedEvents = selectedDateKey ? eventItems.filter((event) => getDateKey(event.startDate) === selectedDateKey) : [];
  const displayedEvents = selectedDateKey ? selectedEvents : nextEvent ? [nextEvent] : [];
  const featured = displayedEvents[0];
  const featuredImageUrl = featured?.imageUrl || fallbackImage?.src;
  const featuredImagePosition = featured?.imageUrl
    ? `${featured.imagePositionX || "center"} ${featured.imagePositionY || "center"}`
    : `${fallbackImage?.positionX || "center"} ${fallbackImage?.positionY || "center"}`;

  if (eventItems.length === 0) {
    return <p className="rounded-2xl border border-[color:var(--line)] p-5 text-sm text-[color:var(--muted)]">Aún no hay eventos publicados.</p>;
  }

  const changeMonth = (offset: number) => {
    setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1));
  };

  const selectedDate = selectedDateKey ? new Date(`${selectedDateKey}T12:00:00`) : null;

  return (
    <div className="mt-5 space-y-7">
      <div className="grid gap-5 lg:grid-cols-[0.78fr_1.22fr]">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <div className="mb-5 flex items-center justify-between gap-3">
            <button type="button" className="btn-secondary !bg-transparent !p-3" onClick={() => changeMonth(-1)} aria-label="Mes anterior">
              <ChevronLeft size={18} />
            </button>
            <p className="text-center text-lg font-black capitalize">{formatMonth(visibleMonth)}</p>
            <button type="button" className="btn-secondary !bg-transparent !p-3" onClick={() => changeMonth(1)} aria-label="Mes siguiente">
              <ChevronRight size={18} />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-[color:var(--muted)]">
            {["L", "M", "M", "J", "V", "S", "D"].map((day, index) => (
              <span key={`${day}-${index}`}>{day}</span>
            ))}
            {monthDays.map((day, index) => {
              const date = day ? new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), day) : null;
              const dateKey = date ? getDateKey(date) : null;
              const hasEvent = dateKey ? eventsInMonth.some((event) => getDateKey(event.startDate) === dateKey) : false;
              const isSelected = Boolean(dateKey && selectedDateKey === dateKey);
              return (
                <button
                  key={`${day || "empty"}-${index}`}
                  type="button"
                  disabled={!day}
                  className={`relative aspect-square rounded-lg border border-white/10 p-2 text-sm font-bold transition disabled:cursor-default ${isSelected ? "bg-[color:var(--accent)] text-white shadow-[0_0_24px_rgba(226,33,28,0.5)]" : hasEvent ? "text-white hover:border-[color:var(--accent)]" : "text-white/70 hover:border-white/30"}`}
                  onClick={() => {
                    if (dateKey) {
                      setSelectedDateKey(dateKey);
                    }
                  }}
                  aria-label={day ? `Seleccionar ${day}` : undefined}
                >
                  {day || ""}
                  {hasEvent && day ? <span className={`absolute bottom-2 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full ${isSelected ? "bg-white" : "bg-[color:var(--accent)]"}`} /> : null}
                </button>
              );
            })}
          </div>
          <div className="mt-5 flex flex-wrap gap-4 text-xs text-[color:var(--muted)]">
            <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[color:var(--accent)]" />Con actividades</span>
            <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full border border-[color:var(--line)]" />Sin actividades</span>
          </div>
        </div>

        {featured ? (
        <article className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-7">
          <div className="absolute inset-0">
            {featuredImageUrl ? (
              <img src={featuredImageUrl} alt={featured.title} className="h-full min-h-64 w-full object-cover opacity-85" style={{ objectPosition: featuredImagePosition }} />
            ) : (
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(226,33,28,0.38),transparent_28%),linear-gradient(135deg,#333,#151515)]" />
            )}
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(17,19,18,0.98)_0%,rgba(17,19,18,0.86)_42%,rgba(17,19,18,0.32)_100%)]" />
          </div>
          <div className="relative max-w-xl py-5">
            <p className="brand-kicker text-xs text-[color:var(--accent)]">{selectedDateKey ? "Evento seleccionado" : "Evento más próximo"}</p>
            <h2 className="mt-4 text-3xl font-black sm:text-4xl">{featured.title}</h2>
            {featured.description ? <p className="mt-5 whitespace-pre-line text-sm leading-7 text-[color:var(--muted)]">{featured.description}</p> : null}
            <div className="mt-6 grid gap-4 text-sm text-white sm:grid-cols-2">
              <span className="inline-flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-lg border border-white/10 text-[color:var(--accent)]"><CalendarDays size={18} /></span>{formatEventDate(featured.startDate)}<br />{formatEventTime(featured.startDate)}</span>
              {featured.location ? <span className="inline-flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-lg border border-white/10 text-white/70"><MapPin size={18} /></span>{featured.location}</span> : null}
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
        ) : (
          <article className="grid min-h-[320px] place-items-center rounded-2xl border border-white/10 bg-white/[0.04] p-7 text-center">
            <div>
              <p className="brand-kicker text-xs text-[color:var(--accent)]">Calendario</p>
              <h2 className="mt-4 text-3xl font-black">No hay eventos programados para este día.</h2>
              {selectedDate ? <p className="mt-4 text-sm text-[color:var(--muted)]">{formatEventDate(selectedDate)}</p> : null}
            </div>
          </article>
        )}
      </div>

      <section className="grid gap-4 md:grid-cols-2">
        {displayedEvents.length ? (
          displayedEvents.map((event) => (
            <article key={event.uid} className="grid gap-4 overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] p-5 sm:grid-cols-[84px_1fr_auto] sm:items-center">
              <div className="rounded-xl border border-white/10 bg-black/10 p-4">
                <CalendarDays className="text-[color:var(--accent)]" />
                <p className="mt-4 text-lg font-black">{formatEventDate(event.startDate)}</p>
                <p className="mt-1 text-xs text-[color:var(--muted)]">{formatEventTime(event.startDate)}</p>
              </div>
              <div>
                <h3 className="text-lg font-bold">{event.title}</h3>
                {event.description ? <p className="mt-3 line-clamp-2 whitespace-pre-line text-sm leading-6 text-[color:var(--muted)]">{event.description}</p> : null}
                {event.location ? <p className="mt-4 flex items-center gap-2 text-sm text-[color:var(--muted)]"><MapPin size={16} />{event.location}</p> : null}
              </div>
              {event.ctaLink ? (
                <a className="btn-secondary !bg-transparent !p-3 text-sm" href={event.ctaLink} target="_blank" rel="noreferrer" aria-label={`Ver detalles de ${event.title}`}><ArrowRight size={16} /></a>
              ) : null}
            </article>
          ))
        ) : (
          <p className="rounded-2xl border border-[color:var(--line)] p-5 text-sm text-[color:var(--muted)]">No hay eventos programados para este día.</p>
        )}
      </section>
    </div>
  );
}
