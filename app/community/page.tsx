import { prisma } from "@/lib/prisma";
import { PublicSurveyForm } from "@/components/forms/public-survey-form";
import { EmptyState } from "@/components/ui/empty-state";

export default async function CommunityPage() {
  const surveys = await prisma.survey.findMany({
    where: { status: "PUBLISHED" },
    include: {
      questions: {
        orderBy: { position: "asc" }
      }
    },
    orderBy: { updatedAt: "desc" }
  });

  return (
    <section className="shell py-12">
      <div className="max-w-3xl">
        <p className="pill">Comunidad</p>
        <h1 className="mt-4 text-4xl font-black">Encuestas, concursos y feedback util</h1>
        <p className="mt-4 text-sm text-[color:var(--muted)]">
          No hay login obligatorio para usuarios. Las respuestas se validan y se deduplican por fingerprint para evitar envios repetidos.
        </p>
      </div>

      <div className="mt-8 grid gap-6">
        {surveys.length === 0 ? (
          <EmptyState title="No hay encuestas activas" description="Publica una encuesta o concurso desde el admin para activar esta seccion." />
        ) : (
          surveys.map((survey) => (
            <PublicSurveyForm key={survey.id} survey={survey} />
          ))
        )}
      </div>
    </section>
  );
}
