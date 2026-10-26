// Server-only AI provider selection. Default: the user's linked Groq account.
import { createOpenAI } from "@ai-sdk/openai";
import { streamText, Output } from "ai";
import type { z } from "zod";

function getModel() {
  const provider = (process.env["AI_PROVIDER"] || "groq").toLowerCase();
  if (provider === "openai" && process.env["OPENAI_API_KEY"]) {
    const openai = createOpenAI({ apiKey: process.env["OPENAI_API_KEY"] });
    return { model: openai.responses(process.env["AI_MODEL"] || "gpt-4.1-mini"), reasoning: false };
  }
  if (provider === "groq") {
    const key = process.env["LOVABLE_API_KEY"];
    const connectionKey = process.env["UDC_GROQ_API_KEY"];
    if (!key || !connectionKey) throw new Error("Connect your Groq account in Settings → Connectors to use the thinking coach.");
    const groq = createOpenAI({
      apiKey: key,
      baseURL: "https://connector-gateway.lovable.dev/udc_groq/openai/v1",
      headers: { "X-Connection-Api-Key": connectionKey },
    });
    return { model: groq.chat(process.env["AI_MODEL"] || "openai/gpt-oss-20b"), reasoning: false };
  }
  if (provider !== "lovable") throw new Error("The selected AI provider is not configured. Check your AI account settings.");
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
    if (status === 429) throw new Error("Your AI account's rate limit was reached. Wait a moment and try again.");
    if (status === 402) throw new Error("Your AI account has insufficient balance. Check billing with your AI provider.");
    if (status === 401 || status === 403) throw new Error("Your AI connection could not authorize this request. Check the connection and model access in your account.");
    // Do not return SDK request/response diagnostics, which may include credentials.
    throw new Error("The AI could not complete this request. Please try again or check your AI account's model access.");
  }
}
