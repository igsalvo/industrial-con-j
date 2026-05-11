import Link from "next/link";
import { Building2, Contact, Instagram, Linkedin, Youtube } from "lucide-react";

export function SiteFooter({
  footerTitle = "Industrial con J",
  footerDescription = "Historias, conversaciones e iniciativas que conectan a la comunidad de Ingeniería Industrial."
}: {
  footerTitle?: string | null;
  footerDescription?: string | null;
}) {
  const legacyFooterDescription = "Contenido para líderes de operaciones, ingeniería industrial y equipos que quieren escalar sistemas reales.";
  const currentFooterDescription = "Historias, conversaciones e iniciativas que conectan a la comunidad de Ingeniería Industrial.";
  const resolvedFooterDescription = !footerDescription || footerDescription === legacyFooterDescription ? currentFooterDescription : footerDescription;

  return (
    <footer className="border-t border-[color:var(--line)] py-10">
      <div className="shell flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xl" style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}>{footerTitle || "Industrial con J"}</p>
          <p className="mt-2 max-w-xl text-sm text-[color:var(--muted)]">
            {resolvedFooterDescription}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 text-sm text-[color:var(--muted)]">
          <Link className="inline-flex items-center gap-2 transition hover:text-[color:var(--foreground)]" href="/contact">
            <Contact size={16} />
            Contacto
          </Link>
          <a className="inline-flex items-center gap-2 transition hover:text-[color:var(--foreground)]" href="https://www.instagram.com/ingenieriaindustrialuchile/" target="_blank" rel="noreferrer">
            <Instagram size={16} />
            Instagram
          </a>
          <a className="inline-flex items-center gap-2 transition hover:text-[color:var(--foreground)]" href="https://www.linkedin.com/company/ingenieria-industrial-uchile/posts/?feedView=all" target="_blank" rel="noreferrer">
            <Linkedin size={16} />
            LinkedIn
          </a>
          <a className="inline-flex items-center gap-2 transition hover:text-[color:var(--foreground)]" href="https://www.youtube.com/channel/UCIk3G6moIvN8JzMt4p1H5wQ" target="_blank" rel="noreferrer">
            <Youtube size={16} />
            YouTube
          </a>
          <a className="inline-flex items-center gap-2 transition hover:text-[color:var(--foreground)]" href="https://www.dii.uchile.cl/" target="_blank" rel="noreferrer">
            <Building2 size={16} />
            Sitio web ingeniería industrial
          </a>
        </div>
      </div>
    </footer>
  );
}
