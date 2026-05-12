import { CalendarDays, Handshake, Megaphone, Mic2, Trophy, Users } from "lucide-react";
import { getAllSponsors, getSiteConfig } from "@/lib/queries";

const tiers = ["Todos", "Gold", "Silver", "Media Partner", "Comunidad"];
const impactItems = [
  { title: "Auspicio de episodios", text: "Tu marca presente en episodios que inspiran a miles de oyentes.", icon: Mic2 },
  { title: "Apoyo a eventos", text: "Hacemos posibles encuentros, charlas y actividades de alto impacto.", icon: CalendarDays },
  { title: "Becas y premios", text: "Impulsamos el talento y reconocemos a futuros líderes.", icon: Trophy },
  { title: "Difusión y contenido", text: "Amplificamos tu propósito a través de nuestros canales.", icon: Megaphone }
];

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

        <div className="grid gap-4 lg:grid-cols-[1fr_0.55fr]">
          <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-3">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {sponsors.map((sponsor, index) => (
                <a key={sponsor.id} href={sponsor.websiteUrl} target="_blank" rel="noreferrer" className={`rounded-xl border bg-white/[0.035] p-3 transition hover:border-[color:var(--accent)] ${index === 0 ? "border-yellow-400/50 shadow-[0_0_22px_rgba(250,204,21,0.12)]" : "border-white/10"}`}>
                  <div className="flex h-20 items-center justify-center rounded-lg bg-white p-4">
                    {sponsor.logoUrl ? <img src={sponsor.logoUrl} alt={sponsor.name} className="max-h-full w-full object-contain" /> : <Handshake className="text-[color:var(--accent)]" size={32} />}
                  </div>
                  <h2 className="mt-3 text-base font-black">{sponsor.name}</h2>
                  <p className="mt-1 inline-flex items-center gap-2 text-xs text-white/70">
                    <span className={`h-2 w-2 rounded-full ${tierColor(sponsor.tier)}`} />
                    {sponsor.tier || "Aliado"}
                  </p>
                </a>
              ))}
            </div>
          </section>

          <aside className="rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_85%_0%,rgba(226,33,28,0.26),transparent_34%),rgba(255,255,255,0.04)] p-7">
            <h2 className="text-2xl font-black">¿Cómo impulsan esta comunidad?</h2>
            <div className="mt-5 divide-y divide-white/10">
              {impactItems.map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.title} className="flex gap-4 py-4">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-white/10 text-[color:var(--accent)]">
                      <Icon size={21} />
                    </span>
                    <div>
                      <h3 className="font-bold">{item.title}</h3>
                      <p className="mt-1 text-sm leading-5 text-[color:var(--muted)]">{item.text}</p>
                    </div>
                  </article>
                );
              })}
            </div>
            <a href="/contact" className="btn-primary mt-5 w-full justify-between">
              Quiero ser aliado
              <Handshake size={18} />
            </a>
          </aside>
        </div>

        <section className="grid gap-4 rounded-xl border border-white/10 bg-white/[0.035] p-5 md:grid-cols-3">
          <div className="flex items-center gap-4"><Users className="text-[color:var(--accent)]" /><strong className="text-2xl">+{sponsors.length}</strong><span className="text-sm text-[color:var(--muted)]">aliados</span></div>
          <div className="flex items-center gap-4"><Mic2 className="text-[color:var(--accent)]" /><strong className="text-2xl">+30</strong><span className="text-sm text-[color:var(--muted)]">episodios impulsados</span></div>
          <div className="flex items-center gap-4"><CalendarDays className="text-[color:var(--accent)]" /><strong className="text-2xl">+8</strong><span className="text-sm text-[color:var(--muted)]">actividades apoyadas</span></div>
        </section>
      </div>
    </main>
  );
}
