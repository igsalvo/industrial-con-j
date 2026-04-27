"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type SiteConfigShape = {
  showFeaturedClips: boolean;
  showLatestEpisodes: boolean;
  showSponsorsSection: boolean;
  showRecommendedSection: boolean;
  showGuestsSection: boolean;
  showCommunityLink: boolean;
  showSponsorBanner: boolean;
  sponsorBannerTitle: string | null;
  heroEyebrow: string | null;
  heroTitle: string | null;
  heroTitleAccent: string | null;
  heroDescription: string | null;
  heroPrimaryCtaLabel: string | null;
  heroPrimaryCtaHref: string | null;
  heroSecondaryCtaLabel: string | null;
  heroSecondaryCtaHref: string | null;
};

export function SiteConfigForm({ config }: { config: SiteConfigShape }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(event.currentTarget);

    const response = await fetch("/api/admin/site-config", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        showFeaturedClips: formData.get("showFeaturedClips") === "on",
        showLatestEpisodes: formData.get("showLatestEpisodes") === "on",
        showSponsorsSection: formData.get("showSponsorsSection") === "on",
        showRecommendedSection: formData.get("showRecommendedSection") === "on",
        showGuestsSection: formData.get("showGuestsSection") === "on",
        showCommunityLink: formData.get("showCommunityLink") === "on",
        showSponsorBanner: formData.get("showSponsorBanner") === "on",
        sponsorBannerTitle: formData.get("sponsorBannerTitle"),
        heroEyebrow: formData.get("heroEyebrow"),
        heroTitle: formData.get("heroTitle"),
        heroTitleAccent: formData.get("heroTitleAccent"),
        heroDescription: formData.get("heroDescription"),
        heroPrimaryCtaLabel: formData.get("heroPrimaryCtaLabel"),
        heroPrimaryCtaHref: formData.get("heroPrimaryCtaHref"),
        heroSecondaryCtaLabel: formData.get("heroSecondaryCtaLabel"),
        heroSecondaryCtaHref: formData.get("heroSecondaryCtaHref")
      })
    });

    const body = await response.json();

    if (!response.ok) {
      setError(body.error || "No se pudo guardar la configuracion.");
      setLoading(false);
      return;
    }

    router.refresh();
    setLoading(false);
  }

  const toggles = [
    { name: "showFeaturedClips", label: "Mostrar clips destacados", defaultChecked: config.showFeaturedClips },
    { name: "showLatestEpisodes", label: "Mostrar ultimos episodios", defaultChecked: config.showLatestEpisodes },
    { name: "showSponsorsSection", label: "Mostrar seccion sponsors", defaultChecked: config.showSponsorsSection },
    { name: "showRecommendedSection", label: "Mostrar recomendados", defaultChecked: config.showRecommendedSection },
    { name: "showGuestsSection", label: "Mostrar seccion invitados", defaultChecked: config.showGuestsSection },
    { name: "showCommunityLink", label: "Mostrar comunidad en header y footer", defaultChecked: config.showCommunityLink },
    { name: "showSponsorBanner", label: "Mostrar banner de auspiciadores", defaultChecked: config.showSponsorBanner }
  ];

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-3 md:grid-cols-2">
        {toggles.map((toggle) => (
          <label key={toggle.name} className="card flex items-center gap-3 p-4 text-sm">
            <input defaultChecked={toggle.defaultChecked} name={toggle.name} type="checkbox" />
            {toggle.label}
          </label>
        ))}
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold">Eyebrow del panel principal</label>
        <input className="field" name="heroEyebrow" defaultValue={config.heroEyebrow || ""} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold">Titulo principal</label>
          <input className="field" name="heroTitle" defaultValue={config.heroTitle || ""} />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold">Texto destacado del titulo</label>
          <input className="field" name="heroTitleAccent" defaultValue={config.heroTitleAccent || ""} />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold">Descripcion del panel principal</label>
        <textarea className="field min-h-28" name="heroDescription" defaultValue={config.heroDescription || ""} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold">Boton principal</label>
          <input className="field" name="heroPrimaryCtaLabel" defaultValue={config.heroPrimaryCtaLabel || ""} placeholder="Texto del boton" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold">URL boton principal</label>
          <input className="field" name="heroPrimaryCtaHref" defaultValue={config.heroPrimaryCtaHref || ""} placeholder="/episodes" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold">Boton secundario</label>
          <input className="field" name="heroSecondaryCtaLabel" defaultValue={config.heroSecondaryCtaLabel || ""} placeholder="Texto del boton" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold">URL boton secundario</label>
          <input className="field" name="heroSecondaryCtaHref" defaultValue={config.heroSecondaryCtaHref || ""} placeholder="/community" />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold">Titulo del banner de auspiciadores</label>
        <input className="field" name="sponsorBannerTitle" defaultValue={config.sponsorBannerTitle || "Auspiciadores"} />
      </div>

      {error ? <p className="text-sm text-red-500">{error}</p> : null}

      <button className="btn-primary" type="submit" disabled={loading}>
        {loading ? "Guardando..." : "Guardar portada"}
      </button>
    </form>
  );
}
