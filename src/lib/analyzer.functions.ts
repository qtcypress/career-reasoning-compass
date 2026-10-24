import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const evaluationSchema = z.object({
  score: z.number().describe("0-100 percent correctness of the plan"),
  verdict: z.string().describe("One-sentence overall verdict"),
  strengths: z.array(z.string()),
  mistakes: z.array(
    z.object({
      step: z.string().describe("Which part of the plan"),
      issue: z.string().describe("What is wrong"),
      thinkingGap: z.string().describe("The flawed thinking pattern behind it"),
      fix: z.string().describe("How to fix it"),
    }),
  ),
  dimensions: z.object({
    understanding: z.number(),
    approach: z.number(),
    edgeCases: z.number(),
    efficiency: z.number(),
  }),
});
export type Evaluation = z.infer<typeof evaluationSchema>;

const mentorHintSchema = z.object({
  reframe: z.string().describe("How the student should change their thinking"),
  guidingQuestion: z.string().describe("A Socratic question to make them rethink, not the answer"),
  hint: z.string().describe("A small nudge without giving away the solution"),
});
export type MentorHint = z.infer<typeof mentorHintSchema>;

const mentorFinalSchema = z.object({
  feedbackOnReply: z.string(),
  correctedThinking: z.string().describe("The mental model they should use going forward"),
  improvedPlan: z.array(z.string()).describe("Step by step corrected plan"),
  newScore: z.number().describe("0-100 score of the student's revised thinking"),
  takeaway: z.string(),
});
export type MentorFinal = z.infer<typeof mentorFinalSchema>;

const SYS =
  "You are CareerPilot's AI problem-solving evaluator and mentor for engineering students preparing for placements. Be honest, specific and encouraging. Scores are integers 0-100. Evaluate the PLAN/THINKING, not code syntax.";

const text = (max: number) => z.string().trim().min(1).max(max);

export const evaluatePlan = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ problem: text(4000), plan: text(6000) }).parse(d))
  .handler(async ({ data }) => {
    const { generateStructured } = await import("./ai.server");
    return generateStructured(
      evaluationSchema,
      SYS,
      `PROBLEM:\n${data.problem}\n\nSTUDENT'S PLANNED SOLUTION:\n${data.plan}\n\nEvaluate how correct this plan is (%), list strengths, every mistake with the thinking gap behind it and how to fix it, and score each dimension 0-100.`,
    );
  });

export const mentorStep1 = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z.object({ problem: text(4000), plan: text(6000), evaluation: z.string().max(8000) }).parse(d),
  )
  .handler(async ({ data }) => {
    const { generateStructured } = await import("./ai.server");
    return generateStructured(
      mentorHintSchema,
      SYS + " As a mentor, do NOT reveal the full solution. Help the student change HOW they think.",
      `PROBLEM:\n${data.problem}\n\nPLAN:\n${data.plan}\n\nEVALUATION:\n${data.evaluation}\n\nMentor step 1: give a thinking reframe, one guiding question, and one small hint.`,
    );
  });

export const mentorStep2 = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({ problem: text(4000), plan: text(6000), question: text(2000), reply: text(4000) })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const { generateStructured } = await import("./ai.server");
    return generateStructured(
      mentorFinalSchema,
      SYS,
      `PROBLEM:\n${data.problem}\n\nORIGINAL PLAN:\n${data.plan}\n\nMENTOR ASKED:\n${data.question}\n\nSTUDENT'S REVISED THINKING:\n${data.reply}\n\nMentor step 2: give feedback on their reply, the corrected mental model, a step-by-step improved plan, a new score for their revised thinking, and one takeaway.`,
    );
  });
