import Link from "next/link";

export function MvpPlaceholder({
  eyebrow = "MVP",
  title,
  description
}: {
  eyebrow?: string;
  title: string;
  description: string;
}) {
  return (
    <section className="shell py-16">
      <div className="card max-w-3xl p-8">
        <p className="pill">{eyebrow}</p>
        <h1 className="mt-4 text-4xl font-black">{title}</h1>
        <p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">{description}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/" className="btn-primary">
            Volver al inicio
          </Link>
          <Link href="/episodes" className="btn-secondary">
            Ver episodios
          </Link>
        </div>
      </div>
    </section>
  );
}
