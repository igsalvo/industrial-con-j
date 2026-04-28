export function SponsorGrid({
  sponsors
}: {
  sponsors: Array<{
    id: string;
    name: string;
    websiteUrl: string;
    logoUrl: string | null;
    tier: string | null;
  }>;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {sponsors.map((sponsor: { id: string; name: string; websiteUrl: string; logoUrl: string | null; tier: string | null }) => (
        <a
          key={sponsor.id}
          href={sponsor.websiteUrl}
          target="_blank"
          rel="noreferrer"
          className="card flex min-h-40 flex-col justify-between p-6 transition hover:-translate-y-1"
        >
          <div className="flex h-20 items-center justify-center rounded-2xl border border-[color:var(--line)] bg-white p-3">
            {sponsor.logoUrl ? (
              <img src={sponsor.logoUrl} alt={sponsor.name} className="max-h-full w-full object-contain" />
            ) : (
              <div className="h-full w-full rounded-xl bg-[linear-gradient(135deg,#d70904,#2b2b2b)]" />
            )}
          </div>
          <div>
            <p className="text-lg" style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}>{sponsor.name}</p>
            <p className="text-sm text-[color:var(--muted)]">{sponsor.tier || "Partner"}</p>
          </div>
        </a>
      ))}
    </div>
  );
}
