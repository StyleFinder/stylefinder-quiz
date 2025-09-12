// Test file for scoring algorithm
import { calculateStyleScores, validateQuizSubmission, generateResponseBreakdown } from '../scoring';
import { QuizSubmission } from '../types';

// Sample test data
const sampleSubmission: QuizSubmission = {
  userName: 'Test User',
  userEmail: 'test@example.com',
  timestamp: new Date(),
  section1: {
    // Dramatic (A) - 4 true responses
    groupA: [true, false, true, false, true, false, true],
    // Whimsical (B) - 2 true responses  
    groupB: [false, false, true, false, false, true, false],
    // Classic (C) - 3 true responses
    groupC: [true, true, false, false, false, true, false],
    // Romantic (D) - 1 true response
    groupD: [false, false, false, true, false, false, false],
    // Sporty (E) - 5 true responses
    groupE: [true, true, true, false, true, true, false],
    // Delicate (F) - 1 true response
    groupF: [false, false, false, false, true, false, false],
    // Contemporary (G) - 6 true responses
    groupG: [true, true, true, true, true, true, false],
    // Natural (H) - 2 true responses
    groupH: [true, false, false, true, false, false, false],
  },
  section2: {
    // Sample answers favoring A (dramatic) and G (contemporary)
    // A=5 times, B=1, C=2, D=1, E=2, F=1, G=4, H=1
    answers: ['a', 'g', 'a', 'c', 'a', 'g', 'e', 'g', 'a', 'c', 'e', 'f', 'g', 'b', 'd', 'a', 'h']
  }
};

// Test the scoring algorithm
export function testScoringAlgorithm() {
  console.log('Testing StyleFinder Scoring Algorithm...\n');
  
  // Test 1: Basic scoring calculation
  console.log('=== TEST 1: Basic Scoring ===');
  const results = calculateStyleScores(sampleSubmission);
  
  console.log('All Scores:', results.allScores);
  console.log('Primary:', results.primary);
  console.log('Secondary:', results.secondary);
  console.log('Supporting:', results.supporting);
  
  // Verify expected scores
  // A: 4 (section1) + 5 (section2) = 9
  // G: 6 (section1) + 4 (section2) = 10  
  console.log('\nExpected vs Actual:');
  console.log(`A (Dramatic): Expected 9, Got ${results.allScores.A}`);
  console.log(`G (Contemporary): Expected 10, Got ${results.allScores.G}`);
  
  // Test 2: Yin/Yang category logic
  console.log('\n=== TEST 2: Yin/Yang Categories ===');
  console.log(`Primary (${results.primary.id}): ${results.primary.name} - Category: ${['A', 'C', 'E', 'G'].includes(results.primary.id) ? 'Yang' : 'Yin'}`);
  console.log(`Secondary (${results.secondary.id}): ${results.secondary.name} - Category: ${['A', 'C', 'E', 'G'].includes(results.secondary.id) ? 'Yang' : 'Yin'}`);
  
  // Test 3: Validation
  console.log('\n=== TEST 3: Validation ===');
  const validationErrors = validateQuizSubmission(sampleSubmission);
  console.log('Validation Errors:', validationErrors.length === 0 ? 'None (✓)' : validationErrors);
  
  // Test invalid submission
  const invalidSubmission = { ...sampleSubmission };
  invalidSubmission.userName = '';
  invalidSubmission.userEmail = 'invalid-email';
  const invalidErrors = validateQuizSubmission(invalidSubmission);
  console.log('Invalid Submission Errors:', invalidErrors);
  
  // Test 4: Response breakdown
  console.log('\n=== TEST 4: Response Breakdown ===');
  const breakdown = generateResponseBreakdown(sampleSubmission);
  console.log('Generated breakdown (first 200 chars):');
  console.log(breakdown.substring(0, 200) + '...');
  
  return results;
}

// Test tie scenarios
export function testTieScenarios() {
  console.log('\n=== TESTING TIE SCENARIOS ===');
  
  // Create submission with tied scores
  const tieSubmission: QuizSubmission = {
    ...sampleSubmission,
    section1: {
      groupA: [true, true, true, false, false, false, false], // A = 3
      groupB: [true, true, true, false, false, false, false], // B = 3
      groupC: [true, true, false, false, false, false, false], // C = 2
      groupD: [true, true, false, false, false, false, false], // D = 2
      groupE: [true, false, false, false, false, false, false], // E = 1
      groupF: [true, false, false, false, false, false, false], // F = 1
      groupG: [false, false, false, false, false, false, false], // G = 0
      groupH: [false, false, false, false, false, false, false], // H = 0
    },
    section2: {
      // A=3, B=3 (tie at top with 6 points each)
      answers: ['a', 'a', 'a', 'b', 'b', 'b', 'c', 'c', 'd', 'd', 'e', 'f', 'g', 'h', 'a', 'b', 'c']
    }
  };
  
  const tieResults = calculateStyleScores(tieSubmission);
  console.log('Tie Results:');
  console.log('A Score:', tieResults.allScores.A, '(Yang)');
  console.log('B Score:', tieResults.allScores.B, '(Yin)');
  console.log('Primary should be A (Yang wins ties):', tieResults.primary);
  console.log('Secondary should be highest Yin:', tieResults.secondary);
  
  return tieResults;
}

// Run tests if this file is executed directly
if (typeof window === 'undefined' && require.main === module) {
  testScoringAlgorithm();
  testTieScenarios();
}