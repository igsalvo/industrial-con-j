"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { UploadField } from "@/components/admin/upload-field";

type SiteConfigShape = {
  logoUrl: string | null;
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
  featuredClipsEyebrow: string | null;
  featuredClipsTitle: string | null;
  featuredClipsDescription: string | null;
  featuredClipsOrder: number;
  latestEpisodesEyebrow: string | null;
  latestEpisodesTitle: string | null;
  latestEpisodesDescription: string | null;
  latestEpisodesOrder: number;
  sponsorsSectionEyebrow: string | null;
  sponsorsSectionTitle: string | null;
  sponsorsSectionDescription: string | null;
  sponsorsSectionOrder: number;
  recommendedSectionEyebrow: string | null;
  recommendedSectionTitle: string | null;
  recommendedSectionDescription: string | null;
  recommendedSectionOrder: number;
  guestsSectionEyebrow: string | null;
  guestsSectionTitle: string | null;
  guestsSectionDescription: string | null;
  guestsSectionOrder: number;
};

const sectionFields = [
  {
    key: "featuredClips",
    label: "Shorts",
    orderName: "featuredClipsOrder",
    eyebrowName: "featuredClipsEyebrow",
    titleName: "featuredClipsTitle",
    descriptionName: "featuredClipsDescription"
  },
  {
    key: "latestEpisodes",
    label: "Ultimos episodios",
    orderName: "latestEpisodesOrder",
    eyebrowName: "latestEpisodesEyebrow",
    titleName: "latestEpisodesTitle",
    descriptionName: "latestEpisodesDescription"
  },
  {
    key: "sponsorsSection",
    label: "Sponsors",
    orderName: "sponsorsSectionOrder",
    eyebrowName: "sponsorsSectionEyebrow",
    titleName: "sponsorsSectionTitle",
    descriptionName: "sponsorsSectionDescription"
  },
  {
    key: "recommendedSection",
    label: "Recomendados",
    orderName: "recommendedSectionOrder",
    eyebrowName: "recommendedSectionEyebrow",
    titleName: "recommendedSectionTitle",
    descriptionName: "recommendedSectionDescription"
  },
  {
    key: "guestsSection",
    label: "Invitados",
    orderName: "guestsSectionOrder",
    eyebrowName: "guestsSectionEyebrow",
    titleName: "guestsSectionTitle",
    descriptionName: "guestsSectionDescription"
  }
] as const;

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
        logoUrl: formData.get("logoUrl"),
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
        heroSecondaryCtaHref: formData.get("heroSecondaryCtaHref"),
        featuredClipsEyebrow: formData.get("featuredClipsEyebrow"),
        featuredClipsTitle: formData.get("featuredClipsTitle"),
        featuredClipsDescription: formData.get("featuredClipsDescription"),
        featuredClipsOrder: formData.get("featuredClipsOrder"),
        latestEpisodesEyebrow: formData.get("latestEpisodesEyebrow"),
        latestEpisodesTitle: formData.get("latestEpisodesTitle"),
        latestEpisodesDescription: formData.get("latestEpisodesDescription"),
        latestEpisodesOrder: formData.get("latestEpisodesOrder"),
        sponsorsSectionEyebrow: formData.get("sponsorsSectionEyebrow"),
        sponsorsSectionTitle: formData.get("sponsorsSectionTitle"),
        sponsorsSectionDescription: formData.get("sponsorsSectionDescription"),
        sponsorsSectionOrder: formData.get("sponsorsSectionOrder"),
        recommendedSectionEyebrow: formData.get("recommendedSectionEyebrow"),
        recommendedSectionTitle: formData.get("recommendedSectionTitle"),
        recommendedSectionDescription: formData.get("recommendedSectionDescription"),
        recommendedSectionOrder: formData.get("recommendedSectionOrder"),
        guestsSectionEyebrow: formData.get("guestsSectionEyebrow"),
        guestsSectionTitle: formData.get("guestsSectionTitle"),
        guestsSectionDescription: formData.get("guestsSectionDescription"),
        guestsSectionOrder: formData.get("guestsSectionOrder")
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
    { name: "showFeaturedClips", label: "Mostrar shorts destacados", defaultChecked: config.showFeaturedClips },
    { name: "showLatestEpisodes", label: "Mostrar ultimos episodios", defaultChecked: config.showLatestEpisodes },
    { name: "showSponsorsSection", label: "Mostrar seccion sponsors", defaultChecked: config.showSponsorsSection },
    { name: "showRecommendedSection", label: "Mostrar recomendados", defaultChecked: config.showRecommendedSection },
    { name: "showGuestsSection", label: "Mostrar seccion invitados", defaultChecked: config.showGuestsSection },
    { name: "showCommunityLink", label: "Mostrar comunidad en header y footer", defaultChecked: config.showCommunityLink },
    { name: "showSponsorBanner", label: "Mostrar banner de auspiciadores", defaultChecked: config.showSponsorBanner }
  ];

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <UploadField
        name="logoUrl"
        label="Logo del podcast"
        defaultValue={config.logoUrl || ""}
        accept="image/*"
        uploadLabel="Subir logo"
        urlPlaceholder="https://... o URL del logo subido"
      />

      <div className="grid gap-3 md:grid-cols-2">
        {toggles.map((toggle) => (
          <label key={toggle.name} className="card flex items-center gap-3 p-4 text-sm">
            <input defaultChecked={toggle.defaultChecked} name={toggle.name} type="checkbox" />
            {toggle.label}
          </label>
        ))}
      </div>

      <div className="space-y-4 rounded-3xl border border-[color:var(--line)] p-5">
        <div>
          <p className="pill">Hero</p>
          <h3 className="mt-3 text-2xl font-black">Panel principal</h3>
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
      </div>

      <div className="space-y-4 rounded-3xl border border-[color:var(--line)] p-5">
        <div>
          <p className="pill">Home</p>
          <h3 className="mt-3 text-2xl font-black">Orden y textos de secciones</h3>
          <p className="mt-2 text-sm text-[color:var(--muted)]">Puedes cambiar el orden en que aparecen y editar sus titulos y descripciones.</p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold">Titulo del banner de auspiciadores</label>
          <input className="field" name="sponsorBannerTitle" defaultValue={config.sponsorBannerTitle || "Auspiciadores"} />
        </div>

        <div className="space-y-5">
          {sectionFields.map((section) => (
            <div key={section.key} className="rounded-2xl border border-[color:var(--line)] p-4">
              <div className="grid gap-4 md:grid-cols-[120px_1fr_1fr]">
                <div>
                  <label className="mb-2 block text-sm font-semibold">Orden</label>
                  <input className="field" name={section.orderName} type="number" defaultValue={config[section.orderName]} min={1} />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold">Eyebrow</label>
                  <input className="field" name={section.eyebrowName} defaultValue={config[section.eyebrowName] || ""} />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold">Titulo</label>
                  <input className="field" name={section.titleName} defaultValue={config[section.titleName] || ""} />
                </div>
              </div>
              <div className="mt-4">
                <label className="mb-2 block text-sm font-semibold">Descripcion</label>
                <textarea className="field min-h-24" name={section.descriptionName} defaultValue={config[section.descriptionName] || ""} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {error ? <p className="text-sm text-red-500">{error}</p> : null}

      <button className="btn-primary" type="submit" disabled={loading}>
        {loading ? "Guardando..." : "Guardar portada"}
      </button>
    </form>
  );
}
