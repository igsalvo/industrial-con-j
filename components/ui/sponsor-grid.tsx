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
      {sponsors.map((sponsor) => (
        <a
          key={sponsor.id}
          href={sponsor.websiteUrl}
          target="_blank"
          rel="noreferrer"
          className="card flex min-h-36 flex-col justify-between p-6 transition hover:-translate-y-1"
        >
          <div
            className="h-14 w-14 rounded-2xl bg-cover bg-center"
            style={{
              backgroundImage: sponsor.logoUrl ? `url(${sponsor.logoUrl})` : "linear-gradient(135deg, #f97316, #0f766e)"
            }}
          />
          <div>
            <p className="text-lg font-semibold">{sponsor.name}</p>
            <p className="text-sm text-[color:var(--muted)]">{sponsor.tier || "Partner"}</p>
          </div>
        </a>
      ))}
    </div>
  );
}
