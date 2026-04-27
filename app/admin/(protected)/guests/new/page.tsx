import Link from "next/link";
import { GuestForm } from "@/components/admin/guest-form";
import { hasDatabase } from "@/lib/queries";
import { MvpPlaceholder } from "@/components/ui/mvp-placeholder";

export default async function AdminGuestNewPage() {
  if (!hasDatabase()) {
    return (
      <MvpPlaceholder
        eyebrow="Admin"
        title="Falta conectar la base de datos"
        description="Para crear invitados desde el panel necesitas configurar DATABASE_URL en Vercel y en tu entorno local."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="card p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="pill">Invitados</p>
            <h1 className="mt-4 text-4xl font-black">Crear invitado</h1>
          </div>
          <Link href="/admin/guests" className="btn-secondary !px-4 !py-2 text-sm">
            Volver a invitados
          </Link>
        </div>
      </div>
      <div className="card p-8">
        <GuestForm mode="create" />
      </div>
    </div>
  );
}
