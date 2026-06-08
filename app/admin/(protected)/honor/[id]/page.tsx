import Link from "next/link";
import { notFound } from "next/navigation";
import { ContentRecordForm } from "@/components/admin/content-record-form";
import { prisma } from "@/lib/prisma";

const fields = [
  { name: "name", label: "Nombre", required: true },
  { name: "photoUrl", label: "Foto", type: "image" },
  { name: "photoPositionX", label: "Posición horizontal de foto (0 izquierda, 100 derecha)", type: "number" },
  { name: "photoPositionY", label: "Posición vertical de foto (0 arriba, 100 abajo)", type: "number" },
  { name: "description", label: "Descripción", type: "textarea", required: true },
  { name: "role", label: "Cargo / rol opcional" },
  { name: "generation", label: "Año de ingreso / generación" },
  { name: "externalLinks", label: "LinkedIn URL", type: "linkedin" },
  { name: "order", label: "Orden", type: "number" },
  { name: "isVisible", label: "Visible", type: "checkbox" }
] as const;

export default async function AdminHonorEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const record = await prisma.honorMember.findUnique({ where: { id } });
  if (!record) notFound();
  return <div className="space-y-6"><div className="card p-8"><p className="pill">Alumni</p><h1 className="mt-4 text-4xl font-black">Editar persona</h1><Link href="/admin/honor" className="btn-secondary mt-5 !px-4 !py-2 text-sm">Volver</Link></div><div className="card p-8"><ContentRecordForm mode="edit" endpoint="/api/admin/honor" backHref="/admin/honor" submitLabel="Guardar cambios" record={record} fields={[...fields]} /></div></div>;
}
