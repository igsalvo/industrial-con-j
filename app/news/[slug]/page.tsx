import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { RichNewsBody } from "@/components/news/rich-news-body";
import { getNewsItemBySlug } from "@/lib/queries";
import { formatDate } from "@/lib/utils";
import { notFound } from "next/navigation";

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const newsItem = await getNewsItemBySlug(slug);
  if (!newsItem) {
    notFound();
  }

  const objectPosition = `${newsItem.imagePositionX || "center"} ${newsItem.imagePositionY || "center"}`;

  return (
    <main className="shell py-9">
      <Link href="/news" className="btn-secondary mb-6 gap-2 !px-4 !py-2 text-sm">
        <ArrowLeft size={15} />
        Volver a noticias
      </Link>
      <article className="mx-auto max-w-4xl">
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <p className="text-xs font-semibold uppercase text-[color:var(--muted)]">{formatDate(newsItem.publishedAt)}</p>
          {newsItem.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-[color:var(--line)] px-2 py-1 text-[10px] font-semibold uppercase text-[color:var(--muted)]">{tag}</span>
          ))}
        </div>
        <h1 className="text-[clamp(2rem,8vw,3.4rem)] font-black">{newsItem.title}</h1>
        <p className="mt-5 text-xl leading-8 text-[color:var(--muted)]">{newsItem.excerpt}</p>

        {newsItem.imageUrl ? (
          <div className="mt-8 aspect-[16/9] overflow-hidden rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-strong)]">
            <img src={newsItem.imageUrl} alt={newsItem.title} className="block !h-full w-full object-cover" style={{ objectPosition }} />
          </div>
        ) : null}

        <RichNewsBody body={newsItem.body} />

        {newsItem.ctaLink ? (
          <a href={newsItem.ctaLink} target="_blank" rel="noreferrer" className="btn-primary mt-8 gap-2">
            {newsItem.ctaText || "Ver más"}
            <ArrowUpRight size={16} />
          </a>
        ) : null}
      </article>
    </main>
  );
}
