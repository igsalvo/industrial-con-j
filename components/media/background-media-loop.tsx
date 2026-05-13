"use client";

import { Play } from "lucide-react";
import { useEffect, useState } from "react";
import type { PublicMediaItem } from "@/lib/queries";

export function BackgroundMediaLoop({
  items,
  title,
  description
}: {
  items: PublicMediaItem[];
  title: string;
  description: string;
}) {
  const visibleItems = items.filter((item) => item.src).slice(0, 6);
  const [index, setIndex] = useState(0);
  const current = visibleItems[index];

  useEffect(() => {
    if (visibleItems.length < 2) {
      return;
    }

    const interval = window.setInterval(() => {
      setIndex((currentIndex) => (currentIndex + 1) % visibleItems.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [visibleItems.length]);

  return (
    <section className="relative min-h-[430px] overflow-hidden rounded-2xl border border-white/10 bg-[#151515] sm:min-h-[540px] lg:min-h-[620px]">
      {current ? (
        <img
          src={current.src}
          alt={current.alt}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: `${current.positionX || "center"} ${current.positionY || "center"}` }}
        />
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(226,33,28,0.24),transparent_30%),linear-gradient(135deg,#242424,#111312)]" />
      )}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0.18)_42%,rgba(0,0,0,0.84)_100%)]" />
      <div className="absolute bottom-0 left-0 right-0 flex flex-col gap-4 p-5 text-white sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-center gap-4">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-white/25 bg-black/35 backdrop-blur">
            <Play fill="currentColor" size={17} />
          </span>
          <div>
            <h2 className="text-xl font-black leading-tight sm:text-2xl">{title}</h2>
            <p className="mt-2 text-sm leading-5 text-white/78 sm:text-base sm:leading-6">{description}</p>
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          {(visibleItems.length ? visibleItems : [{ id: "empty" }]).map((item, itemIndex) => (
            <span key={item.id} className={`h-1.5 rounded-full ${itemIndex === index ? "w-5 bg-[color:var(--accent)]" : "w-2 bg-white/35"}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
