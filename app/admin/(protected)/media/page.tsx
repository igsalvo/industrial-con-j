import { ContentList } from "@/components/admin/content-list";
import { MvpPlaceholder } from "@/components/ui/mvp-placeholder";
import { hasDatabase } from "@/lib/queries";
import { prisma } from "@/lib/prisma";

export default async function AdminMediaPage() {
  if (!hasDatabase()) {
    return <MvpPlaceholder eyebrow="Imágenes" title="Falta conectar la base de datos" description="Configura DATABASE_URL para gestionar imágenes del sitio." />;
  }

  const records = await prisma.mediaItem.findMany({ orderBy: [{ section: "asc" }, { order: "asc" }, { updatedAt: "desc" }] }).catch(() => null);
  if (!records) {
    return <MvpPlaceholder eyebrow="Imágenes" title="Sección pendiente de migración" description="Aplica la migración de Prisma para crear y editar imágenes administrables." />;
  }

  return (
    <ContentList
      title="Gestionar imágenes"
      eyebrow="Media"
      newHref="/admin/media/new"
      records={records}
      getHref={(record) => `/admin/media/${record.id}`}
      getTitle={(record) => String(record.label || record.alt || record.section)}
      getSubtitle={(record) => `${record.section} · ${record.positionX || "center"} ${record.positionY || "center"}`}
      getDate={(record) => record.updatedAt as Date}
    />
  );
}
