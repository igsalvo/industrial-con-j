"use client";

import { useMemo, useState } from "react";
import type { Survey, SurveyQuestion } from "@prisma/client";

type SurveyWithQuestions = Survey & {
  questions: SurveyQuestion[];
};

function shouldShowQuestion(question: SurveyQuestion, answers: Record<string, string>) {
  if (!question.conditionQuestionId || !question.conditionValue) {
    return true;
  }

  return answers[question.conditionQuestionId] === question.conditionValue;
}

export function PublicSurveyForm({ survey }: { survey: SurveyWithQuestions }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const visibleQuestions = useMemo(
    () => survey.questions.filter((question) => shouldShowQuestion(question, answers)),
    [answers, survey.questions]
  );

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");

    const fingerprint = `${window.location.pathname}:${email || "anon"}:${navigator.userAgent}`;

    const response = await fetch(`/api/surveys/${survey.id}/respond`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        surveyId: survey.id,
        name,
        email,
        fingerprint,
        answers: visibleQuestions
          .map((question) => ({
            questionId: question.id,
            value: answers[question.id]
          }))
          .filter((item) => item.value)
      })
    });

    const payload = await response.json();

    if (!response.ok) {
      setStatus("error");
      setMessage(payload.error || "No pudimos guardar tu respuesta.");
      return;
    }

    setStatus("success");
    setMessage(payload.message || survey.successCopy || "Respuesta enviada.");
  };

  return (
    <form onSubmit={onSubmit} className="card space-y-5 p-6">
      <div>
        <p className="pill">{survey.kind === "CONTEST" ? "Concurso" : "Encuesta"}</p>
        <h3 className="mt-4 text-2xl font-bold">{survey.title}</h3>
        {survey.description ? <p className="mt-2 text-sm text-[color:var(--muted)]">{survey.description}</p> : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <input className="field" placeholder="Nombre" value={name} onChange={(event) => setName(event.target.value)} />
        <input className="field" placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} />
      </div>

      {visibleQuestions.map((question) => (
        <div key={question.id} className="space-y-2">
          <label className="block text-sm font-semibold">{question.label}</label>
          {question.helpText ? <p className="text-xs text-[color:var(--muted)]">{question.helpText}</p> : null}
          {question.type === "LONG_TEXT" ? (
            <textarea
              className="field min-h-28"
              placeholder={question.placeholder || ""}
              value={answers[question.id] || ""}
              onChange={(event) => setAnswers((current) => ({ ...current, [question.id]: event.target.value }))}
            />
          ) : null}
          {question.type === "SHORT_TEXT" || question.type === "EMAIL" ? (
            <input
              className="field"
              type={question.type === "EMAIL" ? "email" : "text"}
              placeholder={question.placeholder || ""}
              value={answers[question.id] || ""}
              onChange={(event) => setAnswers((current) => ({ ...current, [question.id]: event.target.value }))}
            />
          ) : null}
          {question.type === "SINGLE_CHOICE" ? (
            <div className="flex flex-wrap gap-2">
              {question.options.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`btn-secondary !px-4 !py-2 text-sm ${answers[question.id] === option ? "!border-[color:var(--accent)] !bg-[color:var(--accent-soft)]" : ""}`}
                  onClick={() => setAnswers((current) => ({ ...current, [question.id]: option }))}
                >
                  {option}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      ))}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button type="submit" className="btn-primary" disabled={status === "submitting"}>
          {status === "submitting" ? "Enviando..." : "Enviar respuesta"}
        </button>
        {message ? <p className="text-sm text-[color:var(--muted)]">{message}</p> : null}
      </div>
    </form>
  );
}
