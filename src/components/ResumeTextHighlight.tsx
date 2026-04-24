import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import { useMemo } from 'react';

interface ResumeTextHighlightProps {
  text: string;
  matchedKeywords: string[];
  missingSkills: string[];
}

export function ResumeTextHighlight({ text, matchedKeywords, missingSkills }: ResumeTextHighlightProps) {
  const highlighted = useMemo(() => {
    if (!text) return '';
    let html = text.replace(/</g, '&lt;').replace(/>/g, '&gt;');

    // Build patterns — longer phrases first
    const allPatterns = [
      ...matchedKeywords.map(k => ({ keyword: k, type: 'matched' as const })),
      ...missingSkills.map(k => ({ keyword: k, type: 'missing' as const })),
    ].sort((a, b) => b.keyword.length - a.keyword.length);

    for (const { keyword, type } of allPatterns) {
      const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b(${escaped})\\b`, 'gi');
      const cls = type === 'matched'
        ? 'bg-primary/20 text-primary px-0.5 rounded'
        : 'bg-destructive/20 text-destructive px-0.5 rounded';
      html = html.replace(regex, `<mark class="${cls}">$1</mark>`);
    }
    return html;
  }, [text, matchedKeywords, missingSkills]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <div className="flex items-center gap-2 mb-3">
        <FileText className="h-5 w-5 text-accent" />
        <h3 className="font-semibold text-foreground">Resume Text (Highlighted)</h3>
      </div>
      <div className="flex gap-3 mb-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><span className="w-3 h-2 rounded bg-primary/30" /> Matched</span>
        <span className="flex items-center gap-1"><span className="w-3 h-2 rounded bg-destructive/30" /> Missing (in job desc)</span>
      </div>
      <div
        className="max-h-64 overflow-y-auto text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap font-mono bg-secondary/50 rounded-lg p-4"
        dangerouslySetInnerHTML={{ __html: highlighted }}
      />
    </motion.div>
  );
}