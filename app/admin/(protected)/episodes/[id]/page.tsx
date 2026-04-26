import Link from "next/link";
import { notFound } from "next/navigation";
import { EpisodeForm } from "@/components/admin/episode-form";
import { hasDatabase } from "@/lib/queries";
import { prisma } from "@/lib/prisma";
import { MvpPlaceholder } from "@/components/ui/mvp-placeholder";

export default async function AdminEpisodeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  if (!hasDatabase()) {
    return (
      <MvpPlaceholder
        eyebrow="Admin"
        title="Falta conectar la base de datos"
        description="Para editar episodios desde el panel necesitas configurar DATABASE_URL en Vercel y en tu entorno local."
      />
    );
  }

  const { id } = await params;

  const [episode, guests, sponsors] = await Promise.all([
    prisma.episode.findUnique({
      where: { id },
      include: { guests: { select: { id: true } } }
    }),
    prisma.guest.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" }
    }),
    prisma.sponsor.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" }
    })
  ]);

  if (!episode) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="card p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="pill">Episodios</p>
            <h1 className="mt-4 text-4xl font-black">Editar episodio</h1>
          </div>
          <Link href="/admin" className="btn-secondary !px-4 !py-2 text-sm">
            Volver al panel
          </Link>
        </div>
      </div>
      <div className="card p-8">
        <EpisodeForm mode="edit" episode={episode} guests={guests} sponsors={sponsors} />
      </div>
    </div>
  );
}
