import Link from "next/link";
import { Building2, CalendarDays, Search, Tag, X } from "lucide-react";
import { getAllGuests, getSiteConfig } from "@/lib/queries";
import { GuestCard } from "@/components/ui/guest-card";
import { EmptyState } from "@/components/ui/empty-state";

const tabs = [
  { href: "/podcast?tab=episodes", label: "Episodios" },
  { href: "/podcast?tab=guests", label: "Invitados" },
  { href: "/podcast?tab=community", label: "Comunidad" },
  { href: "/podcast?tab=sponsors", label: "Aliados" }
];

function isFeaturedGuest(guest: { socialLinks: unknown }) {
  const links = (guest.socialLinks ?? {}) as Record<string, unknown>;
  return links.isFeatured === true || links.isFeatured === "true" || links.isFeatured === "on" || links.isFeatured === "1";
}

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
  const selectedFeatured = filtered.filter(isFeaturedGuest);
  const featured = selectedFeatured.slice(0, 2);
  const rest = filtered.filter((guest) => !featured.some((item) => item.id === guest.id));

  return (
    <main className="dark bg-[#111312] text-white">
      <div className="shell space-y-3 py-9">
      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
        <div>
          <p className="brand-kicker text-xs text-[color:var(--muted)]">{(config.guestsPageEyebrow || "INVITADOS").toUpperCase()}</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-black sm:text-5xl">Voces de la comunidad industrial</h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-[color:var(--muted)]">
            Conoce a las personas que dan vida a las conversaciones de Industrial con J: sus historias, trayectorias, aprendizajes y miradas sobre la ingeniería, la universidad y el mundo profesional.
          </p>
        </div>
      </section>

      <nav className="inline-flex max-w-full flex-wrap gap-1 rounded-xl border border-white/10 bg-white/[0.04] p-1">
        {tabs.map((tab) => (
          <Link key={tab.href} href={tab.href} className={`rounded-lg px-4 py-2 text-sm font-semibold ${tab.label === "Invitados" ? "bg-[color:var(--accent)] text-white" : "text-white/75 hover:bg-white/10"}`}>
            {tab.label}
          </Link>
        ))}
      </nav>

      <form className="-mt-2 grid gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3 lg:grid-cols-[1fr_220px_170px_auto_auto]">
        <label className="relative block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--muted)]" size={18} />
          <input className="field pl-11" name="q" placeholder="Buscar invitados por nombre, empresa o tema" defaultValue={params.q || ""} />
        </label>
        <label className="relative block">
          <Building2 className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--muted)]" size={16} />
          <select className="field pl-11" name="industry" defaultValue={industry}>
          <option value="">Industria</option>
          {industries.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label className="relative block">
          <CalendarDays className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--muted)]" size={16} />
          <select className="field pl-11" name="year" defaultValue={params.year || ""}>
          <option value="">Año</option>
          {["2026", "2025", "2024"].map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <button className="btn-primary" type="submit">Filtrar</button>
        <Link href="/guests" className="btn-secondary gap-2"><X size={16} />Limpiar</Link>
      </form>

      {filtered.length === 0 ? (
        <EmptyState title="Todavía no hay invitados" description="Pronto aparecerán nuevas voces de la comunidad industrial." />
      ) : (
        <>
          {featured.length ? (
          <section className="-mt-1 grid gap-4 lg:grid-cols-2">
            {featured.map((guest) => (
              <article key={guest.slug} className="grid overflow-hidden rounded-xl border border-[color:var(--accent)]/50 bg-[radial-gradient(circle_at_18%_0%,rgba(226,33,28,0.16),transparent_32%),rgba(255,255,255,0.06)] shadow-[0_0_34px_rgba(226,33,28,0.12)] md:grid-cols-[0.82fr_1fr]">
                <div className="relative min-h-72 bg-[#242424]">
                  {guest.profileImage ? (
                    <img src={guest.profileImage} alt={guest.name} className="h-full min-h-72 w-full object-cover" style={{ objectPosition: `${guest.profilePositionX || "center"} ${guest.profilePositionY || "center"}` }} />
                  ) : null}
                  <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full border border-[color:var(--accent)]/60 bg-black/45 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-[color:var(--accent)] backdrop-blur">
                    <Tag size={12} />Destacado
                  </span>
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-black">{guest.name}</h2>
                  <p className="mt-2 text-sm font-semibold text-white/70">{[guest.role, guest.company].filter(Boolean).join(" · ") || "Invitado/a"}</p>
                  <p className="mt-4 line-clamp-4 border-t border-white/10 pt-4 text-sm leading-6 text-[color:var(--muted)]">{guest.bio}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {guest.industries.slice(0, 3).map((tag) => <span key={tag} className="pill">{tag}</span>)}
                  </div>
                  <Link href={`/guests/${guest.slug}`} className="btn-secondary mt-6 !border-[color:var(--accent)]/60 !bg-transparent !px-4 !py-2 text-sm text-[color:var(--accent)]">Ver perfil</Link>
                </div>
              </article>
            ))}
          </section>
          ) : null}

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {rest.map((guest) => <GuestCard key={guest.slug} guest={guest} />)}
          </section>
        </>
      )}
      </div>
    </main>
  );
}
