import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { assessmentInput, evaluateAssessment } from "./assessment-results";

export const saveAssessment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => assessmentInput.parse(input))
  .handler(async ({ data, context }) => {
    const grade = evaluateAssessment(data);
    // A retry after a lost response returns the existing attempt, never duplicates it.
    const existing = await context.supabase.from("assessment_sessions").select("id").eq("id", data.attemptId).eq("user_id", context.userId).maybeSingle();
    if (existing.error) throw new Error("Your quiz could not be saved. Please retry.");
    if (existing.data) return existing.data;
    const { data: saved, error } = await context.supabase.from("assessment_sessions").insert({
      id: data.attemptId, user_id: context.userId, track_id: data.trackId, topic: data.topic,
      score: grade.score, correct: grade.correct, total: grade.total, areas: grade.areas,
    }).select("id").single();
    if (error) throw new Error("Your quiz could not be saved. Please retry.");
    return saved;
  });

export const listAssessments = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase.from("assessment_sessions")
      .select("id, track_id, topic, score, correct, total, areas, created_at")
      .eq("user_id", context.userId).order("created_at", { ascending: false });
    if (error) throw new Error("Your quiz history could not load. Please retry.");
    return data;
  });