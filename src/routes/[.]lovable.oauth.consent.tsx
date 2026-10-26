import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/SiteHeader";
export const Route = createFileRoute("/.lovable/oauth/consent")({
  ssr: false,
  validateSearch: (s: Record<string, unknown>) => ({ authorization_id: typeof s['authorization_id'] === "string" ? s['authorization_id'] : "" }),
  head: () => ({ meta: [{ title: "Connect an assistant | CareerPilot AI" }, { name: "description", content: "Review assistant access to your CareerPilot account." }, { property: "og:title", content: "Connect an assistant | CareerPilot AI" }, { property: "og:description", content: "Approve or cancel secure assistant access." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  beforeLoad: async ({ search, location }) => {
    if (!search.authorization_id) throw new Error("This connection request is missing its authorization ID.");
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    if (!data.session) throw redirect({ to: "/auth", search: { next: location.pathname + location.searchStr + location.hash } });
  },
  loader: async ({ location }) => {
    const id = new URLSearchParams(location.searchStr).get("authorization_id");
    if (!id) throw new Error("Missing connection request.");
    const { data, error } = await supabase.auth.oauth.getAuthorizationDetails(id);
    if (error) throw error;
    if (data && "redirect_url" in data) throw redirect({ href: data.redirect_url });
    return data;
  },
  errorComponent: () => <div><SiteHeader /><main className="mx-auto max-w-lg px-5 py-16"><h1 className="text-2xl font-bold">Connection unavailable</h1><p className="mt-4 text-muted-foreground">This request may have expired or could not be loaded. Start the connection again from your assistant.</p></main></div>,
  component: Consent,
});
function Consent() {
  const details = Route.useLoaderData(); const { authorization_id } = Route.useSearch();
  const [busy, setBusy] = useState(false); const [error, setError] = useState("");
  const name = details && "client" in details ? details.client.name : "your assistant";
  async function decide(approve: boolean) {
    setBusy(true); setError("");
    try {
      const { data, error } = approve ? await supabase.auth.oauth.approveAuthorization(authorization_id, { skipBrowserRedirect: true }) : await supabase.auth.oauth.denyAuthorization(authorization_id, { skipBrowserRedirect: true });
      if (error) throw error;
      if (!data?.redirect_url) throw new Error("No return address was provided. Try connecting again.");
      window.location.assign(data.redirect_url);
    } catch (e) { setError(e instanceof Error ? e.message : "Could not complete the connection."); setBusy(false); }
  }
  return <div><SiteHeader /><main className="mx-auto max-w-lg px-5 py-16"><h1 className="text-3xl font-bold">Connect {name} to CareerPilot AI</h1><p className="mt-5">This lets {name} use this app as you.</p>{details && "client" in details && <><p className="mt-3 break-all text-sm text-muted-foreground">{details.client.uri}</p><p className="mt-3 text-sm">Account: {details.user.email}</p><p className="mt-3 text-sm">Requested identity permissions: {details.scope}</p></>}<p className="mt-5">Access includes coding questions, career paths, and your saved interview scores.</p><p className="mt-3 text-sm text-muted-foreground">This does not bypass your account permissions or expose other users’ scores.</p>{error && <p role="alert" className="mt-4 text-destructive">{error}</p>}<div className="mt-8 flex gap-3"><Button disabled={busy} onClick={() => decide(true)}>Approve connection</Button><Button variant="outline" disabled={busy} onClick={() => decide(false)}>Cancel connection</Button></div></main></div>;
}