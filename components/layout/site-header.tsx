"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, Search, ShoppingCart, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { trackEvent } from "@/lib/analytics";

const links = [
  { href: "/podcast", label: "Podcast" },
  { href: "/news", label: "Noticias" },
  { href: "/events", label: "Eventos" },
  { href: "/identity", label: "Identidad" },
  { href: "/honor", label: "Alumni" },
  { href: "/tiendiita", label: "TienDIIta" },
  { href: "/donations", label: "Donaciones", cta: true },
  { href: "/contact", label: "Contacto" }
];

const alumniLinks = [
  { href: "/honor/circulo-de-honor", label: "Círculo de honor" },
  { href: "/honor/noticias-alumni", label: "Noticias Alumni" }
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
  showNewsLink = true,
  showEventsLink = true,
  showHonorLink = true,
  showProductsLink = true,
  showIdentityLink = true,
  showCommunityLink = true,
  showDonationsLink = true,
  showContactLink = true,
  showEnglishVersion = false,
  showThemeToggle = false,
  logoUrl
}: {
  showPodcastLink?: boolean;
  showNewsLink?: boolean;
  showEventsLink?: boolean;
  showHonorLink?: boolean;
  showProductsLink?: boolean;
  showIdentityLink?: boolean;
  showCommunityLink?: boolean;
  showDonationsLink?: boolean;
  showContactLink?: boolean;
  showEnglishVersion?: boolean;
  showThemeToggle?: boolean;
  logoUrl?: string | null;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const isAdminRoute = pathname.startsWith("/admin");
  const isTiendiitaRoute = pathname.startsWith("/tiendiita");
  const visibleLinks = links.filter((link) => {
    if (link.href === "/podcast") {
      return showPodcastLink;
    }

    if (link.href === "/news") {
      return showNewsLink;
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
    if (!mobileMenuOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    mobileMenuRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
        mobileMenuButtonRef.current?.focus();
      }
    }

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileMenuOpen]);

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
      <div className="shell flex min-h-16 items-center justify-between gap-2 py-2 sm:gap-3 lg:py-3">
        <Link href={isAdminRoute ? "/admin" : "/"} className="flex min-w-0 flex-1 items-center lg:max-w-[330px]">
          <div className="relative h-12 w-full max-w-[170px] overflow-hidden rounded-xl border border-[color:var(--line)] bg-transparent p-1.5 shadow-sm sm:h-16 sm:max-w-[260px] lg:h-20 lg:max-w-[330px]">
            <Image src={resolvedLogo} alt="Industrial con J" fill className="object-contain p-1.5 sm:p-2" sizes="(min-width: 1024px) 330px, (min-width: 640px) 260px, 170px" priority />
          </div>
        </Link>

        {!isAdminRoute ? (
          <nav className="hidden items-center gap-6 lg:flex">
            {visibleLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);

              if (link.href === "/honor") {
                return (
                  <div key={link.href} className="group relative">
                    <Link
                      href={link.href}
                      className={`inline-flex items-center gap-1 text-base transition hover:text-[color:var(--foreground)] ${isActive ? "text-[color:var(--foreground)]" : "text-[color:var(--muted)]"}`}
                      aria-current={isActive ? "page" : undefined}
                      aria-haspopup="menu"
                      style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
                      onClick={() => trackNavigation(link.href, link.label, "header_nav")}
                    >
                      {link.label}
                      <ChevronDown size={15} />
                    </Link>
                    <div className="invisible absolute left-1/2 top-full z-50 w-56 -translate-x-1/2 pt-3 opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                      <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface)] p-2 shadow-2xl">
                        {alumniLinks.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="block rounded-xl px-4 py-3 text-sm font-semibold text-[color:var(--foreground)] transition hover:bg-[color:var(--accent-soft)] hover:text-[color:var(--accent)]"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

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
          {!isAdminRoute && showEnglishVersion ? <LanguageToggle /> : null}
          {showThemeToggle ? <div className="hidden sm:block">
            <ThemeToggle />
          </div> : null}
        </div>

        {!isAdminRoute && isTiendiitaRoute ? (
          <div className="lg:hidden">
            <button type="button" className="btn-primary shrink-0 gap-2 !px-3 !py-3 text-sm" onClick={toggleCart} aria-label="Abrir carrito de cotización">
              <ShoppingCart size={17} />
              <span className="grid h-6 min-w-6 place-items-center rounded-full bg-white px-2 text-xs font-black text-[color:var(--accent)]">{cartCount}</span>
            </button>
          </div>
        ) : null}

        {!isAdminRoute ? (
          <div className="lg:hidden">
            <button
              ref={mobileMenuButtonRef}
              type="button"
              className="btn-secondary shrink-0 gap-2 !px-3 !py-3 text-sm font-semibold"
              onClick={() => setMobileMenuOpen((isOpen) => !isOpen)}
              aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              <span>{mobileMenuOpen ? "Cerrar" : "Menú"}</span>
            </button>
          </div>
        ) : null}
      </div>

      {!isAdminRoute && mobileMenuOpen ? (
        <div className="fixed inset-0 top-[65px] z-50 bg-black/45 backdrop-blur-sm lg:hidden" onMouseDown={() => setMobileMenuOpen(false)}>
          <div
            id="mobile-navigation"
            ref={mobileMenuRef}
            className="ml-auto flex max-h-[calc(100dvh-65px)] w-full max-w-sm flex-col overflow-y-auto border-l border-[color:var(--line)] bg-[color:var(--surface)] px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4 shadow-2xl focus:outline-none"
            role="dialog"
            aria-modal="true"
            aria-label="Menú principal"
            tabIndex={-1}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="brand-kicker text-xs text-[color:var(--muted)]">Navegación</p>
              <button type="button" className="btn-secondary !p-3" onClick={() => setMobileMenuOpen(false)} aria-label="Cerrar menú">
                <X size={18} />
              </button>
            </div>
            <nav className="grid gap-2">
              {visibleLinks.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);

                if (link.href === "/honor") {
                  return (
                    <div key={link.href} className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-strong)] p-2">
                      <button
                        type="button"
                        className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-base font-semibold transition ${
                          isActive ? "bg-[color:var(--accent-soft)] text-[color:var(--foreground)]" : "text-[color:var(--foreground)]"
                        }`}
                        aria-current={isActive ? "page" : undefined}
                        aria-haspopup="menu"
                      >
                        {link.label}
                        <ChevronDown size={16} />
                      </button>
                      <div className="mt-1 grid gap-1">
                        {alumniLinks.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="rounded-xl px-3 py-2 text-sm font-semibold text-[color:var(--muted)] transition hover:bg-[color:var(--accent-soft)] hover:text-[color:var(--accent)]"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                }

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`rounded-2xl border px-4 py-3 text-left text-base font-semibold transition hover:border-[color:var(--accent)] ${
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

            <div className="mt-4 grid gap-3">
              {!isTiendiitaRoute ? (
                <Link
                  href="/search"
                  className="btn-secondary w-full gap-2 !px-4 !py-3 text-sm"
                  onClick={() => trackEvent("click_search", { link_url: "/search", link_text: "Buscar", section: "mobile_header" })}
                >
                  <Search size={16} />
                  Buscar
                </Link>
              ) : null}
              {isTiendiitaRoute ? (
                <button
                  type="button"
                  className="btn-primary w-full gap-2 !px-4 !py-3 text-sm"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    toggleCart();
                  }}
                >
                  <ShoppingCart size={17} />
                  Carrito
                  <span className="grid h-6 min-w-6 place-items-center rounded-full bg-white px-2 text-xs font-black text-[color:var(--accent)]">{cartCount}</span>
                </button>
              ) : null}
              <div className="flex flex-wrap items-center gap-3">
                {showEnglishVersion ? <LanguageToggle /> : null}
                {showThemeToggle ? <ThemeToggle /> : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
