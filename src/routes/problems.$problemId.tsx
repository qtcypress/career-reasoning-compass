import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Bot } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { ProblemStatement } from "@/components/ProblemStatement";
import { Button } from "@/components/ui/button";
import { getProblem } from "@/lib/problems";

export const Route = createFileRoute("/problems/$problemId")({
  loader: ({ params }) => { const problem = getProblem(params.problemId); if (!problem) throw notFound(); return problem; },
  head: ({ loaderData }) => ({ meta: [
    { title: `${loaderData?.title ?? "Question not found"} — Coding Practice | CareerPilot` },
    { name: "description", content: loaderData?.statement ?? "Browse CareerPilot's coding problem bank." },
    { property: "og:title", content: `${loaderData?.title ?? "Coding question"} | CareerPilot` },
    { property: "og:description", content: loaderData?.statement ?? "Practice coding interview questions with an AI thinking coach." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: ProblemPage,
});

function ProblemPage() {
  const problem = Route.useLoaderData();
  return <div className="min-h-screen bg-background"><SiteHeader /><main className="mx-auto max-w-4xl px-5 py-10">
    <Button asChild variant="ghost" className="mb-6 px-0"><Link to="/problems"><ArrowLeft /> Problem bank</Link></Button>
    <ProblemStatement problem={problem} />
    <div className="mt-8 border-t pt-6"><Button asChild variant="hero" size="lg"><Link to="/analyze" search={{ problem: problem.id }}><Bot /> Plan with AI coach <ArrowRight /></Link></Button></div>
  </main></div>;
}