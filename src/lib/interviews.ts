import { z } from "zod";
import { CAREERS } from "./careers";

export type InterviewQuestion = { id: string; question: string; criteria: string; source: string };
const groups: Record<string, { source: string; questions: [string, string][] }> = {
  java: { source: "https://docs.spring.io/spring-framework/reference/data-access/transaction.html", questions: [
    ["How do equals() and hashCode() work together when a Java object is used as a HashMap key?", "Equality contract, equal keys must share hash codes, collisions, mutable keys."],
    ["A Spring service updates an order and its inventory. How would you make both changes atomic, and what can cause @Transactional to fail?", "Transaction boundary, rollback, exceptions, proxy self-invocation, consistency."],
    ["A React page calls a slow Spring endpoint. How would you investigate and improve performance without hiding stale data?", "Measure query and network latency, indexes, pagination, caching invalidation, loading and error states."],
  ] },
  mern: { source: "https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick", questions: [
    ["Explain the Node.js event loop. What happens if an Express handler performs a long CPU-bound calculation?", "Single event loop, asynchronous IO, blocking CPU work, worker threads or job queue."],
    ["A React search box returns older results after newer ones. How would you prevent this race condition?", "Effect dependencies, request cancellation or identity checks, debounce, cleanup."],
    ["When would you embed documents in MongoDB rather than reference them? Use an order system as an example.", "Access patterns, atomicity, duplication, growth limits, consistency and tradeoffs."],
  ] },
  analytics: { source: "https://www.postgresql.org/docs/current/tutorial-window.html", questions: [
    ["Write or describe a SQL query to find the top three products by revenue within each region. How would you handle ties?", "Aggregate revenue per region and product, window partition, rank vs dense_rank vs row_number, tie policy."],
    ["A dashboard shows a sudden 30% revenue drop. How would you determine whether it is a business change or a data issue?", "Validate freshness, pipeline and joins, compare periods, segment changes, reconcile source totals."],
    ["How would you model sales and customers for a Power BI dashboard, and distinguish a measure from a calculated column?", "Fact and dimension tables, relationships, grain, filter context, measures vs row-level stored columns."],
  ] },
  "data-science": { source: "https://scikit-learn.org/stable/common_pitfalls.html", questions: [
    ["What is data leakage? Explain how you would split and preprocess a customer churn dataset safely.", "Split before fitting preprocessing, pipelines, temporal or group split, no future features."],
    ["A classifier has 98% accuracy on a dataset with only 2% positive cases. How would you assess whether it is useful?", "Baseline, confusion matrix, precision and recall, PR AUC, threshold and business costs."],
    ["An A/B test reports higher conversion. What would you check before recommending rollout?", "Randomization, sample size, confidence intervals, significance vs practical impact, guardrails, multiple testing."],
  ] },
  ml: { source: "https://scikit-learn.org/stable/modules/model_evaluation.html", questions: [
    ["Training error keeps falling while validation error increases. What is happening and what would you try?", "Overfitting, regularization, simpler model, early stopping, more data, validation discipline."],
    ["How would you choose a model and evaluation metric for detecting rare fraudulent transactions?", "Imbalance, precision recall, costs, leakage-free split, threshold, baseline."],
    ["A deployed model's performance degrades after three months. How would you detect and respond to drift?", "Input and prediction monitoring, labels, concept vs data drift, retraining, validation, rollback."],
  ] },
  genai: { source: "https://platform.openai.com/docs/guides/retrieval", questions: [
    ["Design a RAG assistant for internal documents. Describe ingestion, retrieval, generation, and how answers cite evidence.", "Chunking, embeddings, metadata permissions, retrieval reranking, grounding, citations, freshness."],
    ["When would you choose RAG over fine-tuning, and when might you use both?", "Knowledge freshness vs behavior, retrieval provenance, costs, fine-tuning for style or task patterns."],
    ["How would you evaluate and reduce hallucinations in a customer support assistant?", "Grounded test set, faithfulness, retrieval quality, refusal, citations, human review, monitoring."],
  ] },
  agents: { source: "https://langchain-ai.github.io/langgraph/concepts/", questions: [
    ["When is a deterministic workflow better than an autonomous agent? Give a practical example.", "Predictability, cost and latency, bounded tasks vs dynamic tool choice, risk."],
    ["An agent can issue refunds through a tool. How would you enforce authorization and prevent unsafe actions?", "Server-side permissions, validation, least privilege, approval, idempotency, audit, injection defense."],
    ["How would you design an agent that can resume after a tool fails without repeating completed actions?", "Persistent checkpoints, state, bounded retries, idempotency keys, timeouts, recovery."],
  ] },
  security: { source: "https://owasp.org/www-project-top-ten/", questions: [
    ["What is the difference between authentication and authorization? How would you test for broken object-level authorization?", "Identity vs access rights, owner checks on server, unauthorized object IDs, least privilege."],
    ["How would you prevent SQL injection and cross-site scripting in a web application?", "Parameterized SQL, context-aware output encoding, safe APIs, CSP defense in depth, not only validation."],
    ["A SOC alert suggests a compromised employee account. What would your first response steps be?", "Validate alert, preserve evidence, contain sessions, scope impact, coordinate, recovery and review."],
  ] },
  devops: { source: "https://kubernetes.io/docs/concepts/workloads/controllers/deployment/", questions: [
    ["How would you design a CI/CD pipeline that deploys safely and can recover from a failed release?", "Tests, artifact immutability, security checks, staging, approvals, rollout, monitoring, rollback."],
    ["A Kubernetes pod is repeatedly restarting. What would you inspect before changing its resource limits?", "Events, logs and previous logs, exit status, probes, OOM, dependencies, metrics."],
    ["What problems does Terraform state solve, and how would a team manage it securely?", "Resource mapping, remote state, locking, secrets and access control, versioning, reviewed plans."],
  ] },
};
const HR: InterviewQuestion[] = [
  { id: "hr-project", question: "Tell me about a project you are proud of. What was your personal contribution and how did you measure its impact?", criteria: "Specific context, individual responsibility, actions, measurable or honest qualitative outcome, reflection.", source: "https://www.amazon.jobs/content/en/how-we-hire/interview-prep" },
  { id: "hr-conflict", question: "Describe a disagreement with a teammate. How did you resolve it and what would you do differently?", criteria: "Real example, respectful listening, concrete action, shared outcome, learning; no invented experience required.", source: "https://www.amazon.jobs/content/en/how-we-hire/interview-prep" },
  { id: "hr-learning", question: "Tell me about a time you had to learn an unfamiliar skill under a deadline. How did you prioritize and verify your work?", criteria: "Situation, priorities, learning approach, verification, result and lessons.", source: "https://www.amazon.jobs/content/en/how-we-hire/interview-prep" },
];
export const ROUNDS = ["Technical", "HR", "Mixed"] as const;
export type Round = typeof ROUNDS[number];
export function interviewQuestions(trackId: string, round: Round): InterviewQuestion[] {
  const group = groups[trackId];
  if (!group) return [];
  const technical = group.questions.map(([question, criteria], i) => ({ id: `${trackId}-${i}`, question, criteria, source: group.source }));
  return round === "HR" ? HR : round === "Mixed" ? [...technical.slice(0, 2), ...HR.slice(0, 1)] : technical;
}
export const interviewInput = z.object({
  trackId: z.string().refine((id) => CAREERS.some((c) => c.id === id)),
  round: z.enum(ROUNDS),
  answers: z.array(z.string().trim().min(15).max(4000)).length(3),
});
const percentage = z.number().int().min(0).max(100);
export const interviewResult = z.object({
  feedback: z.array(z.object({ score: percentage, accuracy: percentage, clarity: percentage, depth: percentage, strengths: z.array(z.string()), improvements: z.array(z.string()), exampleAnswer: z.string() })).length(3),
  summary: z.string(),
});
export type InterviewResult = z.infer<typeof interviewResult>;
export const overallScore = (scores: number[]) => scores.length ? Math.round(scores.reduce((a,b) => a+b, 0) / scores.length) : 0;