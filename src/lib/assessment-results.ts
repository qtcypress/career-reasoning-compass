import { z } from "zod";
import { gradeQuiz, quizFor, quizTopics } from "./assessments";

export const assessmentInput = z.object({
  attemptId: z.string().uuid(),
  trackId: z.string(),
  topic: z.string(),
  answers: z.record(z.number().int().min(0).max(3)),
});

export function evaluateAssessment(input: z.infer<typeof assessmentInput>) {
  const quiz = quizFor(input.trackId);
  if (!quiz.length || (input.topic !== "All topics" && !quizTopics(input.trackId).includes(input.topic))) throw new Error("Choose a valid career path and topic.");
  const questions = input.topic === "All topics" ? quiz : quiz.filter(q => q.topic === input.topic);
  if (Object.keys(input.answers).length !== questions.length || questions.some(q => input.answers[q.id] === undefined)) throw new Error("Answer every question before saving.");
  return gradeQuiz(questions, input.answers);
}

export const areaSchema = z.array(z.object({ topic: z.string(), correct: z.number(), total: z.number(), score: z.number() }));
export type TopicResult = z.infer<typeof areaSchema>[number];

// Rows arrive newest first. A focused retake updates only the topic it assessed.
export function latestTopicResults(rows: { areas: unknown }[]): TopicResult[] {
  const latest = new Map<string, TopicResult>();
  for (const row of rows) {
    const parsed = areaSchema.safeParse(row.areas);
    if (!parsed.success) continue;
    for (const area of parsed.data) if (!latest.has(area.topic)) latest.set(area.topic, area);
  }
  return [...latest.values()];
}