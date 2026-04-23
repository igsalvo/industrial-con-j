import { NextResponse } from "next/server";
import { ensureAdminApiSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { surveyInputSchema, toSurveyPayload } from "@/lib/validation";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await ensureAdminApiSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const { id } = await params;

  try {
    const payload = toSurveyPayload(surveyInputSchema.parse(await request.json()));

    const survey = await prisma.$transaction(async (tx) => {
      await tx.survey.update({
        where: { id },
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

      await tx.surveyQuestion.deleteMany({
        where: { surveyId: id }
      });

      const questionIdMap = new Map<string, string>();

      for (let index = 0; index < payload.questions.length; index += 1) {
        const question = payload.questions[index];
        const localRef = question.id || `temp-${index}`;
        const conditionQuestionId = question.conditionQuestionId ? questionIdMap.get(question.conditionQuestionId) : undefined;

        const createdQuestion = await tx.surveyQuestion.create({
          data: {
            surveyId: id,
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
        where: { id },
        include: { questions: true }
      });
    });

    return NextResponse.json(survey);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid payload." }, { status: 400 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await ensureAdminApiSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const { id } = await params;
  await prisma.survey.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
