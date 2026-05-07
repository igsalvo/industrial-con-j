import { CalendarPlus, Download } from "lucide-react";
import type { CalendarEvent } from "@/lib/google-calendar";
import { formatDate } from "@/lib/utils";

function toDataIcs(content: string) {
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(content)}`;
}

export function GoogleCalendarEvents({ events }: { events: CalendarEvent[] }) {
  if (events.length === 0) {
    return null;
  }

  return (
    <section className="mt-10 space-y-4">
      <div>
        <p className="pill">Google Calendar</p>
        <h2 className="mt-4 text-3xl font-black">Eventos desde calendario</h2>
      </div>
      <div className="grid gap-4">
        {events.map((event) => (
          <article key={event.id} className="card grid gap-4 p-5 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h3 className="text-2xl font-bold">{event.title}</h3>
              <p className="mt-2 text-sm font-semibold text-[color:var(--accent)]">{formatDate(event.startsAt)}</p>
              {event.location ? <p className="mt-2 text-sm text-[color:var(--muted)]">{event.location}</p> : null}
              {event.description ? <p className="mt-3 max-w-2xl whitespace-pre-line text-sm leading-6 text-[color:var(--muted)]">{event.description}</p> : null}
            </div>
            <div className="flex flex-wrap gap-2">
              <a className="btn-primary gap-2 !px-4 !py-2 text-sm" href={event.googleCalendarUrl} target="_blank" rel="noreferrer">
                <CalendarPlus size={16} />
                Agregar a mi calendario
              </a>
              <a className="btn-secondary gap-2 !px-4 !py-2 text-sm" href={toDataIcs(event.icsContent)} download={`${event.title}.ics`}>
                <Download size={16} />
                .ics
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
