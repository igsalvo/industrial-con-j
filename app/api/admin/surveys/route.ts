import type { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { ensureAdminApiSession } from "@/lib/auth";
import { hasDatabase } from "@/lib/queries";
import { prisma } from "@/lib/prisma";
import { surveyInputSchema, toSurveyPayload } from "@/lib/validation";

export async function POST(request: Request) {
  const session = await ensureAdminApiSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (!hasDatabase()) {
    return NextResponse.json({ error: "DATABASE_URL is not configured." }, { status: 503 });
  }

  try {
    const payload = toSurveyPayload(surveyInputSchema.parse(await request.json()));
    const survey = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const createdSurvey = await tx.survey.create({
        data: {
          title: payload.title,
          slug: payload.slug,
          description: payload.description,
          kind: payload.kind,
          status: payload.status,
          successCopy: payload.successCopy,
          episodeId: payload.episodeId
        }
      });

      const questionIdMap = new Map<string, string>();

      for (let index = 0; index < payload.questions.length; index += 1) {
        const question = payload.questions[index];
        const localRef = question.id || `temp-${index}`;
        const conditionQuestionId = question.conditionQuestionId ? questionIdMap.get(question.conditionQuestionId) : undefined;

        const createdQuestion = await tx.surveyQuestion.create({
          data: {
            surveyId: createdSurvey.id,
            label: question.label,
            type: question.type,
            placeholder: question.placeholder,
            helpText: question.helpText,
            position: question.position,
            isRequired: question.isRequired,
            options: question.options,
            conditionQuestionId,
            conditionValue: question.conditionValue
          }
        });

        questionIdMap.set(localRef, createdQuestion.id);
      }

      return tx.survey.findUniqueOrThrow({
        where: { id: createdSurvey.id },
        include: { questions: true }
      });
    });

    return NextResponse.json(survey, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message || "Datos invalidos." }, { status: 400 });
    }

    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid payload." }, { status: 400 });
  }
}
