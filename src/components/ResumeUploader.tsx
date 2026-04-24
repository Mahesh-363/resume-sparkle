import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, X, Loader2 } from 'lucide-react';
import { extractTextFromPDF } from '@/lib/pdfParser';

interface ResumeUploaderProps {
  onTextExtracted: (text: string, fileName: string) => void;
  isProcessing: boolean;
}

export function ResumeUploader({ onTextExtracted, isProcessing }: ResumeUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [error, setError] = useState('');

  const processFile = useCallback(async (f: File) => {
    if (f.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      return;
    }
    setFile(f);
    setError('');
    setExtracting(true);
    try {
      const text = await extractTextFromPDF(f);
      onTextExtracted(text, f.name);
    } catch (err: any) {
      setError(err.message || 'Failed to parse PDF. Please try another file.');
    }
    setExtracting(false);
  }, [onTextExtracted]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const f = e.dataTransfer.files[0];
    if (f) processFile(f);
  }, [processFile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) processFile(f);
  };

  const clearFile = () => {
    setFile(null);
    setError('');
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">Upload Resume (PDF)</label>
      <AnimatePresence mode="wait">
        {!file ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-300 ${
              dragActive
                ? 'border-primary bg-primary/5 glow-primary'
                : 'border-border hover:border-muted-foreground'
            }`}
          >
            <input
              type="file"
              accept=".pdf"
              onChange={handleChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
              disabled={isProcessing}
            />
            <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-muted-foreground text-sm">
              Drag & drop your PDF resume here, or <span className="text-primary font-medium">browse</span>
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="file"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-card p-4 flex items-center gap-3"
          >
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              {extracting ? (
                <Loader2 className="h-5 w-5 text-primary animate-spin" />
              ) : (
                <FileText className="h-5 w-5 text-primary" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {extracting ? 'Extracting text...' : 'Ready'}
              </p>
            </div>
            {!isProcessing && (
              <button onClick={clearFile} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="h-4 w-4" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}