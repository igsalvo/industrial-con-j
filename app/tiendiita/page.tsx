import Link from "next/link";
import { getPublicSectionsData, getSiteConfig } from "@/lib/queries";
import { ProductGrid } from "@/components/sections/public-section-cards";
import { SectionHeading } from "@/components/sections/section-heading";

export default async function TiendiitaPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; category?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const [{ products, categories }, siteConfig] = await Promise.all([getPublicSectionsData(), getSiteConfig()]);
  const q = params.q?.trim().toLowerCase() || "";
  const category = params.category || "";
  const sort = params.sort || "name";

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
      <SectionHeading
        eyebrow={siteConfig.productsSectionEyebrow || "TienDIIta CEIN"}
        title={siteConfig.productsSectionTitle || "Catálogo simple"}
        description={siteConfig.productsSectionDescription || "Productos administrables para consultar o reservar sin carrito ni pagos."}
      />

      <form className="card grid gap-4 p-5 md:grid-cols-[1fr_220px_180px_auto]">
        <input className="field" name="q" placeholder="Buscar por nombre o descripción" defaultValue={params.q || ""} />
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
        <button className="btn-primary" type="submit">Filtrar</button>
      </form>

      <ProductGrid products={filtered} />

      {filtered.length === 0 && (q || category) ? (
        <Link className="btn-secondary" href="/tiendiita">Limpiar filtros</Link>
      ) : null}
    </main>
  );
}
