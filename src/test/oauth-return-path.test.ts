import { describe, expect, it } from "vitest";
import { oauthReturnPath } from "@/lib/oauth-return-path";
describe("OAuth return path", () => {
  it("preserves consent query and fragment", () => expect(oauthReturnPath("/.lovable/oauth/consent?authorization_id=abc#review")).toBe("/.lovable/oauth/consent?authorization_id=abc#review"));
  it("rejects external and malformed paths", () => { for (const value of ["//outside.invalid", "/\\outside.invalid", "/\nattack", "https://outside.invalid", null]) expect(oauthReturnPath(value)).toBe("/"); });
});