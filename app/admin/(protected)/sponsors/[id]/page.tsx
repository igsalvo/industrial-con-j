import Link from "next/link";
import { notFound } from "next/navigation";
import { SponsorForm } from "@/components/admin/sponsor-form";
import { hasDatabase } from "@/lib/queries";
import { prisma } from "@/lib/prisma";
import { MvpPlaceholder } from "@/components/ui/mvp-placeholder";

export default async function AdminSponsorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  if (!hasDatabase()) {
    return (
      <MvpPlaceholder
        eyebrow="Admin"
        title="Falta conectar la base de datos"
        description="Para editar sponsors desde el panel necesitas configurar DATABASE_URL en Vercel y en tu entorno local."
      />
    );
  }

  const { id } = await params;
  const sponsor = await prisma.sponsor.findUnique({ where: { id } });

  if (!sponsor) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="card p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="pill">Sponsors</p>
            <h1 className="mt-4 text-4xl font-black">Editar sponsor</h1>
          </div>
          <Link href="/admin/sponsors" className="btn-secondary !px-4 !py-2 text-sm">
            Volver a sponsors
          </Link>
        </div>
      </div>
      <div className="card p-8">
        <SponsorForm mode="edit" sponsor={sponsor} />
      </div>
    </div>
  );
}
