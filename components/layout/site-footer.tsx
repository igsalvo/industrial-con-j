import Link from "next/link";

export function SiteFooter({ showCommunityLink = true }: { showCommunityLink?: boolean }) {
  return (
    <footer className="border-t border-[color:var(--line)] py-10">
      <div className="shell flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xl" style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}>Industrial con J</p>
          <p className="mt-2 max-w-xl text-sm text-[color:var(--muted)]">
            Contenido para lideres de operaciones, ingenieria industrial y equipos que quieren escalar sistemas reales.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-[color:var(--muted)]">
          <Link href="/episodes">Episodios</Link>
          <Link href="/guests">Invitados</Link>
          <Link href="/sponsors">Sponsors</Link>
          {showCommunityLink ? <Link href="/community">Comunidad</Link> : null}
          <a href="https://instagram.com" target="_blank" rel="noreferrer">
            Instagram
          </a>
          <a href="https://www.linkedin.com/company/ingenieria-industrial-uchile/posts/?feedView=all" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
