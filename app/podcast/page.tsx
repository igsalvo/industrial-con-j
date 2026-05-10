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

const tabs = [
  { id: "episodes", label: "Episodios" },
  { id: "guests", label: "Invitados" },
  { id: "community", label: "Comunidad" },
  { id: "sponsors", label: "Sponsors" }
] as const;

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
      title: siteConfig.communityPageTitle || "Encuestas, preguntas y contacto",
      description:
        siteConfig.communityPageDescription ||
        "Participa en preguntas generales o asociadas a capítulos específicos. Los comentarios quedan en la bandeja del administrador."
    },
    sponsors: {
      eyebrow: siteConfig.sponsorsPageEyebrow || "Sponsors",
      title: siteConfig.sponsorsPageTitle || "Aliados comerciales del podcast",
      description: siteConfig.sponsorsPageDescription || "Grid de logos, links de salida y sponsor destacado por episodio."
    }
  } as const;
  const heading = headings[activeTab as keyof typeof headings];

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
        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {guests.map((guest) => (
            <GuestCard key={guest.slug} guest={guest} />
          ))}
        </section>
      ) : null}

      {activeTab === "community" ? (
        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            {surveys.length === 0 ? (
              <div className="card p-8">
                <h2 className="text-2xl font-bold">{siteConfig.communityEmptyTitle || "No hay encuestas activas"}</h2>
                <p className="text-content mt-3 text-sm text-[color:var(--muted)]">
                  {siteConfig.communityEmptyDescription || "Publica una encuesta desde el administrador para mostrarla aquí."}
                </p>
                <Link href="/podcast?tab=episodes" className="btn-secondary mt-5">
                  Ver episodios
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
            title={siteConfig.communityContactTitle || "Contáctanos"}
            description={siteConfig.communityContactDescription || "Deja tu comentario e información de contacto para responderte después."}
            submitLabel={siteConfig.communityContactSubmitLabel || "Enviar comentario"}
          />
        </section>
      ) : null}

      {activeTab === "sponsors" ? <SponsorGrid sponsors={sponsors} /> : null}
    </main>
  );
}
