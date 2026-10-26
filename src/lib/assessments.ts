import { CAREERS } from "./careers";
import { PATH_QUIZZES } from "./assessment-quizzes";

export type QuizQuestion = { id: string; topic: string; question: string; options: string[]; correct: number; explanation: string };

export function quizFor(trackId: string): QuizQuestion[] {
  return PATH_QUIZZES[trackId] ?? [];
}

export function quizTopics(trackId: string): string[] {
  return [...new Set(quizFor(trackId).map((q) => q.topic))];
}

export function gradeQuiz(questions: QuizQuestion[], answers: Record<string, number>) {
  const correct = questions.filter((q) => answers[q.id] === q.correct).length;
  const areas = [...new Set(questions.map((q) => q.topic))].map((topic) => {
    const subset = questions.filter((q) => q.topic === topic);
    const hits = subset.filter((q) => answers[q.id] === q.correct).length;
    return { topic, correct: hits, total: subset.length, score: Math.round(hits / subset.length * 100) };
  });
  return { correct, total: questions.length, score: questions.length ? Math.round(correct / questions.length * 100) : 0, areas, weakAreas: areas.filter((a) => a.correct < a.total) };
}

export { CAREERS };
