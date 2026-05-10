"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
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

  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--line)] bg-[color:var(--surface)]/90 backdrop-blur-xl">
      <div className="shell flex items-center justify-between gap-4 py-3">
        <Link href={isAdminRoute ? "/admin" : "/"} className="flex min-w-[150px] flex-1 items-center sm:min-w-[220px] lg:max-w-[330px]">
          <div className="relative h-16 w-full overflow-hidden rounded-2xl border border-[color:var(--line)] bg-white p-2 shadow-sm sm:h-20">
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

        <div className="flex items-center gap-3">
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
      </div>
    </header>
  );
}
