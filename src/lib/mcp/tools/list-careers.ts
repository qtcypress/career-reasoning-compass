import { defineTool } from "@lovable.dev/mcp-js";
import { CAREERS } from "@/lib/careers";
export default defineTool({
  name: "list_career_paths", title: "List career paths", description: "List all nine CareerPilot career paths and their core skills.", inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({ content: [{ type: "text", text: CAREERS.map(c => `${c.id}: ${c.name} — ${c.skills}`).join("\n") }] }),
});