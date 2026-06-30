import { NewsFeaturedLoop } from "@/components/news/news-featured-loop";
import { SectionHeading } from "@/components/sections/section-heading";
import { getPublicSectionsData, getSiteConfig } from "@/lib/queries";
import { notFound } from "next/navigation";

export default async function AlumniNewsPage() {
  const [{ alumniNewsItems }, siteConfig] = await Promise.all([getPublicSectionsData(), getSiteConfig()]);
  if (!siteConfig.showHonorSection || siteConfig.showAlumniNewsSection === false) {
    notFound();
  }

  return (
    <main className="dark bg-[#111312] text-white">
      <div className="shell py-9">
        <SectionHeading
          eyebrow={siteConfig.alumniNewsSectionEyebrow || "Noticias Alumni"}
          title={siteConfig.alumniNewsSectionTitle || "Noticias Alumni"}
          description={siteConfig.alumniNewsSectionDescription || "Novedades y reconocimientos vinculados a alumni de Ingeniería Industrial."}
        />
        <NewsFeaturedLoop items={alumniNewsItems} moreHref="/honor/noticias-alumni/todas" compact />
      </div>
    </main>
  );
}
