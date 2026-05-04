import { ContentList } from "@/components/admin/content-list";
import { hasDatabase } from "@/lib/queries";
import { prisma } from "@/lib/prisma";
import { MvpPlaceholder } from "@/components/ui/mvp-placeholder";

export default async function AdminProductCategoriesPage() {
  if (!hasDatabase()) return <MvpPlaceholder eyebrow="Admin" title="Falta conectar la base de datos" description="Configura DATABASE_URL para gestionar categorias." />;
  const records = await prisma.productCategory.findMany({ orderBy: [{ order: "asc" }, { name: "asc" }] }).catch(() => null);
  if (!records) return <MvpPlaceholder eyebrow="Categorias" title="Seccion pendiente de migracion" description="Aplica la migracion de Prisma en la base de datos para crear y editar categorias." />;
  return <ContentList title="Gestionar categorias" eyebrow="TienDIIta" newHref="/admin/product-categories/new" records={records} getHref={(r) => `/admin/product-categories/${r.id}`} getTitle={(r) => String(r.name)} getSubtitle={(r) => String(r.slug)} getDate={(r) => r.updatedAt as Date} />;
}
