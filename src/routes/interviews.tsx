import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowRight, ArrowLeft, Mic, Loader2, Trophy, Target, History } from "lucide-react";
import { toast } from "sonner";
import { CAREERS } from "@/lib/careers";
import { interviewQuestions, ROUNDS, overallScore, interviewResult, type Round } from "@/lib/interviews";
import { scoreInterview, listInterviews } from "@/lib/interviews.functions";
import { SiteHeader } from "@/components/SiteHeader";
import { useSession } from "@/components/SessionProvider";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/interviews")({
  validateSearch: (search: Record<string, unknown>): { track?: string } => typeof search["track"] === "string" && CAREERS.some((c) => c.id === search["track"]) ? { track: search["track"] } : {},
  head: () => ({ meta: [{ title: "Mock Interviews & Score Tracker | CareerPilot" }, { name: "description", content: "Prepare for technical and HR interviews across nine career paths with real interview topics, Groq feedback and private score history." }, { property: "og:title", content: "Mock Interviews | CareerPilot" }, { property: "og:description", content: "Practice career-specific interview questions and track your scores." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: InterviewsPage,
});
function InterviewsPage() { const { track } = Route.useSearch(); return <Interviews key={track} initialTrack={track ?? "java"} />; }
function Interviews({ initialTrack }: { initialTrack: string }) {
  const { user, ready } = useSession(); const client = useQueryClient();
  const scoreFn = useServerFn(scoreInterview); const historyFn = useServerFn(listInterviews);
  const history = useQuery({ queryKey: ["interviews", user?.id], queryFn: () => historyFn(), enabled: !!user });
  const [trackId,setTrackId] = useState(initialTrack); const [round,setRound] = useState<Round>("Technical");
  const [active,setActive] = useState(false); const [index,setIndex] = useState(0); const [answers,setAnswers] = useState(["","",""]); const [busy,setBusy] = useState(false);
  const [result,setResult] = useState<Awaited<ReturnType<typeof scoreInterview>> | null>(null);
  const questions = interviewQuestions(trackId,round); const current = questions[index]; const career = CAREERS.find((c) => c.id === trackId);
  const rows = (history.data ?? []).filter((s) => s.track_id === trackId);
  const [reviewId,setReviewId] = useState<string | null>(null);
  const reviewRow = history.data?.find((s) => s.id === reviewId);
  const review = reviewRow ? interviewResult.safeParse(reviewRow.results) : null;
  async function finish() {
    setBusy(true);
    try { const res = await scoreFn({ data: { trackId, round, answers } }); setResult(res); setActive(false); await client.invalidateQueries({ queryKey: ["interviews"] }); }
    catch(e) { toast.error(e instanceof Error ? e.message : "Interview scoring failed. Try again."); } finally { setBusy(false); }
  }
  return <div className="min-h-screen bg-background"><SiteHeader /><main className="mx-auto max-w-6xl px-5 py-12">
    <p className="text-sm font-semibold uppercase text-muted-foreground">Placement preparation</p><h1 className="mt-2 text-3xl font-bold md:text-4xl">Mock interviews</h1>
    <div className="mt-8 grid gap-8 lg:grid-cols-[260px_1fr]">
      <aside><label className="text-sm font-semibold">Career path</label><Select value={trackId} onValueChange={(v) => { setTrackId(v); setResult(null); setReviewId(null); }} disabled={active || busy}><SelectTrigger className="mt-2" aria-label="Interview career path"><SelectValue /></SelectTrigger><SelectContent>{CAREERS.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select>
        <div className="mt-7 space-y-5 border-y py-6">{[[History, rows.length, "Completed interviews"], [Target, rows.length ? `${overallScore(rows.map((s) => s.score))}%` : "—", "Average score"], [Trophy, rows.length ? `${Math.max(...rows.map((s) => s.score))}%` : "—", "Best score"]].map(([Icon, value, label]) => { const MetricIcon = Icon as typeof History; return <div key={String(label)} className="flex items-center gap-3"><MetricIcon className="h-5 w-5 text-muted-foreground" /><div><div className="font-display text-2xl font-bold">{String(value)}</div><p className="text-xs text-muted-foreground">{String(label)}</p></div></div>; })}</div>
        {!user && ready && <Button asChild variant="outline" className="mt-5 w-full"><Link to="/auth">Sign in to save scores</Link></Button>}
      </aside>
      <div className="min-w-0">
        {!active && !result && <section><div className="flex items-center gap-3"><Mic className="h-6 w-6 text-accent" /><h2 className="text-2xl font-bold">{career?.name}</h2></div><p className="mt-2 text-sm text-muted-foreground">{career?.skills}</p>
          <div className="mt-6 flex flex-wrap gap-2">{ROUNDS.map((r) => <Button key={r} variant={round === r ? "default" : "outline"} onClick={() => setRound(r)}>{r}</Button>)}</div>
          <div className="mt-6 divide-y border-y">{questions.map((q,i) => <div key={q.id} className="py-5"><p className="text-xs font-semibold text-muted-foreground">QUESTION {i+1}</p><p className="mt-2 font-medium">{q.question}</p></div>)}</div>
          <Button className="mt-6" variant="hero" disabled={!user || !ready} onClick={() => { setActive(true); setAnswers(["","",""]); setIndex(0); setReviewId(null); }}>Start {round.toLowerCase()} interview <ArrowRight /></Button>
        </section>}
        {active && current && <section><div className="flex items-center justify-between gap-4"><h2 className="text-xl font-bold">{career?.name} · {round}</h2><span className="shrink-0 text-sm text-muted-foreground">{index+1} / 3</span></div><Progress value={(index+1)/3*100} className="mt-4" /><h3 className="mt-8 text-xl font-semibold leading-relaxed">{current.question}</h3><Textarea aria-label="Interview answer" maxLength={4000} value={answers[index] ?? ""} onChange={(e) => setAnswers((prev) => prev.map((a,i) => i === index ? e.target.value : a))} disabled={busy} className="mt-5 min-h-56" placeholder="Your answer…" /><p className="mt-2 text-xs text-muted-foreground">{answers[index]?.length ?? 0} / 4000</p><div className="mt-6 flex flex-wrap justify-between gap-3"><Button variant="outline" disabled={busy} onClick={() => index ? setIndex(index-1) : setActive(false)}><ArrowLeft />{index ? "Previous" : "Cancel"}</Button><Button variant="hero" disabled={busy || (answers[index]?.trim().length ?? 0) < 15} onClick={() => index < 2 ? setIndex(index+1) : finish()}>{busy ? <><Loader2 className="animate-spin" />Scoring and saving…</> : index < 2 ? <>Next question <ArrowRight /></> : "Finish & get score"}</Button></div></section>}
        {result && <section><div className="flex flex-wrap items-center gap-5"><div className="font-display text-5xl font-bold text-primary">{result.score}%</div><div><h2 className="text-xl font-bold">Interview complete</h2><p className="mt-1 text-sm text-success">Saved to your score tracker</p></div></div><p className="mt-5 text-muted-foreground">{result.summary}</p><div className="mt-7 divide-y border-y">{result.feedback.map((f,i) => <div key={i} className="py-6"><h3 className="font-semibold">{i+1}. {result.questions[i]}</h3><p className="mt-2 text-sm font-semibold">Score {f.score}% · Accuracy {f.accuracy}% · Clarity {f.clarity}% · Depth {f.depth}%</p><details className="mt-3 text-sm"><summary className="cursor-pointer font-medium">Your answer</summary><p className="mt-2 whitespace-pre-wrap text-muted-foreground">{result.answers[i]}</p></details><ul className="mt-3 list-disc space-y-1 pl-5 text-sm">{f.improvements.map((s) => <li key={s}>{s}</li>)}</ul><details className="mt-4 text-sm"><summary className="cursor-pointer font-medium">Strengths & example answer</summary><p className="mt-2 text-success">{f.strengths.join(" · ")}</p><p className="mt-3 whitespace-pre-wrap">{f.exampleAnswer}</p></details></div>)}</div><Button className="mt-6" variant="outline" onClick={() => setResult(null)}>Practice again</Button></section>}
        {!active && <section className="mt-10 border-t pt-7"><h2 className="text-xl font-bold">Score history · {career?.name}</h2>{history.isError ? <div className="mt-4"><p className="text-destructive">Could not load scores.</p><Button variant="outline" onClick={() => history.refetch()}>Retry</Button></div> : history.isFetching ? <p className="mt-4 text-muted-foreground">Loading scores…</p> : rows.length === 0 ? <p className="mt-4 text-sm text-muted-foreground">No completed interviews yet.</p> : <div className="mt-4 divide-y">{rows.map((s) => <div key={s.id} className="flex flex-wrap items-center gap-4 py-3 text-sm"><span className="flex-1">{new Date(s.created_at).toLocaleDateString()} · {s.round}</span><strong>{s.score}%</strong><Button variant="outline" size="sm" onClick={() => setReviewId(reviewId === s.id ? null : s.id)}>Review</Button></div>)}</div>}
          {review?.success && <div className="mt-5 border-l-2 border-accent pl-4"><p>{review.data.summary}</p>{review.data.feedback.map((f,i) => <div key={i} className="mt-4 text-sm"><strong>Question {i+1} · {f.score}%</strong><ul className="mt-2 list-disc pl-5">{f.improvements.map((s) => <li key={s}>{s}</li>)}</ul></div>)}</div>}
        </section>}
      </div>
    </div>
  </main></div>;
}