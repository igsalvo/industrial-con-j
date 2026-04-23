import { prisma } from "@/lib/prisma";
import { SurveyForm } from "@/components/admin/survey-form";

export default async function NewSurveyPage() {
  const episodes = await prisma.episode.findMany({
    orderBy: { publishedAt: "desc" },
    select: { id: true, title: true }
  });

  return (
    <div className="card p-8">
      <h2 className="text-3xl font-black">Nueva encuesta o concurso</h2>
      <div className="mt-6">
        <SurveyForm mode="create" episodes={episodes} />
      </div>
    </div>
  );
}
