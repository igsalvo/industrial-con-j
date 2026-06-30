import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { PublicNewsItem } from "@/lib/queries";

export function NewsCardGrid({
  items,
  compact = false
}: {
  items: PublicNewsItem[];
  compact?: boolean;
}) {
  if (items.length === 0) {
    return <p className="rounded-2xl border border-[color:var(--line)] p-5 text-sm text-[color:var(--muted)]">Aún no hay noticias publicadas.</p>;
  }

  return (
    <div className={`grid gap-5 ${compact ? "md:grid-cols-2 xl:grid-cols-3" : "md:grid-cols-2 xl:grid-cols-4"}`}>
      {items.map((item) => {
        const objectPosition = `${item.imagePositionX || "center"} ${item.imagePositionY || "center"}`;

        return (
          <article key={item.id} id={item.slug} className="card flex h-full flex-col overflow-hidden">
            <div className="aspect-[16/10] bg-[color:var(--surface-strong)]">
              {item.imageUrl ? <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" style={{ objectPosition }} /> : null}
            </div>
            <div className="flex flex-1 flex-col p-5">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-xs font-semibold uppercase text-[color:var(--muted)]">{formatDate(item.publishedAt)}</p>
                {item.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="rounded-full border border-[color:var(--line)] px-2 py-1 text-[10px] font-semibold uppercase text-[color:var(--muted)]">{tag}</span>
                ))}
              </div>
              <h3 className="mt-4 text-2xl font-bold">{item.title}</h3>
              <p className="mt-3 line-clamp-4 text-sm leading-6 text-[color:var(--muted)]">{item.excerpt}</p>
              <Link className="btn-secondary mt-auto w-full gap-2 !px-4 !py-2 text-sm" href={`/news/${item.slug}`}>
                Ver más
                <ArrowUpRight size={15} />
              </Link>
            </div>
          </article>
        );
      })}
    </div>
  );
}
