import { ContentList } from "@/components/admin/content-list";
import { hasDatabase } from "@/lib/queries";
import { prisma } from "@/lib/prisma";
import { MvpPlaceholder } from "@/components/ui/mvp-placeholder";

export default async function AdminProductsPage() {
  if (!hasDatabase()) return <MvpPlaceholder eyebrow="Admin" title="Falta conectar la base de datos" description="Configura DATABASE_URL para gestionar productos." />;
  const records = await prisma.product.findMany({ include: { category: true }, orderBy: [{ order: "asc" }, { updatedAt: "desc" }] }).catch(() => null);
  if (!records) return <MvpPlaceholder eyebrow="Productos" title="Seccion pendiente de migracion" description="Aplica la migracion de Prisma en la base de datos para crear y editar productos." />;
  return <ContentList title="Gestionar productos" eyebrow="TienDIIta" newHref="/admin/products/new" records={records} getHref={(r) => `/admin/products/${r.id}`} getTitle={(r) => String(r.name)} getSubtitle={(r) => `${(r.category as { name?: string })?.name || ""} · $${Number(r.price).toLocaleString("es-CL")}`} getDate={(r) => r.updatedAt as Date} />;
}
