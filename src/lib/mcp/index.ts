import { auth, defineMcp } from "@lovable.dev/mcp-js";
import searchProblems from "./tools/search-problems";
import getProblem from "./tools/get-problem";
import listCareers from "./tools/list-careers";
import listScores from "./tools/list-scores";
const projectRef = import.meta.env['VITE_SUPABASE_PROJECT_ID'] ?? "project-ref-unset";
export default defineMcp({
  name: "careerpilot-ai", title: "CareerPilot AI", version: "0.1.0",
  instructions: "Read CareerPilot's curated problems and nine career paths, and the connected user's private interview scores. These tools do not run AI evaluations or change records.",
  auth: auth.oauth.issuer({ issuer: `https://${projectRef}.supabase.co/auth/v1`, acceptedAudiences: "authenticated" }),
  tools: [searchProblems, getProblem, listCareers, listScores],
});