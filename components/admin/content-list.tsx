import Link from "next/link";
import { formatDate } from "@/lib/utils";

export function ContentList({
  title,
  eyebrow,
  newHref,
  records,
  getHref,
  getTitle,
  getSubtitle,
  getDate
}: {
  title: string;
  eyebrow: string;
  newHref: string;
  records: Array<Record<string, unknown>>;
  getHref: (record: Record<string, unknown>) => string;
  getTitle: (record: Record<string, unknown>) => string;
  getSubtitle?: (record: Record<string, unknown>) => string;
  getDate?: (record: Record<string, unknown>) => Date | null;
}) {
  return (
    <div className="space-y-6">
      <div className="card p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="pill">{eyebrow}</p>
            <h1 className="mt-4 text-4xl font-black">{title}</h1>
          </div>
          <Link href={newHref} className="btn-primary !px-4 !py-2 text-sm">Nuevo</Link>
        </div>
      </div>
      <div className="card p-8">
        {records.length === 0 ? (
          <p className="text-sm text-[color:var(--muted)]">Todavía no hay registros.</p>
        ) : (
          <div className="space-y-3">
            {records.map((record) => (
              <Link key={String(record.id)} href={getHref(record)} className="flex items-center justify-between gap-4 rounded-2xl border border-[color:var(--line)] p-4">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="font-semibold">{getTitle(record)}</p>
                    <span className="rounded-full border border-[color:var(--line)] px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-[color:var(--muted)]">
                      {record.isVisible === false ? "Oculto" : "Visible"}
                    </span>
                  </div>
                  {getSubtitle ? <p className="text-xs text-[color:var(--muted)]">{getSubtitle(record)}</p> : null}
                </div>
                {getDate?.(record) ? <p className="text-xs text-[color:var(--muted)]">{formatDate(getDate(record)!)}</p> : null}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
