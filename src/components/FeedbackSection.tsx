import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Send } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export function FeedbackSection() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    try {
      await supabase.from('feedback').insert({
        rating,
        comment: comment || null,
      });
      // Notify via edge function
      await supabase.functions.invoke('notify-feedback', {
        body: { rating, comment },
      });
      toast.success('Thank you for your feedback!');
      setSubmitted(true);
    } catch {
      toast.success('Thank you for your feedback!');
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6 text-center">
        <p className="text-primary font-semibold text-lg">🎉 Thanks for your feedback!</p>
        <p className="text-muted-foreground text-sm mt-1">Your rating: {rating}/5</p>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 space-y-4">
      <h3 className="font-semibold text-foreground">Rate Your Experience</h3>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="transition-transform hover:scale-110"
          >
            <Star
              className={`h-8 w-8 transition-colors ${
                star <= (hover || rating)
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-muted-foreground'
              }`}
            />
          </button>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={e => setComment(e.target.value)}
        placeholder="Any suggestions? (optional)"
        rows={3}
        className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
      />
      <button
        onClick={handleSubmit}
        className="flex items-center gap-2 px-6 py-2 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:brightness-110 transition-all"
      >
        <Send className="h-4 w-4" /> Submit Feedback
      </button>
    </motion.div>
  );
}