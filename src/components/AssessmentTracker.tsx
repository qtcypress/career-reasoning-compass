import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { latestTopicResults, areaSchema } from "@/lib/assessment-results";
import type { listAssessments } from "@/lib/assessments.functions";

type Rows = Awaited<ReturnType<typeof listAssessments>>;
export function AssessmentTracker({ rows, loading, error, retry, career, practice }: {
  rows: Rows; loading: boolean; error: boolean; retry: () => void; career: string;
  practice: (topic: string) => void;
}) {
  const areas = latestTopicResults(rows);
  const weak = areas.filter(a => a.correct < a.total);
  return <section className="mt-12 border-t pt-8" aria-label="Saved assessment tracker">
    <h2 className="text-xl font-bold">Weak areas tracker · {career}</h2>
    {loading ? <p className="mt-4 text-muted-foreground">Loading your quiz scores…</p> : error ? <div className="mt-4"><p className="text-destructive">Your saved scores could not load.</p><Button variant="outline" className="mt-3" onClick={retry}>Retry history</Button></div> : <>
      {!areas.length ? <p className="mt-4 text-sm text-muted-foreground">No saved assessments for this path yet.</p> : <>
        <p className="mt-3 text-sm text-muted-foreground">Latest score per topic</p>
        <div className="mt-5 grid gap-5 sm:grid-cols-3">{areas.map(a => <div key={a.topic}><div className="flex justify-between gap-3 text-sm"><span>{a.topic}</span><strong>{a.score}%</strong></div><Progress className="mt-2" value={a.score} /></div>)}</div>
        {weak.length ? <ul className="mt-6 divide-y">{weak.map(a => <li key={a.topic} className="flex flex-wrap items-center justify-between gap-3 py-3"><div><strong className="text-sm">{a.topic}</strong><p className="text-sm text-muted-foreground">{a.total - a.correct} of {a.total} missed</p></div><Button variant="outline" size="sm" onClick={() => practice(a.topic)}>Practice topic</Button></li>)}</ul> : <p className="mt-6 text-sm text-success">No weak areas in your latest topic results.</p>}
      </>}
      <h3 className="mt-8 text-lg font-semibold">Quiz score history</h3>
      <div className="mt-3 divide-y">{rows.map(row => <details key={row.id} className="py-4 text-sm"><summary className="cursor-pointer"><span className="font-semibold">{row.score}%</span> · {row.topic} · {row.correct}/{row.total} correct · {new Date(row.created_at).toLocaleString()}</summary><ul className="mt-3 space-y-2 pl-4">{(areaSchema.safeParse(row.areas).data ?? []).map(a => <li key={a.topic}>{a.topic} · {a.score}% · {a.total - a.correct} missed</li>)}</ul></details>)}</div>
    </>}
  </section>;
}