import Link from "next/link";
import { ContentRecordForm } from "@/components/admin/content-record-form";

const fields = [
  { name: "name", label: "Nombre", required: true },
  { name: "slug", label: "Slug opcional" },
  { name: "description", label: "Descripción", type: "textarea" },
  { name: "order", label: "Orden", type: "number" },
  { name: "isVisible", label: "Visible", type: "checkbox" }
] as const;

export default function AdminCategoryNewPage() {
  return <div className="space-y-6"><div className="card p-8"><p className="pill">Categorías</p><h1 className="mt-4 text-4xl font-black">Crear categoría</h1><Link href="/admin/product-categories" className="btn-secondary mt-5 !px-4 !py-2 text-sm">Volver</Link></div><div className="card p-8"><ContentRecordForm mode="create" endpoint="/api/admin/product-categories" backHref="/admin/product-categories" submitLabel="Crear categoría" fields={[...fields]} /></div></div>;
}
