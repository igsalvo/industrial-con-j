import Link from "next/link";
import { ContentRecordForm } from "@/components/admin/content-record-form";
import { newsFields } from "@/app/admin/(protected)/news/fields";

export default function AdminNewsNewPage() {
  return (
    <div className="space-y-6">
      <div className="card p-8">
        <p className="pill">Noticias</p>
        <h1 className="mt-4 text-4xl font-black">Crear noticia</h1>
        <Link href="/admin/news" className="btn-secondary mt-5 !px-4 !py-2 text-sm">Volver</Link>
      </div>
      <div className="card p-8">
        <ContentRecordForm mode="create" endpoint="/api/admin/news" backHref="/admin/news" submitLabel="Crear noticia" fields={[...newsFields]} />
      </div>
    </div>
  );
}
