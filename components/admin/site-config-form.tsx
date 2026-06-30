"use client";

import { useState } from "react";
import { UploadField } from "@/components/admin/upload-field";
import { getYouTubeEmbedUrl } from "@/lib/youtube";

type SiteConfigShape = {
  logoUrl: string | null;
  showPodcastSection: boolean;
  showHeroSection: boolean;
  showFeaturedClips: boolean;
  showLatestEpisodes: boolean;
  showSponsorsSection: boolean;
  showNewsSection: boolean;
  showAlumniNewsSection: boolean;
  showRecommendedSection: boolean;
  showGuestsSection: boolean;
  showIdentitySection: boolean;
  showHonorSection: boolean;
  showProductsSection: boolean;
  showEventsSection: boolean;
  showParticipationSection: boolean;
  showCommunityLink: boolean;
  showContactLink: boolean;
  showThemeToggle: boolean;
  showDonationsSection: boolean;
  showHomePopup: boolean;
  homePopupTitle: string | null;
  homePopupBody: string | null;
  homePopupButtonLabel: string | null;
  homePopupButtonHref: string | null;
  homePopupImageUrl: string | null;
  homePopupVideoUrl: string | null;
  homePopupPlacement: string;
  homePopupMode: string;
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
  heroImageUrl: string | null;
  heroVideoUrl: string | null;
  heroVideoPosterUrl: string | null;
  heroVideoEnabled: boolean;
  heroOrder: number;
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
  newsSectionEyebrow: string | null;
  newsSectionTitle: string | null;
  newsSectionDescription: string | null;
  newsSectionOrder: number;
  alumniNewsSectionEyebrow: string | null;
  alumniNewsSectionTitle: string | null;
  alumniNewsSectionDescription: string | null;
  alumniNewsSectionOrder: number;
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
  identitySectionEyebrow: string | null;
  identitySectionTitle: string | null;
  identitySectionDescription: string | null;
  identitySectionOrder: number;
  honorSectionEyebrow: string | null;
  honorSectionTitle: string | null;
  honorSectionDescription: string | null;
  honorSectionOrder: number;
  productsSectionEyebrow: string | null;
  productsSectionTitle: string | null;
  productsSectionDescription: string | null;
  productsSectionOrder: number;
  productQuoteEmail: string | null;
  eventsSectionEyebrow: string | null;
  eventsSectionTitle: string | null;
  eventsSectionDescription: string | null;
  eventsSectionOrder: number;
  participationSectionEyebrow: string | null;
  participationSectionTitle: string | null;
  participationSectionDescription: string | null;
  participationSectionOrder: number;
  contactPageEyebrow: string | null;
  contactPageTitle: string | null;
  contactPageDescription: string | null;
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
    label: "Últimos episodios",
    orderName: "latestEpisodesOrder",
    eyebrowName: "latestEpisodesEyebrow",
    titleName: "latestEpisodesTitle",
    descriptionName: "latestEpisodesDescription"
  },
  {
    key: "sponsorsSection",
    label: "Aliados",
    orderName: "sponsorsSectionOrder",
    eyebrowName: "sponsorsSectionEyebrow",
    titleName: "sponsorsSectionTitle",
    descriptionName: "sponsorsSectionDescription"
  },
  {
    key: "newsSection",
    label: "Noticias",
    orderName: "newsSectionOrder",
    eyebrowName: "newsSectionEyebrow",
    titleName: "newsSectionTitle",
    descriptionName: "newsSectionDescription"
  },
  {
    key: "alumniNewsSection",
    label: "Noticias Alumni",
    orderName: "alumniNewsSectionOrder",
    eyebrowName: "alumniNewsSectionEyebrow",
    titleName: "alumniNewsSectionTitle",
    descriptionName: "alumniNewsSectionDescription"
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
  },
  {
    key: "identitySection",
    label: "Identidad",
    orderName: "identitySectionOrder",
    eyebrowName: "identitySectionEyebrow",
    titleName: "identitySectionTitle",
    descriptionName: "identitySectionDescription"
  },
  {
    key: "honorSection",
    label: "Alumni",
    orderName: "honorSectionOrder",
    eyebrowName: "honorSectionEyebrow",
    titleName: "honorSectionTitle",
    descriptionName: "honorSectionDescription"
  },
  {
    key: "productsSection",
    label: "TienDIIta",
    orderName: "productsSectionOrder",
    eyebrowName: "productsSectionEyebrow",
    titleName: "productsSectionTitle",
    descriptionName: "productsSectionDescription"
  },
  {
    key: "eventsSection",
    label: "Eventos",
    orderName: "eventsSectionOrder",
    eyebrowName: "eventsSectionEyebrow",
    titleName: "eventsSectionTitle",
    descriptionName: "eventsSectionDescription"
  },
  {
    key: "participationSection",
    label: "Participa",
    orderName: "participationSectionOrder",
    eyebrowName: "participationSectionEyebrow",
    titleName: "participationSectionTitle",
    descriptionName: "participationSectionDescription"
  }
] as const;

