import Link from "next/link";
import type { CSSProperties } from "react";
import type { PublicMediaItem } from "@/lib/queries";

const fallbackItems: PublicMediaItem[] = [
  {
    id: "fallback-podcast",
    section: "fallback",
    src: "/logo-podcast.jpg",
    alt: "Industrial con J",
    label: "Podcast",
    href: null,
    positionX: "center",
    positionY: "center",
    order: 1,
    isFeatured: true
  },
  {
    id: "fallback-community",
    section: "fallback",
    src: "/logo-podcast.jpg",
    alt: "Comunidad Industrial con J",
    label: "Comunidad",
    href: null,
    positionX: "center",
    positionY: "center",
    order: 2,
    isFeatured: false
  },
  {
    id: "fallback-events",
    section: "fallback",
    src: "/logo-podcast.jpg",
    alt: "Eventos Industrial con J",
    label: "Eventos",
    href: null,
    positionX: "center",
    positionY: "center",
    order: 3,
    isFeatured: false
  }
];

function getMediaCardClass(index: number) {
  const classes = [
    "col-span-4 row-span-2 contact-float-one",
    "col-span-2 row-span-1 contact-float-two",
    "col-span-2 row-span-2 contact-float-three",
    "col-span-3 row-span-1 contact-float-four",
    "col-span-3 row-span-1 contact-float-five",
    "col-span-2 row-span-1 contact-float-two"
  ];

  return classes[index] || "col-span-2 row-span-1";
}

function MediaShell({
  item,
  index
}: {
  item: PublicMediaItem;
  index: number;
}) {
  const style = {
    "--object-position-x": item.positionX || "center",
    "--object-position-y": item.positionY || "center"
  } as CSSProperties;
  const content = (
    <figure
      className={`contact-media-card group relative h-full overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#151515] shadow-[0_18px_50px_rgba(0,0,0,0.24)] ${getMediaCardClass(index)}`}
    >
      <img
        src={item.src}
        alt={item.alt}
        className="h-full w-full object-cover opacity-72 grayscale transition duration-700 group-hover:scale-105 group-hover:opacity-95 group-hover:grayscale-0"
        style={{ objectPosition: "var(--object-position-x, center) var(--object-position-y, center)" }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.72))]" />
      {item.label ? (
        <span className="absolute left-3 top-3 rounded-full border border-white/15 bg-black/45 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
          {item.label}
        </span>
      ) : null}
    </figure>
  );

  return item.href ? (
    <Link href={item.href} style={style} className={getMediaCardClass(index)}>
      {content}
    </Link>
  ) : (
    <div style={style} className={getMediaCardClass(index)}>
      {content}
    </div>
  );
}

export function MediaCollage({
  items,
  title,
  accent,
  description,
  className = ""
}: {
  items: PublicMediaItem[];
  title: string;
  accent?: string;
  description?: string;
  className?: string;
}) {
  const visibleItems = (items.length ? items : fallbackItems).slice(0, 6);

  return (
    <aside className={`contact-story relative overflow-hidden rounded-[2rem] border border-[color:var(--line)] bg-[color:var(--surface)] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.16)] sm:p-5 ${className}`}>
      <div className="pointer-events-none absolute -left-16 top-14 h-52 w-52 rounded-full bg-[color:var(--accent)]/20 blur-3xl" />
      <div className="pointer-events-none absolute right-8 top-10 h-24 w-24 rounded-full border border-dashed border-[color:var(--accent)]/45" />
      <div className="pointer-events-none absolute left-8 top-44 h-28 w-28 rounded-full border border-dashed border-white/15" />

      <div className="relative grid min-h-[440px] grid-cols-6 grid-rows-[1fr_0.8fr_1fr] gap-3 sm:min-h-[540px]">
        {visibleItems.map((item, index) => (
          <MediaShell key={item.id} item={item} index={index} />
        ))}

        <div className="absolute bottom-4 left-4 right-4 z-20 rounded-[1.5rem] border border-white/10 bg-black/45 p-5 text-white backdrop-blur-md">
          <div className="mb-4 flex items-center gap-2">
            {visibleItems.slice(0, 5).map((item, index) => (
              <span key={item.id} className={`h-1.5 rounded-full bg-white/35 ${index === 0 ? "w-8 bg-[color:var(--accent)]" : "w-3"}`} />
            ))}
          </div>
          <h2 className="max-w-sm text-4xl font-black sm:text-5xl">
            {title}
            {accent ? <span className="block text-[color:var(--accent)]">{accent}</span> : null}
          </h2>
          {description ? <p className="mt-3 max-w-sm text-sm text-white/75 sm:text-base">{description}</p> : null}
        </div>
      </div>
    </aside>
  );
}
