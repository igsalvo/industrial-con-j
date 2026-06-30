"use client";

import { useEffect, useState } from "react";
import { NewsCardGrid } from "@/components/news/news-card-grid";
import { HonorShowcase } from "@/components/sections/honor-showcase";
import { SectionHeading } from "@/components/sections/section-heading";
import type { PublicNewsItem } from "@/lib/queries";

type AlumniTab = "honor" | "news";

type HonorMember = {
  id: string;
  name: string;
  photoUrl: string | null;
  photoPositionX?: number | null;
  photoPositionY?: number | null;
  description: string;
  role: string | null;
  generation: string | null;
  externalLinks?: unknown;
};

function getTabFromHash(hash: string): AlumniTab {
  return hash === "#noticias-alumni" ? "news" : "honor";
}

export function AlumniTabs({
  members,
  newsItems,
  newsEyebrow,
  newsTitle,
  newsDescription,
  showNews
}: {
  members: HonorMember[];
  newsItems: PublicNewsItem[];
  newsEyebrow: string;
  newsTitle: string;
  newsDescription: string;
  showNews: boolean;
}) {
  const [activeTab, setActiveTab] = useState<AlumniTab>("honor");

  useEffect(() => {
    function syncHash() {
      const hashTab = getTabFromHash(window.location.hash);
      setActiveTab(hashTab === "news" && !showNews ? "honor" : hashTab);
    }

    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, [showNews]);

  function selectTab(nextTab: AlumniTab) {
    if (nextTab === "news" && !showNews) {
      return;
    }

    setActiveTab(nextTab);
    const hash = nextTab === "news" ? "#noticias-alumni" : "#circulo-de-honor";
    window.history.replaceState(null, "", hash);
  }

  return (
    <div className="space-y-5">
      <div className={`grid overflow-hidden rounded-2xl border border-white/10 bg-[color:var(--accent)] text-center text-sm font-black uppercase tracking-[0.08em] text-white ${showNews ? "sm:grid-cols-2" : ""}`} role="tablist" aria-label="Secciones Alumni">
        <button
          type="button"
          className={`px-5 py-4 transition ${activeTab === "honor" ? "bg-white/18" : "hover:bg-white/10"}`}
          role="tab"
          aria-selected={activeTab === "honor"}
          aria-controls="circulo-de-honor"
          onClick={() => selectTab("honor")}
        >
          Círculo de honor
        </button>
        {showNews ? (
          <button
            type="button"
            className={`border-t border-white/15 px-5 py-4 transition sm:border-l sm:border-t-0 ${activeTab === "news" ? "bg-white/18" : "hover:bg-white/10"}`}
            role="tab"
            aria-selected={activeTab === "news"}
            aria-controls="noticias-alumni"
            onClick={() => selectTab("news")}
          >
            Noticias Alumni
          </button>
        ) : null}
      </div>

      <section id="circulo-de-honor" role="tabpanel" hidden={activeTab !== "honor"}>
        <HonorShowcase members={members} />
      </section>

      {showNews ? (
        <section id="noticias-alumni" role="tabpanel" hidden={activeTab !== "news"}>
          <SectionHeading eyebrow={newsEyebrow} title={newsTitle} description={newsDescription} />
          <NewsCardGrid items={newsItems} compact />
        </section>
      ) : null}
    </div>
  );
}
