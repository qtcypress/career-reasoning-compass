import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { CAREERS } from "@/lib/careers";
import { supabaseForUser } from "../supabase";
export default defineTool({
  name: "list_interview_scores", title: "Read my interview scores", description: "Read up to 50 of the signed-in caller's recent interview scores; other users' scores are never included.",
  inputSchema: { track_id: z.string().refine(id => CAREERS.some(c => c.id === id), "Unknown career path").optional() },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ track_id }, ctx) => {
    const client = supabaseForUser(ctx);
    let query = client.from("interview_sessions").select("id, track_id, round, score, created_at").eq("user_id", ctx.getUserId() ?? "").order("created_at", { ascending: false }).limit(50);
    if (track_id) query = query.eq("track_id", track_id);
    const { data, error } = await query;
    if (error) throw new ToolError("Could not read your interview scores.");
    return { content: [{ type: "text", text: data?.map(s => `${s.id}: ${s.track_id} · ${s.round} · ${s.score}% · ${s.created_at}`).join("\n") || "No saved interviews." }] };
  },
});