import Link from "next/link";
import { notFound } from "next/navigation";
import { ContentRecordForm } from "@/components/admin/content-record-form";
import { prisma } from "@/lib/prisma";

const fields = [
  { name: "name", label: "Nombre", required: true },
  { name: "calendarIdOrUrl", label: "ID o URL del Google Calendar", required: true },
  { name: "logoUrl", label: "Logo", type: "image" },
  { name: "order", label: "Orden", type: "number" },
  { name: "isVisible", label: "Visible", type: "checkbox" }
] as const;

export default async function AdminCalendarSourceEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const record = await prisma.calendarSource.findUnique({ where: { id } }).catch(() => null);
  if (!record) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="card p-8">
        <p className="pill">Calendarios</p>
        <h1 className="mt-4 text-4xl font-black">Editar calendario</h1>
        <Link href="/admin/calendar-sources" className="btn-secondary mt-5 !px-4 !py-2 text-sm">Volver</Link>
      </div>
      <div className="card p-8">
        <ContentRecordForm mode="edit" endpoint="/api/admin/calendar-sources" backHref="/admin/calendar-sources" submitLabel="Guardar cambios" record={record} fields={[...fields]} />
      </div>
    </div>
  );
}
