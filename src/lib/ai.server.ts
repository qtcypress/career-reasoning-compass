// Server-only AI provider selection. Default: Lovable AI Gateway.
// Later: set AI_PROVIDER=openai + OPENAI_API_KEY, or AI_PROVIDER=groq + GROQ_API_KEY.
import { createOpenAI } from "@ai-sdk/openai";
import { streamText, Output } from "ai";
import type { z } from "zod";

function getModel() {
  const provider = (process.env["AI_PROVIDER"] || "lovable").toLowerCase();
  if (provider === "openai" && process.env["OPENAI_API_KEY"]) {
    const openai = createOpenAI({ apiKey: process.env["OPENAI_API_KEY"] });
    return { model: openai.responses(process.env["AI_MODEL"] || "gpt-4.1-mini"), reasoning: false };
  }
  if (provider === "groq" && process.env["GROQ_API_KEY"]) {
    const groq = createOpenAI({ apiKey: process.env["GROQ_API_KEY"], baseURL: "https://api.groq.com/openai/v1" });
    return { model: groq.chat(process.env["AI_MODEL"] || "llama-3.3-70b-versatile"), reasoning: false };
  }
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("AI is not configured (missing LOVABLE_API_KEY).");
  let runId: string | undefined;
  const lovable = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey: key,
    headers: { "Lovable-API-Key": key, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: async (input, init) => {
      const headers = new Headers(init?.headers);
      if (runId) headers.set("X-Lovable-AIG-Run-ID", runId);
      const res = await fetch(input, { ...init, headers });
      runId ??= res.headers.get("X-Lovable-AIG-Run-ID") || undefined;
      return res;
    },
  });
  return { model: lovable.responses("openai/gpt-6-astra"), reasoning: true };
}

export async function generateStructured<T>(schema: z.ZodType<T>, system: string, prompt: string): Promise<T> {
  const { model, reasoning } = getModel();
  let streamError: unknown;
  const result = streamText({
    model,
    system,
    prompt,
    maxRetries: 0,
    output: Output.object({ schema }),
    providerOptions: {
      openai: reasoning
        ? { forceReasoning: true, reasoningEffort: "low", store: false }
        : { store: false },
    },
    onError: ({ error }) => {
      streamError = error;
    },
  });
  try {
    return (await result.output) as T;
  } catch (e) {
    const err = streamError ?? e;
    const status = (err as { statusCode?: number })?.statusCode;
    if (status === 429) throw new Error("The AI is busy right now. Please try again in a moment.");
    if (status === 402) throw new Error("AI credits are used up. Add credits in Settings → Plans & credits.");
    throw new Error(err instanceof Error ? err.message : "AI request failed.");
  }
}
