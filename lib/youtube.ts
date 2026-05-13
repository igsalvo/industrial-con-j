export function getYouTubeEmbedUrl(url?: string | null) {
  if (!url) {
    return null;
  }

  try {
    const parsed = new URL(url.trim());
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      if (parsed.pathname === "/watch") {
        const id = parsed.searchParams.get("v");
        return id ? `https://www.youtube.com/embed/${id}` : null;
      }

      if (parsed.pathname.startsWith("/embed/")) {
        const id = parsed.pathname.split("/embed/")[1]?.split("/")[0];
        return id ? `https://www.youtube.com/embed/${id}` : null;
      }

      if (parsed.pathname.startsWith("/shorts/")) {
        const id = parsed.pathname.split("/shorts/")[1]?.split("/")[0];
        return id ? `https://www.youtube.com/embed/${id}` : null;
      }
    }
  } catch {
    return null;
  }

  return null;
}

export function getYouTubeWatchUrl(url?: string | null) {
  const embedUrl = getYouTubeEmbedUrl(url);
  if (!embedUrl) {
    return null;
  }

  const id = embedUrl.split("/embed/")[1]?.split(/[?&/]/)[0];
  return id ? `https://www.youtube.com/watch?v=${id}` : null;
}

export function getYouTubeThumbnailUrl(url?: string | null) {
  const embedUrl = getYouTubeEmbedUrl(url);
  if (!embedUrl) {
    return null;
  }

  const id = embedUrl.split("/embed/")[1]?.split(/[?&/]/)[0];
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null;
}
