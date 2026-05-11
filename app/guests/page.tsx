import Link from "next/link";
import { Search, X } from "lucide-react";
import { getAllGuests, getSiteConfig } from "@/lib/queries";
import { GuestCard } from "@/components/ui/guest-card";
import { EmptyState } from "@/components/ui/empty-state";

const tabs = [
  { href: "/podcast?tab=episodes", label: "Episodios" },
  { href: "/podcast?tab=guests", label: "Invitados" },
  { href: "/podcast?tab=community", label: "Comunidad" },
  { href: "/podcast?tab=sponsors", label: "Aliados" }
];

export default async function GuestsPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; industry?: string; year?: string }>;
}) {
  const params = await searchParams;
  const [guests, config] = await Promise.all([getAllGuests(), getSiteConfig()]);
  const q = params.q?.trim().toLowerCase() || "";
  const industry = params.industry || "";
  const industries = Array.from(new Set(guests.flatMap((guest) => guest.industries))).sort();

  const filtered = guests.filter((guest) => {
    const matchesTerm = q ? `${guest.name} ${guest.company || ""} ${guest.role || ""} ${guest.bio} ${guest.industries.join(" ")}`.toLowerCase().includes(q) : true;
    const matchesIndustry = industry ? guest.industries.includes(industry) : true;
    return matchesTerm && matchesIndustry;
  });
  const featured = filtered.slice(0, 2);
  const rest = filtered.slice(2);

  return (
    <main className="shell space-y-8 py-10">
      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
        <div>
          <p className="pill">{config.guestsPageEyebrow || "INVITADOS"}</p>
          <h1 className="mt-4 text-5xl font-black sm:text-6xl">Voces de la comunidad industrial</h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-[color:var(--muted)]">
            Conoce a las personas que dan vida a las conversaciones de Industrial con J: sus historias, trayectorias, aprendizajes y miradas sobre la ingeniería, la universidad y el mundo profesional.
          </p>
        </div>
        <nav className="flex flex-wrap gap-2 rounded-2xl border border-[color:var(--line)] p-2">
          {tabs.map((tab) => <Link key={tab.href} href={tab.href} className="btn-secondary !px-4 !py-2 text-sm">{tab.label}</Link>)}
        </nav>
      </section>

      <form className="card grid gap-3 p-4 lg:grid-cols-[1fr_220px_160px_auto_auto]">
        <label className="relative block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--muted)]" size={18} />
          <input className="field pl-11" name="q" placeholder="Buscar invitados por nombre, empresa o tema" defaultValue={params.q || ""} />
        </label>
        <select className="field" name="industry" defaultValue={industry}>
          <option value="">Industria</option>
          {industries.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <select className="field" name="year" defaultValue={params.year || ""}>
          <option value="">Año</option>
          {["2026", "2025", "2024"].map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <button className="btn-primary" type="submit">Filtrar</button>
        <Link href="/guests" className="btn-secondary gap-2"><X size={16} />Limpiar</Link>
      </form>

      {filtered.length === 0 ? (
        <EmptyState title="Todavía no hay invitados" description="Pronto aparecerán nuevas voces de la comunidad industrial." />
      ) : (
        <>
          <section className="grid gap-6 lg:grid-cols-2">
            {featured.map((guest) => (
              <article key={guest.slug} className="card grid overflow-hidden md:grid-cols-[0.82fr_1fr]">
                <div className="relative min-h-72 bg-[linear-gradient(135deg,#d70904,#2b2b2b)]">
                  {guest.profileImage ? (
                    <img src={guest.profileImage} alt={guest.name} className="h-full min-h-72 w-full object-cover" style={{ objectPosition: `${guest.profilePositionX || "center"} ${guest.profilePositionY || "center"}` }} />
                  ) : null}
                  <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/45 px-3 py-1 text-xs font-semibold text-white backdrop-blur">Destacado</span>
                </div>
                <div className="p-6">
                  <h2 className="text-3xl font-black">{guest.name}</h2>
                  <p className="mt-2 text-sm font-semibold text-[color:var(--accent)]">{[guest.role, guest.company].filter(Boolean).join(" · ") || "Invitado/a"}</p>
                  <p className="mt-4 line-clamp-5 text-sm leading-7 text-[color:var(--muted)]">{guest.bio}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {guest.industries.slice(0, 3).map((tag) => <span key={tag} className="pill">{tag}</span>)}
                  </div>
                  <Link href={`/guests/${guest.slug}`} className="btn-primary mt-6">Ver perfil</Link>
                </div>
              </article>
            ))}
          </section>

          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {rest.map((guest) => <GuestCard key={guest.slug} guest={guest} />)}
          </section>
        </>
      )}
    </main>
  );
}
