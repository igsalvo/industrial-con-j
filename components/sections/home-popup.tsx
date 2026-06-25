"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getYouTubeEmbedUrl } from "@/lib/youtube";

type HomePopupProps = {
  title?: string | null;
  body?: string | null;
  buttonLabel?: string | null;
  buttonHref?: string | null;
  imageUrl?: string | null;
  videoUrl?: string | null;
  placement?: string | null;
  mode?: string | null;
};

const urlPattern = /(https?:\/\/[^\s]+)/g;

function textWithLinks(text: string) {
  return text.split(urlPattern).map((part, index) => {
    if (!part.match(urlPattern)) {
      return part;
    }

    return (
      <a key={`${part}-${index}`} href={part} target="_blank" rel="noreferrer" className="font-semibold text-[color:var(--accent)] underline-offset-4 hover:underline">
        {part}
      </a>
    );
  });
}

function getPlacementClasses(placement: string | null | undefined) {
  switch (placement) {
    case "fullscreen":
      return {
        wrapper: "items-stretch justify-stretch p-0",
        panel: "min-h-dvh w-full rounded-none border-0 p-6 sm:p-10 md:p-14"
      };
    case "right":
      return {
        wrapper: "items-stretch justify-end p-0 sm:p-6",
        panel: "min-h-dvh w-full max-w-xl rounded-none p-6 sm:min-h-0 sm:rounded-[2rem] sm:p-8"
      };
    case "left":
      return {
        wrapper: "items-stretch justify-start p-0 sm:p-6",
        panel: "min-h-dvh w-full max-w-xl rounded-none p-6 sm:min-h-0 sm:rounded-[2rem] sm:p-8"
      };
    case "top":
      return {
        wrapper: "items-start justify-center p-4 sm:p-8",
        panel: "w-full max-w-4xl p-6 sm:p-8"
      };
    case "bottom":
      return {
        wrapper: "items-end justify-center p-4 sm:p-8",
        panel: "w-full max-w-4xl p-6 sm:p-8"
      };
    default:
      return {
        wrapper: "items-center justify-center p-4 sm:p-8",
        panel: "w-full max-w-2xl p-6 sm:p-8"
      };
  }
}

