"use client";

import Link from "next/link";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { PublicNewsItem } from "@/lib/queries";
import { formatDate } from "@/lib/utils";

export function NewsFeaturedLoop({
  items,
  moreHref,
  compact = false
}: {
  items: PublicNewsItem[];
  moreHref: string;
  compact?: boolean;
}) {
  const loopItems = useMemo(() => items.slice(0, 4), [items]);
  const [activeIndex, setActiveIndex] = useState(0);
  const visibleItems = useMemo(() => {
    if (loopItems.length <= 1) return loopItems;
    return [...loopItems.slice(activeIndex), ...loopItems.slice(0, activeIndex)];
  }, [activeIndex, loopItems]);

  useEffect(() => {
    if (loopItems.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % loopItems.length);
    }, 5200);

    return () => window.clearInterval(timer);
  }, [loopItems.length]);

  if (loopItems.length === 0) {
    return (
      <div className="space-y-5">
        <p className="rounded-2xl border border-[color:var(--line)] p-5 text-sm text-[color:var(--muted)]">Aún no hay noticias publicadas.</p>
        <Link href={moreHref} className="btn-secondary w-full gap-2 sm:w-auto">
          Ver más noticias
          <ArrowUpRight size={16} />
        </Link>
      </div>
    );
  }

  function move(step: number) {
    setActiveIndex((current) => (current + step + loopItems.length) % loopItems.length);
  }

  return (
    <section className="space-y-5" aria-label="Noticias destacadas">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href={moreHref} className="btn-secondary gap-2">
          Ver más noticias
          <ArrowUpRight size={16} />
        </Link>
        {loopItems.length > 1 ? (
          <div className="flex items-center gap-2">
            <button type="button" className="btn-secondary !p-3" onClick={() => move(-1)} aria-label="Noticia anterior">
              <ChevronLeft size={17} />
            </button>
            <button type="button" className="btn-secondary !p-3" onClick={() => move(1)} aria-label="Siguiente noticia">
              <ChevronRight size={17} />
            </button>
          </div>
        ) : null}
      </div>
      <div className={`grid auto-rows-fr gap-5 ${compact ? "md:grid-cols-2 xl:grid-cols-4" : "md:grid-cols-2 xl:grid-cols-4"}`}>
        {visibleItems.map((item, index) => {
          const objectPosition = `${item.imagePositionX || "center"} ${item.imagePositionY || "center"}`;

          return (
            <article key={`${item.id}-${index}`} className="card flex h-full min-h-[390px] flex-col overflow-hidden">
              <div className="aspect-[16/9] shrink-0 bg-[color:var(--surface-strong)]">
                {item.imageUrl ? <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" style={{ objectPosition }} /> : null}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-xs font-semibold uppercase text-[color:var(--muted)]">{formatDate(item.publishedAt)}</p>
                  {item.tags.slice(0, 1).map((tag) => (
                    <span key={tag} className="rounded-full border border-[color:var(--line)] px-2 py-1 text-[10px] font-semibold uppercase text-[color:var(--muted)]">{tag}</span>
                  ))}
                </div>
                <h2 className="mt-4 line-clamp-2 text-2xl font-black leading-tight">{item.title}</h2>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-[color:var(--muted)]">{item.excerpt}</p>
                <Link href={`/news/${item.slug}`} className="btn-primary mt-auto w-full gap-2 !px-4 !py-2 text-sm">
                  Ver más
                  <ArrowUpRight size={15} />
                </Link>
              </div>
            </article>
          );
        })}
      </div>
      {loopItems.length > 1 ? (
        <div className="flex flex-wrap gap-2">
          {loopItems.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className={`h-2.5 rounded-full transition ${index === activeIndex ? "w-10 bg-[color:var(--accent)]" : "w-2.5 bg-[color:var(--line)]"}`}
              onClick={() => setActiveIndex(index)}
              aria-label={`Mostrar noticia ${index + 1}`}
              aria-current={index === activeIndex}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
