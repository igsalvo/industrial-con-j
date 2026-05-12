"use client";

import { ArrowUpRight, BadgeCheck, Handshake } from "lucide-react";
import { useEffect, useState } from "react";

type Sponsor = {
  id: string;
  name: string;
  websiteUrl: string;
  logoUrl: string | null;
  tier: string | null;
  description?: string | null;
};

function tierColor(tier?: string | null) {
  if (tier?.toLowerCase() === "gold") return "bg-yellow-400";
  if (tier?.toLowerCase() === "silver") return "bg-zinc-300";
  if (tier?.toLowerCase() === "media partner") return "bg-purple-400";
  if (tier?.toLowerCase() === "comunidad") return "bg-green-500";
  return "bg-[color:var(--accent)]";
}

export function SponsorShowcase({ sponsors }: { sponsors: Sponsor[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = sponsors[activeIndex];
  const rotationKey = sponsors.map((sponsor) => sponsor.id).join("|");

  useEffect(() => {
    if (sponsors.length < 2) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % sponsors.length);
    }, 3000);

    return () => window.clearInterval(interval);
  }, [rotationKey, sponsors.length]);

  if (!active) {
    return <p className="rounded-2xl border border-white/10 p-5 text-sm text-[color:var(--muted)]">Aún no hay aliados publicados.</p>;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.82fr_1fr]">
      <a key={active.id} href={active.websiteUrl} target="_blank" rel="noreferrer" className="rounded-2xl border border-white/10 bg-white/[0.035] p-7 transition duration-500 hover:border-[color:var(--accent)]">
        <div className="flex h-44 items-center justify-center rounded-2xl bg-white p-8">
          {active.logoUrl ? <img src={active.logoUrl} alt={active.name} className="max-h-full w-full object-contain" /> : <Handshake className="text-[color:var(--accent)]" size={52} />}
        </div>
        <p className="mt-8 inline-flex rounded-full border border-white/10 bg-[color:var(--accent-soft)] px-4 py-2 text-sm font-bold">
          {active.tier || "Aliado"}
        </p>
        <h2 className="mt-5 text-4xl font-black">{active.name}</h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-[color:var(--muted)]">
          {active.description || "Organización aliada que impulsa conversaciones, eventos e iniciativas de Industrial con J."}
        </p>
        <span className="btn-primary mt-8 gap-2">
          Ver aliado
          <ArrowUpRight size={17} />
        </span>
      </a>

      <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-7">
        <div className="flex items-center gap-4">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-[color:var(--accent-soft)] text-[color:var(--accent)]">
            <BadgeCheck size={22} />
          </span>
          <h2 className="text-3xl font-black">Logo wall</h2>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {sponsors.map((sponsor, index) => (
            <button
              key={sponsor.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`rounded-xl border bg-white/[0.035] p-4 text-left transition ${index === activeIndex ? "border-[color:var(--accent)]" : "border-white/10 hover:border-white/25"}`}
            >
              <div className="flex h-24 items-center justify-center rounded-lg bg-white p-5">
                {sponsor.logoUrl ? <img src={sponsor.logoUrl} alt={sponsor.name} className="max-h-full w-full object-contain" /> : <Handshake className="text-[color:var(--accent)]" size={30} />}
              </div>
              <h3 className="mt-4 line-clamp-1 text-lg font-black">{sponsor.name}</h3>
              <p className="mt-2 inline-flex items-center gap-2 text-sm text-white/70">
                <span className={`h-2 w-2 rounded-full ${tierColor(sponsor.tier)}`} />
                {sponsor.tier || "Aliado"}
              </p>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
