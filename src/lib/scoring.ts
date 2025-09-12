// StyleFinder Scoring Algorithm
import { QuizSubmission, StyleResult, StyleScore } from './types';
import { STYLE_MAPPING, YANG_STYLES, YIN_STYLES } from '@/data/quiz-data';

/**
 * Calculate style scores based on quiz submission
 * Section 1: Count 'true' responses per group (A-H) = 0-7 points each
 * Section 2: Count letter selection frequency (a-h) = 0-17 points each
 * Total possible score per style: 0-24 points
 */
export function calculateStyleScores(submission: QuizSubmission): StyleResult {
  const styleIds = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'] as const;
  const scores: Record<string, number> = {};

  // Initialize scores to 0
  styleIds.forEach(id => {
    scores[id] = 0;
  });

  // Section 1: Count 'true' responses per group
  const section1 = submission.section1;
  scores.A += countTrueResponses(section1.groupA);
  scores.B += countTrueResponses(section1.groupB);
  scores.C += countTrueResponses(section1.groupC);
  scores.D += countTrueResponses(section1.groupD);
  scores.E += countTrueResponses(section1.groupE);
  scores.F += countTrueResponses(section1.groupF);
  scores.G += countTrueResponses(section1.groupG);
  scores.H += countTrueResponses(section1.groupH);

  // Section 2: Count letter frequency (convert to uppercase for matching)
  submission.section2.answers.forEach(choice => {
    const letter = choice.toUpperCase();
    if (scores.hasOwnProperty(letter)) {
      scores[letter] += 1;
    }
  });

  // Determine Primary, Secondary, and Supporting styles
  const result = determineStyleProfile(scores);
  
  return result;
}

/**
 * Count the number of 'true' responses in a boolean array
 */
function countTrueResponses(responses: boolean[]): number {
  return responses.filter(response => response === true).length;
}

/**
 * Determine Primary, Secondary, and Supporting styles from scores
 * Primary: Highest score (Yang wins ties)
 * Secondary: Highest score from opposite Yin/Yang category
 * Supporting: Third highest score (any category)
 */
function determineStyleProfile(scores: Record<string, number>): StyleResult {
  // Sort styles by score (descending)
  const sortedEntries = Object.entries(scores)
    .sort(([,a], [,b]) => b - a);

  // Handle ties at the top position (Yang wins ties)
  const topScore = sortedEntries[0][1];
  const tiedAtTop = sortedEntries.filter(([,score]) => score === topScore);
  
  let primaryId: string;
  if (tiedAtTop.length > 1) {
    // Find Yang style in tie, otherwise use first
    const yangInTie = tiedAtTop.find(([id]) => YANG_STYLES.includes(id as any));
    primaryId = yangInTie ? yangInTie[0] : tiedAtTop[0][0];
  } else {
    primaryId = sortedEntries[0][0];
  }

  const primaryScore = scores[primaryId];
  const isYang = YANG_STYLES.includes(primaryId as any);
  
  // Find secondary from opposite category
  const oppositeCategory = isYang ? YIN_STYLES : YANG_STYLES;
  const secondaryEntry = sortedEntries.find(([id]) => 
    oppositeCategory.includes(id as any)
  );
  
  if (!secondaryEntry) {
    throw new Error('Unable to find secondary style from opposite category');
  }

  // Find supporting (third highest overall, excluding primary and secondary)
  const supportingEntry = sortedEntries.find(([id]) => 
    id !== primaryId && id !== secondaryEntry[0]
  );

  if (!supportingEntry) {
    throw new Error('Unable to find supporting style');
  }

  // Create style objects
  const primary: StyleScore = {
    id: primaryId,
    name: STYLE_MAPPING[primaryId as keyof typeof STYLE_MAPPING],
    score: primaryScore
  };

  const secondary: StyleScore = {
    id: secondaryEntry[0],
    name: STYLE_MAPPING[secondaryEntry[0] as keyof typeof STYLE_MAPPING],
    score: secondaryEntry[1]
  };

  const supporting: StyleScore = {
    id: supportingEntry[0], 
    name: STYLE_MAPPING[supportingEntry[0] as keyof typeof STYLE_MAPPING],
    score: supportingEntry[1]
  };

  return {
    primary,
    secondary,
    supporting,
    allScores: scores
  };
}

/**
 * Generate a detailed breakdown of responses for coach email
 */
export function generateResponseBreakdown(submission: QuizSubmission): string {
  let breakdown = 'SECTION 1 RESPONSES (True/False by Group):\n\n';
  
  const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  groups.forEach(group => {
    const responses = submission.section1[`group${group}` as keyof typeof submission.section1];
    const trueCount = countTrueResponses(responses);
    breakdown += `Group ${group} (${STYLE_MAPPING[group as keyof typeof STYLE_MAPPING]}): ${trueCount}/7 True responses\n`;
    
    responses.forEach((response, index) => {
      breakdown += `  ${group}${index + 1}: ${response ? 'TRUE' : 'FALSE'}\n`;
    });
    breakdown += '\n';
  });

  breakdown += '\nSECTION 2 RESPONSES (Multiple Choice):\n\n';
  submission.section2.answers.forEach((answer, index) => {
    breakdown += `Q${index + 1}: ${answer.toUpperCase()}\n`;
  });

  // Count section 2 frequencies
  const letterCounts: Record<string, number> = {};
  groups.forEach(letter => letterCounts[letter] = 0);
  
  submission.section2.answers.forEach(choice => {
    const letter = choice.toUpperCase();
    if (letterCounts.hasOwnProperty(letter)) {
      letterCounts[letter] += 1;
    }
  });

  breakdown += '\nSECTION 2 LETTER FREQUENCIES:\n';
  Object.entries(letterCounts).forEach(([letter, count]) => {
    breakdown += `${letter} (${STYLE_MAPPING[letter as keyof typeof STYLE_MAPPING]}): ${count}/17\n`;
  });

  return breakdown;
}

/**
 * Validate quiz submission has all required data
 */
export function validateQuizSubmission(submission: Partial<QuizSubmission>): string[] {
  const errors: string[] = [];

  if (!submission.userName || submission.userName.trim().length === 0) {
    errors.push('Name is required');
  }

  if (!submission.userEmail || !isValidEmail(submission.userEmail)) {
    errors.push('Valid email is required');
  }

  if (!submission.section1) {
    errors.push('Section 1 responses are required');
  } else {
    // Check each group has 7 responses
    const groups = ['groupA', 'groupB', 'groupC', 'groupD', 'groupE', 'groupF', 'groupG', 'groupH'];
    groups.forEach(group => {
      const responses = submission.section1[group as keyof typeof submission.section1];
      if (!responses || responses.length !== 7) {
        errors.push(`${group} must have exactly 7 responses`);
      }
    });
  }

  if (!submission.section2) {
    errors.push('Section 2 responses are required');
  } else if (!submission.section2.answers || submission.section2.answers.length !== 17) {
    errors.push('Section 2 must have exactly 17 responses');
  } else {
    // Check all answers are valid letters a-h
    const validLetters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    submission.section2.answers.forEach((answer, index) => {
      if (!validLetters.includes(answer.toLowerCase())) {
        errors.push(`Question ${index + 1} has invalid answer: ${answer}`);
      }
    });
  }

  return errors;
}

/**
 * Basic email validation
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}