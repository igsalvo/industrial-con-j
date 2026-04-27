import Link from "next/link";
import { hasDatabase } from "@/lib/queries";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { MvpPlaceholder } from "@/components/ui/mvp-placeholder";

export default async function AdminSurveysPage() {
  if (!hasDatabase()) {
    return (
      <MvpPlaceholder
        eyebrow="Admin"
        title="Falta conectar la base de datos"
        description="Para listar y editar encuestas desde el panel necesitas configurar DATABASE_URL en Vercel y en tu entorno local."
      />
    );
  }

  const surveys = await prisma.survey.findMany({
    include: {
      episode: {
        select: {
          title: true
        }
      }
    },
    orderBy: { updatedAt: "desc" }
  });

  return (
    <div className="space-y-6">
      <div className="card p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="pill">Encuestas</p>
            <h1 className="mt-4 text-4xl font-black">Gestionar encuestas</h1>
          </div>
          <Link href="/admin/surveys/new" className="btn-primary !px-4 !py-2 text-sm">
            Nueva encuesta
          </Link>
        </div>
      </div>

      <div className="card p-8">
        {surveys.length === 0 ? (
          <p className="text-sm text-[color:var(--muted)]">Todavia no hay encuestas en la base.</p>
        ) : (
          <div className="space-y-3">
            {surveys.map((survey) => (
              <Link
                key={survey.id}
                href={`/admin/surveys/${survey.id}`}
                className="flex items-center justify-between rounded-2xl border border-[color:var(--line)] p-4"
              >
                <div>
                  <p className="font-semibold">{survey.title}</p>
                  <p className="text-xs text-[color:var(--muted)]">
                    {survey.kind} · {survey.status}
                    {survey.episode ? ` · ${survey.episode.title}` : ""}
                  </p>
                </div>
                <p className="text-xs text-[color:var(--muted)]">{formatDate(survey.updatedAt)}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
