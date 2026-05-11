import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Package, Search } from "lucide-react";
import { getMediaItems, getPublicSectionsData, getSiteConfig } from "@/lib/queries";
import { ProductGrid } from "@/components/sections/public-section-cards";

export default async function TiendiitaPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; category?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const [{ products, categories }, siteConfig, mediaItems] = await Promise.all([getPublicSectionsData(), getSiteConfig(), getMediaItems("tiendiita.hero")]);
  if (!siteConfig.showProductsSection) {
    notFound();
  }
  const q = params.q?.trim().toLowerCase() || "";
  const category = params.category || "";
  const sort = params.sort || "name";
  const heroMedia = mediaItems[0];

  const filtered = products
    .filter((product) => {
      const matchesTerm = q ? `${product.name} ${product.description}`.toLowerCase().includes(q) : true;
      const matchesCategory = category ? product.category.slug === category : true;
      return matchesTerm && matchesCategory;
    })
    .sort((a, b) => {
      if (sort === "price-asc") return Number(a.price) - Number(b.price);
      if (sort === "price-desc") return Number(b.price) - Number(a.price);
      return a.name.localeCompare(b.name);
    });

  return (
    <main className="shell space-y-8 py-10">
      <section className="card grid overflow-hidden lg:grid-cols-[0.9fr_1.1fr]">
        <div className="p-7 lg:p-9">
          <p className="pill notranslate" translate="no">{siteConfig.productsSectionEyebrow || "TIENDIITA CEIN"}</p>
          <h1 className="mt-5 text-5xl font-black sm:text-6xl">{siteConfig.productsSectionTitle || "Productos con identidad industrial"}</h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-[color:var(--muted)]">
            {siteConfig.productsSectionDescription || "Artículos, recuerdos y productos pensados para quienes quieren llevar consigo parte de la comunidad de Ingeniería Industrial."}
          </p>
          <div className="mt-7 flex flex-wrap gap-2">
            {["Merchandising", "Papelería", "Accesorios", "Ediciones especiales", "Stickers", "Regalos"].map((item) => (
              <span key={item} className="pill">{item}</span>
            ))}
          </div>
        </div>
        <div className="relative min-h-[320px] bg-[linear-gradient(135deg,#d70904,#2b2b2b)]">
          {heroMedia ? (
            <img src={heroMedia.src} alt={heroMedia.alt} className="h-full min-h-[320px] w-full object-cover" style={{ objectPosition: `${heroMedia.positionX || "center"} ${heroMedia.positionY || "center"}` }} />
          ) : (
            <div className="grid h-full min-h-[320px] place-items-center bg-[radial-gradient(circle_at_20%_20%,rgba(226,33,28,0.38),transparent_28%),linear-gradient(135deg,#333,#151515)]">
              <Package className="text-white/80" size={72} />
            </div>
          )}
          <div className="absolute inset-0 bg-black/18" />
        </div>
      </section>

      <form className="card grid gap-4 p-5 md:grid-cols-[1fr_220px_180px_auto]">
        <label className="relative block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--muted)]" size={18} />
          <input className="field pl-11" name="q" placeholder="Buscar por nombre o descripción" defaultValue={params.q || ""} />
        </label>
        <select className="field" name="category" defaultValue={category}>
          <option value="">Todas las categorías</option>
          {categories.map((item) => (
            <option key={item.id} value={item.slug}>{item.name}</option>
          ))}
        </select>
        <select className="field" name="sort" defaultValue={sort}>
          <option value="name">Nombre</option>
          <option value="price-asc">Precio menor</option>
          <option value="price-desc">Precio mayor</option>
        </select>
        <button className="btn-primary gap-2" type="submit">Filtrar<ArrowRight size={16} /></button>
      </form>

      <ProductGrid products={filtered} />

      {filtered.length === 0 && (q || category) ? (
        <Link className="btn-secondary" href="/tiendiita">Limpiar filtros</Link>
      ) : null}
    </main>
  );
}
