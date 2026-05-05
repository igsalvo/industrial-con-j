import { ContentList } from "@/components/admin/content-list";
import { hasDatabase } from "@/lib/queries";
import { prisma } from "@/lib/prisma";
import { MvpPlaceholder } from "@/components/ui/mvp-placeholder";

export default async function AdminParticipationPage() {
  if (!hasDatabase()) return <MvpPlaceholder eyebrow="Admin" title="Falta conectar la base de datos" description="Configura DATABASE_URL para gestionar participación." />;
  const records = await prisma.participationItem.findMany({ orderBy: [{ order: "asc" }, { updatedAt: "desc" }] }).catch(() => null);
  if (!records) return <MvpPlaceholder eyebrow="Participa" title="Sección pendiente de migración" description="Aplica la migración de Prisma en la base de datos para crear y editar participa." />;
  return <ContentList title="Gestionar donaciones y auspicios" eyebrow="Participa" newHref="/admin/participation/new" records={records} getHref={(r) => `/admin/participation/${r.id}`} getTitle={(r) => String(r.title)} getSubtitle={(r) => String(r.type)} getDate={(r) => r.updatedAt as Date} />;
}
