import { motion } from 'framer-motion';

interface ScoreGaugeProps {
  score: number;
  size?: number;
  label?: 'match' | 'resume';
}

export function ScoreGauge({ score, size = 180, label = 'match' }: ScoreGaugeProps) {
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getColor = () => {
    if (score >= 80) return 'hsl(150, 80%, 45%)';
    if (score >= 50) return 'hsl(40, 90%, 55%)';
    return 'hsl(0, 72%, 55%)';
  };

  const getLabel = () => {
    if (label === 'resume') {
      if (score >= 80) return 'Great Resume';
      if (score >= 50) return 'Average Resume';
      return 'Needs Improvement';
    }
    if (score >= 95) return 'Excellent Match';
    if (score >= 80) return 'Strong Match';
    if (score >= 60) return 'Moderate Match';
    if (score >= 40) return 'Weak Match';
    return 'Poor Match';
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="hsl(220, 14%, 16%)"
            strokeWidth="10"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={getColor()}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-4xl font-bold"
            style={{ color: getColor(), fontFamily: 'Space Grotesk' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {score}%
          </motion.span>
        </div>
      </div>
      <span className="text-sm font-medium text-muted-foreground">{getLabel()}</span>
    </div>
  );
}