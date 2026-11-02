import { describe, expect, it } from "vitest";
import { assessmentInput, evaluateAssessment, latestTopicResults } from "@/lib/assessment-results";
import { quizFor } from "@/lib/assessments";
import { CAREERS } from "@/lib/careers";

describe("saved assessments", () => {
  it("recomputes real answer scores for each of the nine paths", () => {
    expect(CAREERS).toHaveLength(9);
    for (const career of CAREERS) {
      const quiz = quizFor(career.id);
      const first = quiz[0];
      if (!first) throw new Error("Missing quiz questions");
      const answers = Object.fromEntries(quiz.map(q => [q.id, q.correct]));
      answers[first.id] = (first.correct + 1) % 4;
      const result = evaluateAssessment({ attemptId: "a8b030b8-4e0c-4ac6-9bde-7aabf31c3862", trackId: career.id, topic: "All topics", answers });
      expect(result.score).toBe(92);
      expect(result.weakAreas.map(a => a.topic)).toEqual([first.topic]);
    }
  });
  it("rejects incomplete quizzes and invalid choices", () => {
    expect(() => evaluateAssessment({ attemptId: "a8b030b8-4e0c-4ac6-9bde-7aabf31c3862", trackId: "java", topic: "All topics", answers: {} })).toThrow("Answer every question");
    expect(assessmentInput.safeParse({ attemptId: "a8b030b8-4e0c-4ac6-9bde-7aabf31c3862", trackId: "java", topic: "All topics", answers: { q: 4 } }).success).toBe(false);
  });
  it("clears a corrected weak topic without erasing other topics", () => {
    const result = latestTopicResults([
      { areas: [{ topic: "DSA", score: 100, correct: 4, total: 4 }] },
      { areas: [{ topic: "DSA", score: 25, correct: 1, total: 4 }, { topic: "Java", score: 50, correct: 2, total: 4 }] },
    ]);
    expect(result.filter(a => a.correct < a.total).map(a => a.topic)).toEqual(["Java"]);
    expect(result.find(a => a.topic === "DSA")?.score).toBe(100);
  });
});