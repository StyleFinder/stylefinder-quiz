import { NextRequest, NextResponse } from 'next/server';
import { getPendingEmails, updateEmailQueueStatus, updateEmailStatus } from '@/lib/supabase';
import { sendEmail } from '@/lib/email';

// This endpoint can be called by Vercel Cron or external schedulers
export async function GET(request: NextRequest) {
  try {
    // Optional: Add cron secret verification for security
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get pending emails from queue
    const pendingEmails = await getPendingEmails(10);

    const results = {
      processed: 0,
      sent: 0,
      failed: 0,
      errors: [] as string[]
    };

    // Process each email
    for (const queueItem of pendingEmails) {
      try {
        results.processed++;

        // Update status to processing
        await updateEmailQueueStatus(queueItem.id!, 'processing');

        // Send the email
        const emailSent = await sendEmail(queueItem.email_data);

        if (emailSent) {
          // Mark as sent
          await updateEmailQueueStatus(queueItem.id!, 'sent');
          await updateEmailStatus(queueItem.submission_id, true);
          results.sent++;

          console.log(`Email sent successfully for submission ${queueItem.submission_id}`);
        } else {
          // Mark as failed and increment retry count
          await updateEmailQueueStatus(queueItem.id!, 'failed', 'Send failed');
          results.failed++;

          // If max attempts reached, update submission status
          if ((queueItem.attempts || 0) >= (queueItem.max_attempts || 3) - 1) {
            await updateEmailStatus(
              queueItem.submission_id,
              false,
              'Max retry attempts reached'
            );
          }
        }
      } catch (error: any) {
        console.error(`Failed to process email queue item ${queueItem.id}:`, error);
        await updateEmailQueueStatus(
          queueItem.id!,
          'failed',
          error.message
        );
        results.failed++;
        results.errors.push(error.message);
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      results
    });
  } catch (error: any) {
    console.error('Email queue processing failed:', error);
    return NextResponse.json(
      {
        error: 'Queue processing failed',
        details: error.message
      },
      { status: 500 }
    );
  }
}

// Allow POST as well for manual triggering
export async function POST(request: NextRequest) {
  return GET(request);
}