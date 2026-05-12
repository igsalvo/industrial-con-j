import { CalendarDays, Handshake, Mic2, Users } from "lucide-react";
import { getAllSponsors, getSiteConfig } from "@/lib/queries";

const tiers = ["Todos", "Gold", "Silver", "Media Partner", "Comunidad"];

function tierColor(tier?: string | null) {
  if (tier?.toLowerCase() === "gold") return "bg-yellow-400";
  if (tier?.toLowerCase() === "silver") return "bg-zinc-300";
  if (tier?.toLowerCase() === "media partner") return "bg-purple-400";
  if (tier?.toLowerCase() === "comunidad") return "bg-green-500";
  return "bg-[color:var(--accent)]";
}

export default async function SponsorsPage() {
  const [sponsors, config] = await Promise.all([getAllSponsors(), getSiteConfig()]);

  return (
    <main className="dark bg-[#111312] text-white">
      <div className="shell space-y-6 py-9">
        <section className="max-w-3xl">
          <p className="brand-kicker text-xs text-white/55">{config.sponsorsPageEyebrow || "ALIADOS"}</p>
          <h1 className="mt-3 text-4xl font-black">{config.sponsorsPageTitle || "Aliados de Industrial con J"}</h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-[color:var(--muted)]">
            {config.sponsorsPageDescription || "Organizaciones que hacen posible este podcast, la comunidad y los encuentros que impulsan la Ingeniería Industrial."}
          </p>
        </section>

        <nav className="flex flex-wrap gap-2 rounded-xl border border-white/10 bg-white/[0.04] p-2">
          {tiers.map((tier, index) => (
            <span key={tier} className={`rounded-full px-6 py-3 text-sm font-bold ${index === 0 ? "bg-[color:var(--accent)] text-white" : "border border-white/10 bg-white/[0.04] text-white/80"}`}>
              {tier}
            </span>
          ))}
        </nav>

        <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-3">
          <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {sponsors.map((sponsor) => (
              <a key={sponsor.id} href={sponsor.websiteUrl} target="_blank" rel="noreferrer" className="rounded-xl border border-white/10 bg-white/[0.035] p-3 transition hover:border-[color:var(--accent)]">
                  <div className="flex h-24 items-center justify-center rounded-lg bg-white p-4">
                    {sponsor.logoUrl ? <img src={sponsor.logoUrl} alt={sponsor.name} className="max-h-full w-full object-contain" /> : <Handshake className="text-[color:var(--accent)]" size={32} />}
                  </div>
                  <h2 className="mt-3 text-base font-black">{sponsor.name}</h2>
                  <p className="mt-1 inline-flex items-center gap-2 text-xs text-white/70">
                    <span className={`h-2 w-2 rounded-full ${tierColor(sponsor.tier)}`} />
                    {sponsor.tier || "Aliado"}
                  </p>
                </a>
            ))}
          </section>
        </div>

        <section className="grid gap-4 rounded-xl border border-white/10 bg-white/[0.035] p-5 md:grid-cols-3">
          <div className="flex items-center gap-4"><Users className="text-[color:var(--accent)]" /><strong className="text-2xl">+{sponsors.length}</strong><span className="text-sm text-[color:var(--muted)]">aliados</span></div>
          <div className="flex items-center gap-4"><Mic2 className="text-[color:var(--accent)]" /><strong className="text-2xl">+30</strong><span className="text-sm text-[color:var(--muted)]">episodios impulsados</span></div>
          <div className="flex items-center gap-4"><CalendarDays className="text-[color:var(--accent)]" /><strong className="text-2xl">+8</strong><span className="text-sm text-[color:var(--muted)]">actividades apoyadas</span></div>
        </section>
        <a href="/contact" className="btn-primary w-full justify-between sm:w-fit">
          Quiero ser aliado
          <Handshake size={18} />
        </a>
      </div>
    </main>
  );
}
