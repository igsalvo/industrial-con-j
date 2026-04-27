import Link from "next/link";
import { notFound } from "next/navigation";
import { GuestForm } from "@/components/admin/guest-form";
import { hasDatabase } from "@/lib/queries";
import { prisma } from "@/lib/prisma";
import { MvpPlaceholder } from "@/components/ui/mvp-placeholder";

export default async function AdminGuestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  if (!hasDatabase()) {
    return (
      <MvpPlaceholder
        eyebrow="Admin"
        title="Falta conectar la base de datos"
        description="Para editar invitados desde el panel necesitas configurar DATABASE_URL en Vercel y en tu entorno local."
      />
    );
  }

  const { id } = await params;
  const guest = await prisma.guest.findUnique({ where: { id } });

  if (!guest) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="card p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="pill">Invitados</p>
            <h1 className="mt-4 text-4xl font-black">Editar invitado</h1>
          </div>
          <Link href="/admin/guests" className="btn-secondary !px-4 !py-2 text-sm">
            Volver a invitados
          </Link>
        </div>
      </div>
      <div className="card p-8">
        <GuestForm mode="edit" guest={guest} />
      </div>
    </div>
  );
}
