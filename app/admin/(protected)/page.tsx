import Link from "next/link";
import { SiteConfigForm } from "@/components/admin/site-config-form";
import { hasDatabase } from "@/lib/queries";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const databaseReady = hasDatabase();
  const [episodes, guests, sponsors, surveys, siteConfig] = databaseReady
    ? await Promise.all([
        prisma.episode.findMany({
          orderBy: { updatedAt: "desc" },
          take: 5
        }),
        prisma.guest.findMany({
          orderBy: { updatedAt: "desc" },
          take: 5
        }),
        prisma.sponsor.findMany({
          orderBy: { updatedAt: "desc" },
          take: 5
        }),
        prisma.survey.findMany({
          orderBy: { updatedAt: "desc" },
          take: 5
        }),
        prisma.siteConfig.findUnique({
          where: { id: "default" }
        })
      ])
    : [[], [], [], [], null];

  return (
    <div className="space-y-6">
      <div className="card p-8">
        <p className="pill">Admin</p>
        <h1 className="mt-4 text-4xl font-black">Panel de gestion</h1>
        <p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">
          El acceso administrativo ya esta activo. Ahora puedes gestionar episodios, invitados, sponsors y encuestas desde el mismo panel.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            title: "Episodios",
            text: "Crear, editar y eliminar episodios.",
            href: "/admin/episodes"
          },
          {
            title: "Invitados",
            text: "Crear, editar y eliminar invitados.",
            href: "/admin/guests"
          },
          {
            title: "Sponsors",
            text: "Crear, editar y eliminar sponsors.",
            href: "/admin/sponsors"
          },
          {
            title: "Encuestas",
            text: "Crear, editar y eliminar encuestas.",
            href: "/admin/surveys"
          }
        ].map((item) => (
          <Link key={item.title} href={item.href} className="rounded-2xl border border-[color:var(--line)] p-5 transition hover:border-[color:var(--accent)]">
            <h2 className="text-xl font-bold">{item.title}</h2>
            <p className="mt-2 text-sm text-[color:var(--muted)]">{item.text}</p>
          </Link>
        ))}
      </div>

      {!databaseReady ? (
        <div className="card p-8">
          <p className="mt-4 text-sm text-[color:var(--muted)]">
            Conecta `DATABASE_URL` para activar creacion, edicion y eliminacion persistente desde el panel.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
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
            {episodes.length === 0 ? (
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

          <div className="space-y-6">
            <div className="card p-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="pill">Invitados</p>
                  <h2 className="mt-4 text-2xl font-black">Ultimos invitados</h2>
                </div>
                <Link href="/admin/guests/new" className="btn-secondary !px-4 !py-2 text-sm">
                  Nuevo invitado
                </Link>
              </div>
              {guests.length === 0 ? (
                <p className="mt-4 text-sm text-[color:var(--muted)]">Todavia no hay invitados creados en la base.</p>
              ) : (
                <div className="mt-6 space-y-3">
                  {guests.map((guest) => (
                    <Link
                      key={guest.id}
                      href={`/admin/guests/${guest.id}`}
                      className="flex items-center justify-between rounded-2xl border border-[color:var(--line)] p-4"
                    >
                      <div>
                        <p className="font-semibold">{guest.name}</p>
                        <p className="text-xs text-[color:var(--muted)]">{guest.slug}</p>
                      </div>
                      <p className="text-xs text-[color:var(--muted)]">{formatDate(guest.updatedAt)}</p>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="card p-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="pill">Sponsors y encuestas</p>
                  <h2 className="mt-4 text-2xl font-black">Modulos activos</h2>
                </div>
              </div>
              <div className="mt-6 grid gap-3">
                <Link href="/admin/sponsors" className="flex items-center justify-between rounded-2xl border border-[color:var(--line)] p-4">
                  <span className="font-semibold">Sponsors</span>
                  <span className="text-xs text-[color:var(--muted)]">{sponsors.length} registros</span>
                </Link>
                <Link href="/admin/surveys" className="flex items-center justify-between rounded-2xl border border-[color:var(--line)] p-4">
                  <span className="font-semibold">Encuestas</span>
                  <span className="text-xs text-[color:var(--muted)]">{surveys.length} registros</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {databaseReady && siteConfig ? (
        <div className="card p-8">
          <div className="mb-6">
            <p className="pill">Home</p>
            <h2 className="mt-4 text-3xl font-black">Visibilidad de secciones</h2>
            <p className="mt-2 text-sm text-[color:var(--muted)]">
              Controla que modulos se muestran en la portada y si comunidad aparece en la navegacion publica.
            </p>
          </div>
          <SiteConfigForm config={siteConfig} />
        </div>
      ) : null}
    </div>
  );
}
