import Link from "next/link";
import { SiteConfigForm } from "@/components/admin/site-config-form";
import { hasDatabase } from "@/lib/queries";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

async function safeQuery<T>(query: Promise<T>, fallback: T) {
  try {
    return await query;
  } catch {
    return fallback;
  }
}

export default async function AdminDashboardPage() {
  const databaseReady = hasDatabase();
  const [episodes, guests, sponsors, surveys, messages, siteConfig, identityItems, honorMembers, products, categories, participationItems] = databaseReady
    ? await Promise.all([
        safeQuery(prisma.episode.findMany({
          orderBy: { updatedAt: "desc" },
          take: 5
        }), []),
        safeQuery(prisma.guest.findMany({
          orderBy: { updatedAt: "desc" },
          take: 5
        }), []),
        safeQuery(prisma.sponsor.findMany({
          orderBy: { updatedAt: "desc" },
          take: 5
        }), []),
        safeQuery(prisma.survey.findMany({
          orderBy: { updatedAt: "desc" },
          take: 5
        }), []),
        safeQuery(prisma.contactMessage.findMany({
          orderBy: { createdAt: "desc" },
          take: 5
        }), []),
        safeQuery(prisma.siteConfig.findUnique({
          where: { id: "default" }
        }), null),
        safeQuery(prisma.identityItem.findMany({ orderBy: { updatedAt: "desc" }, take: 5 }), []),
        safeQuery(prisma.honorMember.findMany({ orderBy: { updatedAt: "desc" }, take: 5 }), []),
        safeQuery(prisma.product.findMany({ orderBy: { updatedAt: "desc" }, take: 5 }), []),
        safeQuery(prisma.productCategory.findMany({ orderBy: { updatedAt: "desc" }, take: 5 }), []),
        safeQuery(prisma.participationItem.findMany({ orderBy: { updatedAt: "desc" }, take: 5 }), [])
      ])
    : [[], [], [], [], [], null, [], [], [], [], []];

  return (
    <div className="space-y-6">
      <div className="card p-8">
        <p className="pill">Admin</p>
        <h1 className="mt-4 text-4xl font-black">Panel de gestión</h1>
        <p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">
          El acceso administrativo ya está activo. Ahora puedes gestionar episodios, invitados, sponsors y encuestas desde el mismo panel.
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
          },
          {
            title: "Bandeja",
            text: "Ver contactos, donaciones y respuestas.",
            href: "/admin/messages"
          },
          {
            title: "Identidad",
            text: "Editar propósito, visión, misión y valores.",
            href: "/admin/identity"
          },
          {
            title: "Alumni",
            text: "Gestionar personas destacadas.",
            href: "/admin/honor"
          },
          {
            title: "TienDIIta",
            text: "Gestionar productos y categorías.",
            href: "/admin/products"
          },
          {
            title: "Participa",
            text: "Editar donaciones, auspicios y participación.",
            href: "/admin/participation"
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
              <p className="mt-4 text-sm text-[color:var(--muted)]">Todavía no hay episodios creados en la base.</p>
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
                  <h2 className="mt-4 text-2xl font-black">Últimos invitados</h2>
                </div>
                <Link href="/admin/guests/new" className="btn-secondary !px-4 !py-2 text-sm">
                  Nuevo invitado
                </Link>
              </div>
              {guests.length === 0 ? (
                <p className="mt-4 text-sm text-[color:var(--muted)]">Todavía no hay invitados creados en la base.</p>
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
                <Link href="/admin/messages" className="flex items-center justify-between rounded-2xl border border-[color:var(--line)] p-4">
                  <span className="font-semibold">Bandeja</span>
                  <span className="text-xs text-[color:var(--muted)]">{messages.length} mensajes recientes</span>
                </Link>
                <Link href="/admin/identity" className="flex items-center justify-between rounded-2xl border border-[color:var(--line)] p-4">
                  <span className="font-semibold">Identidad</span>
                  <span className="text-xs text-[color:var(--muted)]">{identityItems.length} registros</span>
                </Link>
                <Link href="/admin/honor" className="flex items-center justify-between rounded-2xl border border-[color:var(--line)] p-4">
                  <span className="font-semibold">Alumni</span>
                  <span className="text-xs text-[color:var(--muted)]">{honorMembers.length} registros</span>
                </Link>
                <Link href="/admin/products" className="flex items-center justify-between rounded-2xl border border-[color:var(--line)] p-4">
                  <span className="font-semibold">Productos</span>
                  <span className="text-xs text-[color:var(--muted)]">{products.length} productos</span>
                </Link>
                <Link href="/admin/product-categories" className="flex items-center justify-between rounded-2xl border border-[color:var(--line)] p-4">
                  <span className="font-semibold">Categorías</span>
                  <span className="text-xs text-[color:var(--muted)]">{categories.length} categorías</span>
                </Link>
                <Link href="/admin/participation" className="flex items-center justify-between rounded-2xl border border-[color:var(--line)] p-4">
                  <span className="font-semibold">Participa</span>
                  <span className="text-xs text-[color:var(--muted)]">{participationItems.length} registros</span>
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
              Controla que módulos se muestran en la portada y si comunidad aparece en la navegación pública.
            </p>
          </div>
          <SiteConfigForm config={siteConfig} />
        </div>
      ) : null}
    </div>
  );
}
