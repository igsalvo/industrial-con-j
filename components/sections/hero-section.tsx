import Link from "next/link";
import { ArrowRight, CalendarDays, GraduationCap, Podcast, Store } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function HeroSection({
  config
}: {
  config: {
    heroEyebrow?: string | null;
    heroTitle?: string | null;
    heroTitleAccent?: string | null;
    heroDescription?: string | null;
    heroPrimaryCtaLabel?: string | null;
    heroPrimaryCtaHref?: string | null;
    heroSecondaryCtaLabel?: string | null;
    heroSecondaryCtaHref?: string | null;
    heroImageUrl?: string | null;
  };
}) {
  return (
    <section className="shell py-10 md:py-16">
      <div className="overflow-hidden rounded-[2rem] border border-[color:var(--line)] p-8 md:p-12" style={{ background: "var(--hero)" }}>
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <span className="pill">{config.heroEyebrow || "Comunidad industrial en movimiento"}</span>
            <h1 className="mt-6 max-w-4xl text-4xl md:text-6xl" style={{ fontWeight: 600 }}>
              {config.heroTitle || "Contenido, eventos y comunidad de"}{" "}
              <span className="text-[color:var(--accent)]">{config.heroTitleAccent || "Industrial con J"}</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-[color:var(--muted)]">
              {config.heroDescription ||
                "Un espacio para conectar ideas, personas, eventos, alumni, productos e iniciativas del ecosistema industrial."}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href={config.heroPrimaryCtaHref || "/podcast"} className="btn-primary gap-2">
                {config.heroPrimaryCtaLabel || "Explorar plataforma"}
                <ArrowRight size={16} />
              </Link>
              {config.heroSecondaryCtaLabel && config.heroSecondaryCtaHref ? (
                <Link href={config.heroSecondaryCtaHref} className="btn-secondary">
                  {config.heroSecondaryCtaLabel}
                </Link>
              ) : null}
              <div className="sm:hidden">
                <ThemeToggle />
              </div>
            </div>
          </div>

          <div>
            {config.heroImageUrl ? (
              <div className="overflow-hidden rounded-[1.5rem] border border-[color:var(--line)] bg-[color:var(--surface-strong)]">
                <img src={config.heroImageUrl} alt="Industrial con J" className="aspect-[4/3] h-full w-full object-cover" />
              </div>
            ) : null}
            <div className={`grid gap-4 ${config.heroImageUrl ? "mt-4" : ""} sm:grid-cols-2`}>
              <div className="card p-6">
                <Podcast className="text-[color:var(--accent)]" />
                <p className="brand-kicker mt-4 text-sm text-[color:var(--muted)]">Podcast</p>
                <p className="mt-3 text-3xl" style={{ fontWeight: 600 }}>Episodios e invitados</p>
              </div>
              <div className="card p-6">
                <CalendarDays className="text-[color:var(--accent)]" />
                <p className="brand-kicker mt-4 text-sm text-[color:var(--muted)]">Eventos</p>
                <p className="mt-3 text-3xl" style={{ fontWeight: 600 }}>Calendario y actividades</p>
              </div>
              <div className="card p-6">
                <GraduationCap className="text-[color:var(--accent)]" />
                <p className="brand-kicker mt-4 text-sm text-[color:var(--muted)]">Alumni</p>
                <p className="mt-3 text-3xl" style={{ fontWeight: 600 }}>Red y trayectorias</p>
              </div>
              <div className="card p-6">
                <Store className="text-[color:var(--accent)]" />
                <p className="brand-kicker mt-4 text-sm text-[color:var(--muted)]">TienDIIta</p>
                <p className="mt-3 text-3xl" style={{ fontWeight: 600 }}>Productos e iniciativas</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
