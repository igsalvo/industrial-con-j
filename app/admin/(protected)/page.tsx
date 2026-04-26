import Link from "next/link";
import { hasDatabase } from "@/lib/queries";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const databaseReady = hasDatabase();
  const episodes = databaseReady
    ? await prisma.episode.findMany({
        orderBy: { updatedAt: "desc" },
        take: 8
      })
    : [];

  return (
    <div className="space-y-6">
      <div className="card p-8">
        <p className="pill">Admin</p>
        <h1 className="mt-4 text-4xl font-black">Panel de gestion</h1>
        <p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">
          El acceso administrativo ya esta activo. El CRUD de episodios fue reactivado primero y el resto de los modulos se iran sumando sobre esta base.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            title: "Episodios",
            text: "Crear, editar y eliminar episodios."
          },
          {
            title: "Invitados",
            text: "Proximamente reactivado sobre Prisma."
          },
          {
            title: "Sponsors",
            text: "Proximamente reactivado sobre Prisma."
          },
          {
            title: "Encuestas",
            text: "Proximamente reactivado sobre Prisma."
          }
        ].map((item) => (
          <div key={item.title} className="rounded-2xl border border-[color:var(--line)] p-5">
            <h2 className="text-xl font-bold">{item.title}</h2>
            <p className="mt-2 text-sm text-[color:var(--muted)]">{item.text}</p>
          </div>
        ))}
      </div>

      <div className="card p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="pill">Episodios</p>
            <h2 className="mt-4 text-3xl font-black">Gestion de episodios</h2>
          </div>
          <Link href="/admin/episodes/new" className="btn-primary !px-4 !py-2 text-sm">
            Nuevo episodio
          </Link>
        </div>

        {!databaseReady ? (
          <p className="mt-4 text-sm text-[color:var(--muted)]">
            Conecta `DATABASE_URL` para activar creacion, edicion y eliminacion persistente de episodios.
          </p>
        ) : episodes.length === 0 ? (
          <p className="mt-4 text-sm text-[color:var(--muted)]">Todavia no hay episodios creados en la base.</p>
        ) : (
          <div className="mt-6 space-y-3">
            {episodes.map((episode) => (
              <Link
                key={episode.id}
                href={`/admin/episodes/${episode.id}`}
                className="flex items-center justify-between rounded-2xl border border-[color:var(--line)] p-4"
              >
                <div>
                  <p className="font-semibold">{episode.title}</p>
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
