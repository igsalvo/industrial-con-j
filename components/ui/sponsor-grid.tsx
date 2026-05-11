import { ArrowUpRight, BadgeCheck, Handshake, Mic2, Users, CalendarDays, GraduationCap, FileText } from "lucide-react";

const benefits = [
  { title: "Podcast", text: "Apoyan conversaciones que inspiran e informan.", icon: Mic2 },
  { title: "Eventos", text: "Hacen posibles encuentros y experiencias de valor.", icon: CalendarDays },
  { title: "Comunidad", text: "Fortalecen vínculos y redes de Ingeniería Industrial.", icon: Users },
  { title: "Becas", text: "Impulsan oportunidades para crecer y aprender.", icon: GraduationCap },
  { title: "Contenido", text: "Contribuyen a la creación de contenido de calidad.", icon: FileText }
];

export function SponsorGrid({
  sponsors
}: {
  sponsors: Array<{
    id: string;
    name: string;
    websiteUrl: string;
    logoUrl: string | null;
    tier: string | null;
    description?: string | null;
    isFeatured?: boolean;
  }>;
}) {
  const featured = sponsors.find((sponsor) => sponsor.isFeatured) || sponsors[0];
  const grouped = ["Gold", "Silver", "Media Partner", "Comunidad", "Colaborador"].map((tier) => ({
    tier,
    items: sponsors.filter((sponsor) => (sponsor.tier || "Colaborador").toLowerCase() === tier.toLowerCase())
  }));

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        {featured ? (
          <a href={featured.websiteUrl} target="_blank" rel="noreferrer" className="card group flex min-h-80 flex-col justify-between overflow-hidden p-7 transition hover:-translate-y-1">
            <div>
              <div className="mb-6 flex h-28 items-center justify-center rounded-2xl border border-[color:var(--line)] bg-white p-5">
                {featured.logoUrl ? <img src={featured.logoUrl} alt={featured.name} className="max-h-full w-full object-contain" /> : <Handshake className="text-[color:var(--accent)]" size={44} />}
              </div>
              <p className="pill">{featured.tier || "Aliado"}</p>
              <h2 className="mt-4 text-4xl font-black">{featured.name}</h2>
              <p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">
                {featured.description || "Organización aliada que impulsa conversaciones, eventos e iniciativas de Industrial con J."}
              </p>
            </div>
            <span className="btn-primary mt-6 w-fit gap-2">
              Ver aliado
              <ArrowUpRight size={16} />
            </span>
          </a>
        ) : null}

        <div className="card p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-full bg-[color:var(--accent-soft)] text-[color:var(--accent)]">
              <BadgeCheck size={20} />
            </div>
            <h2 className="text-2xl font-black">Logo wall</h2>
          </div>
          <div className="space-y-5">
            {grouped.map((group) =>
              group.items.length ? (
                <section key={group.tier}>
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]">{group.tier}</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {group.items.map((sponsor) => (
                      <a key={sponsor.id} href={sponsor.websiteUrl} target="_blank" rel="noreferrer" className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-strong)] p-4 transition hover:border-[color:var(--accent)]/70">
                        <div className="flex h-16 items-center justify-center rounded-xl bg-white p-3">
                          {sponsor.logoUrl ? <img src={sponsor.logoUrl} alt={sponsor.name} className="max-h-full w-full object-contain" /> : <Handshake className="text-[color:var(--accent)]" size={26} />}
                        </div>
                        <p className="mt-3 text-sm font-semibold">{sponsor.name}</p>
                      </a>
                    ))}
                  </div>
                </section>
              ) : null
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        {benefits.map((benefit) => {
          const Icon = benefit.icon;
          return (
            <article key={benefit.title} className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface)] p-5">
              <Icon className="text-[color:var(--accent)]" size={21} />
              <h3 className="mt-4 font-bold">{benefit.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">{benefit.text}</p>
            </article>
          );
        })}
      </div>

      <a href="/contact" className="btn-primary w-fit">
        Quiero ser aliado
      </a>
    </div>
  );
}
