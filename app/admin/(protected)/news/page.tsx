import { ContentList } from "@/components/admin/content-list";
import { MvpPlaceholder } from "@/components/ui/mvp-placeholder";
import { hasDatabase } from "@/lib/queries";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export default async function AdminNewsPage() {
  if (!hasDatabase()) {
    return <MvpPlaceholder eyebrow="Admin" title="Falta conectar la base de datos" description="Configura DATABASE_URL para gestionar noticias." />;
  }

  const records = await prisma.newsItem.findMany({ orderBy: [{ publishedAt: "desc" }, { order: "asc" }] }).catch(() => null);
  if (!records) {
    return <MvpPlaceholder eyebrow="Noticias" title="Sección pendiente de migración" description="Aplica la migración de Prisma en la base de datos para crear y editar noticias." />;
  }

  return (
    <ContentList
      title="Gestionar noticias"
      eyebrow="Noticias"
      newHref="/admin/news/new"
      records={records}
      getHref={(record) => `/admin/news/${record.id}`}
      getTitle={(record) => String(record.title)}
      getSubtitle={(record) => {
        const tags = Array.isArray(record.tags) ? record.tags.join(", ") : "";
        return [formatDate(record.publishedAt as Date), tags].filter(Boolean).join(" · ");
      }}
      getDate={(record) => record.updatedAt as Date}
    />
  );
}
