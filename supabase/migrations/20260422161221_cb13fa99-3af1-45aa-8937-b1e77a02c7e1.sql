
CREATE TABLE public.resume_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_name TEXT NOT NULL,
  resume_text TEXT,
  job_title TEXT,
  job_description TEXT NOT NULL,
  match_score NUMERIC NOT NULL DEFAULT 0,
  matched_keywords JSONB DEFAULT '[]'::jsonb,
  missing_skills JSONB DEFAULT '[]'::jsonb,
  suggestions JSONB DEFAULT '[]'::jsonb,
  keyword_frequencies JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.resume_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert analyses" ON public.resume_analyses
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Anyone can read analyses" ON public.resume_analyses
  FOR SELECT TO anon, authenticated USING (true);
