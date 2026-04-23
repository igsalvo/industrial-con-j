"use client";

import { QuestionType, SurveyKind, SurveyStatus } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

type DraftQuestion = {
  id?: string;
  label: string;
  type: QuestionType;
  placeholder?: string;
  helpText?: string;
  position: number;
  isRequired: boolean;
  options: string;
  conditionQuestionId?: string;
  conditionValue?: string;
};

export function SurveyForm({
  mode,
  survey,
  episodes
}: {
  mode: "create" | "edit";
  survey?: {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    kind: SurveyKind;
    status: SurveyStatus;
    successCopy: string | null;
    episodeId: string | null;
    questions: Array<{
      id: string;
      label: string;
      type: QuestionType;
      placeholder: string | null;
      helpText: string | null;
      position: number;
      isRequired: boolean;
      options: string[];
      conditionQuestionId: string | null;
      conditionValue: string | null;
    }>;
  };
  episodes: Array<{ id: string; title: string }>;
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [questions, setQuestions] = useState<DraftQuestion[]>(
    survey?.questions.map((question) => ({
      id: question.id,
      label: question.label,
      type: question.type,
      placeholder: question.placeholder || "",
      helpText: question.helpText || "",
      position: question.position,
      isRequired: question.isRequired,
      options: question.options.join(", "),
      conditionQuestionId: question.conditionQuestionId || "",
      conditionValue: question.conditionValue || ""
    })) || [
      {
        label: "",
        type: QuestionType.SHORT_TEXT,
        placeholder: "",
        helpText: "",
        position: 1,
        isRequired: true,
        options: "",
        conditionQuestionId: "",
        conditionValue: ""
      }
    ]
  );

  function updateQuestion(index: number, field: keyof DraftQuestion, value: string | boolean) {
    setQuestions((current) =>
      current.map((question, questionIndex) =>
        questionIndex === index
          ? {
              ...question,
              [field]: value
            }
          : question
      )
    );
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const response = await fetch(mode === "create" ? "/api/admin/surveys" : `/api/admin/surveys/${survey?.id}`, {
      method: mode === "create" ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: formData.get("title"),
        slug: formData.get("slug"),
        description: formData.get("description"),
        kind: formData.get("kind"),
        status: formData.get("status"),
        successCopy: formData.get("successCopy"),
        episodeId: formData.get("episodeId"),
        questions: questions.map((question, index) => ({
          id: question.id,
          label: question.label,
          type: question.type,
          placeholder: question.placeholder,
          helpText: question.helpText,
          position: index + 1,
          isRequired: question.isRequired,
          options: question.options
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
          conditionQuestionId: question.conditionQuestionId,
          conditionValue: question.conditionValue
        }))
      })
    });

    const body = await response.json();

    if (!response.ok) {
      setError(body.error || "No se pudo guardar la encuesta.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  async function onDelete() {
    if (!survey || !window.confirm("Eliminar encuesta?")) {
      return;
    }

    await fetch(`/api/admin/surveys/${survey.id}`, { method: "DELETE" });
    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-2">
        <input className="field" name="title" placeholder="Titulo" defaultValue={survey?.title} required />
        <input className="field" name="slug" placeholder="slug-opcional" defaultValue={survey?.slug} />
      </div>
      <textarea className="field min-h-28" name="description" placeholder="Descripcion" defaultValue={survey?.description || ""} />
      <div className="grid gap-4 lg:grid-cols-4">
        <select className="field" defaultValue={survey?.kind || SurveyKind.SURVEY} name="kind">
          {Object.values(SurveyKind).map((kind) => (
            <option key={kind} value={kind}>
              {kind}
            </option>
          ))}
        </select>
        <select className="field" defaultValue={survey?.status || SurveyStatus.DRAFT} name="status">
          {Object.values(SurveyStatus).map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <select className="field" defaultValue={survey?.episodeId || ""} name="episodeId">
          <option value="">Sin episodio asociado</option>
          {episodes.map((episode) => (
            <option key={episode.id} value={episode.id}>
              {episode.title}
            </option>
          ))}
        </select>
        <input className="field" name="successCopy" placeholder="Mensaje de exito" defaultValue={survey?.successCopy || ""} />
      </div>

      <div className="card p-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-lg font-semibold">Preguntas</p>
            <p className="text-sm text-[color:var(--muted)]">Las preguntas pueden depender de respuestas previas.</p>
          </div>
          <button
            type="button"
            className="btn-secondary !px-4 !py-2 text-sm"
            onClick={() =>
              setQuestions((current) => [
                ...current,
                {
                  label: "",
                  type: QuestionType.SHORT_TEXT,
                  placeholder: "",
                  helpText: "",
                  position: current.length + 1,
                  isRequired: true,
                  options: "",
                  conditionQuestionId: "",
                  conditionValue: ""
                }
              ])
            }
          >
            Agregar pregunta
          </button>
        </div>

        <div className="space-y-4">
          {questions.map((question, index) => (
            <div key={`${question.id || "new"}-${index}`} className="rounded-[1.5rem] border border-[color:var(--line)] p-4">
              <div className="grid gap-4 lg:grid-cols-2">
                <input
                  className="field"
                  placeholder="Texto de la pregunta"
                  value={question.label}
                  onChange={(event) => updateQuestion(index, "label", event.target.value)}
                />
                <select className="field" value={question.type} onChange={(event) => updateQuestion(index, "type", event.target.value as QuestionType)}>
                  {Object.values(QuestionType).map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <input
                  className="field"
                  placeholder="Placeholder"
                  value={question.placeholder}
                  onChange={(event) => updateQuestion(index, "placeholder", event.target.value)}
                />
                <input
                  className="field"
                  placeholder="Ayuda"
                  value={question.helpText}
                  onChange={(event) => updateQuestion(index, "helpText", event.target.value)}
                />
              </div>
              <div className="mt-4 grid gap-4 lg:grid-cols-3">
                <input
                  className="field"
                  placeholder="Opciones separadas por coma"
                  value={question.options}
                  onChange={(event) => updateQuestion(index, "options", event.target.value)}
                />
                <select
                  className="field"
                  value={question.conditionQuestionId}
                  onChange={(event) => updateQuestion(index, "conditionQuestionId", event.target.value)}
                >
                  <option value="">Sin condicion</option>
                  {questions
                    .filter((_, candidateIndex) => candidateIndex < index)
                    .map((candidate, candidateIndex) => (
                      <option key={`${candidate.id || "candidate"}-${candidateIndex}`} value={candidate.id || `temp-${candidateIndex}`}>
                        {candidate.label || `Pregunta ${candidateIndex + 1}`}
                      </option>
                    ))}
                </select>
                <input
                  className="field"
                  placeholder="Valor para mostrar"
                  value={question.conditionValue}
                  onChange={(event) => updateQuestion(index, "conditionValue", event.target.value)}
                />
              </div>
              <div className="mt-4 flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    checked={question.isRequired}
                    type="checkbox"
                    onChange={(event) => updateQuestion(index, "isRequired", event.target.checked)}
                  />
                  Requerida
                </label>
                <button
                  type="button"
                  className="text-sm font-semibold text-red-500"
                  onClick={() => setQuestions((current) => current.filter((_, questionIndex) => questionIndex !== index))}
                >
                  Eliminar pregunta
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {error ? <p className="text-sm text-red-500">{error}</p> : null}
      <div className="flex flex-wrap gap-3">
        <button className="btn-primary" type="submit">
          {mode === "create" ? "Crear encuesta" : "Guardar cambios"}
        </button>
        {mode === "edit" ? (
          <button className="btn-secondary" type="button" onClick={onDelete}>
            Eliminar
          </button>
        ) : null}
      </div>
    </form>
  );
}
