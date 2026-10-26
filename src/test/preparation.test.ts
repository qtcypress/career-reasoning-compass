import { describe, expect, it } from "vitest";
import { CAREERS } from "@/lib/careers";
import { interviewQuestions, ROUNDS, overallScore, interviewInput } from "@/lib/interviews";
import { gradeQuiz, quizFor, quizTopics } from "@/lib/assessments";
import { tailoredSkills, suggestedSkills, emptyResume } from "@/lib/resume";
describe("career preparation", () => {
  it("provides three technical, HR and mixed questions for all nine home-page paths", () => {
    expect(CAREERS).toHaveLength(9);
    for(const career of CAREERS) for(const round of ROUNDS) expect(interviewQuestions(career.id,round)).toHaveLength(3);
    expect(interviewQuestions("missing","Technical")).toEqual([]);
  });
  it("averages actual interview scores and rejects missing answers", () => {
    expect(overallScore([60,75,90])).toBe(75);
    expect(interviewInput.safeParse({trackId:"java",round:"Technical",answers:["short"]}).success).toBe(false);
  });
  it("provides a 12-question quiz across three topics for all nine career paths", () => {
    for (const career of CAREERS) {
      const quiz = quizFor(career.id);
      expect(quiz).toHaveLength(12);
      expect(quizTopics(career.id)).toHaveLength(3);
      for (const topic of quizTopics(career.id)) expect(quiz.filter((q) => q.topic === topic)).toHaveLength(4);
      for (const q of quiz) { expect(q.options).toHaveLength(4); expect(q.correct).toBeGreaterThanOrEqual(0); expect(q.correct).toBeLessThan(4); }
    }
    expect(quizFor("missing")).toEqual([]);
  });
  it("reports the quiz score and exactly the topics with mistakes", () => {
    const quiz = quizFor("java");
    const answers = Object.fromEntries(quiz.map((q) => [q.id,q.correct]));
    const topics = quizTopics("java");
    for (const q of quiz.filter((q) => q.topic !== topics[0])) answers[q.id] = (q.correct + 1) % 4;
    const result = gradeQuiz(quiz, answers);
    expect(result.score).toBe(33);
    expect(result.weakAreas.map((a) => a.topic)).toEqual([topics[1], topics[2]]);
    expect(result.areas.find((a) => a.topic === topics[0])?.score).toBe(100);
  });
  it("orders relevant resume skills without adding unclaimed skills", () => {
    expect(tailoredSkills(["Writing","Python","SQL"],"analytics")).toEqual(["Python","SQL","Writing"]);
    for(const c of CAREERS) expect(suggestedSkills(c.id).length).toBeGreaterThan(0);
    expect(emptyResume().skills).toEqual([]);
  });
});