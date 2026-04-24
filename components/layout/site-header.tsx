import Link from "next/link";
import { Search } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const links = [
  { href: "/episodes", label: "Episodios" },
  { href: "/guests", label: "Invitados" },
  { href: "/sponsors", label: "Sponsors" },
  { href: "/community", label: "Comunidad" },
  { href: "/admin", label: "Admin" }
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--line)] bg-[color:var(--surface)]/90 backdrop-blur-xl">
      <div className="shell flex items-center justify-between gap-4 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[color:var(--accent)] font-black text-white">
            J
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-[color:var(--muted)]">Podcast</p>
            <p className="text-lg font-semibold">Industrial con J</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {links.map((link: { href: string; label: string }) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-[color:var(--muted)] transition hover:text-[color:var(--foreground)]">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/search" className="btn-secondary gap-2 !px-4 !py-3 text-sm">
            <Search size={16} />
            Buscar
          </Link>
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
