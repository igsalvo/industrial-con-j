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
    <article className="card overflow-hidden p-5">
      <div className="flex items-start gap-4">
        <div
          className="h-20 w-20 rounded-2xl bg-cover bg-center"
          style={{
            backgroundImage: guest.profileImage ? `url(${guest.profileImage})` : "linear-gradient(135deg, #d70904, #2b2b2b)"
          }}
        />
        <div>
          <h3 className="text-xl" style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}>
            <Link href={`/guests/${guest.slug}`}>{guest.name}</Link>
          </h3>
          <p className="mt-1 text-sm text-[color:var(--muted)]">{guest.company || "Invitado del podcast"}</p>
          <p className="mt-3 line-clamp-3 text-sm text-[color:var(--muted)]">{guest.bio}</p>
        </div>
      </div>
    </article>
  );
}
