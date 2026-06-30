import { NewsFeaturedLoop } from "@/components/news/news-featured-loop";
import { SectionHeading } from "@/components/sections/section-heading";
import { getPublicSectionsData, getSiteConfig } from "@/lib/queries";
import { notFound } from "next/navigation";

export default async function NewsPage() {
  const [{ newsItems }, siteConfig] = await Promise.all([getPublicSectionsData(), getSiteConfig()]);
  if (!siteConfig.showNewsSection) {
    notFound();
  }

  return (
    <main className="shell py-9">
      <SectionHeading
        eyebrow={siteConfig.newsSectionEyebrow || "Noticias"}
        title={siteConfig.newsSectionTitle || "Noticias de la comunidad"}
        description={siteConfig.newsSectionDescription || "Actualizaciones, hitos y novedades del ecosistema Industrial con J."}
      />
      <NewsFeaturedLoop items={newsItems} moreHref="/news/todas" />
    </main>
  );
}
