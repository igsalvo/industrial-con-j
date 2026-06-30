import { NewsCardGrid } from "@/components/news/news-card-grid";
import { NewsPagination } from "@/components/news/news-pagination";
import { SectionHeading } from "@/components/sections/section-heading";
import { getNewsItemsPage, getSiteConfig } from "@/lib/queries";
import { notFound } from "next/navigation";

function parsePage(value?: string) {
  const page = Number(value);
  return Number.isFinite(page) ? Math.max(1, Math.floor(page)) : 1;
}

export default async function AllNewsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const [{ page: rawPage }, siteConfig] = await Promise.all([searchParams, getSiteConfig()]);
  if (!siteConfig.showNewsSection) {
    notFound();
  }

  const newsPage = await getNewsItemsPage({ scope: "news", page: parsePage(rawPage), pageSize: 6 });

  return (
    <main className="shell py-9">
      <SectionHeading
        eyebrow={siteConfig.newsSectionEyebrow || "Noticias"}
        title="Todas las noticias"
        description={siteConfig.newsSectionDescription || "Actualizaciones, hitos y novedades del ecosistema Industrial con J."}
      />
      <NewsCardGrid items={newsPage.items} compact />
      <NewsPagination basePath="/news/todas" page={newsPage.page} totalPages={newsPage.totalPages} />
    </main>
  );
}
