import { Link, useNavigate } from "@tanstack/react-router";
import logo from "@/assets/quality-thought-logo.png.asset.json";
import { Button } from "@/components/ui/button";
import { useSession } from "./SessionProvider";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function SiteHeader() {
  const { user } = useSession(); const navigate = useNavigate(); const queryClient = useQueryClient();
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="mx-auto flex min-h-20 max-w-6xl items-center justify-between gap-3 px-5 py-3">
        <Link to="/" aria-label="Quality Thought CareerPilot home" className="flex shrink-0 flex-col items-start gap-1 text-primary">
          <img src={logo.url} alt="Quality Thought — School of Technology" width={1674} height={305} className="h-auto w-40 sm:w-48" />
          <span className="font-display text-xs font-semibold">CareerPilot</span>
        </Link>
        <nav className="hidden items-center gap-4 text-sm font-medium text-muted-foreground xl:flex">
          <Link to="/assessments" className="hover:text-foreground">Assessments</Link>
          <Link to="/resume" className="hover:text-foreground">Resume</Link>
          <Link to="/interviews" className="hover:text-foreground">Interviews</Link>
          <Link to="/problems" className="hover:text-foreground">Problem Bank</Link>
          <Link to="/analyze" className="hover:text-foreground">AI Thinking Coach</Link>
        </nav>
        <div className="flex shrink-0 items-center gap-2"><Button asChild variant="hero" size="sm"><Link to="/problems">Practice coding</Link></Button>{user ? <Button variant="ghost" size="sm" onClick={async () => { await queryClient.cancelQueries(); queryClient.clear(); await supabase.auth.signOut(); void navigate({ to: "/auth", replace: true }); }}>Sign out</Button> : <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex"><Link to="/auth">Sign in</Link></Button>}</div>
      </div>
      <nav aria-label="Practice pages" className="flex gap-5 overflow-x-auto border-t px-5 py-3 text-xs font-medium text-muted-foreground xl:hidden"><Link to="/assessments" className="shrink-0">Assessments</Link><Link to="/interviews" className="shrink-0">Interviews</Link><Link to="/resume" className="shrink-0">Resume</Link><Link to="/problems" className="shrink-0">Problem Bank</Link><Link to="/analyze" className="shrink-0">AI Coach</Link></nav>
    </header>
  );
}
