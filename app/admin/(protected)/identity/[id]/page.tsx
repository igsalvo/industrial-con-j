import Link from "next/link";
import { notFound } from "next/navigation";
import { ContentRecordForm } from "@/components/admin/content-record-form";
import { prisma } from "@/lib/prisma";

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

export default async function AdminIdentityEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const record = await prisma.identityItem.findUnique({ where: { id } });
  if (!record) notFound();
  return (
    <div className="space-y-6">
      <div className="card p-8"><p className="pill">Identidad</p><h1 className="mt-4 text-4xl font-black">Editar elemento</h1><Link href="/admin/identity" className="btn-secondary mt-5 !px-4 !py-2 text-sm">Volver</Link></div>
      <div className="card p-8"><ContentRecordForm mode="edit" endpoint="/api/admin/identity" backHref="/admin/identity" submitLabel="Guardar cambios" record={record} fields={[...fields]} /></div>
    </div>
  );
}
