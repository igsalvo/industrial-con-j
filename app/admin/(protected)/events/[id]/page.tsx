import Link from "next/link";
import { ContentRecordForm } from "@/components/admin/content-record-form";
import { MvpPlaceholder } from "@/components/ui/mvp-placeholder";
import { prisma } from "@/lib/prisma";

const fields = [
  { name: "title", label: "Título", required: true },
  { name: "description", label: "Descripción", type: "textarea", required: true },
  { name: "startsAt", label: "Fecha y hora de inicio", type: "datetime-local", required: true },
  { name: "endsAt", label: "Fecha y hora de término", type: "datetime-local" },
  { name: "location", label: "Lugar" },
  { name: "type", label: "Tipo" },
  { name: "imageUrl", label: "Imagen opcional", type: "image" },
  { name: "ctaText", label: "Texto CTA" },
  { name: "ctaLink", label: "Link CTA", type: "url" },
  { name: "order", label: "Orden", type: "number" },
  { name: "isVisible", label: "Visible", type: "checkbox" }
] as const;

function normalizeRecord(record: NonNullable<Awaited<ReturnType<typeof prisma.event.findUnique>>>) {
  return {
    ...record,
    startsAt: record.startsAt.toISOString().slice(0, 16),
    endsAt: record.endsAt ? record.endsAt.toISOString().slice(0, 16) : ""
  };
}

export default async function AdminEventEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const record = await prisma.event.findUnique({ where: { id } }).catch(() => null);
  if (!record) {
    return <MvpPlaceholder eyebrow="Eventos" title="Evento no encontrado" description="El evento no existe o falta aplicar la migración de Prisma." />;
  }

  return (
    <div className="space-y-6">
      <div className="card p-8">
        <p className="pill">Eventos</p>
        <h1 className="mt-4 text-4xl font-black">Editar evento</h1>
        <Link href="/admin/events" className="btn-secondary mt-5 !px-4 !py-2 text-sm">Volver</Link>
      </div>
      <div className="card p-8">
        <ContentRecordForm mode="edit" endpoint="/api/admin/events" backHref="/admin/events" submitLabel="Guardar cambios" record={normalizeRecord(record)} fields={[...fields]} />
      </div>
    </div>
  );
}
