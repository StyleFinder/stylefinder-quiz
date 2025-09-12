'use client';

import { useState, useEffect } from 'react';
import { QuizStorage } from '@/lib/storage';
import { logger } from '@/lib/logger';

interface ResumeQuizBannerProps {
  onResume: () => void;
  onStartFresh: () => void;
}

export default function ResumeQuizBanner({ onResume, onStartFresh }: ResumeQuizBannerProps) {
  const [progressSummary, setProgressSummary] = useState<{
    hasProgress: boolean;
    currentStep: string;
    completedSections: string[];
    lastSaved: Date;
    canResume: boolean;
  } | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved progress on component mount
    const checkSavedProgress = () => {
      try {
        const summary = QuizStorage.getProgressSummary();
        setProgressSummary(summary);
        setIsVisible(summary?.canResume || false);
        
        if (summary?.hasProgress) {
          logger.info('storage', 'Detected saved quiz progress', {
            currentStep: summary.currentStep,
            completedSections: summary.completedSections,
            lastSaved: summary.lastSaved
          });
        }
      } catch (error: any) {
        logger.error('storage', 'Error checking saved progress', {
          error: error.message
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkSavedProgress();
  }, []);

  const handleResume = () => {
    logger.info('storage', 'User chose to resume quiz');
    setIsVisible(false);
    onResume();
  };

  const handleStartFresh = () => {
    logger.info('storage', 'User chose to start fresh quiz');
    QuizStorage.clearQuizData();
    setIsVisible(false);
    onStartFresh();
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  const formatLastSaved = (date: Date) => {
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return 'just now';
    if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  if (isLoading || !isVisible || !progressSummary?.canResume) {
    return null;
  }

  return (
    <div className="fixed top-4 left-4 right-4 z-50 max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl shadow-lg border border-blue-200/20 backdrop-blur-sm">
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1">
                <svg className="w-6 h-6 text-blue-100" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-white">
                  Continue Where You Left Off
                </h3>
                
                <p className="text-blue-100 text-sm mt-1">
                  You have saved progress from {formatLastSaved(progressSummary.lastSaved)}
                </p>
                
                {progressSummary.completedSections.length > 0 && (
                  <div className="mt-2">
                    <p className="text-blue-100 text-xs mb-1">Completed:</p>
                    <div className="flex flex-wrap gap-1">
                      {progressSummary.completedSections.map((section, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/20 text-white"
                        >
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {section}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 ml-4 p-1 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Dismiss"
            >
              <svg className="w-5 h-5 text-blue-100" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <button
              onClick={handleResume}
              className="flex-1 sm:flex-none px-4 py-2 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600"
            >
              Resume Assessment
            </button>
            
            <button
              onClick={handleStartFresh}
              className="flex-1 sm:flex-none px-4 py-2 bg-transparent border border-white/30 text-white rounded-lg font-semibold hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600"
            >
              Start Fresh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}