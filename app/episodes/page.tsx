import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, Clock3, Headphones, Play, Search } from "lucide-react";
import { getAllEpisodes, getSiteConfig } from "@/lib/queries";
import { EmptyState } from "@/components/ui/empty-state";
import { EpisodeCard } from "@/components/ui/episode-card";
import { formatDate } from "@/lib/utils";

const tabs = [
  { href: "/podcast?tab=episodes", label: "Episodios" },
  { href: "/podcast?tab=guests", label: "Invitados" },
  { href: "/podcast?tab=community", label: "Comunidad" },
  { href: "/podcast?tab=sponsors", label: "Aliados" }
];

export default async function EpisodesPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const params = await searchParams;
  const [episodes, config] = await Promise.all([getAllEpisodes(), getSiteConfig()]);
  if (!config.showPodcastSection) {
    notFound();
  }

  const query = params.q?.trim().toLowerCase() || "";
  const filtered = episodes.filter((episode) =>
    query
      ? `${episode.title} ${episode.shortDescription} ${episode.guests.map((guest) => guest.name).join(" ")} ${episode.tags.join(" ")}`.toLowerCase().includes(query)
      : true
  );
  const featured = filtered.find((episode) => episode.isFeatured) || filtered[0];
  const rest = featured ? filtered.filter((episode) => episode.id !== featured.id) : filtered;
  const featuredImage = featured?.thumbnailUrl || featured?.clipThumbnailUrl || "/logo-podcast.jpg";

  return (
    <main className="shell space-y-8 py-10">
      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
        <div>
          <p className="pill">{config.episodesPageEyebrow || "CONTENIDO"}</p>
          <h1 className="mt-4 text-5xl font-black sm:text-6xl">{config.episodesPageTitle || "Episodios"}</h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-[color:var(--muted)]">
            {config.episodesPageDescription ||
              "Conversaciones con personas de la comunidad industrial sobre trayectorias, aprendizajes, decisiones y desafíos que conectan la ingeniería con el mundo real."}
          </p>
        </div>
        <nav className="flex flex-wrap gap-2 rounded-2xl border border-[color:var(--line)] p-2">
          {tabs.map((tab) => (
            <Link key={tab.href} href={tab.href} className="btn-secondary !px-4 !py-2 text-sm">
              {tab.label}
            </Link>
          ))}
        </nav>
      </section>

      <form className="card grid gap-3 p-4 sm:grid-cols-[1fr_auto]">
        <label className="relative block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--muted)]" size={18} />
          <input className="field pl-11" name="q" placeholder="Buscar episodios, invitados o temas" defaultValue={params.q || ""} />
        </label>
        <button className="btn-primary" type="submit">Buscar</button>
      </form>

      {filtered.length === 0 ? (
        <EmptyState title="Aún no hay episodios publicados" description="Pronto aparecerán nuevas conversaciones de la comunidad industrial." />
      ) : featured ? (
        <>
          <article className="card grid overflow-hidden lg:grid-cols-[1.1fr_0.9fr]">
            <div className="relative min-h-[320px] overflow-hidden bg-[linear-gradient(135deg,#d70904,#2b2b2b)]">
              <img
                src={featuredImage}
                alt={featured.title}
                className="h-full min-h-[320px] w-full object-cover"
                style={{ objectPosition: `${featured.thumbnailPositionX || "center"} ${featured.thumbnailPositionY || "center"}` }}
              />
              <div className="absolute inset-0 bg-black/30" />
              <div className="absolute left-6 top-6 rounded-full border border-white/15 bg-black/45 px-3 py-1 text-xs font-semibold text-white backdrop-blur">Episodio destacado</div>
              <div className="absolute bottom-6 left-6 grid h-16 w-16 place-items-center rounded-full bg-[color:var(--accent)] text-white shadow-[0_0_38px_rgba(226,33,28,0.35)]">
                <Play size={26} fill="currentColor" />
              </div>
            </div>
            <div className="p-7">
              <div className="flex flex-wrap gap-2">
                {featured.tags.slice(0, 3).map((tag) => <span key={tag} className="pill">{tag}</span>)}
              </div>
              <h2 className="mt-5 text-4xl font-black">{featured.title}</h2>
              <p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">{featured.shortDescription}</p>
              <div className="mt-6 grid gap-3 text-sm text-[color:var(--muted)] sm:grid-cols-2">
                <span className="inline-flex items-center gap-2"><CalendarDays size={16} />{formatDate(featured.publishedAt)}</span>
                <span className="inline-flex items-center gap-2"><Clock3 size={16} />Duración por definir</span>
                <span className="inline-flex items-center gap-2 sm:col-span-2"><Headphones size={16} />Video + Audio</span>
              </div>
              <p className="mt-4 text-sm font-semibold">{featured.guests.map((guest) => guest.name).join(", ") || "Invitados por confirmar"}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href={`/episodes/${featured.slug}`} className="btn-primary">Ver episodio</Link>
                {featured.spotifyUrl ? <a href={featured.spotifyUrl} target="_blank" rel="noreferrer" className="btn-secondary">Escuchar ahora</a> : null}
              </div>
            </div>
          </article>

          <section className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {rest.map((episode) => <EpisodeCard key={episode.slug} episode={episode} />)}
          </section>
        </>
      ) : null}
    </main>
  );
}
