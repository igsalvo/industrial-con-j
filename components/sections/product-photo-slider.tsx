"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function ProductPhotoSlider({
  name,
  photos,
  objectPosition
}: {
  name: string;
  photos: string[];
  objectPosition: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const hasMultiplePhotos = photos.length > 1;
  const activePhoto = photos[activeIndex];

  function changePhoto(offset: number) {
    setActiveIndex((current) => (current + offset + photos.length) % photos.length);
  }

  return (
    <div className="relative bg-[color:var(--surface-strong)]">
      <div className="aspect-square overflow-hidden">
        {activePhoto ? (
          <img src={activePhoto} alt={name} className="h-full w-full object-cover" style={{ objectPosition }} />
        ) : null}
      </div>

      {hasMultiplePhotos ? (
        <>
          <button
            type="button"
            className="absolute left-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-black/55 text-white backdrop-blur transition hover:bg-[color:var(--accent)]"
            onClick={() => changePhoto(-1)}
            aria-label="Foto anterior"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-black/55 text-white backdrop-blur transition hover:bg-[color:var(--accent)]"
            onClick={() => changePhoto(1)}
            aria-label="Foto siguiente"
          >
            <ChevronRight size={18} />
          </button>
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-black/45 px-2 py-1 backdrop-blur">
            {photos.map((photo, index) => (
              <button
                key={`${photo}-${index}`}
                type="button"
                className={`h-2 w-2 rounded-full transition ${index === activeIndex ? "bg-[color:var(--accent)]" : "bg-white/70"}`}
                onClick={() => setActiveIndex(index)}
                aria-label={`Ver foto ${index + 1}`}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
