import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Search, Code2 } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Difficulty } from "@/components/ProblemStatement";
import { PROBLEMS, TOPICS, filterProblems } from "@/lib/problems";
import { useWebMCP } from "use-webmcp-tool";
import { runWebMCPTool } from "@/lib/webmcp-telemetry";

export const Route = createFileRoute("/problems/")({
  head: () => ({ meta: [
    { title: "Coding Problem Bank | CareerPilot" },
    { name: "description", content: "Practice established coding interview questions across arrays, trees, graphs and dynamic programming with CareerPilot's AI coach." },
    { property: "og:title", content: "Coding Problem Bank | CareerPilot" },
    { property: "og:description", content: "Find coding questions by topic and difficulty, then evaluate your solution plan." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: ProblemBank,
});

function ProblemBank() {
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [topic, setTopic] = useState("All");
  const results = filterProblems(query, difficulty, topic);
  useWebMCP({ name: "read_visible_problems", description: "Read the coding questions currently visible with the active filters.", annotations: { readOnlyHint: true }, execute: () => runWebMCPTool("read_visible_problems", () => results.map(p => `${p.id}: ${p.title} (${p.difficulty})`).join("\n") || "No questions shown.") });
  return <div className="min-h-screen bg-background"><SiteHeader />
    <main className="mx-auto max-w-6xl px-5 py-12">
      <p className="text-sm font-semibold uppercase text-muted-foreground">Coding practice</p>
      <h1 className="mt-2 text-3xl font-bold md:text-4xl">Problem bank</h1>
      <div className="mt-6 flex flex-wrap gap-6 border-b pb-6 text-sm text-muted-foreground">
        <span><strong className="text-foreground">{PROBLEMS.length}</strong> questions</span>
        <span><strong className="text-foreground">3</strong> difficulty levels</span>
        <span><strong className="text-foreground">{TOPICS.length}</strong> topics</span>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_160px_220px]">
        <div className="relative"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input aria-label="Search problems" placeholder="Search questions or topics…" value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9" /></div>
        <Select value={difficulty} onValueChange={setDifficulty}><SelectTrigger aria-label="Difficulty"><SelectValue /></SelectTrigger><SelectContent>{["All", "Easy", "Medium", "Hard"].map((d) => <SelectItem key={d} value={d}>{d === "All" ? "All difficulties" : d}</SelectItem>)}</SelectContent></Select>
        <Select value={topic} onValueChange={setTopic}><SelectTrigger aria-label="Topic"><SelectValue /></SelectTrigger><SelectContent>{["All", ...TOPICS].map((t) => <SelectItem key={t} value={t}>{t === "All" ? "All topics" : t}</SelectItem>)}</SelectContent></Select>
      </div>
      <p className="mt-5 text-sm text-muted-foreground" role="status">{results.length} {results.length === 1 ? "question" : "questions"}</p>
      <div className="mt-3 divide-y border-y">{results.map((p, i) => <article key={p.id} className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center">
        <span className="hidden w-8 text-sm text-muted-foreground sm:block">{String(i + 1).padStart(2, "0")}</span>
        <div className="min-w-0 flex-1"><Link to="/problems/$problemId" params={{ problemId: p.id }} className="font-display font-semibold hover:underline">{p.title}</Link><p className="mt-1 text-xs text-muted-foreground">{p.topics.join(" · ")}</p></div>
        <Difficulty value={p.difficulty} />
        <Button asChild variant="outline" size="sm"><Link to="/problems/$problemId" params={{ problemId: p.id }}>View question <ArrowRight /></Link></Button>
      </article>)}</div>
      {results.length === 0 && <div className="py-16 text-center"><Code2 className="mx-auto h-8 w-8 text-muted-foreground" /><h2 className="mt-4 font-semibold">No matching questions</h2><Button variant="outline" className="mt-4" onClick={() => { setQuery(""); setDifficulty("All"); setTopic("All"); }}>Clear filters</Button></div>}
    </main>
  </div>;
}