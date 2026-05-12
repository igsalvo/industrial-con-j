import Link from "next/link";
import { notFound } from "next/navigation";
import { ContactForm } from "@/components/forms/contact-form";
import { PublicSurveyForm } from "@/components/forms/public-survey-form";
import { getAllEpisodes, getAllGuests, getAllSponsors, getSiteConfig, hasDatabase } from "@/lib/queries";
import { prisma } from "@/lib/prisma";
import { getYouTubeEmbedUrl } from "@/lib/youtube";
import { EpisodeCard } from "@/components/ui/episode-card";
import { GuestCard } from "@/components/ui/guest-card";
import { SponsorGrid } from "@/components/ui/sponsor-grid";
import { SectionHeading } from "@/components/sections/section-heading";
import { Lightbulb, Mic2, MessageCircle, Star } from "lucide-react";

const tabs = [
  { id: "episodes", label: "Episodios" },
  { id: "guests", label: "Invitados" },
  { id: "community", label: "Comunidad" },
  { id: "sponsors", label: "Aliados" }
] as const;

function isFeaturedGuest(guest: { socialLinks: unknown }) {
  const links = (guest.socialLinks ?? {}) as Record<string, unknown>;
  return links.isFeatured === true || links.isFeatured === "true" || links.isFeatured === "on" || links.isFeatured === "1";
}

