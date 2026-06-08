"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { UploadField } from "@/components/admin/upload-field";

type Field =
  | { name: string; label: string; type?: "text" | "number" | "datetime-local" | "textarea" | "select" | "url" | "image" | "images" | "checkbox" | "json" | "linkedin"; required?: boolean; options?: ReadonlyArray<{ label: string; value: string }>; defaultChecked?: boolean };

type ContentRecordFormProps = {
  mode: "create" | "edit";
  endpoint: string;
  backHref: string;
  submitLabel: string;
  record?: Record<string, unknown> & { id?: string };
  fields: ReadonlyArray<Field>;
};

function stringifyDefault(value: unknown) {
  if (value === null || value === undefined) return "";
  if (typeof value === "object") return JSON.stringify(value, null, 2);
  return String(value);
}

function toStringList(value: unknown) {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
  }
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string" && item.trim().length > 0) : [];
    } catch {
      return value.trim() ? [value.trim()] : [];
    }
  }
  return [];
}

function getLinkedInDefault(value: unknown) {
  if (!Array.isArray(value)) {
    return "";
  }

  const link = value.find((item): item is { label?: unknown; url?: unknown } => {
    if (!item || typeof item !== "object") {
      return false;
    }

    const label = "label" in item ? String(item.label || "") : "";
    const url = "url" in item ? String(item.url || "") : "";
    return /linkedin/i.test(label) || /linkedin\.com/i.test(url);
  });

  return typeof link?.url === "string" ? link.url : "";
}

function ImageListField({ name, label, defaultValue }: { name: string; label: string; defaultValue: unknown }) {
  const [images, setImages] = useState(() => toStringList(defaultValue));
  const [draft, setDraft] = useState("");

  function addImage() {
    const next = draft.trim();
    if (!next) return;
    setImages((current) => [...current, next]);
    setDraft("");
  }

  function removeImage(index: number) {
    setImages((current) => current.filter((_, currentIndex) => currentIndex !== index));
  }

  return (
    <div className="space-y-3 md:col-span-2">
      <input type="hidden" name={name} value={JSON.stringify(images)} />
      <UploadField
        name={`_${name}_draft`}
        label={label}
        value={draft}
        onValueChange={setDraft}
        accept="image/*"
        uploadLabel="Subir foto"
        hint="Sube o pega una URL y luego agrégala a la galería del producto."
      />
      <button type="button" className="btn-secondary !px-4 !py-2 text-sm" onClick={addImage}>
        Agregar foto a la galería
      </button>
      {images.length ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {images.map((image, index) => (
            <div key={`${image}-${index}`} className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-strong)] p-3">
              <img src={image} alt={`Foto ${index + 1}`} className="aspect-square w-full rounded-xl object-cover" />
              <button type="button" className="btn-secondary mt-3 w-full !px-3 !py-2 text-xs" onClick={() => removeImage(index)}>
                Quitar
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function ContentRecordForm({ mode, endpoint, backHref, submitLabel, record, fields }: ContentRecordFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const jsonFields = useMemo(() => fields.filter((field) => field.type === "json").map((field) => field.name), [fields]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(event.currentTarget);
    const payload: Record<string, unknown> = {};

    for (const field of fields) {
      if (field.type === "checkbox") {
        payload[field.name] = formData.get(field.name) === "on";
      } else if (field.type === "linkedin") {
        const url = String(formData.get(field.name) || "").trim();
        payload[field.name] = url ? [{ label: "LinkedIn", url }] : [];
      } else if (field.type === "json" || field.type === "images") {
        try {
          payload[field.name] = JSON.parse(String(formData.get(field.name) || "[]"));
        } catch {
          setError(`El JSON de ${field.label} no es válido.`);
          setLoading(false);
          return;
        }
      } else {
        payload[field.name] = formData.get(field.name);
      }
    }

    for (const name of jsonFields) {
      if (!Array.isArray(payload[name])) {
        payload[name] = [];
      }
    }

    const response = await fetch(mode === "create" ? endpoint : `${endpoint}/${record?.id}`, {
      method: mode === "create" ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const body = await response.json();

    if (!response.ok) {
      setError(body.error || "No se pudo guardar.");
      setLoading(false);
      return;
    }

    router.push(backHref);
    router.refresh();
  }

  async function onDelete() {
    if (!record?.id || !window.confirm("Eliminar este registro?")) return;
    const response = await fetch(`${endpoint}/${record.id}`, { method: "DELETE" });
    if (!response.ok) {
      const body = await response.json();
      setError(body.error || "No se pudo eliminar.");
      return;
    }
    router.push(backHref);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        {fields.map((field) => {
          const defaultValue = stringifyDefault(record?.[field.name]);
          if (field.type === "checkbox") {
            return (
              <label key={field.name} className="card flex items-center gap-3 p-4 text-sm font-medium">
                <input defaultChecked={Boolean(record?.[field.name] ?? field.defaultChecked ?? true)} name={field.name} type="checkbox" />
                {field.label}
              </label>
            );
          }
          if (field.type === "textarea" || field.type === "json") {
            return (
              <label key={field.name} className="space-y-2 md:col-span-2">
                <span className="block text-sm font-semibold">{field.label}</span>
                <textarea className={`field min-h-32 ${field.type === "json" ? "font-mono text-sm" : ""}`} name={field.name} defaultValue={defaultValue} required={field.required} />
              </label>
            );
          }
          if (field.type === "select") {
            return (
              <label key={field.name} className="space-y-2">
                <span className="block text-sm font-semibold">{field.label}</span>
                <select className="field" name={field.name} defaultValue={defaultValue} required={field.required}>
                  <option value="">Seleccionar</option>
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </label>
            );
          }
          if (field.type === "image") {
            return <UploadField key={field.name} name={field.name} label={field.label} defaultValue={defaultValue} accept="image/*" />;
          }
          if (field.type === "images") {
            return <ImageListField key={field.name} name={field.name} label={field.label} defaultValue={record?.[field.name]} />;
          }
          if (field.type === "linkedin") {
            return (
              <label key={field.name} className="space-y-2 md:col-span-2">
                <span className="block text-sm font-semibold">{field.label}</span>
                <input className="field" name={field.name} type="url" placeholder="https://www.linkedin.com/in/..." defaultValue={getLinkedInDefault(record?.[field.name])} required={field.required} />
              </label>
            );
          }
          return (
            <label key={field.name} className="space-y-2">
              <span className="block text-sm font-semibold">{field.label}</span>
              <input
                className="field"
                name={field.name}
                type={field.type === "number" ? "number" : field.type === "url" ? "url" : field.type === "datetime-local" ? "datetime-local" : "text"}
                defaultValue={defaultValue}
                required={field.required}
                step={field.name === "price" ? "0.01" : undefined}
              />
            </label>
          );
        })}
      </div>

      {error ? <p className="text-sm text-red-500">{error}</p> : null}

      <div className="flex flex-wrap gap-3">
        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? "Guardando..." : submitLabel}
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
