import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SurveyForm } from "@/components/admin/survey-form";

export default async function EditSurveyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [survey, episodes] = await Promise.all([
    prisma.survey.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: { position: "asc" }
        }
      }
    }),
    prisma.episode.findMany({
      orderBy: { publishedAt: "desc" },
      select: { id: true, title: true }
    })
  ]);

  if (!survey) {
    notFound();
  }

  return (
    <div className="card p-8">
      <h2 className="text-3xl font-black">Editar encuesta</h2>
      <div className="mt-6">
        <SurveyForm mode="edit" survey={survey} episodes={episodes} />
      </div>
    </div>
  );
}
