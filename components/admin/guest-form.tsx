"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { UploadField } from "@/components/admin/upload-field";

export function GuestForm({
  mode,
  guest
}: {
  mode: "create" | "edit";
  guest?: {
    id: string;
    name: string;
    slug: string;
    bio: string;
    company: string | null;
    role: string | null;
    profileImage: string | null;
    industries: string[];
    socialLinks: unknown;
  };
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const links = (guest?.socialLinks ?? {}) as Record<string, string | undefined>;

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const response = await fetch(mode === "create" ? "/api/admin/guests" : `/api/admin/guests/${guest?.id}`, {
      method: mode === "create" ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        slug: formData.get("slug"),
        bio: formData.get("bio"),
        company: formData.get("company"),
        role: formData.get("role"),
        profileImage: formData.get("profileImage"),
        industries: formData.get("industries"),
        linkedin: formData.get("linkedin"),
        x: formData.get("x"),
        website: formData.get("website")
      })
    });

    const body = await response.json();

    if (!response.ok) {
      setError(body.error || "No se pudo guardar el invitado.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  async function onDelete() {
    if (!guest || !window.confirm("Eliminar invitado?")) {
      return;
    }

    await fetch(`/api/admin/guests/${guest.id}`, { method: "DELETE" });
    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-2">
        <input className="field" name="name" placeholder="Nombre" defaultValue={guest?.name} required />
        <input className="field" name="slug" placeholder="slug-opcional" defaultValue={guest?.slug} />
      </div>
      <textarea className="field min-h-40" name="bio" placeholder="Bio" defaultValue={guest?.bio} required />
      <div className="grid gap-4 lg:grid-cols-3">
        <input className="field" name="company" placeholder="Empresa" defaultValue={guest?.company || ""} />
        <input className="field" name="role" placeholder="Cargo" defaultValue={guest?.role || ""} />
        <UploadField name="profileImage" label="Imagen de perfil" defaultValue={guest?.profileImage || ""} />
      </div>
      <input className="field" name="industries" placeholder="Manufacturing, Mining" defaultValue={guest?.industries.join(", ")} />
      <div className="grid gap-4 lg:grid-cols-3">
        <input className="field" name="linkedin" placeholder="LinkedIn URL" defaultValue={links.linkedin || ""} />
        <input className="field" name="x" placeholder="X URL" defaultValue={links.x || ""} />
        <input className="field" name="website" placeholder="Website URL" defaultValue={links.website || ""} />
      </div>
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
      <div className="flex flex-wrap gap-3">
        <button className="btn-primary" type="submit">
          {mode === "create" ? "Crear invitado" : "Guardar cambios"}
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
