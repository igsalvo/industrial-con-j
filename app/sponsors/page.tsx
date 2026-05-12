import { SponsorShowcase } from "@/components/sections/sponsor-showcase";
import { getAllSponsors, getSiteConfig } from "@/lib/queries";

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

        <SponsorShowcase sponsors={sponsors} />
      </div>
    </main>
  );
}
