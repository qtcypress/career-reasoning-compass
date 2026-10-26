import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, CheckCircle2, AlertTriangle, Lightbulb, Bot, ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { SiteHeader } from "@/components/SiteHeader";
import {
  evaluatePlan, mentorStep1, mentorStep2,
  type Evaluation, type MentorHint, type MentorFinal,
} from "@/lib/analyzer.functions";

export const Route = createFileRoute("/analyze")({
  head: () => ({
    meta: [
      { title: "AI Thinking Coach — Evaluate Your Problem-Solving | CareerPilot" },
      { name: "description", content: "Plan a solution, get a % correctness score, see your mistakes and fix your thinking with a 2-step AI mentor." },
      { property: "og:title", content: "AI Thinking Coach | CareerPilot" },
      { property: "og:description", content: "Get your solution plan scored and your thinking corrected by an AI mentor." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Analyze,
});

const SAMPLES = [
  "Detect duplicate UPI transactions in a live payment stream. A transaction is a duplicate if the same sender, receiver and amount appear within 60 seconds.",
  "Allocate K adjacent seats for a group in a movie hall with R rows and C columns where some seats are already booked. Return the best row (closest to the screen center).",
  "Build an LRU cache for 'Continue Watching' that stores the last N shows a user watched with O(1) get and put.",
];

function scoreTone(n: number) {
  return n >= 75 ? "text-success" : n >= 45 ? "text-accent" : "text-destructive";
}

function Stepper({ step }: { step: number }) {
  const labels = ["Plan", "Evaluation", "Mentor · Rethink", "Mentor · Fix"];
  return (
    <ol className="flex flex-wrap gap-2">
      {labels.map((l, i) => (
        <li key={l} className={`rounded-full px-3 py-1 text-xs font-semibold ${i <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
          {i + 1}. {l}
        </li>
      ))}
    </ol>
  );
}

function Analyze() {
  const evalFn = useServerFn(evaluatePlan);
  const m1Fn = useServerFn(mentorStep1);
  const m2Fn = useServerFn(mentorStep2);

  const [problem, setProblem] = useState(SAMPLES[0]);
  const [plan, setPlan] = useState("");
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [hint, setHint] = useState<MentorHint | null>(null);
  const [reply, setReply] = useState("");
  const [final, setFinal] = useState<MentorFinal | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const step = final ? 3 : hint ? 2 : evaluation ? 1 : 0;

  async function run<T>(key: string, fn: () => Promise<T>, set: (v: T) => void) {
    setBusy(key);
    try { set(await fn()); } catch (e) { toast.error(e instanceof Error ? e.message : "Something went wrong"); }
    finally { setBusy(null); }
  }

  const reset = () => { setPlan(""); setEvaluation(null); setHint(null); setReply(""); setFinal(null); };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-5 py-12">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent">AI Thinking Coach</p>
        <h1 className="mt-2 text-3xl font-bold md:text-4xl">How good is your problem-solving?</h1>
        <p className="mt-3 text-muted-foreground">Plan a solution in plain words. Get a % score, see where your thinking slipped, then fix it with the AI mentor in 2 steps.</p>
        <div className="mt-6"><Stepper step={step} /></div>

        {/* Step 1 */}
        <section className="mt-8 rounded-2xl border bg-card p-6 shadow-elegant">
          <h2 className="text-lg font-semibold">1. The problem</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {SAMPLES.map((s, i) => (
              <Button key={i} size="sm" variant={problem === s ? "default" : "outline"} onClick={() => { setProblem(s); reset(); }}>Sample {i + 1}</Button>
            ))}
          </div>
          <Textarea className="mt-3 min-h-24" value={problem} onChange={(e) => setProblem(e.target.value)} placeholder="Paste or write a problem…" disabled={!!evaluation} />
          <h2 className="mt-6 text-lg font-semibold">Your planned solution</h2>
          <p className="text-sm text-muted-foreground">Describe your approach step by step — data structures, logic, edge cases, complexity. No code needed.</p>
          <Textarea className="mt-3 min-h-40" value={plan} onChange={(e) => setPlan(e.target.value)} placeholder={"1. I'll store each transaction in…\n2. For every new one I check…\n3. Edge cases…"} disabled={!!evaluation} />
          {!evaluation && (
            <Button variant="hero" className="mt-4" disabled={!problem.trim() || plan.trim().length < 15 || !!busy}
              onClick={() => run("eval", () => evalFn({ data: { problem, plan } }), setEvaluation)}>
              {busy === "eval" ? <><Loader2 className="animate-spin" /> Evaluating…</> : <>Evaluate my plan <ArrowRight /></>}
            </Button>
          )}
        </section>

        {/* Step 2: evaluation */}
        {evaluation && (
          <section className="mt-6 rounded-2xl border bg-card p-6 shadow-elegant">
            <div className="flex flex-wrap items-center gap-6">
              <div className={`font-display text-6xl font-extrabold ${scoreTone(evaluation.score)}`}>{Math.round(evaluation.score)}%</div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold">2. Evaluation</h2>
                <p className="text-muted-foreground">{evaluation.verdict}</p>
              </div>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {Object.entries(evaluation.dimensions).map(([k, v]) => (
                <div key={k}>
                  <div className="flex justify-between text-sm"><span className="capitalize">{k.replace(/([A-Z])/g, " $1")}</span><span className="font-semibold">{Math.round(v)}%</span></div>
                  <Progress value={v} className="mt-1" />
                </div>
              ))}
            </div>
            {evaluation.strengths.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold">What you got right</h3>
                <ul className="mt-2 space-y-1">{evaluation.strengths.map((s, i) => <li key={i} className="flex gap-2 text-sm"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />{s}</li>)}</ul>
              </div>
            )}
            {evaluation.mistakes.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold">Where you made mistakes</h3>
                <div className="mt-3 space-y-3">
                  {evaluation.mistakes.map((m, i) => (
                    <div key={i} className="rounded-xl border border-destructive/25 bg-destructive/5 p-4 text-sm">
                      <div className="flex items-center gap-2 font-semibold"><AlertTriangle className="h-4 w-4 text-destructive" />{m.step}</div>
                      <p className="mt-1">{m.issue}</p>
                      <p className="mt-2 text-muted-foreground"><strong className="text-foreground">Thinking gap:</strong> {m.thinkingGap}</p>
                      <p className="mt-1 text-muted-foreground"><strong className="text-foreground">How to fix:</strong> {m.fix}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {!hint && (
              <Button variant="hero" className="mt-6" disabled={!!busy}
                onClick={() => run("m1", () => m1Fn({ data: { problem, plan, evaluation: JSON.stringify(evaluation) } }), setHint)}>
                {busy === "m1" ? <><Loader2 className="animate-spin" /> Connecting to mentor…</> : <><Bot /> Fix my thinking with the AI mentor</>}
              </Button>
            )}
          </section>
        )}

        {/* Mentor step 1 */}
        {hint && (
          <section className="mt-6 rounded-2xl bg-ink p-6 text-ink-foreground shadow-elegant">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-accent"><Bot className="h-4 w-4" /> Mentor · Step 1 — Rethink</div>
            <p className="mt-4"><strong>Change your thinking:</strong> {hint.reframe}</p>
            <p className="mt-3 flex gap-2 text-ink-foreground/80"><Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-accent" />{hint.hint}</p>
            <div className="mt-5 rounded-xl border border-ink-foreground/20 p-4">
              <p className="font-semibold text-accent">{hint.guidingQuestion}</p>
            </div>
            {!final && (
              <>
                <Textarea className="mt-4 min-h-32 bg-background text-foreground" value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Answer the mentor's question and describe your revised approach…" />
                <Button variant="hero" className="mt-4" disabled={reply.trim().length < 10 || !!busy}
                  onClick={() => run("m2", () => m2Fn({ data: { problem, plan, question: hint.guidingQuestion, reply } }), setFinal)}>
                  {busy === "m2" ? <><Loader2 className="animate-spin" /> Reviewing…</> : <>Submit revised thinking <ArrowRight /></>}
                </Button>
              </>
            )}
          </section>
        )}

        {/* Mentor step 2 */}
        {final && evaluation && (
          <section className="mt-6 rounded-2xl border-2 border-accent bg-card p-6 shadow-glow">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-accent"><Bot className="h-4 w-4" /> Mentor · Step 2 — Fix</div>
            <div className="mt-4 flex items-center gap-4 font-display text-2xl font-bold">
              <span className={scoreTone(evaluation.score)}>{Math.round(evaluation.score)}%</span>
              <ArrowRight className="text-muted-foreground" />
              <span className={scoreTone(final.newScore)}>{Math.round(final.newScore)}%</span>
            </div>
            <p className="mt-4 text-muted-foreground">{final.feedbackOnReply}</p>
            <h3 className="mt-5 font-semibold">Corrected mental model</h3>
            <p className="mt-1 text-sm">{final.correctedThinking}</p>
            <h3 className="mt-5 font-semibold">Improved plan</h3>
            <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm">{final.improvedPlan.map((s, i) => <li key={i}>{s}</li>)}</ol>
            <p className="mt-5 rounded-xl bg-secondary p-4 text-sm"><strong>Takeaway:</strong> {final.takeaway}</p>
            <Button variant="outline" className="mt-6" onClick={reset}><RotateCcw /> Try another plan</Button>
          </section>
        )}
      </main>
    </div>
  );
}
