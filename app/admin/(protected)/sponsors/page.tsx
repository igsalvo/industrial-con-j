import Link from "next/link";
import { hasDatabase } from "@/lib/queries";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { MvpPlaceholder } from "@/components/ui/mvp-placeholder";

export default async function AdminSponsorsPage() {
  if (!hasDatabase()) {
    return (
      <MvpPlaceholder
        eyebrow="Admin"
        title="Falta conectar la base de datos"
        description="Para listar y editar aliados desde el panel necesitas configurar DATABASE_URL en Vercel y en tu entorno local."
      />
    );
  }

  const sponsors = await prisma.sponsor.findMany({
    orderBy: { updatedAt: "desc" }
  });

  return (
    <div className="space-y-6">
      <div className="card p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="pill">Aliados</p>
            <h1 className="mt-4 text-4xl font-black">Gestionar aliados</h1>
          </div>
          <Link href="/admin/sponsors/new" className="btn-primary !px-4 !py-2 text-sm">
            Nuevo aliado
          </Link>
        </div>
      </div>

      <div className="card p-8">
        {sponsors.length === 0 ? (
          <p className="text-sm text-[color:var(--muted)]">Todavía no hay aliados en la base.</p>
        ) : (
          <div className="space-y-3">
            {sponsors.map((aliado) => (
              <Link
                key={aliado.id}
                href={`/admin/sponsors/${aliado.id}`}
                className="flex items-center justify-between rounded-2xl border border-[color:var(--line)] p-4"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <p className="font-semibold">{aliado.name}</p>
                    <span className="rounded-full border border-[color:var(--line)] px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-[color:var(--muted)]">
                      {aliado.isVisible ? "Visible" : "Oculto"}
                    </span>
                  </div>
                  <p className="text-xs text-[color:var(--muted)]">{aliado.slug}</p>
                </div>
                <p className="text-xs text-[color:var(--muted)]">{formatDate(aliado.updatedAt)}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
