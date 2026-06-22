import Link from "next/link";

export function GuestCard({
  guest
}: {
  guest: {
    id?: string;
    slug: string;
    name: string;
    company: string | null;
    bio: string;
    profileImage: string | null;
    profilePositionX?: string | null;
    profilePositionY?: string | null;
    episodes?: Array<{ slug: string; title: string }>;
  };
}) {
  const imagePosition = `${guest.profilePositionX || "center"} ${guest.profilePositionY || "center"}`;
  const latestEpisode = guest.episodes?.[0];

  return (
    <article className="card overflow-hidden">
      <div className="relative h-60 overflow-hidden border-b border-[color:var(--line)] bg-[linear-gradient(135deg,#d70904,#2b2b2b)]">
        {guest.profileImage ? <img src={guest.profileImage} alt={guest.name} className="guest-card-image h-full w-full object-cover" style={{ objectPosition: imagePosition }} /> : null}
      </div>
      <div className="p-6">
        <h3 className="text-2xl" style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}>
          <Link href={`/guests/${guest.slug}`}>{guest.name}</Link>
        </h3>
        <p className="mt-1 text-sm text-[color:var(--muted)]">{guest.company || "Invitado del podcast"}</p>
        <p className="mt-4 line-clamp-4 text-sm text-[color:var(--muted)]">{guest.bio}</p>
        {latestEpisode ? (
          <Link href={`/episodes/${latestEpisode.slug}`} className="btn-secondary mt-5 !px-4 !py-2 text-sm" aria-label={`Ver episodio ${latestEpisode.title}`}>
            Ver episodio
          </Link>
        ) : (
          <Link href={`/guests/${guest.slug}`} className="btn-secondary mt-5 !px-4 !py-2 text-sm">
            Ver perfil
          </Link>
        )}
      </div>
    </article>
  );
}
