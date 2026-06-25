import Link from "next/link";
import { getSearchResults } from "@/lib/queries";
import { EmptyState } from "@/components/ui/empty-state";
import { EpisodeCard } from "@/components/ui/episode-card";
import { GuestCard } from "@/components/ui/guest-card";
import { TrackedLink, TrackedSubmitButton } from "@/components/analytics/tracked-link";

export default async function SearchPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; guest?: string; tag?: string; industry?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const results = await getSearchResults(resolvedSearchParams);
  const guestFilters = results.filters.guests;
  const tags = results.filters.tags;
  const industries = results.filters.industries;
  const episodes = results.episodes;
  const guests = results.guests;

  return (
    <section className="shell py-8 md:py-12">
      <div className="card p-5 sm:p-8">
        <p className="pill">Busqueda global</p>
        <h1 className="mt-4 text-[clamp(2rem,8vw,2.5rem)] font-black">Encuentra episodios, invitados y temas</h1>
        <form className="mt-6 grid gap-4 lg:grid-cols-4">
          <input className="field lg:col-span-2" defaultValue={resolvedSearchParams.q} name="q" placeholder="Lean, mantenimiento, minería..." />
          <select className="field" defaultValue={resolvedSearchParams.guest || ""} name="guest">
            <option value="">Todos los invitados</option>
            {guestFilters.map((guest) => (
              <option key={guest.slug} value={guest.slug}>
                {guest.name}
              </option>
            ))}
          </select>
          <select className="field" defaultValue={resolvedSearchParams.tag || ""} name="tag">
            <option value="">Todos los temas</option>
            {tags.map((tag: string) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
          <select className="field" defaultValue={resolvedSearchParams.industry || ""} name="industry">
            <option value="">Todas las industrias</option>
            {industries.map((industry: string) => (
              <option key={industry} value={industry}>
                {industry}
              </option>
            ))}
          </select>
          <TrackedSubmitButton
            className="btn-primary w-full lg:col-span-4 lg:w-fit"
            eventName="click_search"
            eventParams={{ link_text: "Filtrar resultados", section: "search_page" }}
          >
            Filtrar resultados
          </TrackedSubmitButton>
        </form>
      </div>

      <div className="mt-10">
        <h2 className="text-3xl font-black">Episodios</h2>
        <div className="mt-6 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {episodes.length === 0 ? (
            <EmptyState title="Sin coincidencias" description="Prueba otra combinación de filtros o crea más contenido desde admin." />
          ) : (
            episodes.map((episode) => <EpisodeCard key={episode.slug} episode={episode} />)
          )}
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-3xl font-black">Invitados</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {guests.length === 0 ? (
            <EmptyState title="No encontramos invitados" description="La búsqueda también cubre biografías y empresas." />
          ) : (
            guests.map((guest) => <GuestCard key={guest.slug} guest={guest} />)
          )}
        </div>
      </div>

      <div className="mt-10 card p-5 sm:p-8">
        <h2 className="text-2xl font-bold">Exploracion rapida</h2>
        <div className="mt-4 grid gap-3 sm:flex sm:flex-wrap">
          <TrackedLink
            className="btn-secondary w-full sm:w-auto"
            href="/episodes"
            eventName="click_episode"
            eventParams={{ link_text: "Ver todos los episodios", content_type: "episode", section: "search_quick_links" }}
          >
            Ver todos los episodios
          </TrackedLink>
          <Link className="btn-secondary w-full sm:w-auto" href="/guests">
            Ver todos los invitados
          </Link>
          <Link className="btn-secondary w-full sm:w-auto" href="/community">
            Ir a comunidad
          </Link>
        </div>
      </div>
    </section>
  );
}
