"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminLoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password")
      })
    });

    const payload = await response.json();

    if (!response.ok) {
      setError(payload.error || "No se pudo iniciar sesion.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="card mx-auto max-w-md space-y-4 p-8">
      <div>
        <p className="pill">Acceso seguro</p>
        <h1 className="mt-4 text-3xl font-black">Admin Industrial con J</h1>
      </div>
      <input className="field" name="email" placeholder="admin@industrialconj.com" type="email" required />
      <input className="field" name="password" placeholder="********" type="password" required />
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
      <button className="btn-primary w-full" type="submit" disabled={loading}>
        {loading ? "Ingresando..." : "Ingresar"}
      </button>
    </form>
  );
}
