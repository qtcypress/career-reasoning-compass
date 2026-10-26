import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight, Target, SearchCheck, Map, Rocket, Flame, Code2, Brain, MessageSquare,
  FileText, Mic, Bot, Trophy, BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/SiteHeader";
import hero from "@/assets/hero.jpg";
import { PROBLEMS } from "@/lib/problems";
import { CAREERS } from "@/lib/careers";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CareerPilot — AI Career Readiness & Placement Prep" },
      { name: "description", content: "AI assessments, personalised roadmaps, coding practice, mock interviews and an AI thinking coach for engineering students." },
      { property: "og:title", content: "CareerPilot — AI Career Readiness & Placement Prep" },
      { property: "og:description", content: "Explore, assess, learn, practice and get hired with AI-guided career readiness." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const steps = [
  { icon: Target, t: "Assess", d: "Understand your readiness across technical and employability skills." },
  { icon: SearchCheck, t: "Find Gaps", d: "See what's strong, weak or missing before placements expose it." },
  { icon: Map, t: "Get Your Roadmap", d: "Know what to learn next based on your stage, goals and assessment." },
  { icon: Rocket, t: "Become Career-Ready", d: "Build skills, communication, resume and interview confidence." },
];
const years = [
  ["Year 1", "Explore", "Discover career paths, build fundamentals and coding habits."],
  ["Year 2", "Build", "Master DSA, core subjects and your first real projects."],
  ["Year 3", "Industry Ready", "Specialise, intern, and build a portfolio companies notice."],
  ["Year 4", "Placement Ready", "Mock interviews, aptitude, resume and offer preparation."],
];
const features = [
  { icon: Flame, t: "Daily Missions", d: "Small daily goals that compound into real skill." },
  { icon: Code2, t: "DSA & Coding", d: `${PROBLEMS.length} coding interview questions with examples, constraints and AI plan evaluation.` },
  { icon: Brain, t: "Aptitude & Reasoning", d: "Quant, logical and verbal practice for every test pattern." },
  { icon: MessageSquare, t: "Communication Lab", d: "Speak, present and write with AI feedback." },
  { icon: FileText, t: "Resume & Profile", d: "ATS-ready resumes built from your actual progress." },
  { icon: Mic, t: "Mock Interviews", d: "Technical and HR rounds with instant scoring." },
  { icon: Bot, t: "AI Career Mentor", d: "Fix your thinking, not just your answer." },
  { icon: Trophy, t: "Contests & Challenges", d: "Compete, rank and stay consistent." },
  { icon: BarChart3, t: "Progress Analytics", d: "See readiness rise week after week." },
];
const problems = PROBLEMS.slice(0, 6);

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="relative overflow-hidden bg-ink text-ink-foreground">
        <img src={hero} alt="Students looking at a glowing career roadmap" width={1536} height={1024} className="absolute inset-0 h-full w-full object-cover opacity-70" />
        <div className="absolute inset-0 bg-hero" />
        <div className="relative mx-auto max-w-6xl px-5 pb-24 pt-32 md:pt-44">
          <p className="mb-5 inline-block rounded-full border border-ink-foreground/25 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-accent">
            AI Career Readiness Platform
          </p>
          <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.05] md:text-6xl">
            Every final-year student has one thought: <span className="text-accent-gradient">I should have started earlier.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-ink-foreground/80">
            Assessments, roadmaps, coding practice, mock interviews and an AI mentor that fixes how you think.
            <strong className="text-ink-foreground"> Explore → Assess → Learn → Practice → Get Hired.</strong>
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="hero" size="lg"><Link to="/analyze">Test your problem-solving <ArrowRight /></Link></Button>
            <Button asChild variant="ghostLight" size="lg"><a href="#how">Explore platform</a></Button>
          </div>
          <div className="mt-16 grid max-w-2xl grid-cols-2 gap-6 md:grid-cols-4">
            {[["10,000+", "Students guided"], ["500+", "Practice activities"], ["100+", "Career paths"], ["AI", "Mentor feedback"]].map(([n, l]) => (
              <div key={l}><div className="font-display text-3xl font-bold text-accent">{n}</div><div className="text-sm text-ink-foreground/70">{l}</div></div>
            ))}
          </div>
        </div>
      </section>

      <section id="how" className="mx-auto max-w-6xl px-5 py-24">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent">How CareerPilot works</p>
        <h2 className="mt-2 text-3xl font-bold md:text-4xl">One guided journey, four steps.</h2>
        <div className="mt-12 grid gap-5 md:grid-cols-4">
          {steps.map((s, i) => (
            <div key={s.t} className="rounded-2xl border bg-card p-6 shadow-elegant">
              <div className="flex items-center justify-between">
                <s.icon className="h-6 w-6 text-accent" />
                <span className="font-display text-sm text-muted-foreground">0{i + 1}</span>
              </div>
              <h3 className="mt-6 text-lg font-semibold">{s.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="careers" className="bg-secondary py-24">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-3xl font-bold md:text-4xl">One platform. Many career possibilities.</h2>
          <p className="mt-3 max-w-xl text-muted-foreground">Explore the paths, understand the skills, build toward the career you want.</p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CAREERS.map((c) => (
              <div key={c.id} className="group rounded-xl border bg-card p-5 transition hover:-translate-y-1 hover:shadow-elegant">
                <h3 className="font-semibold">{c.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{c.skills}</p>
                <Button asChild variant="link" className="mt-4 h-auto px-0"><Link to="/interviews" search={{ track: c.id }}>Practice interview <ArrowRight className="h-4 w-4" /></Link></Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="journey" className="mx-auto max-w-6xl px-5 py-24">
        <h2 className="text-3xl font-bold md:text-4xl">Your complete college journey.</h2>
        <div className="mt-12 grid gap-0 md:grid-cols-4">
          {years.map(([y, t, d]) => (
            <div key={y} className="border-l-2 border-accent py-2 pl-5 pr-4 md:border-l-0 md:border-t-2 md:pl-0 md:pt-6">
              <div className="text-xs font-semibold uppercase tracking-widest text-accent">{y}</div>
              <h3 className="mt-1 text-xl font-semibold">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="bg-ink py-24 text-ink-foreground">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-3xl font-bold md:text-4xl">Everything inside CareerPilot.</h2>
          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl bg-ink-foreground/10 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.t} className="bg-ink p-7">
                <f.icon className="h-6 w-6 text-accent" />
                <h3 className="mt-4 font-semibold">{f.t}</h3>
                <p className="mt-1 text-sm text-ink-foreground/70">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-24">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-accent">New · AI Thinking Coach</p>
            <h2 className="mt-2 text-3xl font-bold md:text-4xl">Plan first. Get scored. Fix your thinking.</h2>
            <p className="mt-4 text-muted-foreground">Write how you'd solve a real-world problem. The AI scores your plan, pinpoints exactly where your thinking went wrong, and a mentor walks you through a 2-step correction.</p>
            <Button asChild variant="hero" size="lg" className="mt-8"><Link to="/problems">Explore coding questions <ArrowRight /></Link></Button>
          </div>
          <ul className="space-y-3">
            {problems.map((p) => (
              <li key={p.id} className="rounded-xl border bg-card text-sm">
                <Link to="/problems/$problemId" params={{ problemId: p.id }} className="flex items-center gap-3 p-4 hover:text-primary"><Code2 className="h-4 w-4 shrink-0 text-accent" /> {p.title}<ArrowRight className="ml-auto h-4 w-4 shrink-0" /></Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <footer className="border-t py-10 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} CareerPilot · Clarity today for a brighter tomorrow.
      </footer>
    </div>
  );
}
