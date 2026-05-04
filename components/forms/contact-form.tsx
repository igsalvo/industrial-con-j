"use client";

import { useState } from "react";

type ContactFormProps = {
  type?: "CONTACT" | "DONATION" | "SPONSORSHIP" | "PARTICIPATION";
  title?: string;
  description?: string;
  submitLabel?: string;
  showSubject?: boolean;
  showMotive?: boolean;
};

export function ContactForm({
  type = "CONTACT",
  title = "Contactanos",
  description = "Deja tus datos y un comentario. El equipo lo revisara desde el panel administrador.",
  submitLabel = "Enviar",
  showSubject = false,
  showMotive = false
}: ContactFormProps) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        name: formData.get("name"),
        email: formData.get("email"),
        subject: formData.get("subject"),
        motive: formData.get("motive"),
        phone: formData.get("phone"),
        company: formData.get("company"),
        message: formData.get("message")
      })
    });

    const payload = await response.json();

    if (!response.ok) {
      setStatus("error");
      setMessage(payload.error || "No se pudo enviar el formulario.");
      return;
    }

    event.currentTarget.reset();
    setStatus("success");
    setMessage(payload.message || "Mensaje enviado.");
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-5 p-6">
      <div>
        <p className="pill">{type === "DONATION" ? "Donaciones" : "Contacto"}</p>
        <h3 className="mt-4 text-2xl font-bold">{title}</h3>
        <p className="mt-2 text-sm text-[color:var(--muted)]">{description}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <input className="field" name="name" placeholder="Nombre" required />
        <input className="field" name="email" type="email" placeholder="Correo" required />
        {showSubject ? <input className="field" name="subject" placeholder="Asunto" required /> : null}
        {showMotive ? (
          <select className="field" name="motive" defaultValue="">
            <option value="">Motivo opcional</option>
            <option value="Consulta general">Consulta general</option>
            <option value="Invitados">Invitados</option>
            <option value="Sponsors">Sponsors</option>
            <option value="TienDIIta CEIN">TienDIIta CEIN</option>
            <option value="Donaciones">Donaciones</option>
          </select>
        ) : null}
        <input className="field" name="phone" placeholder="Telefono opcional" />
        <input className="field" name="company" placeholder="Empresa / institucion opcional" />
      </div>

      <textarea className="field min-h-32" name="message" placeholder="Comentario" required />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button type="submit" className="btn-primary" disabled={status === "submitting"}>
          {status === "submitting" ? "Enviando..." : submitLabel}
        </button>
        {message ? <p className={`text-sm ${status === "error" ? "text-red-500" : "text-[color:var(--muted)]"}`}>{message}</p> : null}
      </div>
    </form>
  );
}
