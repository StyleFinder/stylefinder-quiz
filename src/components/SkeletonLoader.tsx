'use client';

interface SkeletonProps {
  className?: string;
  animate?: boolean;
}

export function SkeletonBox({ className = '', animate = true }: SkeletonProps) {
  return (
    <div 
      className={`bg-gray-200 rounded ${animate ? 'animate-pulse' : ''} ${className}`}
    />
  );
}

export function SkeletonText({ className = '', animate = true }: SkeletonProps) {
  return (
    <div 
      className={`bg-gray-200 rounded h-4 ${animate ? 'animate-pulse' : ''} ${className}`}
    />
  );
}

export function SkeletonButton({ className = '', animate = true }: SkeletonProps) {
  return (
    <div 
      className={`bg-gray-200 rounded-lg h-10 ${animate ? 'animate-pulse' : ''} ${className}`}
    />
  );
}

interface QuizSkeletonProps {
  type: 'section1' | 'section2' | 'userInfo';
  className?: string;
}

export function QuizSkeleton({ type, className = '' }: QuizSkeletonProps) {
  if (type === 'userInfo') {
    return (
      <div className={`max-w-lg mx-auto ${className}`}>
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Header skeleton */}
          <div className="mb-6">
            <SkeletonText className="w-48 h-6 mb-2" />
            <SkeletonText className="w-full h-4" />
            <SkeletonText className="w-3/4 h-4 mt-1" />
          </div>

          {/* Form fields skeleton */}
          <div className="space-y-6">
            <div>
              <SkeletonText className="w-20 h-4 mb-2" />
              <SkeletonBox className="w-full h-12" />
            </div>
            <div>
              <SkeletonText className="w-32 h-4 mb-2" />
              <SkeletonBox className="w-full h-12" />
              <SkeletonText className="w-48 h-3 mt-1" />
            </div>
          </div>

          {/* Privacy notice skeleton */}
          <div className="bg-gray-50 rounded-lg p-4 mt-6">
            <SkeletonText className="w-32 h-4 mb-2" />
            <SkeletonText className="w-full h-3" />
            <SkeletonText className="w-4/5 h-3 mt-1" />
          </div>

          {/* Button skeleton */}
          <SkeletonButton className="w-full mt-6" />
        </div>
      </div>
    );
  }

  if (type === 'section1') {
    return (
      <div className={`max-w-3xl mx-auto ${className}`}>
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header skeleton */}
          <div className="bg-gradient-to-r from-gray-300 to-gray-400 p-6">
            <div className="flex items-center justify-between mb-4">
              <SkeletonText className="w-56 h-6 bg-gray-400/50" />
              <SkeletonBox className="w-24 h-6 bg-gray-400/30 rounded-full" />
            </div>
            <div className="flex items-center justify-between text-sm mb-2">
              <SkeletonText className="w-32 h-4 bg-gray-400/50" />
              <SkeletonText className="w-24 h-4 bg-gray-400/50" />
            </div>
            <SkeletonBox className="w-full h-2 bg-gray-400/30 rounded-full" />
          </div>

          {/* Instructions skeleton */}
          <div className="p-6">
            <div className="mb-6">
              <SkeletonText className="w-full h-4 mb-2" />
              <SkeletonText className="w-3/4 h-4" />
            </div>

            {/* Questions skeleton */}
            <div className="space-y-6">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 pr-4">
                      <SkeletonBox className="w-12 h-6 mb-2" />
                      <SkeletonText className="w-full h-4 mb-1" />
                      <SkeletonText className="w-4/5 h-4" />
                    </div>
                    <div className="flex space-x-3">
                      <SkeletonBox className="w-16 h-8 rounded-full" />
                      <SkeletonBox className="w-16 h-8 rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Status skeleton */}
            <div className="mt-6 p-4 bg-gray-100 rounded-lg">
              <SkeletonText className="w-72 h-4" />
            </div>
          </div>

          {/* Navigation skeleton */}
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
            <SkeletonButton className="w-32" />
            <SkeletonText className="w-24 h-4" />
            <SkeletonButton className="w-36" />
          </div>
        </div>
      </div>
    );
  }

  if (type === 'section2') {
    return (
      <div className={`max-w-4xl mx-auto ${className}`}>
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header skeleton */}
          <div className="bg-gradient-to-r from-gray-300 to-gray-400 p-6">
            <div className="flex items-center justify-between mb-4">
              <SkeletonText className="w-56 h-6 bg-gray-400/50" />
              <SkeletonBox className="w-32 h-6 bg-gray-400/30 rounded-full" />
            </div>
            <div className="flex items-center justify-between text-sm mb-2">
              <SkeletonText className="w-40 h-4 bg-gray-400/50" />
              <SkeletonText className="w-24 h-4 bg-gray-400/50" />
            </div>
            <SkeletonBox className="w-full h-2 bg-gray-400/30 rounded-full" />
          </div>

          {/* Question dots skeleton */}
          <div className="bg-gray-50 p-4 border-b">
            <div className="flex flex-wrap gap-2 justify-center">
              {Array.from({ length: 17 }).map((_, i) => (
                <SkeletonBox key={i} className="w-8 h-8 rounded-full" />
              ))}
            </div>
            <SkeletonText className="w-48 h-4 mx-auto mt-2" />
          </div>

          {/* Question content skeleton */}
          <div className="p-6">
            <div className="mb-6">
              <div className="flex items-center mb-4">
                <SkeletonBox className="w-12 h-6 rounded-full" />
              </div>
              <SkeletonText className="w-full h-6 mb-4" />
              <SkeletonText className="w-3/4 h-4" />
            </div>

            {/* Options skeleton */}
            <div className="grid gap-3 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="p-4 border-2 border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <SkeletonBox className="w-6 h-6 rounded-full mr-3" />
                    <div className="flex-1">
                      <SkeletonText className="w-full h-4 mb-1" />
                      <SkeletonText className="w-2/3 h-4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Status skeleton */}
            <div className="mt-6 p-4 bg-gray-100 rounded-lg">
              <SkeletonText className="w-48 h-4" />
            </div>
          </div>

          {/* Navigation skeleton */}
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
            <SkeletonButton className="w-36" />
            <SkeletonText className="w-32 h-4" />
            <SkeletonButton className="w-40" />
          </div>
        </div>
      </div>
    );
  }

  return null;
}

// Loading spinner component for inline loading states
export function LoadingSpinner({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg', className?: string }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8'
  };

  return (
    <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-rose-500 ${sizeClasses[size]} ${className}`} />
  );
}

// Button loading state component
export function ButtonLoading({ 
  children, 
  isLoading = false, 
  loadingText = 'Loading...', 
  className = '',
  disabled = false,
  ...props 
}: {
  children: React.ReactNode;
  isLoading?: boolean;
  loadingText?: string;
  className?: string;
  disabled?: boolean;
  [key: string]: any;
}) {
  return (
    <button
      className={`flex items-center justify-center transition-all ${className} ${
        isLoading || disabled ? 'opacity-75 cursor-not-allowed' : ''
      }`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <>
          <LoadingSpinner size="sm" className="mr-2" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  );
}