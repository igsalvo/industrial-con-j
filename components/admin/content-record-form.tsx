"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { UploadField } from "@/components/admin/upload-field";

type Field =
  | { name: string; label: string; type?: "text" | "number" | "textarea" | "select" | "url" | "image" | "checkbox" | "json"; required?: boolean; options?: ReadonlyArray<{ label: string; value: string }> };

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
      } else if (field.type === "json") {
        try {
          payload[field.name] = JSON.parse(String(formData.get(field.name) || "[]"));
        } catch {
          setError(`El JSON de ${field.label} no es valido.`);
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
                <input defaultChecked={Boolean(record?.[field.name] ?? true)} name={field.name} type="checkbox" />
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
          return (
            <label key={field.name} className="space-y-2">
              <span className="block text-sm font-semibold">{field.label}</span>
              <input className="field" name={field.name} type={field.type === "number" ? "number" : field.type === "url" ? "url" : "text"} defaultValue={defaultValue} required={field.required} step={field.name === "price" ? "0.01" : undefined} />
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
