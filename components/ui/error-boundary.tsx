"use client";

import type { ErrorInfo, ReactNode } from "react";
import { Component } from "react";

type ErrorBoundaryState = {
  hasError: boolean;
};

export class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Keep client-side failures visible in logs without taking down the whole UI.
    console.error("Client boundary captured an error", { error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="shell py-12">
          <div className="card p-8">
            <p className="pill">Error</p>
            <h1 className="mt-4 text-3xl font-black">No se pudo cargar esta vista</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[color:var(--muted)]">
              Ocurrió un problema en el navegador. Recarga la página o vuelve al inicio para continuar.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button className="btn-primary" type="button" onClick={() => this.setState({ hasError: false })}>
                Reintentar
              </button>
              <a className="btn-secondary" href="/">
                Ir al inicio
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
