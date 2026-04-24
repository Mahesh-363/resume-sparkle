import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, LayoutDashboard, FileSearch, Loader2, RotateCcw, Github, ArrowRight } from 'lucide-react';
import { ResumeUploader } from '@/components/ResumeUploader';
import { AnalysisResults } from '@/components/AnalysisResults';
import { Dashboard } from '@/components/Dashboard';
import { ScoreBreakdown } from '@/components/ScoreBreakdown';
import { ResumeTextHighlight } from '@/components/ResumeTextHighlight';
import { FeedbackSection } from '@/components/FeedbackSection';
import { ExportPDF } from '@/components/ExportPDF';
import { AnalysisLoadingSteps } from '@/components/AnalysisLoadingSteps';
import { ResumeQualityResults } from '@/components/ResumeQualityResults';
import { analyzeResume, type AnalysisResult } from '@/lib/resumeAnalyzer';
import { supabase } from '@/integrations/supabase/client';

type Tab = 'analyze' | 'dashboard';

export default function Index() {
  const [tab, setTab] = useState<Tab>('analyze');
  const [resumeText, setResumeText] = useState('');
  const [resumeName, setResumeName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [processing, setProcessing] = useState(false);

  const onTextExtracted = useCallback((text: string, name: string) => {
    setResumeText(text);
    setResumeName(name);
  }, []);

  const handleAnalyze = async () => {
    if (!resumeText) return;
    setProcessing(true);
    setResult(null);

    // Simulate loading steps delay
    await new Promise(r => setTimeout(r, 2400));

    const analysisResult = analyzeResume(resumeText, jobDescription);
    setResult(analysisResult);

    try {
      await supabase.from('resume_analyses').insert({
        resume_name: resumeName,
        resume_text: resumeText.slice(0, 10000),
        job_title: jobTitle || null,
        job_description: jobDescription || 'Resume Quality Check',
        match_score: analysisResult.matchScore,
        matched_keywords: analysisResult.matchedKeywords,
        missing_skills: analysisResult.missingSkills,
        suggestions: analysisResult.suggestions,
        keyword_frequencies: analysisResult.keywordFrequencies,
      });
    } catch { /* silent */ }
    setProcessing(false);
  };

  const canAnalyze = resumeText && !processing;
  const isMatchMode = result?.mode === 'match';

  const handleSwitchToMatchMode = () => {
    setResult(null);
    // Scroll to job description area
    document.getElementById('job-description-area')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary/15 flex items-center justify-center">
              <FileSearch className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-xl font-bold text-foreground" style={{ fontFamily: 'Space Grotesk' }}>
              ResumeIQ
            </h1>
          </div>
          <nav className="flex gap-1 bg-secondary rounded-lg p-1">
            {([
              { id: 'analyze' as Tab, label: 'Analyze', icon: Zap },
              { id: 'dashboard' as Tab, label: 'Dashboard', icon: LayoutDashboard },
            ]).map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  tab === t.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <t.icon className="h-4 w-4" />
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {tab === 'analyze' ? (
            <motion.div
              key="analyze"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Hero */}
              <div className="text-center space-y-3">
                <h2 className="text-3xl font-bold gradient-text" style={{ fontFamily: 'Space Grotesk' }}>
                  Analyze Your Resume
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto">
                Upload your resume to get an instant quality score. Add a job description
                to get a detailed match analysis — completely free.
                </p>
              </div>

              {/* Form */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <ResumeUploader onTextExtracted={onTextExtracted} isProcessing={processing} />
                </div>

                <div className="space-y-3" id="job-description-area">
                  <div className="space-y-3 mb-4">
                    <label className="text-sm font-medium text-foreground">Job Title (optional)</label>
                    <input
                      type="text"
                      value={jobTitle}
                      onChange={e => setJobTitle(e.target.value)}
                      placeholder="e.g. Senior Frontend Engineer"
                      className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                  </div>
                  <label className="text-sm font-medium text-foreground">Job Description</label>
                  <p className="text-xs text-muted-foreground -mt-1">Optional — leave empty for a general resume quality check</p>
                  <textarea
                    value={jobDescription}
                    onChange={e => setJobDescription(e.target.value)}
                    placeholder="Paste the full job description here..."
                    rows={10}
                    className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={handleAnalyze}
                  disabled={!canAnalyze}
                  className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-sm transition-all ${
                    canAnalyze
                      ? 'bg-primary text-primary-foreground glow-primary hover:brightness-110'
                      : 'bg-muted text-muted-foreground cursor-not-allowed'
                  }`}
                >
                  {processing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Analyzing{jobDescription ? ' Match' : ' Resume'}...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4" />
                      Analyze Resume
                    </>
                  )}
                </button>
              </div>

              {/* Loading Steps */}
              <AnimatePresence>
                {processing && <AnalysisLoadingSteps isActive={processing} />}
              </AnimatePresence>

              {/* Results */}
              {result && !isMatchMode && (
                <>
                  <ResumeQualityResults result={result} resumeName={resumeName} />
                  {/* Smart CTA */}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-6 text-center space-y-3 border-primary/20 border"
                  >
                    <p className="text-foreground font-medium">Want to match your resume with a specific job?</p>
                    <p className="text-muted-foreground text-sm">Paste a job description to get a detailed match score with skill gap analysis</p>
                    <button
                      onClick={handleSwitchToMatchMode}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:brightness-110 transition-all"
                    >
                      Try Job Match Mode <ArrowRight className="h-4 w-4" />
                    </button>
                  </motion.div>
                </>
              )}

              {result && isMatchMode && <AnalysisResults result={result} resumeName={resumeName} />}

              {result && isMatchMode && (
                <>
                  <ScoreBreakdown tfidfScore={result.tfidfScore} skillScore={result.skillScore} matchScore={result.matchScore} />
                  <ResumeTextHighlight text={resumeText} matchedKeywords={result.matchedKeywords} missingSkills={result.missingSkills} />
                </>
              )}

              {result && (
                <div className="flex flex-wrap gap-3 justify-center">
                  <ExportPDF result={result} resumeName={resumeName} />
                  {resumeText && (
                    <button
                      onClick={() => { setResult(null); }}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-secondary text-foreground font-medium text-sm hover:bg-secondary/80 transition-all border border-border"
                    >
                      <RotateCcw className="h-4 w-4" /> Re-run Analysis
                    </button>
                  )}
                </div>
              )}

              {result && <FeedbackSection />}
            </motion.div>
          ) : (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="text-center space-y-3 mb-8">
                <h2 className="text-3xl font-bold gradient-text" style={{ fontFamily: 'Space Grotesk' }}>
                  Analysis Dashboard
                </h2>
                <p className="text-muted-foreground">Your previous resume analysis results</p>
              </div>
              <Dashboard />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 mt-12">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <p>Built by <span className="text-foreground font-medium">Vommi Uma Mahesh</span></p>
          <a
            href="https://github.com/Mahesh-363"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Github className="h-4 w-4" /> github.com/Mahesh-363
          </a>
        </div>
      </footer>
    </div>
  );
}
