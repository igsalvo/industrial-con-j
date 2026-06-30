import { getPublicSectionsData, getSiteConfig } from "@/lib/queries";
import { HonorShowcase } from "@/components/sections/honor-showcase";
import { NewsCardGrid } from "@/components/news/news-card-grid";
import { SectionHeading } from "@/components/sections/section-heading";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function HonorPage() {
  const [{ honorMembers, alumniNewsItems }, siteConfig] = await Promise.all([getPublicSectionsData(), getSiteConfig()]);
  if (!siteConfig.showHonorSection) {
    notFound();
  }

  const preloadedPhotoUrls = Array.from(new Set(honorMembers.map((member) => member.photoUrl).filter((photoUrl): photoUrl is string => Boolean(photoUrl)))).slice(0, 24);
  const showAlumniNews = siteConfig.showAlumniNewsSection !== false;

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
          <nav className="grid overflow-hidden rounded-2xl border border-white/10 bg-[color:var(--accent)] text-center text-sm font-black uppercase tracking-[0.08em] text-white sm:grid-cols-2">
            <Link href="#circulo-de-honor" className="px-5 py-4 transition hover:bg-white/10">
              Círculo de honor
            </Link>
            <Link href="#noticias-alumni" className="border-t border-white/15 px-5 py-4 transition hover:bg-white/10 sm:border-l sm:border-t-0">
              Noticias Alumni
            </Link>
          </nav>
          <section id="circulo-de-honor" className="scroll-mt-28">
            <HonorShowcase members={honorMembers} />
          </section>
          {showAlumniNews ? (
            <section id="noticias-alumni" className="scroll-mt-28 pt-5">
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
