"use client";

import { useEffect } from "react";

export default function AppError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Route error boundary captured an error", error);
  }, [error]);

  return (
    <section className="shell py-12">
      <div className="card p-8">
        <p className="pill">Error</p>
        <h1 className="mt-4 text-3xl font-black">Algo falló al cargar la página</h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-[color:var(--muted)]">
          La aplicación sigue activa. Puedes reintentar sin perder la navegación completa.
        </p>
        <button className="btn-primary mt-6" type="button" onClick={reset}>
          Reintentar
        </button>
      </div>
    </section>
  );
}
