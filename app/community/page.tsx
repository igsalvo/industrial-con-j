import Link from "next/link";
import { ArrowRight, CalendarDays, Handshake, Lightbulb, MessageCircle, Mic2, Users } from "lucide-react";
import { ContactForm } from "@/components/forms/contact-form";
import { PublicSurveyForm } from "@/components/forms/public-survey-form";
import { getSiteConfig, hasDatabase } from "@/lib/queries";
import { prisma } from "@/lib/prisma";

export default async function CommunityPage() {
  const [config, surveys] = await Promise.all([
    getSiteConfig(),
    hasDatabase()
      ? prisma.survey.findMany({
          where: { status: "PUBLISHED" },
          include: {
            episode: true,
            questions: {
              orderBy: { position: "asc" }
            }
          },
          orderBy: { updatedAt: "desc" }
        })
      : []
  ]);

  return (
    <main className="dark bg-[#111312] text-white">
      <section className="shell py-9">
      <div className="max-w-3xl">
        <p className="brand-kicker text-xs text-[color:var(--accent)]">{config.communityPageEyebrow || "COMUNIDAD"}</p>
        <h1 className="mt-3 text-4xl font-black">{config.communityPageTitle || "Participa en Industrial con J"}</h1>
        <p className="mt-4 text-sm leading-6 text-[color:var(--muted)]">
          {config.communityPageDescription || "Queremos escuchar tus ideas, preguntas y comentarios. Propón temas, recomienda invitados o cuéntanos cómo te gustaría ser parte de esta comunidad."}
        </p>
      </div>

      <nav className="mt-6 flex flex-wrap gap-2 rounded-xl border border-white/10 bg-white/[0.04] p-2">
        {["Episodios", "Invitados", "Comunidad", "Aliados"].map((item) => (
          <Link key={item} href={item === "Comunidad" ? "/community" : `/podcast?tab=${item.toLowerCase()}`} className={`rounded-full px-5 py-2 text-sm font-bold ${item === "Comunidad" ? "bg-[color:var(--accent)] text-white" : "border border-white/10 bg-white/[0.04] text-white/75"}`}>
            {item}
          </Link>
        ))}
      </nav>

      <div className="mt-5 grid gap-4 xl:grid-cols-[0.82fr_1fr_0.95fr]">
        <aside className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-xl font-black">Espacios de participación</h2>
          <p className="mt-2 text-sm text-[color:var(--muted)]">Elige cómo te gustaría contribuir a la comunidad.</p>
          <div className="mt-5 space-y-4">
            {[
              { title: "Propón un tema", text: "Sugiere un tema que te gustaría que conversemos en el podcast.", icon: Lightbulb },
              { title: "Sugiere un invitado", text: "Recomienda a alguien que aporte valor a nuestra audiencia.", icon: Mic2 },
              { title: "Cuéntanos tu idea", text: "Comparte tu idea, proyecto o iniciativa con la comunidad.", icon: MessageCircle }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.035] p-4">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-white/15 text-[color:var(--accent)]">
                    <Icon size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                  <h3 className="font-bold">{item.title}</h3>
                  <p className="mt-1 text-xs leading-5 text-[color:var(--muted)]">{item.text}</p>
                  </div>
                  <ArrowRight size={17} />
                </article>
              );
            })}
          </div>
        </aside>

        <div className="space-y-6">
          {surveys.length === 0 ? (
            <div className="grid min-h-[340px] place-items-center rounded-2xl border border-white/10 bg-white/[0.035] p-8 text-center">
              <div>
              <MessageCircle className="mx-auto text-white/45" size={82} />
              <h2 className="mt-6 text-2xl font-bold">{config.communityEmptyTitle || "No hay preguntas activas por ahora"}</h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[color:var(--muted)]">{config.communityEmptyDescription || "Pronto abriremos nuevos espacios para que puedas compartir tus ideas, preguntas y opiniones con la comunidad."}</p>
              <Link href="/episodes" className="btn-secondary mt-5">
                Explorar episodios <ArrowRight size={16} />
              </Link>
              </div>
            </div>
          ) : (
            surveys.map((survey) => (
              <div key={survey.id} className="space-y-3">
                {survey.episode ? (
                  <p className="text-sm text-[color:var(--muted)]">
                    Capitulo:{" "}
                    <Link href={`/episodes/${survey.episode.slug}`} className="font-semibold text-[color:var(--foreground)]">
                      {survey.episode.title}
                    </Link>
                  </p>
                ) : null}
                <PublicSurveyForm survey={survey} />
              </div>
            ))
          )}
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <ContactForm
          type="CONTACT"
          title={config.communityContactTitle || "Queremos escucharte"}
          description={config.communityContactDescription || "Déjanos tu comentario, idea o propuesta."}
          submitLabel={config.communityContactSubmitLabel || "Enviar mensaje"}
          hideHeader={false}
          className="!border-0 !bg-transparent !p-0 !shadow-none"
        />
        </div>
      </div>

      <section className="mt-4 grid gap-4 rounded-xl border border-white/10 bg-white/[0.035] p-5 md:grid-cols-4">
        {[
          { title: "Podcast", text: "Escucha conversaciones con líderes de la industria.", icon: Mic2 },
          { title: "Eventos", text: "Participa en encuentros, charlas y actividades.", icon: CalendarDays },
          { title: "Comunidad", text: "Comparte, aprende y colabora con personas apasionadas.", icon: Users },
          { title: "Aliados", text: "Conoce a nuestras organizaciones aliadas.", icon: Handshake }
        ].map((item) => {
          const Icon = item.icon;
          return (
            <article key={item.title} className="flex items-center gap-4 md:border-r md:border-white/10 md:last:border-r-0">
              <span className="grid h-12 w-12 place-items-center rounded-full border border-white/10 text-[color:var(--accent)]"><Icon size={21} /></span>
              <div>
                <h3 className="font-bold">{item.title}</h3>
                <p className="mt-1 text-xs leading-5 text-[color:var(--muted)]">{item.text}</p>
              </div>
            </article>
          );
        })}
      </section>
      </section>
    </main>
  );
}
