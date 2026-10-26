import { afterEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";

const mocks = vi.hoisted(() => ({
  createOpenAI: vi.fn(),
  chat: vi.fn(() => "groq-model"),
  streamText: vi.fn(() => ({ output: Promise.resolve({ score: 50 }) })),
}));

vi.mock("@ai-sdk/openai", () => ({ createOpenAI: mocks.createOpenAI }));
vi.mock("ai", () => ({ streamText: mocks.streamText, Output: { object: vi.fn() } }));

import { generateStructured } from "@/lib/ai.server";

afterEach(() => { vi.unstubAllEnvs(); vi.clearAllMocks(); });

describe("Coach AI account", () => {
  it("defaults to the user's Groq connector rather than built-in AI", async () => {
    vi.stubEnv("AI_PROVIDER", "");
    vi.stubEnv("AI_MODEL", "");
    vi.stubEnv("LOVABLE_API_KEY", "test-only-gateway-credential");
    vi.stubEnv("UDC_GROQ_API_KEY", "test-only-connection-credential");
    mocks.createOpenAI.mockReturnValue({ chat: mocks.chat });
    await generateStructured(z.object({ score: z.number() }), "Evaluate", "A plan");
    expect(mocks.createOpenAI.mock.calls[0]?.[0]?.baseURL).toBe("https://connector-gateway.lovable.dev/udc_groq/openai/v1");
    expect(Object.keys(mocks.createOpenAI.mock.calls[0]?.[0]?.headers ?? {})).toEqual(["X-Connection-Api-Key"]);
    expect(mocks.chat).toHaveBeenCalledWith("openai/gpt-oss-20b");
  });

  it("does not fall back to built-in AI when the Groq connection is missing", async () => {
    vi.stubEnv("AI_PROVIDER", "");
    vi.stubEnv("LOVABLE_API_KEY", "test-only-gateway-credential");
    vi.stubEnv("UDC_GROQ_API_KEY", "");
    await expect(generateStructured(z.object({ score: z.number() }), "Evaluate", "A plan")).rejects.toThrow("Connect your Groq account");
    expect(mocks.createOpenAI).not.toHaveBeenCalled();
    expect(mocks.streamText).not.toHaveBeenCalled();
  });
});