export default async function PodcastPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const params = await searchParams;
  const activeTab = tabs.some((tab) => tab.id === params.tab) ? params.tab : "episodes";
  const [episodes, guests, sponsors, siteConfig] = await Promise.all([getAllEpisodes(), getAllGuests(), getAllSponsors(), getSiteConfig()]);
  const surveys =
    activeTab === "community" && hasDatabase()
      ? await prisma.survey.findMany({
          where: { status: "PUBLISHED" },
          include: {
            episode: true,
            questions: {
              orderBy: { position: "asc" }
            }
          },
          orderBy: { updatedAt: "desc" }
        })
      : [];
  if (!siteConfig.showPodcastSection) {
    notFound();
  }
  const headings = {
    episodes: {
      eyebrow: siteConfig.episodesPageEyebrow || "Archivo",
      title: siteConfig.episodesPageTitle || "Todos los episodios",
      description:
        siteConfig.episodesPageDescription ||
        "Explora el catálogo completo con lecturas limpias, links externos y relación entre invitados, tags e industrias."
    },
    guests: {
      eyebrow: siteConfig.guestsPageEyebrow || "Invitados",
      title: siteConfig.guestsPageTitle || "Personas que construyen industria",
      description: siteConfig.guestsPageDescription || "Perfiles, empresas, enlaces sociales y episodios donde participan."
    },
    community: {
      eyebrow: siteConfig.communityPageEyebrow || "Comunidad",
      title: siteConfig.communityPageTitle || "Participa en Industrial con J",
      description:
        siteConfig.communityPageDescription ||
        "Queremos escuchar tus ideas, preguntas y comentarios. Propón temas, recomienda invitados o cuéntanos cómo te gustaría ser parte de esta comunidad."
    },
    sponsors: {
      eyebrow: siteConfig.sponsorsPageEyebrow || "ALIADOS",
      title: siteConfig.sponsorsPageTitle || "Aliados de Industrial con J",
      description: siteConfig.sponsorsPageDescription || "Organizaciones que impulsan esta comunidad de conversaciones, eventos e iniciativas en torno a la Ingeniería Industrial."
    }
  } as const;
  const heading = headings[activeTab as keyof typeof headings];
  const featuredGuests = guests.filter(isFeaturedGuest);
  const regularGuests = guests.filter((guest) => !featuredGuests.some((featured) => featured.id === guest.id));

  return (
    <main className="shell space-y-8 py-10">
      <SectionHeading
        eyebrow={heading.eyebrow}
        title={heading.title}
        description={heading.description}
      />

      <nav className="flex flex-wrap gap-2 rounded-2xl border border-[color:var(--line)] p-2">
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            href={`/podcast?tab=${tab.id}`}
            className={activeTab === tab.id ? "btn-primary !px-4 !py-2 text-sm" : "btn-secondary !px-4 !py-2 text-sm"}
          >
            {tab.label}
          </Link>
        ))}
      </nav>

      {activeTab === "episodes" ? (
        <section className="space-y-6">
          {episodes.length === 0 ? (
            <p className="card p-6 text-sm text-[color:var(--muted)]">Aún no hay episodios publicados.</p>
          ) : (
            <div className="space-y-8">
              {episodes.map((episode) => {
                const embedUrl = episode.videoEmbedUrl || getYouTubeEmbedUrl(episode.youtubeUrl);
                return (
                  <article key={episode.id} className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="overflow-hidden rounded-[1.5rem] border border-[color:var(--line)] bg-black">
                      {embedUrl ? (
                        <iframe
                          src={embedUrl}
                          title={episode.title}
                          className="aspect-video w-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <div className="flex aspect-video items-center justify-center p-6 text-sm text-white/70">Sin video embebido</div>
                      )}
                    </div>
                    <EpisodeCard episode={episode} />
                  </article>
                );
              })}
            </div>
          )}
        </section>
      ) : null}

      {activeTab === "guests" ? (
        <section className="space-y-6">
          {featuredGuests.length ? (
            <div className="grid gap-6 md:grid-cols-2">
              {featuredGuests.map((guest) => (
                <div key={guest.slug} className="relative rounded-[1.75rem] border border-[color:var(--accent)]/60 bg-[radial-gradient(circle_at_18%_0%,rgba(226,33,28,0.14),transparent_32%),rgba(255,255,255,0.04)] p-1 shadow-[0_0_36px_rgba(226,33,28,0.13)]">
                  <span className="absolute left-5 top-5 z-10 inline-flex items-center gap-1 rounded-full border border-[color:var(--accent)]/60 bg-black/55 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-[color:var(--accent)] backdrop-blur">
                    <Star size={12} />Destacado
                  </span>
                  <GuestCard guest={guest} />
                </div>
              ))}
            </div>
          ) : null}
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {regularGuests.map((guest) => (
              <GuestCard key={guest.slug} guest={guest} />
            ))}
          </div>
        </section>
      ) : null}

      {activeTab === "community" ? (
        <section className="grid gap-8 xl:grid-cols-[0.82fr_1fr_0.95fr]">
          <aside className="card p-6">
            <h2 className="text-2xl font-black">Espacios de participación</h2>
            <div className="mt-5 space-y-4">
              {[
                { title: "Propón un tema", text: "Sugiere un tema que te gustaría que conversemos en el podcast.", icon: Lightbulb },
                { title: "Sugiere un invitado", text: "Recomienda a alguien que aporte valor a nuestra audiencia.", icon: Mic2 },
                { title: "Cuéntanos tu idea", text: "Comparte tu idea, proyecto o iniciativa con la comunidad.", icon: MessageCircle }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.title} className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-strong)] p-4">
                    <div className="mb-3 grid h-10 w-10 place-items-center rounded-full bg-[color:var(--accent-soft)] text-[color:var(--accent)]">
                      <Icon size={18} />
                    </div>
                    <h3 className="font-bold">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">{item.text}</p>
                  </article>
                );
              })}
            </div>
          </aside>

          <div className="space-y-6">
            {surveys.length === 0 ? (
              <div className="card p-8">
                <h2 className="text-2xl font-bold">{siteConfig.communityEmptyTitle || "No hay preguntas activas por ahora"}</h2>
                <p className="text-content mt-3 text-sm text-[color:var(--muted)]">
                  {siteConfig.communityEmptyDescription || "Pronto abriremos nuevos espacios para que puedas compartir tus ideas, preguntas y opiniones con la comunidad."}
                </p>
                <Link href="/podcast?tab=episodes" className="btn-secondary mt-5">
                  Explorar episodios
                </Link>
              </div>
            ) : (
              surveys.map((survey) => (
                <div key={survey.id} className="space-y-3">
                  {survey.episode ? (
                    <p className="text-sm text-[color:var(--muted)]">
                      Capitulo:{" "}
                      <Link href={`/episodes/${survey.episode.slug}`} className="font-semibold text-[color:var(--foreground)]">
                        {survey.episode.title}
                      </Link>
                    </p>
                  ) : null}
                  <PublicSurveyForm survey={survey} />
                </div>
              ))
            )}
          </div>

          <ContactForm
            type="CONTACT"
            title={siteConfig.communityContactTitle || "Queremos escucharte"}
            description={siteConfig.communityContactDescription || "Déjanos tu comentario, idea o propuesta."}
            submitLabel={siteConfig.communityContactSubmitLabel || "Enviar mensaje"}
          />
        </section>
      ) : null}

      {activeTab === "sponsors" ? <SponsorGrid sponsors={sponsors} /> : null}
    </main>
  );
}
