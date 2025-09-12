import { NextRequest, NextResponse } from 'next/server';
import { QuizSubmission } from '@/lib/types';
import { calculateStyleScores, validateQuizSubmission } from '@/lib/scoring';
import { generateCoachEmail, sendEmail, validateEmailConfig } from '@/lib/email';
import { logger, trackQuizSubmission, trackEmailEvent, trackAPIPerformance, initializeMonitoring } from '@/lib/logger';

// Initialize monitoring on first API call
let monitoringInitialized = false;

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Initialize monitoring system once
    if (!monitoringInitialized) {
      initializeMonitoring();
      monitoringInitialized = true;
    }
    // Parse request body
    const body = await request.json();
    
    // Parse and log request
    logger.info('api', 'Quiz submission received', { 
      userName: body.userName,
      userAgent: request.headers.get('user-agent') || 'unknown'
    }, body.userEmail);

    // Validate request data
    const validationErrors = validateQuizSubmission(body);
    if (validationErrors.length > 0) {
      logger.warn('validation', 'Quiz submission validation failed', { 
        errors: validationErrors,
        userName: body.userName 
      }, body.userEmail);
      
      trackAPIPerformance('/api/submit-quiz', 'POST', 400, Date.now() - startTime);
      
      return NextResponse.json(
        { error: 'Validation failed', details: validationErrors },
        { status: 400 }
      );
    }

    // Validate email configuration
    const emailConfigErrors = validateEmailConfig();
    if (emailConfigErrors.length > 0) {
      logger.error('config', 'Email configuration validation failed', { 
        errors: emailConfigErrors 
      });
      
      trackAPIPerformance('/api/submit-quiz', 'POST', 500, Date.now() - startTime);
      
      return NextResponse.json(
        { error: 'Server configuration error. Please contact support.' },
        { status: 500 }
      );
    }

    const submission: QuizSubmission = {
      ...body,
      timestamp: new Date(body.timestamp) // Ensure timestamp is a Date object
    };

    // Calculate style scores
    logger.debug('scoring', 'Calculating style scores', { userName: submission.userName }, submission.userEmail);
    const results = calculateStyleScores(submission);
    
    // Track successful quiz completion
    trackQuizSubmission(submission, results);

    // Generate and send coach email
    try {
      trackEmailEvent('attempt', process.env.COACH_EMAIL || 'coach@example.com');
      
      const emailData = generateCoachEmail(submission, results);
      const emailSent = await sendEmail(emailData);
      
      if (emailSent) {
        trackEmailEvent('sent', emailData.to);
        logger.info('email', 'Coach email sent successfully', {
          recipient: emailData.to,
          userName: submission.userName,
          primaryStyle: results.primary.name
        }, submission.userEmail);
      } else {
        trackEmailEvent('failed', emailData.to);
        logger.warn('email', 'Failed to send coach email - continuing with user response', {
          recipient: emailData.to,
          userName: submission.userName
        }, submission.userEmail);
      }
    } catch (emailError: any) {
      trackEmailEvent('failed', process.env.COACH_EMAIL || 'coach@example.com', emailError);
      logger.error('email', 'Email sending error - continuing with user response', {
        error: emailError.message,
        userName: submission.userName
      }, submission.userEmail);
    }

    // Track successful API response
    const responseTime = Date.now() - startTime;
    trackAPIPerformance('/api/submit-quiz', 'POST', 200, responseTime);
    
    logger.info('api', 'Quiz submission completed successfully', {
      userName: submission.userName,
      primaryStyle: results.primary.name,
      responseTime,
      success: true
    }, submission.userEmail);

    // Return results for user (only primary style)
    return NextResponse.json({
      success: true,
      primaryStyle: results.primary.name.toLowerCase().replace(/\s+/g, '-'),
      message: 'Assessment completed successfully. Results have been sent to your style coach.'
    });

  } catch (error: any) {
    const responseTime = Date.now() - startTime;
    trackAPIPerformance('/api/submit-quiz', 'POST', 500, responseTime, error);
    
    logger.error('api', 'Quiz submission failed with internal server error', {
      error: error.message,
      stack: error.stack,
      responseTime
    });
    
    return NextResponse.json(
      { 
        error: 'Internal server error. Please try again or contact support.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// Handle non-POST requests
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. This endpoint only accepts POST requests.' },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed. This endpoint only accepts POST requests.' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed. This endpoint only accepts POST requests.' },
    { status: 405 }
  );
}