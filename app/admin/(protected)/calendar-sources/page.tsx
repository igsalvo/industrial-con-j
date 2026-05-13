import { ContentList } from "@/components/admin/content-list";
import { MvpPlaceholder } from "@/components/ui/mvp-placeholder";
import { hasDatabase } from "@/lib/queries";
import { prisma } from "@/lib/prisma";

export default async function AdminCalendarSourcesPage() {
  if (!hasDatabase()) {
    return <MvpPlaceholder eyebrow="Calendarios" title="Falta conectar la base de datos" description="Configura DATABASE_URL para gestionar calendarios externos." />;
  }

  const records = await prisma.calendarSource.findMany({ orderBy: [{ order: "asc" }, { updatedAt: "desc" }] }).catch(() => null);
  if (!records) {
    return <MvpPlaceholder eyebrow="Calendarios" title="Sección pendiente de migración" description="Aplica la migración de Prisma para crear y editar calendarios externos." />;
  }

  return (
    <ContentList
      title="Gestionar calendarios"
      eyebrow="Eventos"
      newHref="/admin/calendar-sources/new"
      records={records}
      getHref={(record) => `/admin/calendar-sources/${record.id}`}
      getTitle={(record) => String(record.name)}
      getSubtitle={(record) => String(record.calendarIdOrUrl)}
      getDate={(record) => record.updatedAt as Date}
    />
  );
}
