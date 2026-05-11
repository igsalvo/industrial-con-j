import Link from "next/link";
import { ArrowUpRight, BadgeDollarSign, Gift, Handshake, HeartHandshake, Landmark, Package, Sparkles, Target, Users } from "lucide-react";

const icons = {
  purpose: Target,
  vision: Sparkles,
  mission: Landmark,
  values: HeartHandshake,
  donation: Gift,
  sponsorship: Handshake,
  participation: Users,
  product: Package,
  price: BadgeDollarSign
};

function IconView({ name }: { name?: string | null }) {
  const key = (name || "").toLowerCase() as keyof typeof icons;
  const Icon = icons[key] || Sparkles;
  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-strong)] text-[color:var(--accent)]">
      <Icon size={20} />
    </div>
  );
}

export function IdentityGrid({
  items
}: {
  items: Array<{ id: string; kind: string; title: string; text: string; icon: string | null; imageUrl: string | null }>;
}) {
  if (items.length === 0) {
    return <p className="rounded-2xl border border-[color:var(--line)] p-5 text-sm text-[color:var(--muted)]">Aún no hay elementos de identidad publicados.</p>;
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <article key={item.id} className="card overflow-hidden p-5">
          {item.imageUrl ? <img src={item.imageUrl} alt={item.title} className="mb-5 aspect-[4/3] w-full rounded-2xl object-cover" /> : null}
          <IconView name={item.icon || item.kind} />
          <p className="brand-kicker mt-5 text-xs text-[color:var(--muted)]">{item.kind}</p>
          <h3 className="mt-2 text-2xl font-bold">{item.title}</h3>
          <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">{item.text}</p>
        </article>
      ))}
    </div>
  );
}

export function HonorGrid({
  members
}: {
  members: Array<{
    id: string;
    name: string;
    photoUrl: string | null;
    photoPositionX?: number | null;
    photoPositionY?: number | null;
    description: string;
    role: string | null;
    generation: string | null;
    externalLinks: unknown;
  }>;
}) {
  if (members.length === 0) {
    return <p className="rounded-2xl border border-[color:var(--line)] p-5 text-sm text-[color:var(--muted)]">Aún no hay personas publicadas.</p>;
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {members.map((member) => {
        const links = Array.isArray(member.externalLinks) ? (member.externalLinks as Array<{ label: string; url: string }>) : [];
        const photoPosition = `${member.photoPositionX ?? 50}% ${member.photoPositionY ?? 50}%`;
        return (
          <article key={member.id} className="card overflow-hidden">
            <div className="aspect-[4/3] bg-[color:var(--surface-strong)]">
              {member.photoUrl ? <img src={member.photoUrl} alt={member.name} className="h-full w-full object-cover" style={{ objectPosition: photoPosition }} /> : null}
            </div>
            <div className="p-5">
              <h3 className="text-2xl font-bold">{member.name}</h3>
              {member.generation ? <p className="mt-2 text-sm font-semibold text-[color:var(--accent)]">{member.generation}</p> : null}
              {member.role ? <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]">{member.role}</p> : null}
              <details className="group mt-4">
                <summary className="cursor-pointer list-none text-sm font-semibold text-[color:var(--foreground)]">
                  <span className="group-open:hidden">Ver perfil</span>
                  <span className="hidden group-open:inline">Ocultar perfil</span>
                </summary>
                <p className="mt-3 text-justify text-sm leading-6 text-[color:var(--muted)]">{member.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {links.map((link) => (
                    <a key={link.url} className="btn-secondary !px-3 !py-2 text-xs" href={link.url} target="_blank" rel="noreferrer">
                      {link.label}
                    </a>
                  ))}
                </div>
              </details>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export function ProductGrid({
  products
}: {
  products: Array<{ id: string; name: string; photoUrl: string | null; description: string; price: unknown; stock: number | null; ctaText: string | null; ctaLink: string | null; category: { name: string } }>;
}) {
  if (products.length === 0) {
    return <p className="rounded-2xl border border-[color:var(--line)] p-5 text-sm text-[color:var(--muted)]">No hay productos que coincidan con la búsqueda.</p>;
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {products.map((product) => (
        <article key={product.id} className="card overflow-hidden">
          <div className="aspect-square bg-[color:var(--surface-strong)]">
            {product.photoUrl ? <img src={product.photoUrl} alt={product.name} className="h-full w-full object-cover" /> : null}
          </div>
          <div className="p-5">
            <p className="pill">{product.category.name}</p>
            <h3 className="mt-4 text-2xl font-bold">{product.name}</h3>
            <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">{product.description}</p>
            <div className="mt-5 flex items-center justify-between gap-4">
              <p className="text-xl font-black">${Number(product.price).toLocaleString("es-CL")}</p>
              {typeof product.stock === "number" ? <p className="text-xs text-[color:var(--muted)]">Stock: {product.stock}</p> : null}
            </div>
            {product.ctaText && product.ctaLink ? (
              <a className="btn-primary mt-5 w-full gap-2" href={product.ctaLink} target="_blank" rel="noreferrer">
                {product.ctaText}
                <ArrowUpRight size={15} />
              </a>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}

export function ParticipationGrid({
  items
}: {
  items: Array<{ id: string; title: string; description: string; imageUrl: string | null; icon: string | null; type: string; ctaText: string | null; ctaLink: string | null }>;
}) {
  if (items.length === 0) {
    return <p className="rounded-2xl border border-[color:var(--line)] p-5 text-sm text-[color:var(--muted)]">Aún no hay opciones publicadas.</p>;
  }

  return (
    <div className="grid gap-5 md:grid-cols-3">
      {items.map((item) => (
        <article key={item.id} className="card overflow-hidden p-5">
          {item.imageUrl ? <img src={item.imageUrl} alt={item.title} className="mb-5 aspect-[4/3] w-full rounded-2xl object-cover" /> : null}
          <IconView name={item.icon || item.type.toLowerCase()} />
          <p className="brand-kicker mt-5 text-xs text-[color:var(--muted)]">{item.type}</p>
          <h3 className="mt-2 text-2xl font-bold">{item.title}</h3>
          <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">{item.description}</p>
          {item.ctaText && item.ctaLink ? (
            <Link className="btn-secondary mt-5 w-full gap-2" href={item.ctaLink}>
              {item.ctaText}
              <ArrowUpRight size={15} />
            </Link>
          ) : null}
        </article>
      ))}
    </div>
  );
}
