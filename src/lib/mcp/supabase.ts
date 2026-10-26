import { createClient } from "@supabase/supabase-js";
import type { ToolContext } from "@lovable.dev/mcp-js";
import type { Database } from "@/integrations/supabase/types";

export function supabaseForUser(ctx: ToolContext) {
  const token = ctx.getToken();
  if (!token || !ctx.isAuthenticated()) throw new Error("Sign in to read your scores.");
  const url = process.env['SUPABASE_URL'];
  const key = process.env['SUPABASE_PUBLISHABLE_KEY'] ?? process.env['SUPABASE_ANON_KEY'];
  if (!url || !key) throw new Error("Score storage is unavailable.");
  return createClient<Database>(url, key, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}