import { ContentList } from "@/components/admin/content-list";
import { hasDatabase } from "@/lib/queries";
import { prisma } from "@/lib/prisma";
import { MvpPlaceholder } from "@/components/ui/mvp-placeholder";
import { formatDate } from "@/lib/utils";

export default async function AdminEventsPage() {
  if (!hasDatabase()) {
    return <MvpPlaceholder eyebrow="Admin" title="Falta conectar la base de datos" description="Configura DATABASE_URL para gestionar eventos." />;
  }

  const records = await prisma.event.findMany({ orderBy: [{ startsAt: "asc" }, { order: "asc" }] }).catch(() => null);
  if (!records) {
    return <MvpPlaceholder eyebrow="Eventos" title="Sección pendiente de migración" description="Aplica la migración de Prisma en la base de datos para crear y editar eventos." />;
  }

  return (
    <ContentList
      title="Gestionar eventos"
      eyebrow="Eventos"
      newHref="/admin/events/new"
      records={records}
      getHref={(record) => `/admin/events/${record.id}`}
      getTitle={(record) => String(record.title)}
      getSubtitle={(record) => `${formatDate(record.startsAt as Date)}${record.location ? ` · ${record.location}` : ""}`}
      getDate={(record) => record.updatedAt as Date}
    />
  );
}
