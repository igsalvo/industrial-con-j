import Link from "next/link";
import { ContentRecordForm } from "@/components/admin/content-record-form";
import { mediaItemFields } from "../fields";

export default function AdminMediaNewPage() {
  return (
    <div className="space-y-6">
      <div className="card p-8">
        <p className="pill">Media</p>
        <h1 className="mt-4 text-4xl font-black">Nueva imagen</h1>
        <Link href="/admin/media" className="btn-secondary mt-5 !px-4 !py-2 text-sm">Volver</Link>
      </div>
      <div className="card p-8">
        <ContentRecordForm mode="create" endpoint="/api/admin/media" backHref="/admin/media" submitLabel="Crear imagen" fields={[...mediaItemFields]} />
      </div>
    </div>
  );
}
