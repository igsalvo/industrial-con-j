import { notFound } from "next/navigation";
import { getGuestBySlug } from "@/lib/queries";
import { EpisodeCard } from "@/components/ui/episode-card";

export default async function GuestDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guest = await getGuestBySlug(slug);

  if (!guest) {
    notFound();
  }

  const socialLinks = (guest.socialLinks ?? {}) as Record<string, string | undefined>;

  return (
    <section className="shell py-12">
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="card p-8">
          <div
            className="h-64 rounded-[1.5rem] bg-cover bg-center"
            style={{
              backgroundImage: guest.profileImage ? `url(${guest.profileImage})` : "linear-gradient(135deg, #0f766e, #0f172a)"
            }}
          />
          <h1 className="mt-6 text-4xl font-black">{guest.name}</h1>
          <p className="mt-2 text-sm text-[color:var(--muted)]">
            {guest.role ? `${guest.role} · ` : ""}
            {guest.company || "Invitado del podcast"}
          </p>
          <p className="mt-5 text-sm leading-7 text-[color:var(--muted)]">{guest.bio}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {Object.entries(socialLinks)
              .filter(([, value]: [string, string | undefined]) => value)
              .map(([key, value]: [string, string | undefined]) => (
                <a key={key} href={value} target="_blank" rel="noreferrer" className="btn-secondary !px-4 !py-2 text-sm capitalize">
                  {key}
                </a>
              ))}
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-black">Episodios donde participa</h2>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {guest.episodes.map((episode: (typeof guest.episodes)[number]) => (
              <EpisodeCard key={episode.slug} episode={episode} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
