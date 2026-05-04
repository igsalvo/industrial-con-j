import Link from "next/link";
import { notFound } from "next/navigation";
import { ContentRecordForm } from "@/components/admin/content-record-form";
import { prisma } from "@/lib/prisma";

const fields = [
  { name: "title", label: "Titulo", required: true },
  { name: "description", label: "Descripcion", type: "textarea", required: true },
  { name: "type", label: "Tipo", type: "select", required: true, options: [
    { label: "Donacion", value: "DONATION" },
    { label: "Auspicio", value: "SPONSORSHIP" },
    { label: "Participacion", value: "PARTICIPATION" }
  ] },
  { name: "imageUrl", label: "Imagen opcional", type: "image" },
  { name: "icon", label: "Icono opcional" },
  { name: "ctaText", label: "Texto CTA" },
  { name: "ctaLink", label: "Link CTA", type: "url" },
  { name: "order", label: "Orden", type: "number" },
  { name: "isVisible", label: "Visible", type: "checkbox" }
] as const;

export default async function AdminParticipationEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const record = await prisma.participationItem.findUnique({ where: { id } });
  if (!record) notFound();
  return <div className="space-y-6"><div className="card p-8"><p className="pill">Participa</p><h1 className="mt-4 text-4xl font-black">Editar item</h1><Link href="/admin/participation" className="btn-secondary mt-5 !px-4 !py-2 text-sm">Volver</Link></div><div className="card p-8"><ContentRecordForm mode="edit" endpoint="/api/admin/participation" backHref="/admin/participation" submitLabel="Guardar cambios" record={record} fields={[...fields]} /></div></div>;
}
