"use client";

export function UploadField({
  name,
  label,
  defaultValue
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
}) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold">{label}</label>
      <input className="field" name={name} defaultValue={defaultValue || ""} placeholder="https://..." />
      <p className="text-xs text-[color:var(--muted)]">Para este release usa una URL publica de imagen. La subida cloud se agrega en la siguiente etapa.</p>
    </div>
  );
}
