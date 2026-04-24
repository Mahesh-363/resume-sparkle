import { motion } from 'framer-motion';
import { Brain, Cpu } from 'lucide-react';

interface ScoreBreakdownProps {
  tfidfScore: number;
  skillScore: number;
  matchScore: number;
}

export function ScoreBreakdown({ tfidfScore, skillScore, matchScore }: ScoreBreakdownProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 space-y-4"
    >
      <h3 className="font-semibold text-foreground flex items-center gap-2">
        <Brain className="h-5 w-5 text-accent" />
        Score Breakdown
      </h3>
      <div className="space-y-3">
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1">
              <Cpu className="h-3 w-3" /> TF-IDF Cosine Similarity (40% weight)
            </span>
            <span className="text-foreground font-medium">{tfidfScore}%</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-accent"
              initial={{ width: 0 }}
              animate={{ width: `${tfidfScore}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Measures how similar the word distributions are between your resume and the job description.
          </p>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1">
              <Brain className="h-3 w-3" /> Skill Pattern Match (60% weight)
            </span>
            <span className="text-foreground font-medium">{skillScore}%</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${skillScore}%` }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Percentage of required skills found in your resume from 40+ tracked patterns.
          </p>
        </div>
        <div className="border-t border-border pt-3 flex justify-between text-sm font-semibold">
          <span className="text-foreground">Combined Score</span>
          <span className="text-primary">{matchScore}%</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Formula: (TF-IDF × 0.4) + (Skill Match × 0.6) = {Math.round(tfidfScore * 0.4 + skillScore * 0.6)}%
        </p>
      </div>
    </motion.div>
  );
}