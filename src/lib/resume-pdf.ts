import { PDFDocument, type PDFFont } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { resumeRole, tailoredSkills, type Resume } from "./resume";

export async function createResumePdf(resume: Resume, trackId: string, fontBytes: Uint8Array) {
  const pdf = await PDFDocument.create(); pdf.registerFontkit(fontkit);
  const font: PDFFont = await pdf.embedFont(fontBytes, { subset: true });
  let page = pdf.addPage([595,842]); let y = 790;
  const newPage = () => { page = pdf.addPage([595,842]); y = 790; };
  function text(value: string, size=10, gap=5) {
    for (const paragraph of value.replace(/\t/g," ").split("\n")) {
      let line = "";
      const clean = [...paragraph].filter((c) => font.getCharacterSet().includes(c.codePointAt(0) ?? 0)).join("");
      for (const char of clean) {
        if (font.widthOfTextAtSize(line+char,size) > 491) {
          const space = line.lastIndexOf(" ");
          const draw = space > 0 ? line.slice(0,space) : line;
          if (y < 52) newPage(); page.drawText(draw,{ x:52,y,size,font }); y -= size+5;
          line = (space > 0 ? line.slice(space+1) : "") + char;
        } else line += char;
      }
      if (y < 52) newPage(); if (line) page.drawText(line,{ x:52,y,size,font }); y -= size+gap;
    }
  }
  function section(title: string) { if(y<105) newPage(); y-=12; text(title.toUpperCase(),12,8); page.drawLine({start:{x:52,y:y+3},end:{x:543,y:y+3},thickness:0.5}); y-=7; }
  text(resume.name,22,8); text(resumeRole(trackId),12,8);
  text([resume.email,resume.phone,resume.location].filter(Boolean).join(" | "),9,5);
  if(resume.links) text(resume.links,9,7);
  if(resume.summary.trim()) { section("Summary"); text(resume.summary); }
  if(resume.skills.length) { section("Skills"); text(tailoredSkills(resume.skills,trackId).join(" · ")); }
  for(const [title,entries] of [["Experience",resume.experience],["Projects",resume.projects],["Education",resume.education]] as const) {
    const filled = entries.filter((e) => e.title.trim() || e.organization.trim() || e.details.trim());
    if(!filled.length) continue; section(title);
    for(const e of filled) { if(y<110) newPage(); text([e.title,e.organization].filter(Boolean).join(" — "),11,5); if(e.dates) text(e.dates,9,5); if(e.details) text(e.details); y-=8; }
  }
  pdf.setTitle(`${resume.name} — ${resumeRole(trackId)} Resume`); pdf.setAuthor(resume.name);
  return pdf.save();
}
export function downloadResume(bytes: Uint8Array, filename: string) {
  const blob = new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
  const file = new File([blob], filename, { type: "application/pdf" });
  if (matchMedia("(pointer: coarse)").matches && navigator.canShare?.({ files:[file] })) {
    void navigator.share({ files:[file],title: filename }).catch((e: unknown) => { if (!(e instanceof DOMException && e.name === "AbortError")) download(blob,filename); });
  } else download(blob,filename);
}
function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href=url; a.download=filename; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url),30000);
}