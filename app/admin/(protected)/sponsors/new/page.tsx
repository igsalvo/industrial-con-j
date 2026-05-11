import Link from "next/link";
import { SponsorForm } from "@/components/admin/sponsor-form";
import { hasDatabase } from "@/lib/queries";
import { MvpPlaceholder } from "@/components/ui/mvp-placeholder";

export default async function AdminSponsorNewPage() {
  if (!hasDatabase()) {
    return (
      <MvpPlaceholder
        eyebrow="Admin"
        title="Falta conectar la base de datos"
        description="Para crear aliados desde el panel necesitas configurar DATABASE_URL en Vercel y en tu entorno local."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="card p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="pill">Aliados</p>
            <h1 className="mt-4 text-4xl font-black">Crear aliado</h1>
          </div>
          <Link href="/admin/sponsors" className="btn-secondary !px-4 !py-2 text-sm">
            Volver a aliados
          </Link>
        </div>
      </div>
      <div className="card p-8">
        <SponsorForm mode="create" />
      </div>
    </div>
  );
}
