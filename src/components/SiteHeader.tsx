import { Link } from "@tanstack/react-router";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold text-primary">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-accent">
            <Compass className="h-4 w-4" />
          </span>
          CareerPilot
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-medium text-muted-foreground md:flex">
          <a href="/#how" className="hover:text-foreground">How it works</a>
          <a href="/#careers" className="hover:text-foreground">Careers</a>
          <a href="/#journey" className="hover:text-foreground">Journey</a>
          <a href="/#features" className="hover:text-foreground">Features</a>
          <Link to="/analyze" className="hover:text-foreground">AI Thinking Coach</Link>
        </nav>
        <Button asChild variant="hero" size="sm">
          <Link to="/analyze">Try AI Evaluator</Link>
        </Button>
      </div>
    </header>
  );
}
