import { readFileSync } from "node:fs";
import { PDFDocument } from "pdf-lib";
import { describe, expect, it } from "vitest";
import { createResumePdf } from "@/lib/resume-pdf";
import { emptyResume } from "@/lib/resume";
describe("resume PDF", () => {
  it("creates a valid, multi-page resume without dropping long content", async () => {
    const resume={...emptyResume(),name:"José Test",summary:"Built reliable systems. ".repeat(450),skills:["Python","SQL"]};
    const bytes=await createResumePdf(resume,"analytics",new Uint8Array(readFileSync("public/fonts/resume.ttf")));
    const document=await PDFDocument.load(bytes);
    expect(document.getPageCount()).toBeGreaterThan(1);
    expect(document.getTitle()).toBe("José Test — Data Analytics Resume");
    expect(document.getPages().every((p) => p.getWidth()===595 && p.getHeight()===842)).toBe(true);
  }, 20000);
});