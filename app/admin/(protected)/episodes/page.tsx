import Link from "next/link";
import { hasDatabase } from "@/lib/queries";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { MvpPlaceholder } from "@/components/ui/mvp-placeholder";

export default async function AdminEpisodesPage() {
  if (!hasDatabase()) {
    return (
      <MvpPlaceholder
        eyebrow="Admin"
        title="Falta conectar la base de datos"
        description="Para listar y editar episodios desde el panel necesitas configurar DATABASE_URL en Vercel y en tu entorno local."
      />
    );
  }

  const episodes = await prisma.episode.findMany({
    orderBy: { updatedAt: "desc" }
  });

  return (
    <div className="space-y-6">
      <div className="card p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="pill">Episodios</p>
            <h1 className="mt-4 text-4xl font-black">Gestionar episodios</h1>
          </div>
          <Link href="/admin/episodes/new" className="btn-primary !px-4 !py-2 text-sm">
            Nuevo episodio
          </Link>
        </div>
      </div>

      <div className="card p-8">
        {episodes.length === 0 ? (
          <p className="text-sm text-[color:var(--muted)]">Todavia no hay episodios en la base.</p>
        ) : (
          <div className="space-y-3">
            {episodes.map((episode) => (
              <Link
                key={episode.id}
                href={`/admin/episodes/${episode.id}`}
                className="flex items-center justify-between rounded-2xl border border-[color:var(--line)] p-4"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <p className="font-semibold">{episode.title}</p>
                    <span className="rounded-full border border-[color:var(--line)] px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-[color:var(--muted)]">
                      {episode.isVisible ? "Visible" : "Oculto"}
                    </span>
                  </div>
                  <p className="text-xs text-[color:var(--muted)]">{episode.slug}</p>
                </div>
                <p className="text-xs text-[color:var(--muted)]">{formatDate(episode.updatedAt)}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
