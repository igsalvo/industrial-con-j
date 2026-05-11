import Link from "next/link";
import { Lightbulb, Mic2, MessageCircle } from "lucide-react";
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
    <section className="shell py-12">
      <div className="max-w-3xl">
        <p className="pill">{config.communityPageEyebrow || "COMUNIDAD"}</p>
        <h1 className="mt-4 text-4xl font-black">{config.communityPageTitle || "Participa en Industrial con J"}</h1>
        <p className="text-content mt-4 text-sm leading-7 text-[color:var(--muted)]">
          {config.communityPageDescription || "Queremos escuchar tus ideas, preguntas y comentarios. Propón temas, recomienda invitados o cuéntanos cómo te gustaría ser parte de esta comunidad."}
        </p>
      </div>

      <div className="mt-8 grid gap-8 xl:grid-cols-[0.82fr_1fr_0.95fr]">
        <aside className="card p-6">
          <h2 className="text-2xl font-black">Espacios de participación</h2>
          <div className="mt-5 space-y-4">
            {[
              { title: "Propón un tema", text: "Sugiere un tema que te gustaría que conversemos en el podcast.", icon: Lightbulb },
              { title: "Sugiere un invitado", text: "Recomienda a alguien que aporte valor a nuestra audiencia.", icon: Mic2 },
              { title: "Cuéntanos tu idea", text: "Comparte tu idea, proyecto o iniciativa con la comunidad.", icon: MessageCircle }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-strong)] p-4">
                  <div className="mb-3 grid h-10 w-10 place-items-center rounded-full bg-[color:var(--accent-soft)] text-[color:var(--accent)]">
                    <Icon size={18} />
                  </div>
                  <h3 className="font-bold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">{item.text}</p>
                </article>
              );
            })}
          </div>
        </aside>

        <div className="space-y-6">
          {surveys.length === 0 ? (
            <div className="card p-8">
              <h2 className="text-2xl font-bold">{config.communityEmptyTitle || "No hay preguntas activas por ahora"}</h2>
              <p className="mt-3 text-sm text-[color:var(--muted)]">{config.communityEmptyDescription || "Pronto abriremos nuevos espacios para que puedas compartir tus ideas, preguntas y opiniones con la comunidad."}</p>
              <Link href="/episodes" className="btn-secondary mt-5">
                Explorar episodios
              </Link>
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

        <ContactForm
          type="CONTACT"
          title={config.communityContactTitle || "Queremos escucharte"}
          description={config.communityContactDescription || "Déjanos tu comentario, idea o propuesta."}
          submitLabel={config.communityContactSubmitLabel || "Enviar mensaje"}
        />
      </div>
    </section>
  );
}
