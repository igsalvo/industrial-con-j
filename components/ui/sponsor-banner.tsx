export function SponsorBanner({
  title,
  sponsors
}: {
  title: string;
  sponsors: Array<{
    id: string;
    name: string;
    websiteUrl: string;
    logoUrl: string | null;
  }>;
}) {
  if (sponsors.length === 0) {
    return null;
  }

  return (
    <section className="shell py-6">
      <div className="card p-6">
        <div className="flex flex-col gap-5">
          <div>
            <p className="brand-kicker text-xs text-[color:var(--muted)]">{title}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {sponsors.map((sponsor) => (
              <a
                key={sponsor.id}
                href={sponsor.websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-4 rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-strong)] p-4 transition hover:border-[color:var(--accent)]"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white p-2">
                  {sponsor.logoUrl ? (
                    <img src={sponsor.logoUrl} alt={sponsor.name} className="max-h-full w-full object-contain" />
                  ) : (
                    <div className="h-full w-full rounded-lg bg-[linear-gradient(135deg,#d70904,#2b2b2b)]" />
                  )}
                </div>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{sponsor.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
