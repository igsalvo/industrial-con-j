import Link from "next/link";
import { ContentRecordForm } from "@/components/admin/content-record-form";

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

export default function AdminParticipationNewPage() {
  return <div className="space-y-6"><div className="card p-8"><p className="pill">Participa</p><h1 className="mt-4 text-4xl font-black">Crear item</h1><Link href="/admin/participation" className="btn-secondary mt-5 !px-4 !py-2 text-sm">Volver</Link></div><div className="card p-8"><ContentRecordForm mode="create" endpoint="/api/admin/participation" backHref="/admin/participation" submitLabel="Crear item" fields={[...fields]} /></div></div>;
}
