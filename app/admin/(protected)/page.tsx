import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const [episodes, guests, sponsors, surveys, counts] = await Promise.all([
    prisma.episode.findMany({
      include: { sponsor: true },
      orderBy: { updatedAt: "desc" },
      take: 8
    }),
    prisma.guest.findMany({
      orderBy: { updatedAt: "desc" },
      take: 8
    }),
    prisma.sponsor.findMany({
      orderBy: { updatedAt: "desc" },
      take: 8
    }),
    prisma.survey.findMany({
      orderBy: { updatedAt: "desc" },
      take: 8
    }),
    Promise.all([
      prisma.episode.count(),
      prisma.guest.count(),
      prisma.sponsor.count(),
      prisma.survey.count(),
      prisma.surveyResponse.count()
    ])
  ]);

  const [episodeCount, guestCount, sponsorCount, surveyCount, responseCount] = counts;

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {[
          { label: "Episodios", value: episodeCount },
          { label: "Invitados", value: guestCount },
          { label: "Sponsors", value: sponsorCount },
          { label: "Encuestas", value: surveyCount },
          { label: "Respuestas", value: responseCount }
        ].map((item) => (
          <div key={item.label} className="card p-6">
            <p className="text-sm text-[color:var(--muted)]">{item.label}</p>
            <p className="mt-3 text-4xl font-black">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-8 xl:grid-cols-2">
        <div className="card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Episodios</h2>
            <Link href="/admin/episodes/new" className="btn-secondary !px-4 !py-2 text-sm">
              Crear
            </Link>
          </div>
          <div className="space-y-3">
            {episodes.map((episode) => (
              <Link
                key={episode.id}
                href={`/admin/episodes/${episode.id}`}
                className="flex items-center justify-between rounded-2xl border border-[color:var(--line)] p-4"
              >
                <div>
                  <p className="font-semibold">{episode.title}</p>
                  <p className="text-xs text-[color:var(--muted)]">{formatDate(episode.updatedAt)}</p>
                </div>
                <p className="text-xs text-[color:var(--muted)]">{episode.sponsor?.name || "Sin sponsor"}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Invitados</h2>
            <Link href="/admin/guests/new" className="btn-secondary !px-4 !py-2 text-sm">
              Crear
            </Link>
          </div>
          <div className="space-y-3">
            {guests.map((guest) => (
              <Link
                key={guest.id}
                href={`/admin/guests/${guest.id}`}
                className="flex items-center justify-between rounded-2xl border border-[color:var(--line)] p-4"
              >
                <div>
                  <p className="font-semibold">{guest.name}</p>
                  <p className="text-xs text-[color:var(--muted)]">{guest.company || "Sin empresa"}</p>
                </div>
                <p className="text-xs text-[color:var(--muted)]">{formatDate(guest.updatedAt)}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Sponsors</h2>
            <Link href="/admin/sponsors/new" className="btn-secondary !px-4 !py-2 text-sm">
              Crear
            </Link>
          </div>
          <div className="space-y-3">
            {sponsors.map((sponsor) => (
              <Link
                key={sponsor.id}
                href={`/admin/sponsors/${sponsor.id}`}
                className="flex items-center justify-between rounded-2xl border border-[color:var(--line)] p-4"
              >
                <div>
                  <p className="font-semibold">{sponsor.name}</p>
                  <p className="text-xs text-[color:var(--muted)]">{sponsor.tier || "Partner"}</p>
                </div>
                <p className="text-xs text-[color:var(--muted)]">{formatDate(sponsor.updatedAt)}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Encuestas</h2>
            <Link href="/admin/surveys/new" className="btn-secondary !px-4 !py-2 text-sm">
              Crear
            </Link>
          </div>
          <div className="space-y-3">
            {surveys.map((survey) => (
              <Link
                key={survey.id}
                href={`/admin/surveys/${survey.id}`}
                className="flex items-center justify-between rounded-2xl border border-[color:var(--line)] p-4"
              >
                <div>
                  <p className="font-semibold">{survey.title}</p>
                  <p className="text-xs text-[color:var(--muted)]">{survey.status}</p>
                </div>
                <p className="text-xs text-[color:var(--muted)]">{formatDate(survey.updatedAt)}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
