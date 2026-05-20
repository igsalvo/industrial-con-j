"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, ShoppingCart, X } from "lucide-react";
import { useEffect, useState } from "react";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { trackEvent } from "@/lib/analytics";

const links = [
  { href: "/podcast", label: "Podcast" },
  { href: "/events", label: "Eventos" },
  { href: "/identity", label: "Identidad" },
  { href: "/honor", label: "Alumni" },
  { href: "/tiendiita", label: "TienDIIta" },
  { href: "/donations", label: "Donaciones", cta: true },
  { href: "/contact", label: "Contacto" }
];

function getNavigationEvent(href: string) {
  if (href === "/events") return "click_event";
  if (href === "/tiendiita") return "click_tiendita";
  if (href === "/donations") return "click_donation";
  if (href === "/contact") return "click_contact";
  return null;
}

export function SiteHeader({
  showPodcastLink = true,
  showEventsLink = true,
  showHonorLink = true,
  showProductsLink = true,
  showIdentityLink = true,
  showCommunityLink = true,
  showDonationsLink = true,
  showContactLink = true,
  showThemeToggle = false,
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
  showThemeToggle?: boolean;
  logoUrl?: string | null;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const isAdminRoute = pathname.startsWith("/admin");
  const isTiendiitaRoute = pathname.startsWith("/tiendiita");
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

  useEffect(() => {
    if (!isTiendiitaRoute) {
      setCartCount(0);
      return;
    }

    const readCartCount = () => {
      try {
        const cartItems = JSON.parse(window.localStorage.getItem("tiendiita-cart") || "[]") as Array<{ quantity?: number }>;
        setCartCount(cartItems.reduce((total, item) => total + (Number(item.quantity) || 0), 0));
      } catch {
        setCartCount(0);
      }
    };

    readCartCount();
    window.addEventListener("storage", readCartCount);
    window.addEventListener("tiendiita-cart-updated", readCartCount);

    return () => {
      window.removeEventListener("storage", readCartCount);
      window.removeEventListener("tiendiita-cart-updated", readCartCount);
    };
  }, [isTiendiitaRoute]);

  function toggleCart() {
    trackEvent("click_tiendita", {
      link_text: "Carrito",
      section: "tiendita_cart"
    });
    window.dispatchEvent(new CustomEvent("tiendiita-cart-toggle"));
  }

  function trackNavigation(href: string, label: string, section: string) {
    const eventName = getNavigationEvent(href);
    if (!eventName) {
      return;
    }

    trackEvent(eventName, {
      link_url: href,
      link_text: label,
      section
    });
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--line)] bg-[color:var(--surface)]/90 backdrop-blur-xl">
      <div className="shell flex items-center justify-between gap-3 py-3">
        <Link href={isAdminRoute ? "/admin" : "/"} className="flex min-w-0 flex-1 items-center lg:max-w-[330px]">
          <div className="relative h-14 w-full max-w-[210px] overflow-hidden rounded-2xl border border-[color:var(--line)] bg-transparent p-2 shadow-sm sm:h-20 sm:max-w-[330px]">
            <Image src={resolvedLogo} alt="Industrial con J" fill className="object-contain p-2" sizes="(min-width: 1024px) 330px, 55vw" priority />
          </div>
        </Link>

        {!isAdminRoute ? (
          <nav className="hidden items-center gap-6 lg:flex">
            {visibleLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-base transition hover:text-[color:var(--foreground)] ${
                    "cta" in link && link.cta
                      ? "rounded-full bg-[color:var(--accent)] px-4 py-2 font-semibold text-white shadow-[0_10px_26px_rgba(215,9,4,0.2)] hover:text-white"
                      : isActive
                        ? "text-[color:var(--foreground)]"
                        : "text-[color:var(--muted)]"
                  } ${link.label === "TienDIIta" ? "notranslate" : ""}`}
                  translate={link.label === "TienDIIta" ? "no" : undefined}
                  aria-current={isActive ? "page" : undefined}
                  style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
                  onClick={() => trackNavigation(link.href, link.label, "header_nav")}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        ) : null}

        <div className="hidden items-center gap-3 lg:flex">
          {!isAdminRoute && !isTiendiitaRoute ? (
            <Link
              href="/search"
              className="btn-secondary gap-2 !px-4 !py-3 text-sm"
              onClick={() => trackEvent("click_search", { link_url: "/search", link_text: "Buscar", section: "header" })}
            >
              <Search size={16} />
              Buscar
            </Link>
          ) : null}
          {!isAdminRoute && isTiendiitaRoute ? (
            <button type="button" className="btn-primary gap-2 !px-4 !py-3 text-sm" onClick={toggleCart} aria-label="Abrir carrito de cotización">
              <ShoppingCart size={17} />
              Carrito
              <span className="grid h-6 min-w-6 place-items-center rounded-full bg-white px-2 text-xs font-black text-[color:var(--accent)]">{cartCount}</span>
            </button>
          ) : null}
          {!isAdminRoute ? <LanguageToggle /> : null}
          {showThemeToggle ? <div className="hidden sm:block">
            <ThemeToggle />
          </div> : null}
        </div>

        {!isAdminRoute && isTiendiitaRoute ? (
          <button type="button" className="btn-primary gap-2 !px-3 !py-3 text-sm lg:hidden" onClick={toggleCart} aria-label="Abrir carrito de cotización">
            <ShoppingCart size={17} />
            <span className="grid h-6 min-w-6 place-items-center rounded-full bg-white px-2 text-xs font-black text-[color:var(--accent)]">{cartCount}</span>
          </button>
        ) : null}

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
              {visibleLinks.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`rounded-2xl border px-4 py-3 text-center text-sm font-semibold transition hover:border-[color:var(--accent)] ${
                      "cta" in link && link.cta
                        ? "border-[color:var(--accent)] bg-[color:var(--accent)] text-white"
                        : isActive
                          ? "border-[color:var(--accent)] bg-[color:var(--accent-soft)] text-[color:var(--foreground)]"
                          : "border-[color:var(--line)] bg-[color:var(--surface-strong)] text-[color:var(--foreground)]"
                    } ${link.label === "TienDIIta" ? "notranslate" : ""}`}
                    translate={link.label === "TienDIIta" ? "no" : undefined}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => trackNavigation(link.href, link.label, "mobile_nav")}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex flex-wrap items-center gap-3">
              {!isTiendiitaRoute ? (
                <Link
                  href="/search"
                  className="btn-secondary gap-2 !px-4 !py-3 text-sm"
                  onClick={() => trackEvent("click_search", { link_url: "/search", link_text: "Buscar", section: "mobile_header" })}
                >
                  <Search size={16} />
                  Buscar
                </Link>
              ) : null}
              {isTiendiitaRoute ? (
                <button type="button" className="btn-primary gap-2 !px-4 !py-3 text-sm" onClick={toggleCart}>
                  <ShoppingCart size={17} />
                  Carrito
                  <span className="grid h-6 min-w-6 place-items-center rounded-full bg-white px-2 text-xs font-black text-[color:var(--accent)]">{cartCount}</span>
                </button>
              ) : null}
              <LanguageToggle />
              {showThemeToggle ? <ThemeToggle /> : null}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
