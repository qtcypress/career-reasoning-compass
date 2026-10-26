import { describe, expect, it } from "vitest";
import { PROBLEMS, filterProblems, getProblem, problemPrompt } from "@/lib/problems";

describe("coding problem bank", () => {
  it("filters questions using search, difficulty and topic together", () => {
    expect(filterProblems("median", "Hard", "Binary search").map((p) => p.id)).toEqual(["median-of-two-sorted-arrays"]);
    expect(filterProblems("median", "Easy", "Binary search")).toEqual([]);
    expect(filterProblems("  TWO SUM  ", "All", "All").map((p) => p.id)).toEqual(["two-sum"]);
  });
  it("passes the actual selected question, constraints and examples to evaluation", () => {
    const p = getProblem("coin-change");
    if (!p) throw new Error("Missing question");
    const prompt = problemPrompt(p);
    expect(prompt).toContain("Return −1 if the amount is impossible, and 0 for amount 0.");
    expect(prompt).toContain("0 ≤ amount ≤ 10,000");
    expect(prompt).toContain("coins = [2], amount = 3\nOutput: -1");
    expect(prompt).not.toContain("Two Sum");
  });
  it("keeps every question within the coach input limit and uniquely addressable", () => {
    expect(new Set(PROBLEMS.map((p) => p.id)).size).toBe(PROBLEMS.length);
    for (const p of PROBLEMS) expect(problemPrompt(p).length).toBeLessThanOrEqual(4000);
    expect(getProblem("unknown-question")).toBeUndefined();
  });
});