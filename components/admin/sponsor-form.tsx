"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { UploadField } from "@/components/admin/upload-field";

export function SponsorForm({
  mode,
  sponsor
}: {
  mode: "create" | "edit";
  sponsor?: {
    id: string;
    name: string;
    slug: string;
    websiteUrl: string;
    logoUrl: string | null;
    description: string | null;
    tier: string | null;
    isFeatured: boolean;
  };
}) {
  const router = useRouter();
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const response = await fetch(mode === "create" ? "/api/admin/sponsors" : `/api/admin/sponsors/${sponsor?.id}`, {
      method: mode === "create" ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        slug: formData.get("slug"),
        websiteUrl: formData.get("websiteUrl"),
        logoUrl: formData.get("logoUrl"),
        description: formData.get("description"),
        tier: formData.get("tier"),
        isFeatured: formData.get("isFeatured") === "on"
      })
    });

    const body = await response.json();

    if (!response.ok) {
      setError(body.error || "No se pudo guardar el sponsor.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  async function onDelete() {
    if (!sponsor || !window.confirm("Eliminar sponsor?")) {
      return;
    }

    await fetch(`/api/admin/sponsors/${sponsor.id}`, { method: "DELETE" });
    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-2">
        <input className="field" name="name" placeholder="Nombre" defaultValue={sponsor?.name} required />
        <input className="field" name="slug" placeholder="slug-opcional" defaultValue={sponsor?.slug} />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <input className="field" name="websiteUrl" placeholder="Website URL" defaultValue={sponsor?.websiteUrl} required />
        <UploadField name="logoUrl" label="Logo" defaultValue={sponsor?.logoUrl || ""} />
        <input className="field" name="tier" placeholder="Gold / Silver / Partner" defaultValue={sponsor?.tier || ""} />
      </div>
      <textarea className="field min-h-32" name="description" placeholder="Descripcion" defaultValue={sponsor?.description || ""} />
      <label className="card flex items-center gap-3 p-4 text-sm font-medium">
        <input defaultChecked={sponsor?.isFeatured} name="isFeatured" type="checkbox" />
        Sponsor destacado
      </label>
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
      <div className="flex flex-wrap gap-3">
        <button className="btn-primary" type="submit">
          {mode === "create" ? "Crear sponsor" : "Guardar cambios"}
        </button>
        {mode === "edit" ? (
          <button className="btn-secondary" type="button" onClick={onDelete}>
            Eliminar
          </button>
        ) : null}
      </div>
    </form>
  );
}
