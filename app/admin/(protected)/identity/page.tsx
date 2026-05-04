import { ContentList } from "@/components/admin/content-list";
import { hasDatabase } from "@/lib/queries";
import { prisma } from "@/lib/prisma";
import { MvpPlaceholder } from "@/components/ui/mvp-placeholder";

export default async function AdminIdentityPage() {
  if (!hasDatabase()) return <MvpPlaceholder eyebrow="Admin" title="Falta conectar la base de datos" description="Configura DATABASE_URL para gestionar identidad." />;
  const records = await prisma.identityItem.findMany({ orderBy: [{ order: "asc" }, { updatedAt: "desc" }] });
  return <ContentList title="Gestionar identidad" eyebrow="Identidad" newHref="/admin/identity/new" records={records} getHref={(r) => `/admin/identity/${r.id}`} getTitle={(r) => String(r.title)} getSubtitle={(r) => String(r.kind)} getDate={(r) => r.updatedAt as Date} />;
}
