import Link from "next/link";
import { notFound } from "next/navigation";
import { ContentRecordForm } from "@/components/admin/content-record-form";
import { MvpPlaceholder } from "@/components/ui/mvp-placeholder";
import { prisma } from "@/lib/prisma";

export default async function AdminProductEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [record, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }).catch(() => null),
    prisma.productCategory.findMany({ orderBy: [{ order: "asc" }, { name: "asc" }] }).catch(() => null)
  ]);
  if (!categories) return <MvpPlaceholder eyebrow="Productos" title="Sección pendiente de migración" description="Aplica la migración de Prisma antes de editar productos." />;
  if (!record) notFound();
  const fields = [
    { name: "name", label: "Nombre", required: true },
    { name: "slug", label: "Slug opcional" },
    { name: "photoUrl", label: "Foto principal", type: "image" },
    { name: "photoUrls", label: "Fotos adicionales", type: "images" },
    { name: "photoPositionX", label: "Encuadre horizontal", type: "select", options: [{ label: "Izquierda", value: "left" }, { label: "Centro", value: "center" }, { label: "Derecha", value: "right" }] },
    { name: "photoPositionY", label: "Encuadre vertical", type: "select", options: [{ label: "Arriba", value: "top" }, { label: "Centro", value: "center" }, { label: "Abajo", value: "bottom" }] },
    { name: "description", label: "Descripción", type: "textarea", required: true },
    { name: "price", label: "Precio", type: "number", required: true },
    { name: "categoryId", label: "Categoría", type: "select", required: true, options: categories.map((item) => ({ label: item.name, value: item.id })) },
    { name: "ctaLink", label: "Link CTA", type: "url" },
    { name: "order", label: "Orden", type: "number" },
    { name: "isVisible", label: "Visible", type: "checkbox" }
  ] as const;
  return <div className="space-y-6"><div className="card p-8"><p className="pill">Productos</p><h1 className="mt-4 text-4xl font-black">Editar producto</h1><Link href="/admin/products" className="btn-secondary mt-5 !px-4 !py-2 text-sm">Volver</Link></div><div className="card p-8"><ContentRecordForm mode="edit" endpoint="/api/admin/products" backHref="/admin/products" submitLabel="Guardar cambios" record={record} fields={[...fields]} /></div></div>;
}
