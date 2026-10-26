import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { getProblem, problemPrompt } from "@/lib/problems";
export default defineTool({
  name: "get_problem", title: "Read coding question", description: "Read the full statement, examples, and constraints for a problem ID returned by search_problems.",
  inputSchema: { problem_id: z.string().min(1).max(100) },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ problem_id }) => { const p = getProblem(problem_id); if (!p) throw new ToolError("Unknown problem ID."); return { content: [{ type: "text", text: problemPrompt(p) }] }; },
});