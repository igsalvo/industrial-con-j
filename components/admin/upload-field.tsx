"use client";

import { useId, useState } from "react";

export function UploadField({
  name,
  label,
  defaultValue
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
}) {
  const [value, setValue] = useState(defaultValue || "");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const inputId = useId();

  async function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/uploads", {
        method: "POST",
        body: formData
      });

      const body = await response.json();

      if (!response.ok) {
        setError(body.error || "No se pudo subir la imagen.");
        setUploading(false);
        return;
      }

      setValue(body.url || "");
    } catch {
      setError("No se pudo subir la imagen.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold">{label}</label>
      <input className="field" name={name} value={value} onChange={(event) => setValue(event.target.value)} placeholder="https://..." />
      <div className="flex flex-wrap items-center gap-3">
        <label htmlFor={inputId} className="btn-secondary !px-4 !py-2 text-sm cursor-pointer">
          {uploading ? "Subiendo..." : "Subir imagen"}
        </label>
        <input id={inputId} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
        <span className="text-xs text-[color:var(--muted)]">Tambien puedes pegar una URL publica manualmente.</span>
      </div>
      {error ? <p className="text-xs text-red-500">{error}</p> : null}
    </div>
  );
}
