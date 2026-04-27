export function SectionHeading({
  eyebrow,
  title,
  description
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-6">
      <p className="brand-kicker text-xs text-[color:var(--muted)]">{eyebrow}</p>
      <h2 className="mt-3 text-3xl md:text-4xl" style={{ fontWeight: 600 }}>{title}</h2>
      <p className="mt-3 max-w-2xl text-sm text-[color:var(--muted)]">{description}</p>
    </div>
  );
}
