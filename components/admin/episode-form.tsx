"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { UploadField } from "@/components/admin/upload-field";

type EpisodeFormProps = {
  mode: "create" | "edit";
  episode?: {
    id: string;
    title: string;
    slug: string;
    shortDescription: string;
    longDescription: string;
    timestamps: string[];
    spotifyUrl: string | null;
    youtubeUrl: string | null;
    applePodcastsUrl: string | null;
    videoEmbedUrl: string | null;
    audioEmbedUrl: string | null;
    thumbnailUrl: string | null;
    thumbnailPositionX?: string | null;
    thumbnailPositionY?: string | null;
    clipThumbnailUrl: string | null;
    clipVideoUrl: string | null;
    tags: string[];
    industries: string[];
    isFeatured: boolean;
    isVisible: boolean;
    sponsorId: string | null;
    publishedAt: Date;
    resourceLinks: unknown;
    guests: Array<{ id: string }>;
  };
  guests: Array<{ id: string; name: string }>;
  sponsors: Array<{ id: string; name: string }>;
};

export function EpisodeForm({ mode, episode, guests, sponsors }: EpisodeFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedGuestIds, setSelectedGuestIds] = useState<string[]>(episode?.guests.map((guest: { id: string }) => guest.id) || []);
  const defaultResources = useMemo(() => JSON.stringify(episode?.resourceLinks ?? [], null, 2), [episode?.resourceLinks]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    let resourceLinks: Array<{ label: string; url: string }> = [];

    try {
      resourceLinks = JSON.parse(String(formData.get("resourceLinks") || "[]"));
    } catch {
      setError("El JSON de recursos no es válido.");
      setLoading(false);
      return;
    }

    const payload = {
      title: formData.get("title"),
      slug: formData.get("slug"),
      shortDescription: formData.get("shortDescription"),
      longDescription: formData.get("longDescription"),
      timestamps: formData.get("timestamps"),
      spotifyUrl: formData.get("spotifyUrl"),
      youtubeUrl: formData.get("youtubeUrl"),
      applePodcastsUrl: formData.get("applePodcastsUrl"),
      videoEmbedUrl: formData.get("videoEmbedUrl"),
      audioEmbedUrl: formData.get("audioEmbedUrl"),
      thumbnailUrl: formData.get("thumbnailUrl"),
      thumbnailPositionX: formData.get("thumbnailPositionX"),
      thumbnailPositionY: formData.get("thumbnailPositionY"),
      clipThumbnailUrl: formData.get("clipThumbnailUrl"),
      clipVideoUrl: formData.get("clipVideoUrl"),
      tags: formData.get("tags"),
      industries: formData.get("industries"),
      sponsorId: formData.get("sponsorId"),
      isFeatured: formData.get("isFeatured") === "on",
      isVisible: formData.get("isVisible") === "on",
      publishedAt: formData.get("publishedAt"),
      guestIds: selectedGuestIds,
      resourceLinks
    };

    const response = await fetch(mode === "create" ? "/api/admin/episodes" : `/api/admin/episodes/${episode?.id}`, {
      method: mode === "create" ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const body = await response.json();

    if (!response.ok) {
      setError(body.error || "No se pudo guardar el episodio.");
      setLoading(false);
      return;
    }

    router.push("/admin/episodes");
    router.refresh();
  }

  async function onDelete() {
    if (!episode || !window.confirm("Eliminar este episodio?")) {
      return;
    }

    await fetch(`/api/admin/episodes/${episode.id}`, { method: "DELETE" });
    router.push("/admin/episodes");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <input className="field" name="title" placeholder="Título" defaultValue={episode?.title} required />
        <input className="field" name="slug" placeholder="slug-opcional" defaultValue={episode?.slug} />
      </div>
      <textarea className="field min-h-24" name="shortDescription" placeholder="Resumen corto" defaultValue={episode?.shortDescription} required />
      <textarea className="field min-h-40" name="longDescription" placeholder="Descripción larga" defaultValue={episode?.longDescription} required />
      <UploadField
        name="thumbnailUrl"
        label="Miniatura pública del episodio"
        defaultValue={episode?.thumbnailUrl || ""}
        accept="image/*"
        uploadLabel="Subir miniatura"
        urlPlaceholder="https://... o URL de imagen subida"
        hint="Esta imagen reemplaza el logo en las tarjetas de episodios y en la página de detalle."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <select className="field" name="thumbnailPositionX" defaultValue={episode?.thumbnailPositionX || "center"}>
          <option value="left">Encuadre horizontal: izquierda</option>
          <option value="center">Encuadre horizontal: centro</option>
          <option value="right">Encuadre horizontal: derecha</option>
        </select>
        <select className="field" name="thumbnailPositionY" defaultValue={episode?.thumbnailPositionY || "center"}>
          <option value="top">Encuadre vertical: arriba</option>
          <option value="center">Encuadre vertical: centro</option>
          <option value="bottom">Encuadre vertical: abajo</option>
        </select>
      </div>
      <textarea className="field min-h-32" name="timestamps" placeholder="00:00 Intro" defaultValue={episode?.timestamps.join("\n")} />
      <div className="grid gap-4 lg:grid-cols-3">
        <input className="field" name="spotifyUrl" placeholder="Spotify URL" defaultValue={episode?.spotifyUrl || ""} />
        <input className="field" name="youtubeUrl" placeholder="YouTube URL" defaultValue={episode?.youtubeUrl || ""} />
        <input className="field" name="applePodcastsUrl" placeholder="Apple Podcasts URL" defaultValue={episode?.applePodcastsUrl || ""} />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <input className="field" name="videoEmbedUrl" placeholder="Video embed URL" defaultValue={episode?.videoEmbedUrl || ""} />
        <input className="field" name="audioEmbedUrl" placeholder="Audio embed URL" defaultValue={episode?.audioEmbedUrl || ""} />
        <UploadField
          name="clipVideoUrl"
          label="Video short del episodio"
          defaultValue={episode?.clipVideoUrl || ""}
          accept="video/*"
          uploadLabel="Subir short"
          urlPlaceholder="https://youtube.com/... o URL del video subido"
        />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <UploadField name="clipThumbnailUrl" label="Thumbnail del clip" defaultValue={episode?.clipThumbnailUrl || ""} />
        <input className="field" name="tags" placeholder="Lean, KPI, Operaciones" defaultValue={episode?.tags.join(", ")} />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <input className="field" name="industries" placeholder="Manufacturing, Mining" defaultValue={episode?.industries.join(", ")} />
      </div>
      <textarea className="field min-h-40 font-mono text-sm" name="resourceLinks" defaultValue={defaultResources} />
      <div className="grid gap-6 lg:grid-cols-3">
        <input
          className="field"
          name="publishedAt"
          type="datetime-local"
          defaultValue={episode?.publishedAt ? new Date(episode.publishedAt).toISOString().slice(0, 16) : ""}
        />
        <select className="field" name="sponsorId" defaultValue={episode?.sponsorId || ""}>
          <option value="">Sin aliado</option>
          {sponsors.map((sponsor: { id: string; name: string }) => (
            <option key={sponsor.id} value={sponsor.id}>
              {sponsor.name}
            </option>
          ))}
        </select>
        <label className="card flex items-center gap-3 p-4 text-sm font-medium">
          <input defaultChecked={episode?.isFeatured} name="isFeatured" type="checkbox" />
          Destacar episodio
        </label>
        <label className="card flex items-center gap-3 p-4 text-sm font-medium">
          <input defaultChecked={episode?.isVisible ?? true} name="isVisible" type="checkbox" />
          Mostrar en la página
        </label>
      </div>

      <div className="card p-6">
        <p className="text-lg font-semibold">Invitados asociados</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {guests.map((guest: { id: string; name: string }) => {
            const checked = selectedGuestIds.includes(guest.id);
            return (
              <label key={guest.id} className="flex items-center gap-3 rounded-2xl border border-[color:var(--line)] p-3">
                <input
                  checked={checked}
                  type="checkbox"
                  onChange={() =>
                    setSelectedGuestIds((current) =>
                      checked ? current.filter((id) => id !== guest.id) : [...current, guest.id]
                    )
                  }
                />
                {guest.name}
              </label>
            );
          })}
        </div>
      </div>

      {error ? <p className="text-sm text-red-500">{error}</p> : null}
      <div className="flex flex-wrap gap-3">
        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? "Guardando..." : mode === "create" ? "Crear episodio" : "Guardar cambios"}
        </button>
        {mode === "edit" ? (
          <button className="btn-secondary" type="button" onClick={onDelete}>
            Eliminar
          </button>
        ) : null}
      </div>
    </form>
  );
}
