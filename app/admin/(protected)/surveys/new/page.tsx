import Link from "next/link";
import { SurveyForm } from "@/components/admin/survey-form";
import { hasDatabase } from "@/lib/queries";
import { prisma } from "@/lib/prisma";
import { MvpPlaceholder } from "@/components/ui/mvp-placeholder";

export default async function AdminSurveyNewPage() {
  if (!hasDatabase()) {
    return (
      <MvpPlaceholder
        eyebrow="Admin"
        title="Falta conectar la base de datos"
        description="Para crear encuestas desde el panel necesitas configurar DATABASE_URL en Vercel y en tu entorno local."
      />
    );
  }

  const episodes = await prisma.episode.findMany({
    select: { id: true, title: true },
    orderBy: { title: "asc" }
  });

  return (
    <div className="space-y-6">
      <div className="card p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="pill">Encuestas</p>
            <h1 className="mt-4 text-4xl font-black">Crear encuesta</h1>
          </div>
          <Link href="/admin/surveys" className="btn-secondary !px-4 !py-2 text-sm">
            Volver a encuestas
          </Link>
        </div>
      </div>
      <div className="card p-8">
        <SurveyForm mode="create" episodes={episodes} />
      </div>
    </div>
  );
}
