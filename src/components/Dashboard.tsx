import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { History, TrendingUp, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { ScoreGauge } from './ScoreGauge';

interface AnalysisRecord {
  id: string;
  resume_name: string;
  job_title: string | null;
  match_score: number;
  matched_keywords: string[];
  missing_skills: string[];
  created_at: string;
}

export function Dashboard() {
  const [records, setRecords] = useState<AnalysisRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecords = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('resume_analyses')
      .select('id, resume_name, job_title, match_score, matched_keywords, missing_skills, created_at')
      .order('created_at', { ascending: false })
      .limit(20);
    setRecords((data as AnalysisRecord[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchRecords(); }, []);

  const avgScore = records.length
    ? Math.round(records.reduce((sum, r) => sum + Number(r.match_score), 0) / records.length)
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="glass-card p-12 text-center">
        <History className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">No analyses yet</h3>
        <p className="text-muted-foreground text-sm">Upload a resume and analyze it to see results here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="glass-card p-5 text-center">
          <p className="text-3xl font-bold text-foreground" style={{ fontFamily: 'Space Grotesk' }}>{records.length}</p>
          <p className="text-sm text-muted-foreground mt-1">Total Analyses</p>
        </div>
        <div className="glass-card p-5 flex flex-col items-center">
          <ScoreGauge score={avgScore} size={100} />
          <p className="text-sm text-muted-foreground mt-1">Average Score</p>
        </div>
        <div className="glass-card p-5 text-center">
          <p className="text-3xl font-bold text-primary" style={{ fontFamily: 'Space Grotesk' }}>
            {Math.max(...records.map(r => Number(r.match_score)))}%
          </p>
          <p className="text-sm text-muted-foreground mt-1">Best Score</p>
        </div>
      </div>

      {/* Records */}
      <div className="space-y-3">
        {records.map((r, i) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card p-4 flex items-center gap-4"
          >
            <div className="flex-shrink-0">
              <ScoreGauge score={Number(r.match_score)} size={60} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">{r.resume_name}</p>
              {r.job_title && <p className="text-xs text-muted-foreground">{r.job_title}</p>}
              <div className="flex gap-1 mt-1 flex-wrap">
                {(r.matched_keywords as string[]).slice(0, 5).map(k => (
                  <span key={k} className="px-2 py-0.5 text-[10px] rounded-full bg-primary/10 text-primary">
                    {k}
                  </span>
                ))}
              </div>
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {new Date(r.created_at).toLocaleDateString()}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}