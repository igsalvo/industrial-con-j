import Link from "next/link";
import { ContentRecordForm } from "@/components/admin/content-record-form";
import { MvpPlaceholder } from "@/components/ui/mvp-placeholder";
import { prisma } from "@/lib/prisma";
import { mediaItemFields } from "../fields";

export default async function AdminMediaEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const record = await prisma.mediaItem.findUnique({ where: { id } }).catch(() => null);
  if (!record) {
    return <MvpPlaceholder eyebrow="Media" title="Imagen no encontrada" description="La imagen no existe o falta aplicar la migración de Prisma." />;
  }

  return (
    <div className="space-y-6">
      <div className="card p-8">
        <p className="pill">Media</p>
        <h1 className="mt-4 text-4xl font-black">Editar imagen</h1>
        <Link href="/admin/media" className="btn-secondary mt-5 !px-4 !py-2 text-sm">Volver</Link>
      </div>
      <div className="card p-8">
        <ContentRecordForm mode="edit" endpoint="/api/admin/media" backHref="/admin/media" submitLabel="Guardar cambios" record={record} fields={[...mediaItemFields]} />
      </div>
    </div>
  );
}
