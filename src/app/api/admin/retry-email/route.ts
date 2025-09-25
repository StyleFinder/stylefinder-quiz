import { NextRequest, NextResponse } from 'next/server';
import { getSubmissionById, queueEmail } from '@/lib/supabase';
import { generateCoachEmail, sendEmail } from '@/lib/email';
import { calculateStyleScores } from '@/lib/scoring';

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const authHeader = request.headers.get('authorization');
    const adminToken = process.env.ADMIN_TOKEN || 'admin123';

    if (!authHeader || authHeader !== `Bearer ${adminToken}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { submissionId } = await request.json();

    if (!submissionId) {
      return NextResponse.json(
        { error: 'Submission ID required' },
        { status: 400 }
      );
    }

    // Get submission from database
    const submission = await getSubmissionById(submissionId);

    if (!submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }

    // Reconstruct quiz data
    const quizData = {
      userName: submission.user_name,
      userEmail: submission.user_email,
      section1: submission.section1_responses,
      section2: submission.section2_responses,
      timestamp: new Date(submission.submitted_at || '')
    };

    // Recalculate results (or use stored values)
    const results = {
      primary: {
        id: Object.keys(submission.scores).find(k => submission.scores[k] === submission.primary_score) || 'A',
        name: submission.primary_style,
        score: submission.primary_score,
        description: ''
      },
      secondary: {
        id: Object.keys(submission.scores).find(k => submission.scores[k] === submission.secondary_score) || 'B',
        name: submission.secondary_style,
        score: submission.secondary_score,
        description: ''
      },
      supporting: {
        id: Object.keys(submission.scores).find(k => submission.scores[k] === submission.supporting_score) || 'C',
        name: submission.supporting_style,
        score: submission.supporting_score,
        description: ''
      },
      allScores: submission.scores
    };

    // Generate and send email
    const emailData = generateCoachEmail(quizData as any, results as any);
    const emailSent = await sendEmail(emailData);

    if (emailSent) {
      return NextResponse.json({
        success: true,
        message: 'Email sent successfully'
      });
    } else {
      // Queue for retry
      await queueEmail(submissionId, emailData.to, emailData);

      return NextResponse.json({
        success: true,
        message: 'Email queued for retry'
      });
    }
  } catch (error: any) {
    console.error('Email retry failed:', error);
    return NextResponse.json(
      { error: 'Failed to retry email', details: error.message },
      { status: 500 }
    );
  }
}