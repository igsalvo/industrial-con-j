"use client";

import { useRef, useState } from "react";

export function UploadField({
  name,
  label,
  defaultValue
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(defaultValue || "");
  const [status, setStatus] = useState("Subir archivo");

  async function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setStatus("Subiendo...");
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/admin/uploads", {
      method: "POST",
      body: formData
    });
    const payload = await response.json();

    if (!response.ok) {
      setStatus(payload.error || "Fallo la subida");
      return;
    }

    setValue(payload.url);
    setStatus("Archivo listo");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold">{label}</label>
      <input className="field" name={name} value={value} onChange={(event) => setValue(event.target.value)} placeholder="/uploads/archivo.png o https://..." />
      <div className="flex flex-wrap items-center gap-3">
        <input ref={inputRef} type="file" onChange={onFileChange} className="text-sm" />
        <span className="text-xs text-[color:var(--muted)]">{status}</span>
      </div>
    </div>
  );
}
