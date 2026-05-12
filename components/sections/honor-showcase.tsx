"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

type HonorMember = {
  id: string;
  name: string;
  photoUrl: string | null;
  photoPositionX?: number | null;
  photoPositionY?: number | null;
  description: string;
  role: string | null;
  generation: string | null;
};

export function HonorShowcase({ members }: { members: HonorMember[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const featured = members[activeIndex];

  useEffect(() => {
    if (members.length < 2) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % members.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [members.length]);

  if (!featured) {
    return <p className="rounded-2xl border border-white/10 p-5 text-sm text-[color:var(--muted)]">Aún no hay personas publicadas.</p>;
  }

  const featuredPosition = `${featured.photoPositionX ?? 50}% ${featured.photoPositionY ?? 50}%`;

  return (
    <div className="space-y-5">
      <article className="grid min-h-[360px] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] lg:grid-cols-[0.86fr_1fr]">
        <div className="h-[360px] bg-white/5">
          {featured.photoUrl ? <img src={featured.photoUrl} alt={featured.name} className="h-full w-full object-cover" style={{ objectPosition: featuredPosition }} /> : null}
        </div>
        <div className="relative overflow-hidden p-8">
          <div className="pointer-events-none absolute right-0 top-0 h-full w-64 bg-[radial-gradient(circle_at_70%_20%,rgba(226,33,28,0.13),transparent_35%)]" />
          <div className="relative max-w-lg">
            <p className="brand-kicker text-xs text-[color:var(--accent)]">Miembro destacado</p>
            <h2 className="mt-4 text-3xl font-black sm:text-4xl">{featured.name}</h2>
            {featured.generation ? <p className="mt-4 font-bold text-[color:var(--accent)]">{featured.generation}</p> : null}
            <p className="mt-4 line-clamp-4 text-sm leading-7 text-[color:var(--muted)]">{featured.description}</p>
            <Link href="/honor" className="btn-primary mt-6 gap-2 !px-5 !py-2 text-sm">
              Ver perfil
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </article>

      <p className="brand-kicker text-xs text-white/50">Miembros del círculo</p>
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
        {members.map((member, index) => {
          const photoPosition = `${member.photoPositionX ?? 50}% ${member.photoPositionY ?? 50}%`;
          return (
            <button
              key={member.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`overflow-hidden rounded-xl border bg-white/[0.035] text-left transition ${index === activeIndex ? "border-[color:var(--accent)]" : "border-white/10 hover:border-white/25"}`}
            >
              <div className="aspect-[4/3] bg-white/5">
                {member.photoUrl ? <img src={member.photoUrl} alt={member.name} className="h-full w-full object-cover" style={{ objectPosition: photoPosition }} /> : null}
              </div>
              <div className="p-4">
                <h3 className="line-clamp-1 font-black">{member.name}</h3>
                {member.generation ? <p className="mt-2 text-sm font-bold text-[color:var(--accent)]">{member.generation}</p> : null}
                <span className="mt-3 inline-flex items-center gap-2 text-sm text-white/80">Ver perfil <ArrowRight size={14} /></span>
              </div>
            </button>
          );
        })}
      </section>
    </div>
  );
}
