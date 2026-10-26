import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sourceUrl, type CodingProblem } from "@/lib/problems";

export function Difficulty({ value }: { value: CodingProblem["difficulty"] }) {
  return <span className={`text-xs font-semibold ${value === "Easy" ? "text-success" : value === "Medium" ? "text-accent-foreground" : "text-destructive"}`}>{value}</span>;
}

export function ProblemStatement({ problem }: { problem: CodingProblem }) {
  return <div>
    <div className="flex flex-wrap items-center gap-3"><Difficulty value={problem.difficulty} /><span className="text-xs text-muted-foreground">{problem.topics.join(" · ")}</span></div>
    <h2 className="mt-3 text-2xl font-bold">{problem.title}</h2>
    <p className="mt-4 leading-relaxed">{problem.statement}</p>
    <h3 className="mt-6 font-semibold">Examples</h3>
    <div className="mt-3 space-y-4">{problem.examples.map((e, i) => <div key={i} className="border-l-2 border-accent pl-4 text-sm">
      <p className="font-mono break-words"><strong>Input:</strong> {e.input}</p>
      <p className="mt-1 font-mono break-words"><strong>Output:</strong> {e.output}</p>
      <p className="mt-2 text-muted-foreground">{e.explanation}</p>
    </div>)}</div>
    <h3 className="mt-6 font-semibold">Constraints</h3>
    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">{problem.constraints.map((c) => <li key={c}>{c}</li>)}</ul>
    <Button asChild variant="link" className="mt-4 h-auto px-0"><a href={sourceUrl(problem)} target="_blank" rel="noopener noreferrer">Original question on LeetCode <ExternalLink /></a></Button>
  </div>;
}