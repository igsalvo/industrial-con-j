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
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--muted)]">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-black">{title}</h2>
      <p className="mt-3 max-w-2xl text-sm text-[color:var(--muted)]">{description}</p>
    </div>
  );
}
