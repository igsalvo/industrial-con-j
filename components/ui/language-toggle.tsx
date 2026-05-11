"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate?: {
        TranslateElement: new (
          options: {
            pageLanguage: string;
            includedLanguages: string;
            autoDisplay: boolean;
          },
          elementId: string
        ) => void;
      };
    };
  }
}

function getCurrentLanguage() {
  if (typeof document === "undefined") {
    return "es";
  }

  return document.cookie.includes("googtrans=/es/en") ? "en" : "es";
}

function setTranslateCookie(language: "es" | "en") {
  const value = language === "en" ? "/es/en" : "/es/es";
  const maxAge = 60 * 60 * 24 * 365;
  document.cookie = `googtrans=${value};path=/;max-age=${maxAge}`;

  if (window.location.hostname.includes(".")) {
    document.cookie = `googtrans=${value};path=/;domain=.${window.location.hostname};max-age=${maxAge}`;
  }
}

export function LanguageToggle() {
  const [language, setLanguage] = useState<"es" | "en">("es");

  useEffect(() => {
    setLanguage(getCurrentLanguage() as "es" | "en");

    window.googleTranslateElementInit = () => {
      if (!window.google?.translate?.TranslateElement) {
        return;
      }

      new window.google.translate.TranslateElement(
        {
          pageLanguage: "es",
          includedLanguages: "en,es",
          autoDisplay: false
        },
        "google_translate_element"
      );
    };
  }, []);

  const changeLanguage = (nextLanguage: "es" | "en") => {
    setLanguage(nextLanguage);
    setTranslateCookie(nextLanguage);

    const select = document.querySelector<HTMLSelectElement>(".goog-te-combo");
    if (select) {
      select.value = nextLanguage;
      select.dispatchEvent(new Event("change"));
      return;
    }

    window.location.reload();
  };

  return (
    <>
      <div id="google_translate_element" aria-hidden="true" className="google-translate-host" />
      <Script src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" strategy="afterInteractive" />
      <div className="notranslate flex rounded-full border border-[color:var(--line)] bg-[color:var(--surface-strong)] p-1 text-sm" aria-label="Idioma" translate="no">
        <button
          type="button"
          className={`rounded-full px-3 py-2 font-semibold transition ${language === "es" ? "bg-[color:var(--accent)] text-white" : "text-[color:var(--muted)] hover:text-[color:var(--foreground)]"}`}
          onClick={() => changeLanguage("es")}
        >
          ES
        </button>
        <button
          type="button"
          className={`rounded-full px-3 py-2 font-semibold transition ${language === "en" ? "bg-[color:var(--accent)] text-white" : "text-[color:var(--muted)] hover:text-[color:var(--foreground)]"}`}
          onClick={() => changeLanguage("en")}
        >
          EN
        </button>
      </div>
    </>
  );
}
