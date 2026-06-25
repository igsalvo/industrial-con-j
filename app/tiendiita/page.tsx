import { notFound } from "next/navigation";
import { BadgeCheck, Package, Star } from "lucide-react";
import { getMediaItems, getPublicSectionsData, getSiteConfig } from "@/lib/queries";
import { ProductQuoteCarousel } from "@/components/sections/product-quote-carousel";

export default async function TiendiitaPage() {
  const [{ products }, siteConfig, mediaItems] = await Promise.all([getPublicSectionsData(), getSiteConfig(), getMediaItems("tiendiita.hero")]);
  if (!siteConfig.showProductsSection) {
    notFound();
  }
  const heroMedia = mediaItems[0];
  const productItems = products.map((product) => ({
    id: product.id,
    name: product.name,
    photoUrl: product.photoUrl,
    photoUrls: product.photoUrls,
    photoPositionX: product.photoPositionX,
    photoPositionY: product.photoPositionY,
    description: product.description,
    price: Number(product.price),
    ctaLink: product.ctaLink
  }));

  return (
    <main className="dark bg-[#111312] text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0">
          {heroMedia ? (
            <img src={heroMedia.src} alt={heroMedia.alt} className="h-full w-full object-cover opacity-90" style={{ objectPosition: `${heroMedia.positionX || "center"} ${heroMedia.positionY || "center"}` }} />
          ) : (
            <div className="grid h-full place-items-center bg-[radial-gradient(circle_at_65%_30%,rgba(226,33,28,0.28),transparent_30%),linear-gradient(135deg,#252525,#111312)]">
              <Package className="text-white/40" size={72} />
            </div>
          )}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(17,19,18,0.98)_0%,rgba(17,19,18,0.82)_38%,rgba(17,19,18,0.12)_74%)]" />
        </div>
        <div className="shell relative min-h-[240px] py-8 sm:min-h-[280px] sm:py-10">
          <p className="brand-kicker text-xs text-white/60 notranslate" translate="no">{siteConfig.productsSectionEyebrow || "TIENDIITA CEIN"}</p>
          <h1 className="mt-4 max-w-xl text-[clamp(2rem,8vw,3rem)] font-black sm:text-5xl">{siteConfig.productsSectionTitle || "Productos con identidad industrial"}</h1>
          <p className="mt-5 max-w-2xl text-sm leading-6 text-[color:var(--muted)]">
            {siteConfig.productsSectionDescription || "Artículos, recuerdos y productos pensados para quienes quieren llevar consigo parte de la comunidad de Ingeniería Industrial."}
          </p>
          <div className="mt-6 grid max-w-3xl gap-3 text-xs text-white/70 sm:grid-cols-2">
            <span className="inline-flex min-w-0 items-center gap-2"><BadgeCheck className="shrink-0" size={16} />Diseños exclusivos para la comunidad</span>
            <span className="inline-flex min-w-0 items-center gap-2"><Star className="shrink-0" size={16} />Calidad premium y materiales duraderos</span>
          </div>
        </div>
      </section>

      <div className="shell space-y-6 py-6">
        <ProductQuoteCarousel products={productItems} />
      </div>
    </main>
  );
}
