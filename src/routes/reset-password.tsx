import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SiteHeader } from "@/components/SiteHeader";
export const Route = createFileRoute("/reset-password")({ head: () => ({ meta: [{ title: "Reset your password | CareerPilot" }, { name: "description", content: "Securely choose a new CareerPilot password." }, { property: "og:title", content: "Reset your password | CareerPilot" }, { property: "og:description", content: "Recover access to your saved preparation progress." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }), component: ResetPassword });
function ResetPassword() {
  const [valid, setValid] = useState(false); const [password,setPassword] = useState(""); const [busy,setBusy] = useState(false); const navigate = useNavigate();
  useEffect(() => { setValid(new URLSearchParams(window.location.hash.slice(1)).get("type") === "recovery"); }, []);
  return <div className="min-h-screen bg-background"><SiteHeader /><main className="mx-auto max-w-md px-5 py-16"><h1 className="text-3xl font-bold">Reset password</h1>{valid ? <form className="mt-6 space-y-4" onSubmit={async (e) => { e.preventDefault(); setBusy(true); const { error } = await supabase.auth.updateUser({ password }); setBusy(false); if (error) toast.error(error.message); else { toast.success("Password updated"); void navigate({ to: "/interviews" }); } }}><label className="block">New password<Input className="mt-2" required minLength={8} type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} /></label><Button disabled={busy}>Update password</Button></form> : <p className="mt-4">Open the password reset link from your email to continue.</p>}</main></div>;
}