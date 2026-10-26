import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { filterProblems, TOPICS } from "@/lib/problems";
export default defineTool({
  name: "search_problems", title: "Search coding problems",
  description: "Find curated coding interview questions by search, topic, and difficulty.",
  inputSchema: { query: z.string().max(200).default(""), difficulty: z.enum(["All", "Easy", "Medium", "Hard"]).default("All"), topic: z.string().refine(t => t === "All" || TOPICS.includes(t), "Unknown topic").default("All") },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ query, difficulty, topic }) => ({ content: [{ type: "text", text: filterProblems(query, difficulty, topic).map(p => `${p.id}: ${p.title} (${p.difficulty}) — ${p.topics.join(", ")}`).join("\n") || "No matching problems." }] }),
});