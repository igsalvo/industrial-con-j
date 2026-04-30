import Link from "next/link";
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
        <p className="pill">{config.communityPageEyebrow || "Comunidad"}</p>
        <h1 className="mt-4 text-4xl font-black">{config.communityPageTitle || "Encuestas, preguntas y contacto"}</h1>
        <p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">
          {config.communityPageDescription || "Participa en preguntas generales o asociadas a capitulos especificos. Los comentarios quedan en la bandeja del administrador."}
        </p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          {surveys.length === 0 ? (
            <div className="card p-8">
              <h2 className="text-2xl font-bold">{config.communityEmptyTitle || "No hay encuestas activas"}</h2>
              <p className="mt-3 text-sm text-[color:var(--muted)]">{config.communityEmptyDescription || "Publica una encuesta desde el administrador para mostrarla aqui."}</p>
              <Link href="/episodes" className="btn-secondary mt-5">
                Ver episodios
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
          title={config.communityContactTitle || "Contactanos"}
          description={config.communityContactDescription || "Deja tu comentario e informacion de contacto para responderte despues."}
          submitLabel={config.communityContactSubmitLabel || "Enviar comentario"}
        />
      </div>
    </section>
  );
}
