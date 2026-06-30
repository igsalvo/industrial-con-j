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

  return (
    <div className="space-y-5">
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
