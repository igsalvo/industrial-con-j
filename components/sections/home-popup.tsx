"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getYouTubeEmbedUrl } from "@/lib/youtube";

type HomePopupProps = {
  title?: string | null;
  body?: string | null;
  buttonLabel?: string | null;
  buttonHref?: string | null;
  videoUrl?: string | null;
  placement?: string | null;
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

export function HomePopup({ title, body, buttonLabel, buttonHref, videoUrl, placement }: HomePopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const contentKey = useMemo(() => encodeURIComponent([title, body, buttonLabel, buttonHref, videoUrl, placement].filter(Boolean).join("|")), [title, body, buttonLabel, buttonHref, videoUrl, placement]);
  const youtubeEmbedUrl = getYouTubeEmbedUrl(videoUrl);
  const normalizedVideoUrl = videoUrl?.trim();
  const placementClasses = getPlacementClasses(placement);

  const closePopup = useCallback(() => {
    window.sessionStorage.setItem("industrialconj-home-popup-dismissed", contentKey);
    setIsVisible(false);
  }, [contentKey]);

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closePopup();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closePopup, isVisible]);

  useEffect(() => {
    if (!title && !body && !normalizedVideoUrl) {
      return;
    }

    if (window.sessionStorage.getItem("industrialconj-home-popup-dismissed") !== contentKey) {
      setIsVisible(true);
    }
  }, [body, contentKey, normalizedVideoUrl, title]);

  if (!isVisible) {
    return null;
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
