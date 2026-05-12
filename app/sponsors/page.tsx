import { Handshake } from "lucide-react";
import { getAllSponsors, getSiteConfig } from "@/lib/queries";

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

        <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {sponsors.map((sponsor) => (
              <a key={sponsor.id} href={sponsor.websiteUrl} target="_blank" rel="noreferrer" className="rounded-xl border border-white/10 bg-white/[0.035] p-4 transition hover:border-[color:var(--accent)]">
                <div className="flex h-28 items-center justify-center rounded-lg bg-white p-5">
                  {sponsor.logoUrl ? <img src={sponsor.logoUrl} alt={sponsor.name} className="max-h-full w-full object-contain" /> : <Handshake className="text-[color:var(--accent)]" size={32} />}
                </div>
                <h2 className="mt-4 text-lg font-black">{sponsor.name}</h2>
                <p className="mt-2 inline-flex items-center gap-2 text-sm text-white/70">
                  <span className={`h-2 w-2 rounded-full ${tierColor(sponsor.tier)}`} />
                  {sponsor.tier || "Aliado"}
                </p>
              </a>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
