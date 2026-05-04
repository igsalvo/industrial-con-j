import { ContentList } from "@/components/admin/content-list";
import { hasDatabase } from "@/lib/queries";
import { prisma } from "@/lib/prisma";
import { MvpPlaceholder } from "@/components/ui/mvp-placeholder";

export default async function AdminHonorPage() {
  if (!hasDatabase()) return <MvpPlaceholder eyebrow="Admin" title="Falta conectar la base de datos" description="Configura DATABASE_URL para gestionar Alumni." />;
  const records = await prisma.honorMember.findMany({ orderBy: [{ order: "asc" }, { updatedAt: "desc" }] }).catch(() => null);
  if (!records) return <MvpPlaceholder eyebrow="Alumni" title="Seccion pendiente de migracion" description="Aplica la migracion de Prisma en la base de datos para crear y editar alumni." />;
  return <ContentList title="Gestionar Alumni" eyebrow="Alumni" newHref="/admin/honor/new" records={records} getHref={(r) => `/admin/honor/${r.id}`} getTitle={(r) => String(r.name)} getSubtitle={(r) => [r.role, r.generation].filter(Boolean).join(" · ")} getDate={(r) => r.updatedAt as Date} />;
}
