"use client";

import { ArrowRight, Linkedin, X } from "lucide-react";
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
  externalLinks?: unknown;
};

function formatGeneration(generation?: string | null) {
  const normalized = generation?.trim();
  if (!normalized) {
    return null;
  }

  const withoutPrefix = normalized.replace(/^gen(?:eraci[oó]n)?\s*:?\s*/i, "").trim();
  return `Generación ${withoutPrefix || normalized}`;
}

function getLinkedInUrl(externalLinks: unknown) {
  if (!Array.isArray(externalLinks)) {
    return null;
  }

  const link = externalLinks.find((item): item is { label?: unknown; url?: unknown } => {
    if (!item || typeof item !== "object") {
      return false;
    }

    const label = "label" in item ? String(item.label || "") : "";
    const url = "url" in item ? String(item.url || "") : "";
    return /linkedin/i.test(label) || /linkedin\.com/i.test(url);
  });

  return typeof link?.url === "string" ? link.url : null;
}

function HonorPhoto({
  member,
  className = "",
  priority = false
}: {
  member: HonorMember;
  className?: string;
  priority?: boolean;
}) {
  const photoPosition = `${member.photoPositionX ?? 50}% ${member.photoPositionY ?? 50}%`;

  if (!member.photoUrl) {
    return null;
  }

  return (
    <img
      src={member.photoUrl}
      alt={member.name}
      width={640}
      height={640}
      loading="eager"
      decoding={priority ? "sync" : "async"}
      fetchPriority={priority ? "high" : "auto"}
      className={`h-full w-full object-cover ${className}`}
      style={{ objectPosition: photoPosition }}
    />
  );
}

export function HonorShowcase({ members }: { members: HonorMember[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [modalMember, setModalMember] = useState<HonorMember | null>(null);
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

  useEffect(() => {
    if (!modalMember) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setModalMember(null);
      }
    }

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [modalMember]);

  if (!featured) {
    return <p className="rounded-2xl border border-white/10 p-5 text-sm text-[color:var(--muted)]">Aún no hay personas publicadas.</p>;
  }

  const featuredLinkedInUrl = getLinkedInUrl(featured.externalLinks);

  return (
    <div className="space-y-5">
      <article className="grid overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] lg:min-h-[360px] lg:grid-cols-[0.86fr_1fr]">
        <div className="aspect-square bg-white/5 lg:h-[360px]">
          <HonorPhoto member={featured} priority />
        </div>
        <div className="relative overflow-hidden p-5 sm:p-8">
          <div className="pointer-events-none absolute right-0 top-0 h-full w-64 bg-[radial-gradient(circle_at_70%_20%,rgba(226,33,28,0.13),transparent_35%)]" />
          <div className="relative max-w-lg">
            <p className="brand-kicker text-xs text-[color:var(--accent)]">Miembro destacado</p>
            <h2 className="mt-4 text-[clamp(1.8rem,8vw,2.25rem)] font-black sm:text-4xl">{featured.name}</h2>
            {formatGeneration(featured.generation) ? <p className="mt-4 text-lg font-bold text-[color:var(--accent)]">{formatGeneration(featured.generation)}</p> : null}
            <p className="mt-4 line-clamp-4 text-base leading-7 text-[color:var(--muted)]">{featured.description}</p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button type="button" className="btn-primary !px-5 !py-3 text-sm" onClick={() => setModalMember(featured)}>
                Ver perfil
              </button>
              {featuredLinkedInUrl ? (
                <a href={featuredLinkedInUrl} target="_blank" rel="noreferrer" className="inline-grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[0.06] text-white transition hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]" aria-label={`LinkedIn de ${featured.name}`}>
                  <Linkedin size={21} />
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </article>

      <p className="brand-kicker text-xs text-white/50">Miembros del círculo</p>
      <section className="grid gap-4 min-[480px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {members.map((member, index) => {
          const linkedInUrl = getLinkedInUrl(member.externalLinks);
          return (
            <article
              key={member.id}
              className={`overflow-hidden rounded-xl border bg-white/[0.035] text-left transition ${index === activeIndex ? "border-[color:var(--accent)]" : "border-white/10 hover:border-white/25"}`}
            >
              <button type="button" onClick={() => setActiveIndex(index)} className="block w-full text-left">
                <div className="aspect-square bg-white/5">
                  <HonorPhoto member={member} priority={index < 12} />
                </div>
              </button>
              <div className="p-4">
                <h3 className="font-black leading-tight">{member.name}</h3>
                {formatGeneration(member.generation) ? <p className="mt-2 text-base font-bold text-[color:var(--accent)]">{formatGeneration(member.generation)}</p> : null}
                <div className="mt-3 flex items-center gap-2">
                  <button type="button" className="inline-flex min-h-10 items-center gap-2 text-sm text-white/80 transition hover:text-[color:var(--accent)]" onClick={() => setModalMember(member)}>
                    Ver perfil <ArrowRight size={14} />
                  </button>
                  {linkedInUrl ? (
                    <a href={linkedInUrl} target="_blank" rel="noreferrer" className="ml-auto grid h-8 w-8 place-items-center rounded-full border border-white/10 text-white/75 transition hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]" aria-label={`LinkedIn de ${member.name}`}>
                      <Linkedin size={16} />
                    </a>
                  ) : null}
                </div>
              </div>
            </article>
          );
        })}
      </section>
      {modalMember ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-3 sm:p-4" role="dialog" aria-modal="true" aria-labelledby="honor-profile-title" onMouseDown={() => setModalMember(null)}>
          <div className="max-h-[calc(100dvh-1.5rem)] w-full max-w-5xl overflow-auto rounded-2xl border border-white/10 bg-[#181a19] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.45)] sm:max-h-[90vh] sm:p-6" onMouseDown={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="brand-kicker text-xs text-[color:var(--accent)]">Perfil</p>
                <h2 id="honor-profile-title" className="mt-3 text-[clamp(1.65rem,7vw,1.875rem)] font-black">{modalMember.name}</h2>
                {formatGeneration(modalMember.generation) ? <p className="mt-2 text-base font-bold text-[color:var(--accent)]">{formatGeneration(modalMember.generation)}</p> : null}
              </div>
              <button type="button" className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-white/75 hover:text-[color:var(--accent)]" onClick={() => setModalMember(null)} aria-label="Cerrar perfil">
                <X size={18} />
              </button>
            </div>
            <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(260px,0.9fr)_1fr] lg:items-start">
              <div className="aspect-square overflow-hidden rounded-xl border border-white/10 bg-black/20">
                {modalMember.photoUrl ? (
                  <HonorPhoto member={modalMember} priority className="max-h-[70vh]" />
                ) : (
                  <div className="grid h-full min-h-[280px] place-items-center px-6 text-center text-sm text-[color:var(--muted)]">Sin foto disponible</div>
                )}
              </div>
              <div>
                {modalMember.role ? <p className="text-sm font-semibold text-white/80">{modalMember.role}</p> : null}
                {getLinkedInUrl(modalMember.externalLinks) ? (
                  <a href={getLinkedInUrl(modalMember.externalLinks) || ""} target="_blank" rel="noreferrer" className="mt-4 inline-grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.06] text-white transition hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]" aria-label={`LinkedIn de ${modalMember.name}`}>
                    <Linkedin size={18} />
                  </a>
                ) : null}
                <p className="mt-5 whitespace-pre-line text-sm leading-7 text-[color:var(--muted)]">{modalMember.description}</p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
