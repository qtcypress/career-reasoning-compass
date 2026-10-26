import { Link, useNavigate } from "@tanstack/react-router";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "./SessionProvider";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function SiteHeader() {
  const { user } = useSession(); const navigate = useNavigate(); const queryClient = useQueryClient();
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold text-primary">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-accent">
            <Compass className="h-4 w-4" />
          </span>
          CareerPilot
        </Link>
        <nav className="hidden items-center gap-5 text-sm font-medium text-muted-foreground lg:flex">
          <a href="/#how" className="hover:text-foreground">How it works</a>
          <a href="/#careers" className="hover:text-foreground">Careers</a>
          <Link to="/interviews" className="hover:text-foreground">Interviews</Link>
          <Link to="/problems" className="hover:text-foreground">Problem Bank</Link>
          <Link to="/analyze" className="hover:text-foreground">AI Thinking Coach</Link>
        </nav>
        <div className="flex items-center gap-2"><Button asChild variant="hero" size="sm"><Link to="/problems">Practice coding</Link></Button>{user ? <Button variant="ghost" size="sm" onClick={async () => { await queryClient.cancelQueries(); queryClient.clear(); await supabase.auth.signOut(); void navigate({ to: "/auth", replace: true }); }}>Sign out</Button> : <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex"><Link to="/auth">Sign in</Link></Button>}</div>
      </div>
    </header>
  );
}
