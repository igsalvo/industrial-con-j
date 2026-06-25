import { notFound } from "next/navigation";
import Image from "next/image";
import { getGuestBySlug } from "@/lib/queries";
import { EpisodeCard } from "@/components/ui/episode-card";
import { TrackedAnchor } from "@/components/analytics/tracked-link";

export default async function GuestDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guest = await getGuestBySlug(slug);

  if (!guest) {
    notFound();
  }

  const socialLinks = (guest.socialLinks ?? {}) as Record<string, string | undefined>;
  const imagePosition = `${guest.profilePositionX || "center"} ${guest.profilePositionY || "center"}`;
  const getSocialEventName = (key: string, url?: string) => {
    const value = `${key} ${url || ""}`.toLowerCase();
    if (value.includes("instagram")) return "click_instagram";
    if (value.includes("linkedin")) return "click_linkedin";
    return null;
  };

  return (
    <section className="shell py-8 md:py-12">
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="card p-5 sm:p-8">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-[linear-gradient(135deg,#d70904,#2b2b2b)] sm:h-64 sm:aspect-auto">
            {guest.profileImage ? (
              <Image
                src={guest.profileImage}
                alt={guest.name}
                fill
                className="object-contain"
                style={{ objectPosition: imagePosition }}
                sizes="(min-width: 1024px) 33vw, 100vw"
              />
            ) : null}
          </div>
          <h1 className="mt-6 text-[clamp(2rem,8vw,2.5rem)] font-black">{guest.name}</h1>
          <p className="mt-2 text-sm text-[color:var(--muted)]">
            {guest.role ? `${guest.role} · ` : ""}
            {guest.company || "Invitado del podcast"}
          </p>
          <p className="mt-5 text-sm leading-7 text-[color:var(--muted)]">{guest.bio}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {Object.entries(socialLinks)
              .filter(([, value]: [string, string | undefined]) => value)
              .map(([key, value]: [string, string | undefined]) => {
                const eventName = getSocialEventName(key, value);

                return eventName ? (
                  <TrackedAnchor
                    key={key}
                    href={value}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-secondary !px-4 !py-2 text-sm capitalize"
                    eventName={eventName}
                    eventParams={{
                      link_text: key,
                      social_network: eventName.replace("click_", ""),
                      content_type: "guest",
                      content_title: guest.name,
                      section: "guest_profile"
                    }}
                  >
                    {key}
                  </TrackedAnchor>
                ) : (
                  <a key={key} href={value} target="_blank" rel="noreferrer" className="btn-secondary !px-4 !py-2 text-sm capitalize">
                    {key}
                  </a>
                );
              })}
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-black">Episodios donde participa</h2>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {guest.episodes.map((episode: (typeof guest.episodes)[number]) => (
              <EpisodeCard key={episode.slug} episode={episode} mediaVariant="wide" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
