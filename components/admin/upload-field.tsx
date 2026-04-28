"use client";

import { useId, useMemo, useState } from "react";

function getYouTubeEmbedUrl(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      const id = parsed.pathname.replace("/", "");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }

    if (parsed.hostname.includes("youtube.com")) {
      if (parsed.pathname.startsWith("/watch")) {
        const id = parsed.searchParams.get("v");
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

function getPreviewKind(value: string) {
  const lowered = value.toLowerCase();
  if (!value) return null;
  if (getYouTubeEmbedUrl(value)) return "youtube";
  if (/(\.png|\.jpg|\.jpeg|\.gif|\.webp|\.svg)(\?|$)/.test(lowered)) return "image";
  if (/(\.mp4|\.webm|\.ogg|\.mov)(\?|$)/.test(lowered)) return "video";
  return "link";
}

export function UploadField({
  name,
  label,
  defaultValue,
  accept = "image/*",
  uploadLabel,
  urlPlaceholder
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  accept?: string;
  uploadLabel?: string;
  urlPlaceholder?: string;
}) {
  const [value, setValue] = useState(defaultValue || "");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const inputId = useId();
  const previewKind = useMemo(() => getPreviewKind(value), [value]);
  const youtubeEmbedUrl = useMemo(() => (value ? getYouTubeEmbedUrl(value) : null), [value]);

  async function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/uploads", {
        method: "POST",
        body: formData
      });

      const body = await response.json();

      if (!response.ok) {
        setError(body.error || "No se pudo subir el archivo.");
        setUploading(false);
        return;
      }

      setValue(body.url || "");
    } catch {
      setError("No se pudo subir el archivo.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold">{label}</label>
      <input
        className="field"
        name={name}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={urlPlaceholder || "https://..."}
      />
      <div className="flex flex-wrap items-center gap-3">
        <label htmlFor={inputId} className="btn-secondary !px-4 !py-2 text-sm cursor-pointer">
          {uploading ? "Subiendo..." : uploadLabel || "Subir archivo"}
        </label>
        <input id={inputId} type="file" accept={accept} className="hidden" onChange={onFileChange} />
        <span className="text-xs text-[color:var(--muted)]">Tambien puedes pegar una URL publica manualmente.</span>
      </div>

      {value ? (
        <div className="rounded-3xl border border-[color:var(--line)] bg-[color:var(--surface-strong)] p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--muted)]">Vista previa</p>
          {previewKind === "image" ? (
            <div className="overflow-hidden rounded-2xl border border-[color:var(--line)] bg-white p-4">
              <img src={value} alt={`Vista previa de ${label}`} className="mx-auto max-h-72 w-full object-contain" />
            </div>
          ) : null}
          {previewKind === "video" ? (
            <video src={value} controls className="w-full overflow-hidden rounded-2xl border border-[color:var(--line)] bg-black" />
          ) : null}
          {previewKind === "youtube" && youtubeEmbedUrl ? (
            <div className="aspect-[9/16] max-w-xs overflow-hidden rounded-2xl border border-[color:var(--line)] bg-black">
              <iframe
                src={youtubeEmbedUrl}
                title={`Vista previa de ${label}`}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : null}
          {previewKind === "link" ? (
            <a href={value} target="_blank" rel="noreferrer" className="text-sm text-[color:var(--accent)] underline underline-offset-4">
              Abrir recurso enlazado
            </a>
          ) : null}
        </div>
      ) : null}

      {error ? <p className="text-xs text-red-500">{error}</p> : null}
    </div>
  );
}
