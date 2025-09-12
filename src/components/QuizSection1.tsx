'use client';

import { useState, useEffect } from 'react';
import { Section1Response } from '@/lib/types';
import { SECTION1_QUESTIONS } from '@/data/quiz-data';
import { ButtonLoading } from '@/components/SkeletonLoader';

interface QuizSection1Props {
  onComplete: (data: Section1Response) => void;
  onBack: () => void;
}

const groupLabels = {
  groupA: 'A - Dramatic',
  groupB: 'B - Whimsical', 
  groupC: 'C - Classic',
  groupD: 'D - Romantic',
  groupE: 'E - Sporty',
  groupF: 'F - Delicate',
  groupG: 'G - Contemporary',
  groupH: 'H - Natural'
};

export default function QuizSection1({ onComplete, onBack }: QuizSection1Props) {
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [responses, setResponses] = useState<Section1Response>({
    groupA: new Array(7).fill(null),
    groupB: new Array(7).fill(null),
    groupC: new Array(7).fill(null),
    groupD: new Array(7).fill(null),
    groupE: new Array(7).fill(null),
    groupF: new Array(7).fill(null),
    groupG: new Array(7).fill(null),
    groupH: new Array(7).fill(null),
  });
  const [isNavigating, setIsNavigating] = useState(false);

  const groups = Object.keys(SECTION1_QUESTIONS) as (keyof typeof SECTION1_QUESTIONS)[];
  const currentGroup = groups[currentGroupIndex];
  const currentQuestions = SECTION1_QUESTIONS[currentGroup];
  const currentResponses = responses[currentGroup];

  // Check if all questions in current group are answered
  const isCurrentGroupComplete = currentResponses.every(response => response !== null);
  
  // Check if all groups are complete
  const isAllComplete = Object.values(responses).every(groupResponses => 
    groupResponses.every(response => response !== null)
  );

  const handleResponseChange = (questionIndex: number, value: boolean) => {
    setResponses(prev => ({
      ...prev,
      [currentGroup]: prev[currentGroup].map((response, idx) => 
        idx === questionIndex ? value : response
      )
    }));
  };

  const handleNext = () => {
    setIsNavigating(true);
    
    setTimeout(() => {
      if (currentGroupIndex < groups.length - 1) {
        setCurrentGroupIndex(currentGroupIndex + 1);
      } else if (isAllComplete) {
        // Convert null responses to false (shouldn't happen with validation, but safety check)
        const cleanedResponses: Section1Response = Object.keys(responses).reduce((acc, key) => {
          acc[key as keyof Section1Response] = responses[key as keyof Section1Response].map(
            response => response === null ? false : response
          );
          return acc;
        }, {} as Section1Response);
        
        onComplete(cleanedResponses);
      }
      setIsNavigating(false);
    }, 300); // Brief delay to show loading state
  };

  const handlePrevious = () => {
    if (currentGroupIndex > 0) {
      setCurrentGroupIndex(currentGroupIndex - 1);
    } else {
      onBack();
    }
  };

  // Auto-scroll to top when group changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentGroupIndex]);

  const getProgressPercentage = () => {
    const completedGroups = Object.values(responses).filter(groupResponses => 
      groupResponses.every(response => response !== null)
    ).length;
    return (completedGroups / groups.length) * 100;
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-500 to-pink-600 text-white p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Section 1: Style Preferences</h2>
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
              Group {currentGroupIndex + 1} of {groups.length}
            </span>
          </div>
          
          <div className="flex items-center justify-between text-sm mb-2">
            <span>{groupLabels[currentGroup]}</span>
            <span>{Math.round(getProgressPercentage())}% Complete</span>
          </div>
          
          {/* Progress bar for Section 1 */}
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
        </div>

        {/* Questions */}
        <div className="p-6">
          <div className="mb-6">
            <p className="text-gray-600 text-sm mb-4">
              For each statement, select <strong>True</strong> if it describes you or <strong>False</strong> if it doesn't.
              Answer honestly based on your natural preferences.
            </p>
          </div>

          <div className="space-y-6">
            {currentQuestions.map((question, index) => (
              <div key={question.id} className="border border-gray-200 rounded-lg p-4 hover:border-rose-300 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1 pr-4">
                    <div className="flex items-center mb-2">
                      <span className="bg-rose-100 text-rose-700 text-xs font-medium px-2 py-1 rounded">
                        {question.id}
                      </span>
                    </div>
                    <p className="text-gray-900 font-medium leading-relaxed">
                      {question.text}
                    </p>
                  </div>
                  
                  <div className="flex-shrink-0">
                    <div className="flex space-x-3">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name={question.id}
                          value="true"
                          checked={currentResponses[index] === true}
                          onChange={() => handleResponseChange(index, true)}
                          className="sr-only"
                        />
                        <div className={`w-16 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                          currentResponses[index] === true
                            ? 'bg-green-500 text-white shadow-md'
                            : 'bg-gray-100 text-gray-600 hover:bg-green-100'
                        }`}>
                          True
                        </div>
                      </label>
                      
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name={question.id}
                          value="false"
                          checked={currentResponses[index] === false}
                          onChange={() => handleResponseChange(index, false)}
                          className="sr-only"
                        />
                        <div className={`w-16 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                          currentResponses[index] === false
                            ? 'bg-red-500 text-white shadow-md'
                            : 'bg-gray-100 text-gray-600 hover:bg-red-100'
                        }`}>
                          False
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Completion Status */}
          {!isCurrentGroupComplete && (
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-center text-amber-700">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Please answer all questions in this group to continue
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
          <button
            onClick={handlePrevious}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {currentGroupIndex === 0 ? 'Back to Info' : 'Previous Group'}
          </button>

          <div className="text-sm text-gray-500">
            {currentResponses.filter(r => r !== null).length} of {currentQuestions.length} answered
          </div>

          <ButtonLoading
            onClick={handleNext}
            isLoading={isNavigating}
            loadingText={currentGroupIndex === groups.length - 1 ? 'Continuing...' : 'Loading...'}
            disabled={!isCurrentGroupComplete}
            className={`flex items-center px-6 py-2 rounded-lg font-medium transition-all ${
              isCurrentGroupComplete && !isNavigating
                ? 'bg-rose-500 text-white hover:bg-rose-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {currentGroupIndex === groups.length - 1 ? 'Continue to Section 2' : 'Next Group'}
            {!isNavigating && (
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
          </ButtonLoading>
        </div>
      </div>
    </div>
  );
}