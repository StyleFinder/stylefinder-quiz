'use client';

import { useState, useEffect } from 'react';
import { LoadingSpinner } from '@/components/SkeletonLoader';

interface AutoSaveIndicatorProps {
  className?: string;
}

export default function AutoSaveIndicator({ className = '' }: AutoSaveIndicatorProps) {
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    // Listen for auto-save events
    const handleAutoSave = () => {
      setStatus('saving');
      
      setTimeout(() => {
        setStatus('saved');
        setLastSaved(new Date());
        
        // Return to idle after showing success
        setTimeout(() => {
          setStatus('idle');
        }, 2000);
      }, 500); // Simulate brief saving period
    };

    const handleAutoSaveError = () => {
      setStatus('error');
      
      // Return to idle after showing error
      setTimeout(() => {
        setStatus('idle');
      }, 3000);
    };

    // Listen for custom events from the storage system
    window.addEventListener('quizAutoSaved', handleAutoSave);
    window.addEventListener('quizAutoSaveError', handleAutoSaveError);

    return () => {
      window.removeEventListener('quizAutoSaved', handleAutoSave);
      window.removeEventListener('quizAutoSaveError', handleAutoSaveError);
    };
  }, []);

  const formatLastSaved = (date: Date) => {
    const now = new Date();
    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffSeconds < 10) return 'just now';
    if (diffSeconds < 60) return `${diffSeconds}s ago`;
    
    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (status === 'idle') {
    return null;
  }

  return (
    <div className={`fixed bottom-4 right-4 z-40 ${className}`}>
      <div className={`
        flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-medium shadow-lg transition-all duration-300 transform
        ${status === 'saving' ? 'bg-blue-500 text-white animate-pulse' : ''}
        ${status === 'saved' ? 'bg-green-500 text-white' : ''}
        ${status === 'error' ? 'bg-red-500 text-white' : ''}
      `}>
        {status === 'saving' && (
          <>
            <LoadingSpinner size="sm" className="text-white" />
            <span>Saving...</span>
          </>
        )}

        {status === 'saved' && (
          <>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>
              Saved {lastSaved ? formatLastSaved(lastSaved) : 'now'}
            </span>
          </>
        )}

        {status === 'error' && (
          <>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>Save failed</span>
          </>
        )}
      </div>
    </div>
  );
}