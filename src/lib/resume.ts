import { CAREERS } from "./careers";
export type ResumeEntry = { title: string; organization: string; dates: string; details: string };
export type Resume = { name: string; email: string; phone: string; location: string; links: string; summary: string; skills: string[]; experience: ResumeEntry[]; projects: ResumeEntry[]; education: ResumeEntry[] };
export const emptyResume = (): Resume => ({ name: "", email: "", phone: "", location: "", links: "", summary: "", skills: [], experience: [], projects: [], education: [] });
export const suggestedSkills = (trackId: string) => CAREERS.find((c) => c.id === trackId)?.skills.split(" · ") ?? [];
export const tailoredSkills = (skills: string[], trackId: string) => {
  const preferred = suggestedSkills(trackId).map((s) => s.toLowerCase());
  return [...skills].sort((a,b) => (preferred.includes(b.toLowerCase()) ? 1 : 0) - (preferred.includes(a.toLowerCase()) ? 1 : 0));
};
export const resumeRole = (trackId: string) => CAREERS.find((c) => c.id === trackId)?.name ?? "";