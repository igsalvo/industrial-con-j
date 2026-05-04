import { hasDatabase } from "@/lib/queries";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

async function safeQuery<T>(query: Promise<T>, fallback: T) {
  try {
    return await query;
  } catch {
    return fallback;
  }
}

export default async function AdminMessagesPage() {
  const databaseReady = hasDatabase();
  const [messages, surveyResponses] = databaseReady
    ? await Promise.all([
        safeQuery(prisma.contactMessage.findMany({
          orderBy: { createdAt: "desc" },
          take: 100
        }), []),
        safeQuery(prisma.surveyResponse.findMany({
          orderBy: { createdAt: "desc" },
          take: 100,
          include: {
            survey: {
              include: {
                episode: true
              }
            },
            answers: {
              include: {
                question: true
              }
            }
          }
        }), [])
      ])
    : [[], []];

  return (
    <div className="space-y-6">
      <div className="card p-8">
        <p className="pill">Bandeja</p>
        <h1 className="mt-4 text-4xl font-black">Mensajes y respuestas</h1>
        <p className="mt-3 text-sm text-[color:var(--muted)]">
          Aqui quedan los formularios de contacto, donaciones y las respuestas de encuestas publicas.
        </p>
      </div>

      {!databaseReady ? (
        <div className="card p-8 text-sm text-[color:var(--muted)]">Conecta DATABASE_URL para ver la bandeja.</div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          <div className="card p-8">
            <h2 className="text-2xl font-black">Contacto y donaciones</h2>
            <div className="mt-6 space-y-4">
              {messages.length === 0 ? (
                <p className="text-sm text-[color:var(--muted)]">Aun no hay mensajes.</p>
              ) : (
                messages.map((message) => (
                  <div key={message.id} className="rounded-2xl border border-[color:var(--line)] p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="pill">{message.type === "DONATION" ? "Donacion" : "Contacto"}</p>
                      <p className="text-xs text-[color:var(--muted)]">{formatDate(message.createdAt)}</p>
                    </div>
                    <h3 className="mt-3 text-lg font-bold">{message.name}</h3>
                    <p className="text-sm text-[color:var(--muted)]">{message.email}</p>
                    {message.subject || message.motive ? (
                      <p className="mt-1 text-sm text-[color:var(--muted)]">
                        {[message.subject, message.motive].filter(Boolean).join(" · ")}
                      </p>
                    ) : null}
                    {message.phone || message.company ? (
                      <p className="mt-1 text-sm text-[color:var(--muted)]">
                        {[message.phone, message.company].filter(Boolean).join(" · ")}
                      </p>
                    ) : null}
                    <p className="mt-4 whitespace-pre-line text-sm leading-6">{message.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="card p-8">
            <h2 className="text-2xl font-black">Respuestas de encuestas</h2>
            <div className="mt-6 space-y-4">
              {surveyResponses.length === 0 ? (
                <p className="text-sm text-[color:var(--muted)]">Aun no hay respuestas.</p>
              ) : (
                surveyResponses.map((response) => (
                  <div key={response.id} className="rounded-2xl border border-[color:var(--line)] p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="pill">{response.survey.kind === "CONTEST" ? "Concurso" : "Encuesta"}</p>
                      <p className="text-xs text-[color:var(--muted)]">{formatDate(response.createdAt)}</p>
                    </div>
                    <h3 className="mt-3 text-lg font-bold">{response.survey.title}</h3>
                    {response.survey.episode ? <p className="text-sm text-[color:var(--muted)]">{response.survey.episode.title}</p> : null}
                    <p className="mt-2 text-sm text-[color:var(--muted)]">
                      {[response.name, response.email].filter(Boolean).join(" · ") || "Respuesta anonima"}
                    </p>
                    <div className="mt-4 space-y-3">
                      {response.answers.map((answer) => (
                        <div key={answer.id} className="rounded-xl bg-[color:var(--surface-soft)] p-3 text-sm">
                          <p className="font-semibold">{answer.question.label}</p>
                          <p className="mt-1 whitespace-pre-line text-[color:var(--muted)]">{answer.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
