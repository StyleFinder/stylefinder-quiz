'use client';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  percentage: number;
  stepName: string;
}

export default function ProgressBar({ currentStep, totalSteps, percentage, stepName }: ProgressBarProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-4 flex items-center justify-between text-sm text-gray-600">
        <span className="font-medium">{stepName}</span>
        <span>{currentStep} of {totalSteps}</span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-rose-500 to-pink-600 transition-all duration-500 ease-out relative"
          style={{ width: `${percentage}%` }}
        >
          {/* Animated shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-pulse"></div>
        </div>
      </div>
      
      <div className="mt-2 flex justify-between text-xs text-gray-500">
        <span>0%</span>
        <span className="font-medium text-rose-600">{Math.round(percentage)}%</span>
        <span>100%</span>
      </div>
    </div>
  );
}