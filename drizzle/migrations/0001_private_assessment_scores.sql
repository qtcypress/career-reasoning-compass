CREATE TABLE public.assessment_sessions (
 id uuid PRIMARY KEY,
 user_id uuid NOT NULL,
 track_id text NOT NULL,
 topic text NOT NULL DEFAULT 'All topics',
 score integer NOT NULL CHECK (score BETWEEN 0 AND 100),
 correct integer NOT NULL,
 total integer NOT NULL,
 areas jsonb NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now(),
 CHECK (total > 0 AND correct >= 0 AND correct <= total)
);
GRANT SELECT, INSERT ON public.assessment_sessions TO authenticated;
GRANT ALL ON public.assessment_sessions TO service_role;
ALTER TABLE public.assessment_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read own quiz scores" ON public.assessment_sessions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Insert own quiz scores" ON public.assessment_sessions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE INDEX assessment_sessions_owner_date ON public.assessment_sessions (user_id, created_at DESC);