export function SiteConfigForm({ config }: { config: SiteConfigShape }) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [heroVideoUrl, setHeroVideoUrl] = useState(config.heroVideoUrl || "");
  const [heroVideoEnabled, setHeroVideoEnabled] = useState(config.heroVideoEnabled);

  function isValidHeroVideoUrl(value: string) {
    const normalized = value.trim();
    if (!normalized) {
      return true;
    }

    if (getYouTubeEmbedUrl(normalized)) {
      return true;
    }

    if (normalized.startsWith("/")) {
      return /\.(mp4|webm|mov)(?:\?.*)?$/i.test(normalized);
    }

    try {
      const url = new URL(normalized);
      return url.protocol === "https:" && /\.(mp4|webm|mov)$/i.test(url.pathname);
    } catch {
      return false;
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    const formData = new FormData(event.currentTarget);
    const normalizedHeroVideoUrl = heroVideoUrl.trim();
    const normalizedPopupVideoUrl = String(formData.get("homePopupVideoUrl") || "").trim();

    if (heroVideoEnabled && !isValidHeroVideoUrl(normalizedHeroVideoUrl)) {
      setError("La URL del video debe ser un .mp4, .webm, .mov HTTPS/local o un enlace válido de YouTube.");
      setLoading(false);
      return;
    }

    if (normalizedPopupVideoUrl && !isValidHeroVideoUrl(normalizedPopupVideoUrl)) {
      setError("La URL del video del pop-up debe ser un .mp4, .webm, .mov HTTPS/local o un enlace válido de YouTube.");
      setLoading(false);
      return;
    }

    const payload = {
      logoUrl: formData.get("logoUrl"),
      showPodcastSection: formData.get("showPodcastSection") === "on",
      showHeroSection: formData.get("showHeroSection") === "on",
      showFeaturedClips: formData.get("showFeaturedClips") === "on",
      showLatestEpisodes: formData.get("showLatestEpisodes") === "on",
      showSponsorsSection: formData.get("showSponsorsSection") === "on",
      showNewsSection: formData.get("showNewsSection") === "on",
      showAlumniNewsSection: formData.get("showAlumniNewsSection") === "on",
      showRecommendedSection: false,
      showGuestsSection: formData.get("showGuestsSection") === "on",
      showIdentitySection: formData.get("showIdentitySection") === "on",
      showHonorSection: formData.get("showHonorSection") === "on",
      showProductsSection: formData.get("showProductsSection") === "on",
      showEventsSection: formData.get("showEventsSection") === "on",
      showParticipationSection: formData.get("showParticipationSection") === "on",
      showCommunityLink: formData.get("showCommunityLink") === "on",
      showContactLink: formData.get("showContactLink") === "on",
      showThemeToggle: formData.get("showThemeToggle") === "on",
      showDonationsSection: formData.get("showDonationsSection") === "on",
      showHomePopup: formData.get("showHomePopup") === "on",
      homePopupTitle: formData.get("homePopupTitle"),
      homePopupBody: formData.get("homePopupBody"),
      homePopupButtonLabel: formData.get("homePopupButtonLabel"),
      homePopupButtonHref: formData.get("homePopupButtonHref"),
      homePopupImageUrl: formData.get("homePopupImageUrl"),
      homePopupVideoUrl: normalizedPopupVideoUrl,
      homePopupPlacement: formData.get("homePopupPlacement"),
      homePopupMode: formData.get("homePopupMode"),
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
      heroImageUrl: formData.get("heroImageUrl"),
      heroVideoUrl: normalizedHeroVideoUrl,
      heroVideoPosterUrl: formData.get("heroVideoPosterUrl"),
      heroVideoEnabled,
      heroOrder: formData.get("heroOrder"),
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
      newsSectionEyebrow: formData.get("newsSectionEyebrow"),
      newsSectionTitle: formData.get("newsSectionTitle"),
      newsSectionDescription: formData.get("newsSectionDescription"),
      newsSectionOrder: formData.get("newsSectionOrder"),
      alumniNewsSectionEyebrow: formData.get("alumniNewsSectionEyebrow"),
      alumniNewsSectionTitle: formData.get("alumniNewsSectionTitle"),
      alumniNewsSectionDescription: formData.get("alumniNewsSectionDescription"),
      alumniNewsSectionOrder: formData.get("alumniNewsSectionOrder"),
      donationsSectionEyebrow: formData.get("donationsSectionEyebrow"),
      donationsSectionTitle: formData.get("donationsSectionTitle"),
      donationsSectionDescription: formData.get("donationsSectionDescription"),
      donationsSectionOrder: formData.get("donationsSectionOrder"),
      donationUrl: formData.get("donationUrl"),
      guestsSectionEyebrow: formData.get("guestsSectionEyebrow"),
      guestsSectionTitle: formData.get("guestsSectionTitle"),
      guestsSectionDescription: formData.get("guestsSectionDescription"),
      guestsSectionOrder: formData.get("guestsSectionOrder"),
      identitySectionEyebrow: formData.get("identitySectionEyebrow"),
      identitySectionTitle: formData.get("identitySectionTitle"),
      identitySectionDescription: formData.get("identitySectionDescription"),
      identitySectionOrder: formData.get("identitySectionOrder"),
      honorSectionEyebrow: formData.get("honorSectionEyebrow"),
      honorSectionTitle: formData.get("honorSectionTitle"),
      honorSectionDescription: formData.get("honorSectionDescription"),
      honorSectionOrder: formData.get("honorSectionOrder"),
      productsSectionEyebrow: formData.get("productsSectionEyebrow"),
      productsSectionTitle: formData.get("productsSectionTitle"),
      productsSectionDescription: formData.get("productsSectionDescription"),
      productsSectionOrder: formData.get("productsSectionOrder"),
      productQuoteEmail: formData.get("productQuoteEmail"),
      eventsSectionEyebrow: formData.get("eventsSectionEyebrow"),
      eventsSectionTitle: formData.get("eventsSectionTitle"),
      eventsSectionDescription: formData.get("eventsSectionDescription"),
      eventsSectionOrder: formData.get("eventsSectionOrder"),
      participationSectionEyebrow: formData.get("participationSectionEyebrow"),
      participationSectionTitle: formData.get("participationSectionTitle"),
      participationSectionDescription: formData.get("participationSectionDescription"),
      participationSectionOrder: formData.get("participationSectionOrder"),
      contactPageEyebrow: formData.get("contactPageEyebrow"),
      contactPageTitle: formData.get("contactPageTitle"),
      contactPageDescription: formData.get("contactPageDescription"),
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
    };

    setLoading(true);
    setSuccess("");

    const response = await fetch("/api/admin/site-config", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const body = await response.json().catch(() => ({}));

    if (!response.ok) {
      setError(body.error || "No se pudo guardar la configuracion.");
      setLoading(false);
      return;
    }

    setSuccess("Cambios guardados.");
    setLoading(false);
  }

  const toggles = [
    { name: "showPodcastSection", label: "Mostrar Podcast", defaultChecked: config.showPodcastSection },
    { name: "showHeroSection", label: "Mostrar bienvenida", defaultChecked: config.showHeroSection },
    { name: "showFeaturedClips", label: "Mostrar shorts destacados", defaultChecked: config.showFeaturedClips },
    { name: "showLatestEpisodes", label: "Mostrar últimos episodios", defaultChecked: config.showLatestEpisodes },
    { name: "showSponsorsSection", label: "Mostrar sección aliados", defaultChecked: config.showSponsorsSection },
    { name: "showNewsSection", label: "Mostrar Noticias", defaultChecked: config.showNewsSection },
    { name: "showAlumniNewsSection", label: "Mostrar Noticias Alumni", defaultChecked: config.showAlumniNewsSection },
    { name: "showDonationsSection", label: "Mostrar Donaciones", defaultChecked: config.showDonationsSection },
    { name: "showGuestsSection", label: "Mostrar sección invitados", defaultChecked: config.showGuestsSection },
    { name: "showIdentitySection", label: "Mostrar identidad", defaultChecked: config.showIdentitySection },
    { name: "showHonorSection", label: "Mostrar Alumni", defaultChecked: config.showHonorSection },
    { name: "showProductsSection", label: "Mostrar TienDIIta", defaultChecked: config.showProductsSection },
    { name: "showEventsSection", label: "Mostrar Eventos", defaultChecked: config.showEventsSection },
    { name: "showParticipationSection", label: "Mostrar participa", defaultChecked: config.showParticipationSection },
    { name: "showCommunityLink", label: "Mostrar Comunidad en footer", defaultChecked: config.showCommunityLink },
    { name: "showContactLink", label: "Mostrar Contacto en barra superior", defaultChecked: config.showContactLink },
    { name: "showThemeToggle", label: "Permitir cambio modo claro/oscuro", defaultChecked: config.showThemeToggle }
  ];

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="space-y-4 rounded-3xl border border-[color:var(--line)] p-5">
        <div>
          <p className="pill">Pop-up inicio</p>
          <h3 className="mt-3 text-2xl font-black">Aviso emergente editable</h3>
          <p className="mt-2 text-sm text-[color:var(--muted)]">
            Elige si aparece como pop-up al entrar al inicio o como ventana lateral visible en todo el sitio hasta que se cierre.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-[220px_1fr]">
          <label className="card flex items-center gap-3 p-4 text-sm font-medium">
            <input defaultChecked={config.showHomePopup} name="showHomePopup" type="checkbox" />
            Mostrar aviso
          </label>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold">Tipo de aviso</label>
              <select className="field" name="homePopupMode" defaultValue={config.homePopupMode || "modal"}>
                <option value="modal">Pop-up de inicio</option>
                <option value="side-panel">Ventana lateral en todo el sitio</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold">Ubicación / formato del pop-up</label>
              <select className="field" name="homePopupPlacement" defaultValue={config.homePopupPlacement || "center"}>
                <option value="center">Centro</option>
                <option value="fullscreen">Pantalla completa</option>
                <option value="right">Costado derecho</option>
                <option value="left">Costado izquierdo</option>
                <option value="top">Arriba</option>
                <option value="bottom">Abajo</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold">Título</label>
          <input className="field" name="homePopupTitle" defaultValue={config.homePopupTitle || ""} placeholder="¡Ayúdanos a elegir nuestra mascota!" />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold">Texto</label>
          <textarea
            className="field min-h-32"
            name="homePopupBody"
            defaultValue={config.homePopupBody || ""}
            placeholder="Escribe el contenido del aviso. Si pegas URLs completas, se mostrarán como links."
          />
        </div>

        <UploadField
          name="homePopupImageUrl"
          label="Imagen del pop-up"
          defaultValue={config.homePopupImageUrl || ""}
          accept="image/*"
          uploadLabel="Subir imagen"
          urlPlaceholder="URL de imagen"
          hint="Opcional. Se muestra dentro del aviso, sobre el texto. Útil para figuras o afiches."
        />

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold">Texto botón</label>
            <input className="field" name="homePopupButtonLabel" defaultValue={config.homePopupButtonLabel || ""} placeholder="Vota aquí" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold">Link botón</label>
            <input className="field" name="homePopupButtonHref" defaultValue={config.homePopupButtonHref || ""} placeholder="https://..." />
          </div>
        </div>

        <UploadField
          name="homePopupVideoUrl"
          label="Video del pop-up"
          defaultValue={config.homePopupVideoUrl || ""}
          accept="video/mp4"
          uploadLabel="Subir video .mp4"
          urlPlaceholder="URL .mp4 o link de YouTube"
          hint="Opcional. Si lo completas, se muestra un reproductor dentro del pop-up."
        />
      </div>

      <div className="space-y-4 rounded-3xl border border-[color:var(--line)] p-5">
        <div>
          <p className="pill">Video visible del inicio</p>
          <h3 className="mt-3 text-2xl font-black">Subir u ocultar video</h3>
          <p className="mt-2 text-sm text-[color:var(--muted)]">
            Este video aparece dentro del panel principal de la portada. No se usa como fondo.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-[220px_1fr]">
          <label className="card flex items-center gap-3 p-4 text-sm font-medium">
            <input checked={heroVideoEnabled} name="heroVideoEnabled" type="checkbox" onChange={(event) => setHeroVideoEnabled(event.target.checked)} />
            Mostrar video en inicio
          </label>
          <UploadField
            name="heroVideoUrl"
            label="Video del inicio"
            value={heroVideoUrl}
            onValueChange={setHeroVideoUrl}
            accept="video/mp4"
            uploadLabel="Subir video .mp4"
            urlPlaceholder="URL .mp4 o link de YouTube"
            hint="Puedes subir un archivo .mp4, pegar una URL pública .mp4 o usar un link de YouTube. Desactiva el checkbox para ocultarlo."
          />
          <div className="md:col-start-2">
            <UploadField
              name="heroVideoPosterUrl"
              label="Portada del video"
              defaultValue={config.heroVideoPosterUrl || ""}
              accept="image/*"
              uploadLabel="Subir portada"
              urlPlaceholder="URL de imagen para la portada"
              hint="Opcional. Se usa como imagen inicial del video. Para YouTube aparece como portada clickeable antes de reproducir."
            />
          </div>
        </div>
      </div>

      <UploadField
        name="logoUrl"
        label="Logo del podcast"
        defaultValue={config.logoUrl || ""}
        accept="image/*"
        uploadLabel="Subir logo"
        urlPlaceholder="https://... o URL del logo subido"
      />

      <div className="space-y-3">
        <div>
          <p className="pill">Barra superior</p>
          <h3 className="mt-3 text-2xl font-black">Ocultar enlaces del menú</h3>
        </div>
      <div className="grid gap-3 md:grid-cols-2">
        {toggles.map((toggle) => (
          <label key={toggle.name} className="card flex items-center gap-3 p-4 text-sm">
            <input defaultChecked={toggle.defaultChecked} name={toggle.name} type="checkbox" />
            {toggle.label}
          </label>
        ))}
      </div>
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

        <div className="grid gap-4 md:grid-cols-[120px_1fr]">
          <div>
            <label className="mb-2 block text-sm font-semibold">Orden</label>
            <input className="field" name="heroOrder" type="number" defaultValue={config.heroOrder} />
          </div>
          <UploadField
            name="heroImageUrl"
            label="Imagen o fondo de bienvenida"
            defaultValue={config.heroImageUrl || ""}
            accept="image/*"
            uploadLabel="Subir imagen"
            urlPlaceholder="https://... o URL de imagen subida"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold">Título principal</label>
            <input className="field" name="heroTitle" defaultValue={config.heroTitle || ""} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold">Texto destacado del título</label>
            <input className="field" name="heroTitleAccent" defaultValue={config.heroTitleAccent || ""} />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold">Descripción del panel principal</label>
          <textarea className="field min-h-28" name="heroDescription" defaultValue={config.heroDescription || ""} />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold">Boton principal</label>
            <input className="field" name="heroPrimaryCtaLabel" defaultValue={config.heroPrimaryCtaLabel || ""} placeholder="Texto del botón" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold">URL botón principal</label>
            <input className="field" name="heroPrimaryCtaHref" defaultValue={config.heroPrimaryCtaHref || ""} placeholder="/episodes" />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold">Boton secundario</label>
            <input className="field" name="heroSecondaryCtaLabel" defaultValue={config.heroSecondaryCtaLabel || ""} placeholder="Texto del botón" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold">URL botón secundario</label>
            <input className="field" name="heroSecondaryCtaHref" defaultValue={config.heroSecondaryCtaHref || ""} placeholder="/community" />
          </div>
        </div>
      </div>

      <div className="space-y-4 rounded-3xl border border-[color:var(--line)] p-5">
        <div>
          <p className="pill">Home</p>
          <h3 className="mt-3 text-2xl font-black">Orden y textos de secciones</h3>
          <p className="mt-2 text-sm text-[color:var(--muted)]">Puedes cambiar el orden en que aparecen y editar sus títulos y descripciones.</p>
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
                  <label className="mb-2 block text-sm font-semibold">Título</label>
                  <input className="field" name={section.titleName} defaultValue={config[section.titleName] || ""} />
                </div>
              </div>
              <div className="mt-4">
                <label className="mb-2 block text-sm font-semibold">Descripción</label>
                <textarea className="field min-h-24" name={section.descriptionName} defaultValue={config[section.descriptionName] || ""} />
              </div>
            </div>
          ))}
          <div className="rounded-2xl border border-[color:var(--line)] p-4">
            <label className="mb-2 block text-sm font-semibold">Correo para cotizaciones TienDIIta</label>
            <input className="field" name="productQuoteEmail" type="email" defaultValue={config.productQuoteEmail || ""} placeholder="cotizaciones@industrialconj.cl" />
            <p className="mt-2 text-xs text-[color:var(--muted)]">Destino de las solicitudes enviadas desde el carrito de cotización.</p>
          </div>
        </div>
      </div>

      <div className="space-y-4 rounded-3xl border border-[color:var(--line)] p-5">
        <div>
          <p className="pill">Páginas públicas</p>
          <h3 className="mt-3 text-2xl font-black">Textos editables</h3>
          <p className="mt-2 text-sm text-[color:var(--muted)]">Estos textos controlan comunidad, donaciones, archivo, invitados, aliados y footer.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-semibold">Episodios eyebrow</label>
            <input className="field" name="episodesPageEyebrow" defaultValue={config.episodesPageEyebrow || ""} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold">Episodios título</label>
            <input className="field" name="episodesPageTitle" defaultValue={config.episodesPageTitle || ""} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold">Episodios descripción</label>
            <textarea className="field min-h-24" name="episodesPageDescription" defaultValue={config.episodesPageDescription || ""} />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-semibold">Invitados eyebrow</label>
            <input className="field" name="guestsPageEyebrow" defaultValue={config.guestsPageEyebrow || ""} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold">Invitados título</label>
            <input className="field" name="guestsPageTitle" defaultValue={config.guestsPageTitle || ""} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold">Invitados descripción</label>
            <textarea className="field min-h-24" name="guestsPageDescription" defaultValue={config.guestsPageDescription || ""} />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-semibold">Aliados eyebrow</label>
            <input className="field" name="sponsorsPageEyebrow" defaultValue={config.sponsorsPageEyebrow || ""} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold">Aliados título</label>
            <input className="field" name="sponsorsPageTitle" defaultValue={config.sponsorsPageTitle || ""} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold">Aliados descripción</label>
            <textarea className="field min-h-24" name="sponsorsPageDescription" defaultValue={config.sponsorsPageDescription || ""} />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-semibold">Contacto eyebrow</label>
            <input className="field" name="contactPageEyebrow" defaultValue={config.contactPageEyebrow || ""} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold">Contacto título</label>
            <input className="field" name="contactPageTitle" defaultValue={config.contactPageTitle || ""} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold">Contacto descripción</label>
            <textarea className="field min-h-24" name="contactPageDescription" defaultValue={config.contactPageDescription || ""} />
          </div>
        </div>

        <div className="rounded-2xl border border-[color:var(--line)] p-4">
          <h4 className="text-lg font-bold">Comunidad</h4>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <input className="field" name="communityPageEyebrow" defaultValue={config.communityPageEyebrow || ""} placeholder="Eyebrow" />
            <input className="field" name="communityPageTitle" defaultValue={config.communityPageTitle || ""} placeholder="Título" />
            <textarea className="field min-h-24 md:col-span-2" name="communityPageDescription" defaultValue={config.communityPageDescription || ""} placeholder="Descripción principal" />
            <input className="field" name="communityEmptyTitle" defaultValue={config.communityEmptyTitle || ""} placeholder="Título sin encuestas" />
            <input className="field" name="communityEmptyDescription" defaultValue={config.communityEmptyDescription || ""} placeholder="Descripción sin encuestas" />
            <input className="field" name="communityContactTitle" defaultValue={config.communityContactTitle || ""} placeholder="Título formulario contacto" />
            <input className="field" name="communityContactSubmitLabel" defaultValue={config.communityContactSubmitLabel || ""} placeholder="Texto botón contacto" />
            <textarea className="field min-h-24 md:col-span-2" name="communityContactDescription" defaultValue={config.communityContactDescription || ""} placeholder="Descripción formulario contacto" />
          </div>
        </div>

        <div className="rounded-2xl border border-[color:var(--line)] p-4">
          <h4 className="text-lg font-bold">Donaciones</h4>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <input className="field" name="donationsContactTitle" defaultValue={config.donationsContactTitle || ""} placeholder="Título formulario donaciones" />
            <input className="field" name="donationsContactSubmitLabel" defaultValue={config.donationsContactSubmitLabel || ""} placeholder="Texto botón donaciones" />
            <textarea className="field min-h-24 md:col-span-2" name="donationsContactDescription" defaultValue={config.donationsContactDescription || ""} placeholder="Descripción formulario donaciones" />
          </div>
        </div>

        <div className="rounded-2xl border border-[color:var(--line)] p-4">
          <h4 className="text-lg font-bold">Footer</h4>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <input className="field" name="footerTitle" defaultValue={config.footerTitle || ""} placeholder="Título footer" />
            <textarea className="field min-h-24" name="footerDescription" defaultValue={config.footerDescription || ""} placeholder="Descripción footer" />
          </div>
        </div>
      </div>

      {error ? <p className="text-sm text-red-500">{error}</p> : null}
      {success ? <p className="text-sm font-semibold text-[color:var(--accent)]">{success}</p> : null}

      <button className="btn-primary" type="submit" disabled={loading}>
        {loading ? "Guardando..." : "Guardar portada"}
      </button>
    </form>
  );
}
