import Link from "next/link";
import { hasDatabase } from "@/lib/queries";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { MvpPlaceholder } from "@/components/ui/mvp-placeholder";

export default async function AdminGuestsPage() {
  if (!hasDatabase()) {
    return (
      <MvpPlaceholder
        eyebrow="Admin"
        title="Falta conectar la base de datos"
        description="Para listar y editar invitados desde el panel necesitas configurar DATABASE_URL en Vercel y en tu entorno local."
      />
    );
  }

  const guests = await prisma.guest.findMany({
    orderBy: { updatedAt: "desc" }
  });

  return (
    <div className="space-y-6">
      <div className="card p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="pill">Invitados</p>
            <h1 className="mt-4 text-4xl font-black">Gestionar invitados</h1>
          </div>
          <Link href="/admin/guests/new" className="btn-primary !px-4 !py-2 text-sm">
            Nuevo invitado
          </Link>
        </div>
      </div>

      <div className="card p-8">
        {guests.length === 0 ? (
          <p className="text-sm text-[color:var(--muted)]">Todavia no hay invitados en la base.</p>
        ) : (
          <div className="space-y-3">
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
    </div>
  );
}
