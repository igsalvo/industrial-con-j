import { NewsCardGrid } from "@/components/news/news-card-grid";
import { NewsPagination } from "@/components/news/news-pagination";
import { SectionHeading } from "@/components/sections/section-heading";
import { getNewsItemsPage, getSiteConfig } from "@/lib/queries";
import { notFound } from "next/navigation";

function parsePage(value?: string) {
  const page = Number(value);
  return Number.isFinite(page) ? Math.max(1, Math.floor(page)) : 1;
}

export default async function AllAlumniNewsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const [{ page: rawPage }, siteConfig] = await Promise.all([searchParams, getSiteConfig()]);
  if (!siteConfig.showHonorSection || siteConfig.showAlumniNewsSection === false) {
    notFound();
  }

  const newsPage = await getNewsItemsPage({ scope: "alumni", page: parsePage(rawPage), pageSize: 6 });

  return (
    <main className="dark bg-[#111312] text-white">
      <div className="shell py-9">
        <SectionHeading
          eyebrow={siteConfig.alumniNewsSectionEyebrow || "Noticias Alumni"}
          title="Todas las noticias alumni"
          description={siteConfig.alumniNewsSectionDescription || "Novedades y reconocimientos vinculados a alumni de Ingeniería Industrial."}
        />
        <NewsCardGrid items={newsPage.items} compact />
        <NewsPagination basePath="/honor/noticias-alumni/todas" page={newsPage.page} totalPages={newsPage.totalPages} />
      </div>
    </main>
  );
}
