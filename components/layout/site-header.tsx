"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const links = [
  { href: "/podcast", label: "Podcast" },
  { href: "/events", label: "Eventos" },
  { href: "/identity", label: "Identidad" },
  { href: "/honor", label: "Alumni" },
  { href: "/tiendiita", label: "TienDIIta" },
  { href: "/donations", label: "Donaciones", cta: true },
  { href: "/contact", label: "Contacto" }
];

export function SiteHeader({
  showPodcastLink = true,
  showEventsLink = true,
  showHonorLink = true,
  showProductsLink = true,
  showIdentityLink = true,
  showCommunityLink = true,
  showDonationsLink = true,
  showContactLink = true,
  logoUrl
}: {
  showPodcastLink?: boolean;
  showEventsLink?: boolean;
  showHonorLink?: boolean;
  showProductsLink?: boolean;
  showIdentityLink?: boolean;
  showCommunityLink?: boolean;
  showDonationsLink?: boolean;
  showContactLink?: boolean;
  logoUrl?: string | null;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAdminRoute = pathname.startsWith("/admin");
  const visibleLinks = links.filter((link) => {
    if (link.href === "/podcast") {
      return showPodcastLink;
    }

    if (link.href === "/events") {
      return showEventsLink;
    }

    if (link.href === "/honor") {
      return showHonorLink;
    }

    if (link.href === "/identity") {
      return showIdentityLink;
    }

    if (link.href === "/tiendiita") {
      return showProductsLink;
    }

    if (link.href === "/community") {
      return showCommunityLink;
    }

    if (link.href === "/donations") {
      return showDonationsLink;
    }

    if (link.href === "/contact") {
      return showContactLink;
    }

    return true;
  });
  const resolvedLogo = logoUrl || "/logo-podcast.jpg";

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--line)] bg-[color:var(--surface)]/90 backdrop-blur-xl">
      <div className="shell flex items-center justify-between gap-3 py-3">
        <Link href={isAdminRoute ? "/admin" : "/"} className="flex min-w-0 flex-1 items-center lg:max-w-[330px]">
          <div className="relative h-14 w-full max-w-[210px] overflow-hidden rounded-2xl border border-[color:var(--line)] bg-white p-2 shadow-sm sm:h-20 sm:max-w-[330px]">
            <Image src={resolvedLogo} alt="Industrial con J" fill className="object-contain p-2" sizes="(min-width: 1024px) 330px, 55vw" priority />
          </div>
        </Link>

        {!isAdminRoute ? (
          <nav className="hidden items-center gap-6 lg:flex">
            {visibleLinks.map((link: { href: string; label: string }) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-base transition hover:text-[color:var(--foreground)] ${
                  "cta" in link && link.cta ? "rounded-full bg-[color:var(--accent)] px-4 py-2 font-semibold text-white shadow-[0_10px_26px_rgba(215,9,4,0.2)] hover:text-white" : "text-[color:var(--muted)]"
                } ${link.label === "TienDIIta" ? "notranslate" : ""}`}
                translate={link.label === "TienDIIta" ? "no" : undefined}
                style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        ) : null}

        <div className="hidden items-center gap-3 lg:flex">
          {!isAdminRoute ? (
            <Link href="/search" className="btn-secondary gap-2 !px-4 !py-3 text-sm">
              <Search size={16} />
              Buscar
            </Link>
          ) : null}
          {!isAdminRoute ? <LanguageToggle /> : null}
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
        </div>

        {!isAdminRoute ? (
          <button
            type="button"
            className="btn-secondary !p-3 lg:hidden"
            onClick={() => setMobileMenuOpen((isOpen) => !isOpen)}
            aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        ) : null}
      </div>

      {!isAdminRoute && mobileMenuOpen ? (
        <div className="border-t border-[color:var(--line)] bg-[color:var(--surface)] lg:hidden">
          <div className="shell space-y-4 py-4">
            <nav className="grid grid-cols-2 gap-2">
              {visibleLinks.map((link: { href: string; label: string }) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-2xl border border-[color:var(--line)] px-4 py-3 text-center text-sm font-semibold transition hover:border-[color:var(--accent)] ${
                    "cta" in link && link.cta ? "bg-[color:var(--accent)] text-white" : "bg-[color:var(--surface-strong)] text-[color:var(--foreground)]"
                  } ${link.label === "TienDIIta" ? "notranslate" : ""}`}
                  translate={link.label === "TienDIIta" ? "no" : undefined}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex flex-wrap items-center gap-3">
              <Link href="/search" className="btn-secondary gap-2 !px-4 !py-3 text-sm">
                <Search size={16} />
                Buscar
              </Link>
              <LanguageToggle />
              <ThemeToggle />
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
