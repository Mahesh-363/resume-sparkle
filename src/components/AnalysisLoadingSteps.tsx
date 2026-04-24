import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';

const STEPS = [
  'Parsing resume...',
  'Extracting skills...',
  'Analyzing sections...',
  'Calculating score...',
];

interface Props {
  isActive: boolean;
}

export function AnalysisLoadingSteps({ isActive }: Props) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!isActive) { setCurrentStep(0); return; }
    const interval = setInterval(() => {
      setCurrentStep(prev => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 600);
    return () => clearInterval(interval);
  }, [isActive]);

  if (!isActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="glass-card p-6 space-y-3"
    >
      {STEPS.map((step, i) => (
        <motion.div
          key={step}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: i <= currentStep ? 1 : 0.3, x: 0 }}
          transition={{ delay: i * 0.15 }}
          className="flex items-center gap-3 text-sm"
        >
          {i < currentStep ? (
            <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
          ) : i === currentStep ? (
            <Loader2 className="h-4 w-4 text-primary animate-spin shrink-0" />
          ) : (
            <div className="h-4 w-4 rounded-full border border-border shrink-0" />
          )}
          <span className={i <= currentStep ? 'text-foreground' : 'text-muted-foreground'}>{step}</span>
        </motion.div>
      ))}
    </motion.div>
  );
}