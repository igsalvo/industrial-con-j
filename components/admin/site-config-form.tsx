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
  showDonationsSection: boolean;
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
  donationsSectionEyebrow: string | null;
  donationsSectionTitle: string | null;
  donationsSectionDescription: string | null;
  donationsSectionOrder: number;
  donationUrl: string | null;
  recommendedSectionEyebrow: string | null;
  recommendedSectionTitle: string | null;
  recommendedSectionDescription: string | null;
  recommendedSectionOrder: number;
  guestsSectionEyebrow: string | null;
  guestsSectionTitle: string | null;
  guestsSectionDescription: string | null;
  guestsSectionOrder: number;
  communityPageEyebrow: string | null;
  communityPageTitle: string | null;
  communityPageDescription: string | null;
  communityEmptyTitle: string | null;
  communityEmptyDescription: string | null;
  communityContactTitle: string | null;
  communityContactDescription: string | null;
  communityContactSubmitLabel: string | null;
  donationsContactTitle: string | null;
  donationsContactDescription: string | null;
  donationsContactSubmitLabel: string | null;
  episodesPageEyebrow: string | null;
  episodesPageTitle: string | null;
  episodesPageDescription: string | null;
  guestsPageEyebrow: string | null;
  guestsPageTitle: string | null;
  guestsPageDescription: string | null;
  sponsorsPageEyebrow: string | null;
  sponsorsPageTitle: string | null;
  sponsorsPageDescription: string | null;
  footerTitle: string | null;
  footerDescription: string | null;
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
    key: "donationsSection",
    label: "Donaciones",
    orderName: "donationsSectionOrder",
    eyebrowName: "donationsSectionEyebrow",
    titleName: "donationsSectionTitle",
    descriptionName: "donationsSectionDescription"
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
        showRecommendedSection: false,
        showGuestsSection: formData.get("showGuestsSection") === "on",
        showCommunityLink: formData.get("showCommunityLink") === "on",
        showDonationsSection: formData.get("showDonationsSection") === "on",
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
        donationsSectionEyebrow: formData.get("donationsSectionEyebrow"),
        donationsSectionTitle: formData.get("donationsSectionTitle"),
        donationsSectionDescription: formData.get("donationsSectionDescription"),
        donationsSectionOrder: formData.get("donationsSectionOrder"),
        donationUrl: formData.get("donationUrl"),
        guestsSectionEyebrow: formData.get("guestsSectionEyebrow"),
        guestsSectionTitle: formData.get("guestsSectionTitle"),
        guestsSectionDescription: formData.get("guestsSectionDescription"),
        guestsSectionOrder: formData.get("guestsSectionOrder"),
        communityPageEyebrow: formData.get("communityPageEyebrow"),
        communityPageTitle: formData.get("communityPageTitle"),
        communityPageDescription: formData.get("communityPageDescription"),
        communityEmptyTitle: formData.get("communityEmptyTitle"),
        communityEmptyDescription: formData.get("communityEmptyDescription"),
        communityContactTitle: formData.get("communityContactTitle"),
        communityContactDescription: formData.get("communityContactDescription"),
        communityContactSubmitLabel: formData.get("communityContactSubmitLabel"),
        donationsContactTitle: formData.get("donationsContactTitle"),
        donationsContactDescription: formData.get("donationsContactDescription"),
        donationsContactSubmitLabel: formData.get("donationsContactSubmitLabel"),
        episodesPageEyebrow: formData.get("episodesPageEyebrow"),
        episodesPageTitle: formData.get("episodesPageTitle"),
        episodesPageDescription: formData.get("episodesPageDescription"),
        guestsPageEyebrow: formData.get("guestsPageEyebrow"),
        guestsPageTitle: formData.get("guestsPageTitle"),
        guestsPageDescription: formData.get("guestsPageDescription"),
        sponsorsPageEyebrow: formData.get("sponsorsPageEyebrow"),
        sponsorsPageTitle: formData.get("sponsorsPageTitle"),
        sponsorsPageDescription: formData.get("sponsorsPageDescription"),
        footerTitle: formData.get("footerTitle"),
        footerDescription: formData.get("footerDescription")
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
    { name: "showDonationsSection", label: "Mostrar seccion donaciones", defaultChecked: config.showDonationsSection },
    { name: "showGuestsSection", label: "Mostrar seccion invitados", defaultChecked: config.showGuestsSection },
    { name: "showCommunityLink", label: "Mostrar comunidad en header y footer", defaultChecked: config.showCommunityLink }
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

        <div className="space-y-5">
          <div className="rounded-2xl border border-[color:var(--line)] p-4">
            <label className="mb-2 block text-sm font-semibold">URL externa para donaciones (opcional)</label>
            <input className="field" name="donationUrl" defaultValue={config.donationUrl || ""} placeholder="https://..." />
          </div>

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

      <div className="space-y-4 rounded-3xl border border-[color:var(--line)] p-5">
        <div>
          <p className="pill">Paginas publicas</p>
          <h3 className="mt-3 text-2xl font-black">Textos editables</h3>
          <p className="mt-2 text-sm text-[color:var(--muted)]">Estos textos controlan comunidad, donaciones, archivo, invitados, sponsors y footer.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-semibold">Episodios eyebrow</label>
            <input className="field" name="episodesPageEyebrow" defaultValue={config.episodesPageEyebrow || ""} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold">Episodios titulo</label>
            <input className="field" name="episodesPageTitle" defaultValue={config.episodesPageTitle || ""} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold">Episodios descripcion</label>
            <textarea className="field min-h-24" name="episodesPageDescription" defaultValue={config.episodesPageDescription || ""} />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-semibold">Invitados eyebrow</label>
            <input className="field" name="guestsPageEyebrow" defaultValue={config.guestsPageEyebrow || ""} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold">Invitados titulo</label>
            <input className="field" name="guestsPageTitle" defaultValue={config.guestsPageTitle || ""} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold">Invitados descripcion</label>
            <textarea className="field min-h-24" name="guestsPageDescription" defaultValue={config.guestsPageDescription || ""} />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-semibold">Sponsors eyebrow</label>
            <input className="field" name="sponsorsPageEyebrow" defaultValue={config.sponsorsPageEyebrow || ""} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold">Sponsors titulo</label>
            <input className="field" name="sponsorsPageTitle" defaultValue={config.sponsorsPageTitle || ""} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold">Sponsors descripcion</label>
            <textarea className="field min-h-24" name="sponsorsPageDescription" defaultValue={config.sponsorsPageDescription || ""} />
          </div>
        </div>

        <div className="rounded-2xl border border-[color:var(--line)] p-4">
          <h4 className="text-lg font-bold">Comunidad</h4>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <input className="field" name="communityPageEyebrow" defaultValue={config.communityPageEyebrow || ""} placeholder="Eyebrow" />
            <input className="field" name="communityPageTitle" defaultValue={config.communityPageTitle || ""} placeholder="Titulo" />
            <textarea className="field min-h-24 md:col-span-2" name="communityPageDescription" defaultValue={config.communityPageDescription || ""} placeholder="Descripcion principal" />
            <input className="field" name="communityEmptyTitle" defaultValue={config.communityEmptyTitle || ""} placeholder="Titulo sin encuestas" />
            <input className="field" name="communityEmptyDescription" defaultValue={config.communityEmptyDescription || ""} placeholder="Descripcion sin encuestas" />
            <input className="field" name="communityContactTitle" defaultValue={config.communityContactTitle || ""} placeholder="Titulo formulario contacto" />
            <input className="field" name="communityContactSubmitLabel" defaultValue={config.communityContactSubmitLabel || ""} placeholder="Texto boton contacto" />
            <textarea className="field min-h-24 md:col-span-2" name="communityContactDescription" defaultValue={config.communityContactDescription || ""} placeholder="Descripcion formulario contacto" />
          </div>
        </div>

        <div className="rounded-2xl border border-[color:var(--line)] p-4">
          <h4 className="text-lg font-bold">Donaciones</h4>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <input className="field" name="donationsContactTitle" defaultValue={config.donationsContactTitle || ""} placeholder="Titulo formulario donaciones" />
            <input className="field" name="donationsContactSubmitLabel" defaultValue={config.donationsContactSubmitLabel || ""} placeholder="Texto boton donaciones" />
            <textarea className="field min-h-24 md:col-span-2" name="donationsContactDescription" defaultValue={config.donationsContactDescription || ""} placeholder="Descripcion formulario donaciones" />
          </div>
        </div>

        <div className="rounded-2xl border border-[color:var(--line)] p-4">
          <h4 className="text-lg font-bold">Footer</h4>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <input className="field" name="footerTitle" defaultValue={config.footerTitle || ""} placeholder="Titulo footer" />
            <textarea className="field min-h-24" name="footerDescription" defaultValue={config.footerDescription || ""} placeholder="Descripcion footer" />
          </div>
        </div>
      </div>

      {error ? <p className="text-sm text-red-500">{error}</p> : null}

      <button className="btn-primary" type="submit" disabled={loading}>
        {loading ? "Guardando..." : "Guardar portada"}
      </button>
    </form>
  );
}
