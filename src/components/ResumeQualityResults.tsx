import { motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Lightbulb, FileText, Zap, Hash } from 'lucide-react';
import { ScoreGauge } from './ScoreGauge';
import type { AnalysisResult } from '@/lib/resumeAnalyzer';

interface Props {
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

export function ResumeQualityResults({ result, resumeName }: Props) {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Score */}
      <motion.div variants={item} className="glass-card p-8 flex flex-col items-center glow-primary">
        <h2 className="text-lg font-semibold text-foreground mb-4">Resume Quality Score — {resumeName}</h2>
        <ScoreGauge score={result.matchScore} label="resume" />
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Detected Sections */}
        <motion.div variants={item} className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Detected Sections ({result.detectedSections.length})</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {result.detectedSections.length === 0 && (
              <p className="text-muted-foreground text-sm">No standard sections detected</p>
            )}
            {result.detectedSections.map(s => (
              <span key={s} className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-primary/15 text-primary border border-primary/20">
                <CheckCircle2 className="h-3 w-3" /> {s}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Skills Found */}
        <motion.div variants={item} className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-5 w-5 text-accent" />
            <h3 className="font-semibold text-foreground">Skills Detected ({result.matchedKeywords.length})</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {result.matchedKeywords.length === 0 && (
              <p className="text-muted-foreground text-sm">No recognized skills found</p>
            )}
            {result.matchedKeywords.map(skill => (
              <span key={skill} className="px-3 py-1 rounded-full text-xs font-medium bg-accent/15 text-accent border border-accent/20">
                {skill}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Keyword Strength & Action Verbs */}
      <motion.div variants={item} className="glass-card p-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Hash className="h-4 w-4 text-primary" /> Keyword Strength
            </div>
            <div className="h-3 bg-secondary rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${result.keywordStrength}%` }}
                transition={{ duration: 1 }}
              />
            </div>
            <p className="text-xs text-muted-foreground">{result.keywordStrength}% unique keyword density</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <AlertTriangle className="h-4 w-4 text-accent" /> Action Verbs Found
            </div>
            <p className="text-2xl font-bold text-foreground" style={{ fontFamily: 'Space Grotesk' }}>
              {result.actionVerbCount}
            </p>
            <p className="text-xs text-muted-foreground">
              {result.actionVerbCount >= 10 ? 'Great use of action verbs!' : 'Try using more action verbs to strengthen impact'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Suggestions */}
      {result.suggestions.length > 0 && (
        <motion.div variants={item} className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="h-5 w-5" style={{ color: 'hsl(40, 90%, 55%)' }} />
            <h3 className="font-semibold text-foreground">Improvement Suggestions</h3>
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