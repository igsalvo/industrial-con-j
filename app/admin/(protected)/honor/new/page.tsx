import Link from "next/link";
import { ContentRecordForm } from "@/components/admin/content-record-form";

const fields = [
  { name: "name", label: "Nombre", required: true },
  { name: "photoUrl", label: "Foto", type: "image" },
  { name: "description", label: "Descripción", type: "textarea", required: true },
  { name: "role", label: "Cargo / rol opcional" },
  { name: "generation", label: "Generación / año opcional" },
  { name: "externalLinks", label: "Links externos JSON", type: "json" },
  { name: "order", label: "Orden", type: "number" },
  { name: "isVisible", label: "Visible", type: "checkbox" }
] as const;

export default function AdminHonorNewPage() {
  return <div className="space-y-6"><div className="card p-8"><p className="pill">Alumni</p><h1 className="mt-4 text-4xl font-black">Crear persona</h1><Link href="/admin/honor" className="btn-secondary mt-5 !px-4 !py-2 text-sm">Volver</Link></div><div className="card p-8"><ContentRecordForm mode="create" endpoint="/api/admin/honor" backHref="/admin/honor" submitLabel="Crear persona" fields={[...fields]} /></div></div>;
}
