import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useSession } from "@/components/SessionProvider";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import "@lovable.dev/cloud-auth-js/styles.css";
import { oauthReturnPath } from "@/lib/oauth-return-path";

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>): { next?: string } => ({ next: oauthReturnPath(s['next'] ?? "/interviews") }),
  head: () => ({ meta: [{ title: "Sign in | CareerPilot" }, { name: "description", content: "Sign in to save your CareerPilot interview scores and progress." }, { property: "og:title", content: "Sign in | CareerPilot" }, { property: "og:description", content: "Your private career preparation progress." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: AuthPage,
});
function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup" | "reset">("signin");
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [busy, setBusy] = useState(false); const [notice, setNotice] = useState("");
  const { user } = useSession();
  const next = Route.useSearch().next ?? "/interviews";
  useEffect(() => { if (user) window.location.assign(next); }, [user, next]);
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setNotice("");
    try {
      if (mode === "reset") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` }); if (error) throw error; setNotice("Check your email for a password reset link.");
      } else if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: new URL(next, window.location.origin).href } }); if (error) throw error;
        if (!data.session) setNotice("Check your email to confirm your account before signing in.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password }); if (error) throw error;
      }
    } catch (e) { toast.error(e instanceof Error ? e.message : "Sign-in failed. Please try again."); } finally { setBusy(false); }
  }
  async function social(provider: "google" | "lovable") {
    setBusy(true);
    try { const result = await lovable.auth.signInWithOAuth(provider, { redirect_uri: new URL(next, window.location.origin).href }); if (result.error) throw result.error; } catch(e) { toast.error(e instanceof Error ? e.message : "Sign-in failed."); } finally { setBusy(false); }
  }
  return <div className="min-h-screen bg-background"><SiteHeader /><main className="mx-auto max-w-md px-5 py-16"><h1 className="text-3xl font-bold">{mode === "signup" ? "Create your account" : mode === "reset" ? "Reset password" : "Welcome back"}</h1>
    <form onSubmit={submit} className="mt-8 space-y-4"><label className="block text-sm font-medium">Email<Input type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2" /></label>
    {mode !== "reset" && <label className="block text-sm font-medium">Password<Input type="password" autoComplete={mode === "signup" ? "new-password" : "current-password"} required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2" /></label>}
    <Button type="submit" disabled={busy} className="w-full">{busy ? "Please wait…" : mode === "signup" ? "Create account" : mode === "reset" ? "Send reset link" : "Sign in"}</Button></form>
    {notice && <p role="status" className="mt-4 text-sm text-success">{notice}</p>}
    {mode !== "reset" && <div className="mt-6 space-y-3 border-t pt-6"><Button variant="outline" disabled={busy} onClick={() => social("google")} className="w-full">Continue with Google</Button><Button variant="outline" disabled={busy} onClick={() => social("lovable")} className="lovable-auth-button w-full">Continue with Lovable</Button></div>}
    <div className="mt-4 flex flex-wrap justify-between"><Button variant="link" onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setNotice(""); }}>{mode === "signin" ? "Create account" : "Back to sign in"}</Button>{mode === "signin" && <Button variant="link" onClick={() => setMode("reset")}>Forgot password?</Button>}</div><Button asChild variant="link" className="mt-3"><Link to="/interviews">Back to interviews</Link></Button>
  </main></div>;
}