CREATE TABLE public.interview_sessions (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id uuid NOT NULL,
 track_id text NOT NULL,
 round text NOT NULL CHECK (round IN ('Technical','HR','Mixed')),
 score integer NOT NULL CHECK (score BETWEEN 0 AND 100),
 results jsonb NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.interview_sessions TO authenticated;
GRANT ALL ON public.interview_sessions TO service_role;
ALTER TABLE public.interview_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read own interviews" ON public.interview_sessions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Save own interviews" ON public.interview_sessions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE INDEX interview_sessions_owner_date ON public.interview_sessions(user_id, created_at DESC);