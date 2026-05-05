import Link from "next/link";

export function SiteFooter({
  showCommunityLink = true,
  showDonationsLink = true,
  footerTitle = "Industrial con J",
  footerDescription = "Contenido para líderes de operaciónes, ingeniería industrial y equipos que quieren escalar sistemas reales."
}: {
  showCommunityLink?: boolean;
  showDonationsLink?: boolean;
  footerTitle?: string | null;
  footerDescription?: string | null;
}) {
  return (
    <footer className="border-t border-[color:var(--line)] py-10">
      <div className="shell flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xl" style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}>{footerTitle || "Industrial con J"}</p>
          <p className="mt-2 max-w-xl text-sm text-[color:var(--muted)]">
            {footerDescription || "Contenido para líderes de operaciónes, ingeniería industrial y equipos que quieren escalar sistemas reales."}
          </p>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-[color:var(--muted)]">
          <Link href="/guests">Invitados</Link>
          <Link href="/sponsors">Sponsors</Link>
          <Link href="/identity">Identidad</Link>
          <Link href="/honor">Alumni</Link>
          <Link href="/tiendiita">TienDIIta</Link>
          {showDonationsLink ? <Link href="/donations">Donaciones</Link> : null}
          <Link href="/contact">Contacto</Link>
          <a href="https://www.instagram.com/ingenieriaindustrialuchile/" target="_blank" rel="noreferrer">
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
