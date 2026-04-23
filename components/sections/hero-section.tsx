import Link from "next/link";
import { ArrowRight, Podcast, Users } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function HeroSection() {
  return (
    <section className="shell py-10 md:py-16">
      <div className="overflow-hidden rounded-[2rem] border border-[color:var(--line)] p-8 md:p-12" style={{ background: "var(--hero)" }}>
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <span className="pill">Ingenieria industrial para equipos que ejecutan</span>
            <h1 className="mt-6 max-w-4xl text-4xl font-black tracking-tight md:text-6xl">
              El hub de contenido, comunidad y patrocinio de <span className="text-[color:var(--accent)]">Industrial con J</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-[color:var(--muted)]">
              Episodios, clips, invitados, encuestas y oportunidades para marcas que quieren hablarle a lideres de operaciones.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/episodes" className="btn-primary gap-2">
                Explorar episodios
                <ArrowRight size={16} />
              </Link>
              <Link href="/community" className="btn-secondary">
                Participar en la comunidad
              </Link>
              <div className="sm:hidden">
                <ThemeToggle />
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="card p-6">
              <Podcast className="text-[color:var(--accent)]" />
              <p className="mt-4 text-sm font-medium uppercase tracking-[0.25em] text-[color:var(--muted)]">Contenido</p>
              <p className="mt-3 text-3xl font-black">Clips, episodios y recursos</p>
            </div>
            <div className="card p-6">
              <Users className="text-[color:var(--accent)]" />
              <p className="mt-4 text-sm font-medium uppercase tracking-[0.25em] text-[color:var(--muted)]">Comunidad</p>
              <p className="mt-3 text-3xl font-black">Encuestas, concursos y feedback</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
