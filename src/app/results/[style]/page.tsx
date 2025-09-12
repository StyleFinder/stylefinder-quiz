import { notFound } from 'next/navigation';
import Link from 'next/link';
import { STYLE_DESCRIPTIONS } from '@/data/quiz-data';

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

  const styleInfo = STYLE_DESCRIPTIONS[styleSlug];
  
  if (!styleInfo) {
    notFound();
  }

  const isYang = ['dramatic', 'classic', 'contemporary', 'sporty'].includes(styleSlug);
  const category = isYang ? 'Yang' : 'Yin';

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
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
              Assessment Complete!
            </h1>
            <p className="text-xl text-gray-600">
              Your StyleFinder ID® results are ready
            </p>
          </div>
        </div>

        {/* Results Card */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Style Header */}
            <div className={`${
              isYang 
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600' 
                : 'bg-gradient-to-r from-rose-500 to-pink-600'
            } text-white p-8 text-center`}>
              <div className="mb-4">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  isYang ? 'bg-white/20' : 'bg-white/20'
                }`}>
                  Your Primary Style
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-2">
                {styleInfo.name}
              </h2>
              <p className="text-xl opacity-90 mb-4">
                {category} Energy Style
              </p>
              <div className="bg-white/10 rounded-lg p-4 max-w-2xl mx-auto">
                <p className="text-lg leading-relaxed">
                  {styleInfo.description}
                </p>
              </div>
            </div>

            {/* Style Details */}
            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Key Characteristics */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 text-rose-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                    Key Characteristics
                  </h3>
                  <ul className="space-y-2">
                    {styleInfo.characteristics.map((characteristic, index) => (
                      <li key={index} className="flex items-center text-gray-700">
                        <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {characteristic}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Colors & Keywords */}
                <div className="space-y-6">
                  {/* Your Colors */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <svg className="w-5 h-5 text-rose-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zM3 13a1 1 0 011-1h1a1 1 0 011 1v3a1 1 0 11-2 0v-3zM11 2a2 2 0 00-2 2v6h2V4h3a2 2 0 012 2v7a2 2 0 11-4 0v-2a1 1 0 112 0v2a1 1 0 002 0V6a3 3 0 00-3-3h-3z" clipRule="evenodd" />
                      </svg>
                      Your Colors
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {styleInfo.colors.map((color, index) => (
                        <span key={index} className="px-3 py-1 bg-rose-100 text-rose-800 text-sm rounded-full">
                          {color}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Style Keywords */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <svg className="w-5 h-5 text-rose-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9.243 3.03a1 1 0 01.727 1.213L9.53 6h2.94l.56-2.243a1 1 0 111.94.486L14.53 6H17a1 1 0 110 2h-2.97l-1 4H15a1 1 0 110 2h-2.47l-.56 2.242a1 1 0 11-1.94-.485L10.47 14H7.53l-.56 2.242a1 1 0 11-1.94-.485L5.47 14H3a1 1 0 110-2h2.97l1-4H5a1 1 0 110-2h2.47l.56-2.243a1 1 0 011.213-.727zM9.03 8l-1 4h2.94l1-4H9.03z" clipRule="evenodd" />
                      </svg>
                      Style Keywords
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {styleInfo.keywords.map((keyword, index) => (
                        <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Coach Information */}
            <div className="bg-gray-50 p-8 border-t">
              <div className="text-center">
                <div className="mb-4">
                  <svg className="w-12 h-12 text-rose-500 mx-auto mb-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M14.828 5.172a4 4 0 00-5.656 0L8 6.343l-1.172-1.171a4 4 0 00-5.656 5.656L8 17.657l6.828-6.829a4 4 0 000-5.656z" clipRule="evenodd" />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Complete Results Sent to Your Coach
                  </h3>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    Your complete StyleFinder ID® assessment results, including your secondary and supporting 
                    styles along with all your detailed responses, have been sent to your personal style coach. 
                    They will reach out to you with personalized guidance and recommendations.
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-4 max-w-md mx-auto">
                  <div className="flex items-center justify-center mb-2">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-green-700 font-medium">Results Successfully Delivered</span>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Your coach will contact you within 24-48 hours with your complete style profile.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 text-center space-y-4">
            <Link
              href="/"
              className="inline-block bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold py-3 px-8 rounded-xl hover:from-rose-600 hover:to-pink-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg"
            >
              Take Another Assessment
            </Link>
            
            <p className="text-sm text-gray-500">
              Want to explore more styles? You can take the assessment again anytime.
            </p>
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