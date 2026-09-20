'use client';

import { useState, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { useApp } from '@/lib/store';
import { validateFileUpload } from '@/lib/security';
import { handleFileUpload } from '@/components/landing/LandingPage';

export const FileUploadZone = memo(function FileUploadZone() {
  const { dispatch } = useApp();
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) processFiles(files);
  }, []);

  const processFiles = (files: File[]) => {
    setError(null);
    for (const file of files) {
      const validation = validateFileUpload({ name: file.name, size: file.size, type: file.type });
      if (!validation.valid) {
        setError(`${file.name}: ${validation.error || 'Invalid file'}`);
        return;
      }
    }
    handleFileUpload(files, dispatch);
  };

  return (
    <div>
      <motion.div
        className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 ${
          isDragOver
            ? 'border-accent-500 bg-accent-500/5'
            : 'border-lexora-700 hover:border-lexora-500 bg-lexora-900/30'
        }`}
        role="region"
        aria-label="File upload dropzone"
        tabIndex={0}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={onDrop}
        whileHover={{ scale: 1.005 }}
        transition={{ duration: 0.15 }}
      >
        <label className="cursor-pointer block">
          <input
            type="file"
            className="hidden"
            accept=".pdf,.txt,.md,.docx"
            multiple
            onChange={(e) => {
              const files = e.target.files ? Array.from(e.target.files) : [];
              if (files.length > 0) processFiles(files);
            }}
            aria-label="Upload documents"
          />
          <Upload className={`w-8 h-8 mx-auto mb-4 ${isDragOver ? 'text-accent-500' : 'text-lexora-500'}`} />
          <p className="text-sm font-medium text-lexora-200 mb-1">
            {isDragOver ? 'Drop your documents here' : 'Drag & drop your documents, or click to browse'}
          </p>
          <p className="text-xs text-lexora-500">
            PDF, DOCX, TXT, or Markdown — up to 10MB each
          </p>
        </label>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 flex items-center gap-2 text-sm text-danger p-3 rounded-lg bg-danger/10 border border-danger/20"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </motion.div>
      )}
    </div>
  );
});
