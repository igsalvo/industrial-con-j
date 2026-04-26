import Link from "next/link";
import { EpisodeForm } from "@/components/admin/episode-form";
import { hasDatabase } from "@/lib/queries";
import { prisma } from "@/lib/prisma";
import { MvpPlaceholder } from "@/components/ui/mvp-placeholder";

export default async function AdminEpisodeNewPage() {
  if (!hasDatabase()) {
    return (
      <MvpPlaceholder
        eyebrow="Admin"
        title="Falta conectar la base de datos"
        description="Para crear episodios desde el panel necesitas configurar DATABASE_URL en Vercel y en tu entorno local."
      />
    );
  }

  const [guests, sponsors] = await Promise.all([
    prisma.guest.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" }
    }),
    prisma.sponsor.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" }
    })
  ]);

  return (
    <div className="space-y-6">
      <div className="card p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="pill">Episodios</p>
            <h1 className="mt-4 text-4xl font-black">Crear episodio</h1>
          </div>
          <Link href="/admin" className="btn-secondary !px-4 !py-2 text-sm">
            Volver al panel
          </Link>
        </div>
      </div>
      <div className="card p-8">
        <EpisodeForm mode="create" guests={guests} sponsors={sponsors} />
      </div>
    </div>
  );
}
