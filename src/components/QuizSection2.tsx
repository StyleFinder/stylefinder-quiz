'use client';

import { useState, useEffect } from 'react';
import { Section2Response } from '@/lib/types';
import { SECTION2_QUESTIONS } from '@/data/quiz-data';
import { ButtonLoading } from '@/components/SkeletonLoader';

interface QuizSection2Props {
  onComplete: (data: Section2Response) => void;
  onBack: () => void;
}

export default function QuizSection2({ onComplete, onBack }: QuizSection2Props) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>(new Array(SECTION2_QUESTIONS.length).fill(''));
  const [isNavigating, setIsNavigating] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const currentQuestion = SECTION2_QUESTIONS[currentQuestionIndex];
  const isCurrentAnswered = answers[currentQuestionIndex] !== '';
  const totalAnswered = answers.filter(answer => answer !== '').length;
  const isAllComplete = totalAnswered === SECTION2_QUESTIONS.length;

  const handleAnswerSelect = (answer: string) => {
    setAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[currentQuestionIndex] = answer;
      return newAnswers;
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < SECTION2_QUESTIONS.length - 1) {
      setIsNavigating(true);
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setIsNavigating(false);
      }, 200);
    } else if (isAllComplete) {
      setIsCompleting(true);
      // Add a delay to show the completion loading state
      setTimeout(() => {
        onComplete({ answers });
      }, 500);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else {
      onBack();
    }
  };

  const handleQuestionJump = (questionIndex: number) => {
    setCurrentQuestionIndex(questionIndex);
  };

  // Auto-scroll to top when question changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentQuestionIndex]);

  const getProgressPercentage = () => {
    return (totalAnswered / SECTION2_QUESTIONS.length) * 100;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Section 2: Lifestyle Choices</h2>
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
              Question {currentQuestionIndex + 1} of {SECTION2_QUESTIONS.length}
            </span>
          </div>
          
          <div className="flex items-center justify-between text-sm mb-2">
            <span>Multiple Choice Questions</span>
            <span>{Math.round(getProgressPercentage())}% Complete</span>
          </div>
          
          {/* Progress bar for Section 2 */}
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
        </div>

        {/* Question Navigation Dots */}
        <div className="bg-gray-50 p-4 border-b">
          <div className="flex flex-wrap gap-2 justify-center">
            {SECTION2_QUESTIONS.map((_, index) => (
              <button
                key={index}
                onClick={() => handleQuestionJump(index)}
                className={`w-8 h-8 rounded-full text-sm font-medium transition-all ${
                  index === currentQuestionIndex
                    ? 'bg-purple-500 text-white'
                    : answers[index] !== ''
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
                title={`Question ${index + 1}${answers[index] ? ' - Answered' : ' - Unanswered'}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <div className="text-center mt-2 text-sm text-gray-600">
            {totalAnswered} of {SECTION2_QUESTIONS.length} questions answered
          </div>
        </div>

        {/* Current Question */}
        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <span className="bg-purple-100 text-purple-700 text-sm font-medium px-3 py-1 rounded-full">
                {currentQuestion.id}
              </span>
              {isCurrentAnswered && (
                <span className="ml-3 text-green-600 text-sm flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Answered
                </span>
              )}
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {currentQuestion.text}
            </h3>
            
            <p className="text-gray-600 text-sm">
              Select the option that best describes your preference or lifestyle.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {Object.entries(currentQuestion.options).map(([letter, option]) => (
              <label
                key={letter}
                className={`block p-4 rounded-lg border-2 cursor-pointer transition-all hover:border-purple-300 ${
                  answers[currentQuestionIndex] === letter
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${currentQuestionIndex}`}
                  value={letter}
                  checked={answers[currentQuestionIndex] === letter}
                  onChange={() => handleAnswerSelect(letter)}
                  className="sr-only"
                />
                <div className="flex items-center">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 ${
                    answers[currentQuestionIndex] === letter
                      ? 'border-purple-500 bg-purple-500'
                      : 'border-gray-300'
                  }`}>
                    {answers[currentQuestionIndex] === letter && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <span className="font-medium text-purple-700 text-sm">
                      {letter.toUpperCase()}.
                    </span>
                    <span className="text-gray-900 ml-2">
                      {option}
                    </span>
                  </div>
                </div>
              </label>
            ))}
          </div>

          {/* Answer Required Notice */}
          {!isCurrentAnswered && (
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-center text-amber-700">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Please select an answer to continue
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
            {currentQuestionIndex === 0 ? 'Back to Section 1' : 'Previous Question'}
          </button>

          <div className="text-sm text-gray-500">
            {totalAnswered} of {SECTION2_QUESTIONS.length} questions answered
          </div>

          <ButtonLoading
            onClick={handleNext}
            isLoading={isNavigating || isCompleting}
            loadingText={
              isCompleting ? 'Completing Assessment...' : 
              currentQuestionIndex === SECTION2_QUESTIONS.length - 1 ? 'Finishing...' : 
              'Loading...'
            }
            disabled={!isCurrentAnswered}
            className={`flex items-center px-6 py-2 rounded-lg font-medium transition-all ${
              isCurrentAnswered && !isNavigating && !isCompleting
                ? 'bg-purple-500 text-white hover:bg-purple-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {currentQuestionIndex === SECTION2_QUESTIONS.length - 1 ? (
              isAllComplete ? 'Complete Assessment' : 'Finish Section'
            ) : (
              'Next Question'
            )}
            {!isNavigating && !isCompleting && (
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
          </ButtonLoading>
        </div>
      </div>

      {/* Section Complete Notice */}
      {currentQuestionIndex === SECTION2_QUESTIONS.length - 1 && !isAllComplete && (
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <h4 className="font-medium text-yellow-800">Almost Complete!</h4>
              <p className="text-yellow-700 text-sm">
                Please answer all remaining questions to complete your StyleFinder ID® assessment.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}