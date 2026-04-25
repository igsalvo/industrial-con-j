import Link from "next/link";

export default function CommunityPage() {
  return (
    <section className="shell py-12">
      <div className="max-w-3xl">
        <p className="pill">Comunidad</p>
        <h1 className="mt-4 text-4xl font-black">Comunidad en preparacion</h1>
        <p className="mt-4 text-sm text-[color:var(--muted)]">
          Para el MVP priorizamos una experiencia publica simple. Las encuestas, concursos y formularios interactivos vuelven en la siguiente etapa.
        </p>
      </div>

      <div className="mt-8 card max-w-3xl p-8">
        <h2 className="text-2xl font-bold">Que si queda activo hoy</h2>
        <ul className="mt-4 space-y-3 text-sm text-[color:var(--muted)]">
          <li>Explorar episodios y perfiles de invitados.</li>
          <li>Salir a Spotify, YouTube y Apple Podcasts.</li>
          <li>Mostrar sponsors y propuesta editorial del proyecto.</li>
        </ul>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/episodes" className="btn-primary">
            Ver episodios
          </Link>
          <a href="mailto:hola@industrialconj.cl" className="btn-secondary">
            Contactar al equipo
          </a>
        </div>
      </div>
    </section>
  );
}
