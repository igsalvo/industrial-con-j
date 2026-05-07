"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Global error boundary captured an error", error);
  }, [error]);

  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <main className="shell py-12">
          <div className="card p-8">
            <p className="pill">Error</p>
            <h1 className="mt-4 text-3xl font-black">No se pudo iniciar la aplicación</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[color:var(--muted)]">
              Hubo un fallo inesperado. Reintenta cargar la experiencia.
            </p>
            <button className="btn-primary mt-6" type="button" onClick={reset}>
              Reintentar
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
