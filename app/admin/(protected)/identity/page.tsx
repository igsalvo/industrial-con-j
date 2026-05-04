import { ContentList } from "@/components/admin/content-list";
import { hasDatabase } from "@/lib/queries";
import { prisma } from "@/lib/prisma";
import { MvpPlaceholder } from "@/components/ui/mvp-placeholder";

export default async function AdminIdentityPage() {
  if (!hasDatabase()) return <MvpPlaceholder eyebrow="Admin" title="Falta conectar la base de datos" description="Configura DATABASE_URL para gestionar identidad." />;
  const records = await prisma.identityItem.findMany({ orderBy: [{ order: "asc" }, { updatedAt: "desc" }] }).catch(() => null);
  if (!records) return <MvpPlaceholder eyebrow="Identidad" title="Seccion pendiente de migracion" description="Aplica la migracion de Prisma en la base de datos para crear y editar identidad." />;
  return <ContentList title="Gestionar identidad" eyebrow="Identidad" newHref="/admin/identity/new" records={records} getHref={(r) => `/admin/identity/${r.id}`} getTitle={(r) => String(r.title)} getSubtitle={(r) => String(r.kind)} getDate={(r) => r.updatedAt as Date} />;
}
