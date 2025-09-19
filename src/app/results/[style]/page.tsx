import { notFound } from 'next/navigation';

interface ResultsPageProps {
  params: { style: string };
}

// Valid style slugs
const validStyles = [
  'dramatic', 'whimsical', 'classic', 'romantic',
  'sporty', 'delicate', 'contemporary', 'natural'
];

export default function ResultsPage({ params }: ResultsPageProps) {
  const styleSlug = params.style.toLowerCase();
  
  // Check if the style is valid
  if (!validStyles.includes(styleSlug)) {
    notFound();
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-rose-500 to-pink-600 rounded-full mb-4">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              🔥 You did it! Your StyleFinder Assessment is complete. 🔥
            </h1>
            
            <div className="max-w-3xl mx-auto text-lg leading-relaxed text-gray-700 space-y-4">
              <p>
                Your results are in motion—now the magic begins. ✨
              </p>
              <p>
                A StyleFinder Coach will be reaching out to you personally to reveal your unique style code and show you how to unlock confidence, visibility, and power like never before.
              </p>
              <p>
                This isn't just about clothes—it's about <strong>YOU</strong> stepping into your next chapter with boldness and ease. 💃
              </p>
              <p>
                Stay tuned. Your transformation is on its way. 🚀
              </p>
              <p className="text-xl font-medium text-rose-600 mt-6">
                XO<br />
                Mary Michele
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-gray-400 text-sm">
          <p>StyleFinder ID® Personal Style Assessment System</p>
          <p className="mt-1">Thank you for discovering your unique style identity!</p>
        </div>
      </div>
    </div>
  );
}

// Generate static pages for all style types (optional, for better performance)
export function generateStaticParams() {
  return validStyles.map((style) => ({
    style,
  }));
}