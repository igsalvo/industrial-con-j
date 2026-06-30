import { getPublicSectionsData, getSiteConfig } from "@/lib/queries";
import { HonorShowcase } from "@/components/sections/honor-showcase";
import { NewsCardGrid } from "@/components/news/news-card-grid";
import { SectionHeading } from "@/components/sections/section-heading";
import { notFound } from "next/navigation";

export default async function HonorPage() {
  const [{ honorMembers, alumniNewsItems }, siteConfig] = await Promise.all([getPublicSectionsData(), getSiteConfig()]);
  if (!siteConfig.showHonorSection) {
    notFound();
  }

  const preloadedPhotoUrls = Array.from(new Set(honorMembers.map((member) => member.photoUrl).filter((photoUrl): photoUrl is string => Boolean(photoUrl)))).slice(0, 24);
  const showAlumniNews = alumniNewsItems.length > 0 && siteConfig.showAlumniNewsSection !== false;

  return (
    <>
      {preloadedPhotoUrls.map((photoUrl) => (
        <link key={photoUrl} rel="preload" as="image" href={photoUrl} fetchPriority="high" />
      ))}
      <main className="dark bg-[#111312] text-white">
        <div className="shell space-y-5 py-9">
          <section className="max-w-3xl">
            <p className="brand-kicker text-xs text-white/55">{siteConfig.honorSectionEyebrow || "ALUMNI"}</p>
            <h1 className="mt-3 text-4xl font-black">{siteConfig.honorSectionTitle || "Círculo de honor"}</h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-[color:var(--muted)]">
              {siteConfig.honorSectionDescription || "Reconocimiento a egresados y egresadas de Ingeniería Industrial que han dejado una huella significativa en la industria, la sociedad y el desarrollo del país."}
            </p>
          </section>
          <HonorShowcase members={honorMembers} />
          {showAlumniNews ? (
            <section className="pt-5">
              <SectionHeading
                eyebrow={siteConfig.alumniNewsSectionEyebrow || "Noticias Alumni"}
                title={siteConfig.alumniNewsSectionTitle || "Noticias Alumni"}
                description={siteConfig.alumniNewsSectionDescription || "Novedades y reconocimientos vinculados a alumni de Ingeniería Industrial."}
              />
              <NewsCardGrid items={alumniNewsItems} compact />
            </section>
          ) : null}
        </div>
      </main>
    </>
  );
}
