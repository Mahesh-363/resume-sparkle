import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Lightbulb, BarChart3 } from 'lucide-react';
import { ScoreGauge } from './ScoreGauge';
import type { AnalysisResult } from '@/lib/resumeAnalyzer';

interface AnalysisResultsProps {
  result: AnalysisResult;
  resumeName: string;
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function AnalysisResults({ result, resumeName }: AnalysisResultsProps) {
  const topKeywords = Object.entries(result.keywordFrequencies)
    .sort((a, b) => b[1].job - a[1].job)
    .slice(0, 12);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Score */}
      <motion.div variants={item} className="glass-card p-8 flex flex-col items-center glow-primary">
        <h2 className="text-lg font-semibold text-foreground mb-4">Job Match Score — {resumeName}</h2>
        <ScoreGauge score={result.matchScore} />
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Matched Skills */}
        <motion.div variants={item} className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Matched Skills ({result.matchedKeywords.length})</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {result.matchedKeywords.length === 0 && (
              <p className="text-muted-foreground text-sm">No skill matches found</p>
            )}
            {result.matchedKeywords.map(skill => (
              <span key={skill} className="px-3 py-1 rounded-full text-xs font-medium bg-primary/15 text-primary border border-primary/20">
                {skill}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Missing Skills */}
        <motion.div variants={item} className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <XCircle className="h-5 w-5 text-destructive" />
            <h3 className="font-semibold text-foreground">Missing Skills ({result.missingSkills.length})</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {result.missingSkills.length === 0 && (
              <p className="text-muted-foreground text-sm">No missing skills — great job!</p>
            )}
            {result.missingSkills.map(skill => (
              <span key={skill} className="px-3 py-1 rounded-full text-xs font-medium bg-destructive/15 text-destructive border border-destructive/20">
                {skill}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Keyword Frequencies */}
      {topKeywords.length > 0 && (
        <motion.div variants={item} className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-5 w-5 text-accent" />
            <h3 className="font-semibold text-foreground">Keyword Frequency Comparison</h3>
          </div>
          <div className="space-y-3">
            {topKeywords.map(([word, freq]) => {
              const maxCount = Math.max(freq.resume, freq.job, 1);
              return (
                <div key={word} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-foreground font-medium">{word}</span>
                    <span className="text-muted-foreground">Resume: {freq.resume} | Job: {freq.job}</span>
                  </div>
                  <div className="flex gap-1 h-2">
                    <div
                      className="bg-primary/60 rounded-full transition-all"
                      style={{ width: `${(freq.resume / maxCount) * 50}%` }}
                    />
                    <div
                      className="bg-accent/60 rounded-full transition-all"
                      style={{ width: `${(freq.job / maxCount) * 50}%` }}
                    />
                  </div>
                </div>
              );
            })}
            <div className="flex gap-4 text-xs text-muted-foreground mt-2">
              <span className="flex items-center gap-1"><span className="w-3 h-2 rounded bg-primary/60" /> Resume</span>
              <span className="flex items-center gap-1"><span className="w-3 h-2 rounded bg-accent/60" /> Job Description</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Suggestions */}
      {result.suggestions.length > 0 && (
        <motion.div variants={item} className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="h-5 w-5 text-warning" style={{ color: 'hsl(40, 90%, 55%)' }} />
            <h3 className="font-semibold text-foreground">Tips & Suggestions</h3>
          </div>
          <ul className="space-y-3">
            {result.suggestions.map((s, i) => (
              <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                <span className="text-primary font-bold mt-0.5">{i + 1}.</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </motion.div>
  );
}