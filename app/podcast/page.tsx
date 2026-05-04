import Link from "next/link";
import { getAllEpisodes, getAllGuests, getAllSponsors, getSiteConfig } from "@/lib/queries";
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

  return (
    <main className="shell space-y-8 py-10">
      <SectionHeading
        eyebrow="Podcast"
        title={siteConfig.episodesPageTitle || "Industrial con J"}
        description={siteConfig.episodesPageDescription || "Episodios, invitados, comunidad y sponsors en una sola seccion."}
      />

      <nav className="flex flex-wrap gap-2 rounded-2xl border border-[color:var(--line)] p-2">
        {tabs.map((tab) => (
          <Link key={tab.id} href={`/podcast?tab=${tab.id}`} className={activeTab === tab.id ? "btn-primary !px-4 !py-2 text-sm" : "btn-secondary !px-4 !py-2 text-sm"}>
            {tab.label}
          </Link>
        ))}
      </nav>

      {activeTab === "episodes" ? (
        <section className="space-y-6">
          {episodes.length === 0 ? (
            <p className="card p-6 text-sm text-[color:var(--muted)]">Aun no hay episodios publicados.</p>
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
        <section className="card p-8">
          <h2 className="text-3xl font-black">{siteConfig.communityPageTitle || "Comunidad"}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[color:var(--muted)]">
            {siteConfig.communityPageDescription || "Participa en preguntas, encuestas y contacto con el equipo."}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/community" className="btn-primary">Ir a comunidad</Link>
            <Link href="/contact" className="btn-secondary">Contactar</Link>
          </div>
        </section>
      ) : null}

      {activeTab === "sponsors" ? <SponsorGrid sponsors={sponsors} /> : null}
    </main>
  );
}
