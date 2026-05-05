import Link from "next/link";
import { ContentRecordForm } from "@/components/admin/content-record-form";

const fields = [
  { name: "kind", label: "Tipo", type: "select", required: true, options: [
    { label: "Propósito", value: "Proposito" },
    { label: "Visión", value: "Vision" },
    { label: "Misión", value: "Mision" },
    { label: "Valores", value: "Valores" }
  ] },
  { name: "title", label: "Título", required: true },
  { name: "text", label: "Texto", type: "textarea", required: true },
  { name: "icon", label: "Icono opcional" },
  { name: "imageUrl", label: "Imagen opcional", type: "image" },
  { name: "order", label: "Orden", type: "number" },
  { name: "isVisible", label: "Visible", type: "checkbox" }
] as const;

export default function AdminIdentityNewPage() {
  return (
    <div className="space-y-6">
      <div className="card p-8"><p className="pill">Identidad</p><h1 className="mt-4 text-4xl font-black">Crear elemento</h1><Link href="/admin/identity" className="btn-secondary mt-5 !px-4 !py-2 text-sm">Volver</Link></div>
      <div className="card p-8"><ContentRecordForm mode="create" endpoint="/api/admin/identity" backHref="/admin/identity" submitLabel="Crear elemento" fields={[...fields]} /></div>
    </div>
  );
}
