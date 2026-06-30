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
  const activeItem = loopItems[activeIndex] || loopItems[0];

  useEffect(() => {
    if (loopItems.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % loopItems.length);
    }, 5200);

    return () => window.clearInterval(timer);
  }, [loopItems.length]);

  if (loopItems.length === 0 || !activeItem) {
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

  const objectPosition = `${activeItem.imagePositionX || "center"} ${activeItem.imagePositionY || "center"}`;

  function move(step: number) {
    setActiveIndex((current) => (current + step + loopItems.length) % loopItems.length);
  }

  return (
    <section className="space-y-5" aria-label="Noticias destacadas">
      <article className={`card overflow-hidden ${compact ? "" : "lg:grid lg:grid-cols-[1.1fr_0.9fr]"}`}>
        <div className="aspect-[16/10] min-h-[260px] bg-[color:var(--surface-strong)] lg:aspect-auto">
          {activeItem.imageUrl ? <img src={activeItem.imageUrl} alt={activeItem.title} className="h-full w-full object-cover" style={{ objectPosition }} /> : null}
        </div>
        <div className="flex min-h-[360px] flex-col p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-semibold uppercase text-[color:var(--muted)]">{formatDate(activeItem.publishedAt)}</p>
            {activeItem.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="rounded-full border border-[color:var(--line)] px-2 py-1 text-[10px] font-semibold uppercase text-[color:var(--muted)]">{tag}</span>
            ))}
          </div>
          <h2 className="mt-5 text-[clamp(2rem,5vw,3.1rem)] font-black leading-tight">{activeItem.title}</h2>
          <p className="mt-4 line-clamp-4 text-base leading-7 text-[color:var(--muted)]">{activeItem.excerpt}</p>
          <div className="mt-auto flex flex-wrap items-center gap-3 pt-7">
            <Link href={`/news/${activeItem.slug}`} className="btn-primary gap-2">
              Ver más
              <ArrowUpRight size={16} />
            </Link>
            <Link href={moreHref} className="btn-secondary gap-2">
              Ver más noticias
              <ArrowUpRight size={16} />
            </Link>
            {loopItems.length > 1 ? (
              <div className="ml-auto flex items-center gap-2">
                <button type="button" className="btn-secondary !p-3" onClick={() => move(-1)} aria-label="Noticia anterior">
                  <ChevronLeft size={17} />
                </button>
                <button type="button" className="btn-secondary !p-3" onClick={() => move(1)} aria-label="Siguiente noticia">
                  <ChevronRight size={17} />
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </article>
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
