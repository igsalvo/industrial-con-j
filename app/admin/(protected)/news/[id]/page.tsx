import Link from "next/link";
import { ContentRecordForm } from "@/components/admin/content-record-form";
import { newsFields } from "@/app/admin/(protected)/news/fields";
import { MvpPlaceholder } from "@/components/ui/mvp-placeholder";
import { formatChileDateTimeLocal } from "@/lib/date-time";
import { prisma } from "@/lib/prisma";

function normalizeRecord(record: NonNullable<Awaited<ReturnType<typeof prisma.newsItem.findUnique>>>) {
  const placement = record.showOnNews && record.showOnAlumniNews ? "BOTH" : record.showOnAlumniNews ? "ALUMNI" : "NEWS";

  return {
    ...record,
    tags: record.tags.join(", "),
    placement,
    publishedAt: formatChileDateTimeLocal(record.publishedAt)
  };
}

export default async function AdminNewsEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const record = await prisma.newsItem.findUnique({ where: { id } }).catch(() => null);
  if (!record) {
    return <MvpPlaceholder eyebrow="Noticias" title="Noticia no encontrada" description="La noticia no existe o falta aplicar la migración de Prisma." />;
  }

  return (
    <div className="space-y-6">
      <div className="card p-8">
        <p className="pill">Noticias</p>
        <h1 className="mt-4 text-4xl font-black">Editar noticia</h1>
        <Link href="/admin/news" className="btn-secondary mt-5 !px-4 !py-2 text-sm">Volver</Link>
      </div>
      <div className="card p-8">
        <ContentRecordForm mode="edit" endpoint="/api/admin/news" backHref="/admin/news" submitLabel="Guardar cambios" record={normalizeRecord(record)} fields={[...newsFields]} />
      </div>
    </div>
  );
}
