"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const links = [
  { href: "/episodes", label: "Episodios" },
  { href: "/guests", label: "Invitados" },
  { href: "/sponsors", label: "Sponsors" },
  { href: "/community", label: "Comunidad" }
];

export function SiteHeader({ showCommunityLink = true }: { showCommunityLink?: boolean }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");
  const visibleLinks = showCommunityLink ? links : links.filter((link) => link.href !== "/community");

  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--line)] bg-[color:var(--surface)]/90 backdrop-blur-xl">
      <div className="shell flex items-center justify-between gap-4 py-4">
        <Link href={isAdminRoute ? "/admin" : "/"} className="flex items-center gap-3">
          <div className="relative h-11 w-11 overflow-hidden rounded-2xl border border-[color:var(--line)] bg-white">
            <Image src="/logo-podcast.jpg" alt="Logo Industrial con J" fill className="object-cover" sizes="44px" priority />
          </div>
          <div>
            <p className="brand-kicker text-xs text-[color:var(--muted)]">{isAdminRoute ? "Admin" : "Podcast"}</p>
            <p className="text-xl" style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}>
              {isAdminRoute ? "Industrial con J Admin" : "Industrial con J"}
            </p>
          </div>
        </Link>

        {!isAdminRoute ? <nav className="hidden items-center gap-6 lg:flex">
          {visibleLinks.map((link: { href: string; label: string }) => (
            <Link key={link.href} href={link.href} className="text-base text-[color:var(--muted)] transition hover:text-[color:var(--foreground)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
              {link.label}
            </Link>
          ))}
        </nav> : null}

        <div className="flex items-center gap-3">
          {!isAdminRoute ? (
            <Link href="/search" className="btn-secondary gap-2 !px-4 !py-3 text-sm">
              <Search size={16} />
              Buscar
            </Link>
          ) : null}
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
