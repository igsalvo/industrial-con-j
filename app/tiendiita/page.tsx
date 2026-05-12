import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, Package, Search, SlidersHorizontal, Star, Shirt, NotebookPen, ShoppingBag } from "lucide-react";
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
        <div className="shell relative min-h-[330px] py-10">
          <p className="brand-kicker text-xs text-white/60 notranslate" translate="no">{siteConfig.productsSectionEyebrow || "TIENDIITA CEIN"}</p>
          <h1 className="mt-4 max-w-xl text-4xl font-black sm:text-5xl">{siteConfig.productsSectionTitle || "Productos con identidad industrial"}</h1>
          <p className="mt-5 max-w-2xl text-sm leading-6 text-[color:var(--muted)]">
            {siteConfig.productsSectionDescription || "Artículos, recuerdos y productos pensados para quienes quieren llevar consigo parte de la comunidad de Ingeniería Industrial."}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            {[
              { item: "Merchandising", icon: Shirt },
              { item: "Papelería", icon: NotebookPen },
              { item: "Accesorios", icon: ShoppingBag },
              { item: "Ediciones especiales", icon: Star }
            ].map(({ item, icon: Icon }) => (
              <span key={item} className="pill gap-2"><Icon size={15} />{item}</span>
            ))}
          </div>
          <div className="mt-7 grid max-w-3xl gap-3 text-xs text-white/70 sm:grid-cols-3">
            <span className="inline-flex items-center gap-2"><BadgeCheck size={16} />Diseños exclusivos para la comunidad</span>
            <span className="inline-flex items-center gap-2"><Star size={16} />Calidad premium y materiales duraderos</span>
          </div>
        </div>
      </section>

      <div className="shell space-y-6 py-6">
      <form className="grid gap-4 rounded-xl border border-white/10 bg-white/[0.04] p-3 md:grid-cols-[1fr_220px_180px_auto]">
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
        <button className="btn-primary gap-2" type="submit">Filtrar<SlidersHorizontal size={16} /></button>
      </form>

      <ProductGrid products={filtered} />

      {filtered.length === 0 && (q || category) ? (
        <Link className="btn-secondary" href="/tiendiita">Limpiar filtros</Link>
      ) : null}
      </div>
    </main>
  );
}
