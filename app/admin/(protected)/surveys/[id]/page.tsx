import Link from "next/link";
import { notFound } from "next/navigation";
import { SurveyForm } from "@/components/admin/survey-form";
import { hasDatabase } from "@/lib/queries";
import { prisma } from "@/lib/prisma";
import { MvpPlaceholder } from "@/components/ui/mvp-placeholder";

export default async function AdminSurveyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  if (!hasDatabase()) {
    return (
      <MvpPlaceholder
        eyebrow="Admin"
        title="Falta conectar la base de datos"
        description="Para editar encuestas desde el panel necesitas configurar DATABASE_URL en Vercel y en tu entorno local."
      />
    );
  }

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
      select: { id: true, title: true },
      orderBy: { title: "asc" }
    })
  ]);

  if (!survey) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="card p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="pill">Encuestas</p>
            <h1 className="mt-4 text-4xl font-black">Editar encuesta</h1>
          </div>
          <Link href="/admin/surveys" className="btn-secondary !px-4 !py-2 text-sm">
            Volver a encuestas
          </Link>
        </div>
      </div>
      <div className="card p-8">
        <SurveyForm mode="edit" survey={survey} episodes={episodes} />
      </div>
    </div>
  );
}
