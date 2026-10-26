import { describe, expect, it } from "vitest";
import { CAREERS } from "@/lib/careers";
import { interviewQuestions, ROUNDS, overallScore, interviewInput } from "@/lib/interviews";
import { gradeQuiz, QUIZ } from "@/lib/assessments";
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
  it("reports the quiz score and exactly the topics with mistakes", () => {
    const answers = Object.fromEntries(QUIZ.map((q) => [q.id,q.correct]));
    answers['stack']=0; answers['queue']=0; answers['binary']=0;
    const result=gradeQuiz(QUIZ,answers);
    expect(result.score).toBe(75);
    expect(result.weakAreas.map((a) => a.topic)).toEqual(["Data structures","Algorithms"]);
    expect(result.areas.find((a) => a.topic === "Data structures")?.score).toBe(50);
  });
  it("orders relevant resume skills without adding unclaimed skills", () => {
    expect(tailoredSkills(["Writing","Python","SQL"],"analytics")).toEqual(["Python","SQL","Writing"]);
    for(const c of CAREERS) expect(suggestedSkills(c.id).length).toBeGreaterThan(0);
    expect(emptyResume().skills).toEqual([]);
  });
});