export function HomePopup({ title, body, buttonLabel, buttonHref, imageUrl, videoUrl, placement, mode = "modal" }: HomePopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const isSidePanel = mode === "side-panel";
  const storageKey = isSidePanel ? "industrialconj-home-side-panel-dismissed" : "industrialconj-home-popup-dismissed";
  const contentKey = useMemo(() => encodeURIComponent([title, body, buttonLabel, buttonHref, imageUrl, videoUrl, placement, mode].filter(Boolean).join("|")), [title, body, buttonLabel, buttonHref, imageUrl, videoUrl, placement, mode]);
  const normalizedImageUrl = imageUrl?.trim();
  const youtubeEmbedUrl = getYouTubeEmbedUrl(videoUrl);
  const normalizedVideoUrl = videoUrl?.trim();
  const placementClasses = getPlacementClasses(placement);

  const closePopup = useCallback(() => {
    const storage = isSidePanel ? window.localStorage : window.sessionStorage;
    storage.setItem(storageKey, contentKey);
    setIsVisible(false);
    setIsExpanded(false);
  }, [contentKey, isSidePanel, storageKey]);

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        if (isSidePanel && isExpanded) {
          setIsExpanded(false);
          return;
        }

        closePopup();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closePopup, isExpanded, isSidePanel, isVisible]);

  useEffect(() => {
    if (!title && !body && !normalizedImageUrl && !normalizedVideoUrl) {
      return;
    }

    const storage = isSidePanel ? window.localStorage : window.sessionStorage;

    if (storage.getItem(storageKey) !== contentKey) {
      setIsVisible(true);
    }
  }, [body, contentKey, isSidePanel, normalizedImageUrl, normalizedVideoUrl, storageKey, title]);

  if (!isVisible) {
    return null;
  }

  if (isSidePanel) {
    const previewText = body?.replace(/\s+/g, " ").trim();

    return (
      <aside className="fixed right-0 top-1/2 z-[70] flex -translate-y-1/2 items-center" aria-label={title || "Aviso destacado"}>
        {!isExpanded ? (
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            className="group flex max-w-[78vw] items-center gap-3 rounded-l-2xl border border-r-0 border-white/15 bg-[#181a19] px-3 py-3 text-left text-white shadow-2xl transition hover:border-[color:var(--accent)] sm:max-w-xs sm:px-4"
            aria-expanded={isExpanded}
            aria-controls="home-side-panel-content"
          >
            {normalizedImageUrl ? (
              <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white">
                <img src={normalizedImageUrl} alt="" className="h-full w-full object-contain p-1" />
              </span>
            ) : (
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-white/10 bg-[color:var(--accent)] text-xl font-black">
                J
              </span>
            )}
            <span className="min-w-0">
              {title ? <span className="line-clamp-2 block text-sm font-black leading-tight">{title}</span> : null}
              {previewText ? <span className="mt-1 line-clamp-1 block text-xs text-white/68">Presiona para ver el mensaje completo</span> : null}
            </span>
          </button>
        ) : null}

        {isExpanded ? (
          <div
            id="home-side-panel-content"
            className="relative mr-3 max-h-[calc(100svh-2rem)] w-[calc(100vw-1.5rem)] max-w-sm overflow-y-auto rounded-2xl border border-white/15 bg-[#181a19] p-4 text-white shadow-2xl sm:mr-6 sm:max-w-md sm:p-5"
            role="dialog"
            aria-modal="false"
            aria-labelledby={title ? "home-side-panel-title" : undefined}
          >
        <button
          type="button"
          onClick={() => setIsExpanded(false)}
          className="absolute right-14 top-3 grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/10 text-xl leading-none text-white transition hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
          aria-label="Contraer aviso"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={closePopup}
          className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/10 text-xl leading-none text-white transition hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
          aria-label="Cerrar aviso"
        >
          ×
        </button>

        <div className="pr-20">
          {title ? <h2 id="home-side-panel-title" className="text-xl font-black leading-tight sm:text-2xl">{title}</h2> : null}
          {normalizedImageUrl ? (
            <div className="mt-4 rounded-2xl border border-white/10 bg-white p-3">
              <img src={normalizedImageUrl} alt={title || "Imagen del aviso"} className="mx-auto max-h-48 w-full object-contain sm:max-h-56" />
            </div>
          ) : null}
          {body ? (
            <div className="mt-4 space-y-3 text-sm leading-6 text-[color:var(--muted)]">
              {body.split(/\n{2,}/).map((paragraph, index) => (
                <p key={`${paragraph}-${index}`}>{textWithLinks(paragraph)}</p>
              ))}
            </div>
          ) : null}
        </div>

        {normalizedVideoUrl ? (
          <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-black">
            {youtubeEmbedUrl ? (
              <iframe
                className="aspect-video w-full"
                src={youtubeEmbedUrl}
                title={title || "Video del aviso"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video className="aspect-video w-full object-cover" src={normalizedVideoUrl} controls playsInline />
            )}
          </div>
        ) : null}

        {buttonLabel && buttonHref ? (
          <a href={buttonHref} target={buttonHref.startsWith("/") ? undefined : "_blank"} rel={buttonHref.startsWith("/") ? undefined : "noreferrer"} className="btn-primary mt-5 w-full justify-center">
            {buttonLabel}
          </a>
        ) : null}
          </div>
        ) : null}
      </aside>
    );
  }

  return (
    <div
      className={`fixed inset-0 z-[80] flex bg-black/75 backdrop-blur-sm ${placementClasses.wrapper}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "home-popup-title" : undefined}
      aria-label={title ? undefined : "Aviso de inicio"}
    >
      <div className={`card relative max-h-dvh overflow-y-auto border-white/15 bg-[color:var(--panel)] shadow-2xl ${placementClasses.panel}`}>
        <button
          type="button"
          onClick={closePopup}
          className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/10 text-2xl leading-none text-white transition hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
          aria-label="Cerrar pop-up"
        >
          ×
        </button>

        <div className="pr-10">
          {title ? <h2 id="home-popup-title" className="text-3xl font-black sm:text-4xl">{title}</h2> : null}
          {normalizedImageUrl ? (
            <div className="mt-6 rounded-3xl border border-white/10 bg-white p-4">
              <img src={normalizedImageUrl} alt={title || "Imagen del aviso"} className="mx-auto max-h-[360px] w-full object-contain" />
            </div>
          ) : null}
          {body ? (
            <div className="mt-5 space-y-4 text-base leading-7 text-[color:var(--muted)]">
              {body.split(/\n{2,}/).map((paragraph, index) => (
                <p key={`${paragraph}-${index}`}>{textWithLinks(paragraph)}</p>
              ))}
            </div>
          ) : null}
        </div>

        {normalizedVideoUrl ? (
          <div className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-black">
            {youtubeEmbedUrl ? (
              <iframe
                className="aspect-video w-full"
                src={youtubeEmbedUrl}
                title={title || "Video del pop-up"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video className="aspect-video w-full object-cover" src={normalizedVideoUrl} controls playsInline />
            )}
          </div>
        ) : null}

        {buttonLabel && buttonHref ? (
          <a href={buttonHref} target={buttonHref.startsWith("/") ? undefined : "_blank"} rel={buttonHref.startsWith("/") ? undefined : "noreferrer"} className="btn-primary mt-6">
            {buttonLabel}
          </a>
        ) : null}
      </div>
    </div>
  );
}
