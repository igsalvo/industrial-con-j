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
  };
}) {
  return (
    <article className="card overflow-hidden">
      <div className="relative h-60 overflow-hidden border-b border-[color:var(--line)] bg-[linear-gradient(135deg,#d70904,#2b2b2b)]">
        {guest.profileImage ? <img src={guest.profileImage} alt={guest.name} className="h-full w-full object-cover" /> : null}
      </div>
      <div className="p-6">
        <h3 className="text-2xl" style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}>
          <Link href={`/guests/${guest.slug}`}>{guest.name}</Link>
        </h3>
        <p className="mt-1 text-sm text-[color:var(--muted)]">{guest.company || "Invitado del podcast"}</p>
        <p className="mt-4 line-clamp-4 text-sm text-[color:var(--muted)]">{guest.bio}</p>
      </div>
    </article>
  );
}
