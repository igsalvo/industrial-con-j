import Link from "next/link";
import { getSearchResults } from "@/lib/queries";
import { EmptyState } from "@/components/ui/empty-state";
import { EpisodeCard } from "@/components/ui/episode-card";
import { GuestCard } from "@/components/ui/guest-card";

export default async function SearchPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; guest?: string; tag?: string; industry?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const results = await getSearchResults(resolvedSearchParams);
  const guestFilters = results.filters.guests as Array<{ id: string; slug: string; name: string }>;
  const tags = results.filters.tags as string[];
  const industries = results.filters.industries as string[];
  const episodes = results.episodes as Array<Parameters<typeof EpisodeCard>[0]["episode"]>;
  const guests = results.guests as Array<Parameters<typeof GuestCard>[0]["guest"]>;

  return (
    <section className="shell py-12">
      <div className="card p-8">
        <p className="pill">Busqueda global</p>
        <h1 className="mt-4 text-4xl font-black">Encuentra episodios, invitados y temas</h1>
        <form className="mt-6 grid gap-4 lg:grid-cols-4">
          <input className="field lg:col-span-2" defaultValue={resolvedSearchParams.q} name="q" placeholder="Lean, mantenimiento, mineria..." />
          <select className="field" defaultValue={resolvedSearchParams.guest || ""} name="guest">
            <option value="">Todos los invitados</option>
            {guestFilters.map((guest) => (
              <option key={guest.id} value={guest.slug}>
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
          <button className="btn-primary lg:col-span-4 lg:w-fit" type="submit">
            Filtrar resultados
          </button>
        </form>
      </div>

      <div className="mt-10">
        <h2 className="text-3xl font-black">Episodios</h2>
        <div className="mt-6 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {episodes.length === 0 ? (
            <EmptyState title="Sin coincidencias" description="Prueba otra combinacion de filtros o crea mas contenido desde admin." />
          ) : (
            episodes.map((episode) => <EpisodeCard key={episode.id} episode={episode} />)
          )}
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-3xl font-black">Invitados</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {guests.length === 0 ? (
            <EmptyState title="No encontramos invitados" description="La busqueda tambien cubre biografias y empresas." />
          ) : (
            guests.map((guest) => <GuestCard key={guest.id} guest={guest} />)
          )}
        </div>
      </div>

      <div className="mt-10 card p-8">
        <h2 className="text-2xl font-bold">Exploracion rapida</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link className="btn-secondary" href="/episodes">
            Ver todos los episodios
          </Link>
          <Link className="btn-secondary" href="/guests">
            Ver todos los invitados
          </Link>
          <Link className="btn-secondary" href="/community">
            Ir a comunidad
          </Link>
        </div>
      </div>
    </section>
  );
}
