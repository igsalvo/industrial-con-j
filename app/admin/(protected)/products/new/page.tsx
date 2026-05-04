import Link from "next/link";
import { ContentRecordForm } from "@/components/admin/content-record-form";
import { prisma } from "@/lib/prisma";

export default async function AdminProductNewPage() {
  const categories = await prisma.productCategory.findMany({ orderBy: [{ order: "asc" }, { name: "asc" }] });
  const fields = [
    { name: "name", label: "Nombre", required: true },
    { name: "slug", label: "Slug opcional" },
    { name: "photoUrl", label: "Foto", type: "image" },
    { name: "description", label: "Descripcion", type: "textarea", required: true },
    { name: "price", label: "Precio", type: "number", required: true },
    { name: "categoryId", label: "Categoria", type: "select", required: true, options: categories.map((item) => ({ label: item.name, value: item.id })) },
    { name: "stock", label: "Stock opcional", type: "number" },
    { name: "ctaText", label: "Texto CTA" },
    { name: "ctaLink", label: "Link CTA", type: "url" },
    { name: "order", label: "Orden", type: "number" },
    { name: "isVisible", label: "Visible", type: "checkbox" }
  ] as const;
  return <div className="space-y-6"><div className="card p-8"><p className="pill">Productos</p><h1 className="mt-4 text-4xl font-black">Crear producto</h1><Link href="/admin/products" className="btn-secondary mt-5 !px-4 !py-2 text-sm">Volver</Link></div><div className="card p-8"><ContentRecordForm mode="create" endpoint="/api/admin/products" backHref="/admin/products" submitLabel="Crear producto" fields={[...fields]} /></div></div>;
}
