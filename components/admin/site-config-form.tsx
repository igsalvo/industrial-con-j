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
        sponsorBannerTitle: formData.get("sponsorBannerTitle")
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
        <label className="mb-2 block text-sm font-semibold">Titulo del banner de auspiciadores</label>
        <input className="field" name="sponsorBannerTitle" defaultValue={config.sponsorBannerTitle || "Auspiciadores"} />
      </div>

      {error ? <p className="text-sm text-red-500">{error}</p> : null}

      <button className="btn-primary" type="submit" disabled={loading}>
        {loading ? "Guardando..." : "Guardar visibilidad"}
      </button>
    </form>
  );
}
