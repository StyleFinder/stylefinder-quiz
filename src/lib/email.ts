// Email service for StyleFinder Quiz
import nodemailer from 'nodemailer';
import { QuizSubmission, StyleResult, EmailTemplate } from './types';
import { generateResponseBreakdown } from './scoring';
import { logger } from './logger';

// Rate limiting tracking
const emailSentCount = new Map<string, { count: number; resetTime: number }>();

/**
 * Configure email transporter based on environment variables
 * Supports Gmail, SendGrid, Mailgun, AWS SES, and other SMTP providers
 */
export function createEmailTransporter() {
  const config: any = {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  };

  // Provider-specific configurations
  const host = process.env.SMTP_HOST?.toLowerCase();
  
  if (host?.includes('gmail.com')) {
    // Gmail-specific settings
    config.service = 'gmail';
  } else if (host?.includes('sendgrid')) {
    // SendGrid-specific settings
    config.auth.user = 'apikey'; // SendGrid always uses 'apikey' as username
  } else if (host?.includes('mailgun')) {
    // Mailgun-specific settings
    config.tls = {
      ciphers: 'SSLv3'
    };
  } else if (host?.includes('amazonaws.com')) {
    // AWS SES specific settings
    config.secure = false;
    config.requireTLS = true;
  }

  return nodemailer.createTransport(config);
}

/**
 * Generate email template for coach with complete quiz results
 */
export function generateCoachEmail(
  submission: QuizSubmission, 
  results: StyleResult
): EmailTemplate {
  const { userName, userEmail, timestamp } = submission;
  const { primary, secondary, supporting } = results;

  const subject = `StyleFinder Assessment Results - ${userName}`;
  
  const responseBreakdown = generateResponseBreakdown(submission);
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
        .results { background-color: #e8f4f8; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .client-info { background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .response-detail { background-color: #f8f9fa; padding: 15px; border-radius: 5px; font-family: monospace; white-space: pre-line; }
        .style-score { margin: 10px 0; }
        .primary { font-weight: bold; font-size: 1.1em; color: #d63384; }
        .secondary { font-weight: bold; color: #6f42c1; }
        .supporting { font-weight: bold; color: #20c997; }
        .score-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .score-table th, .score-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .score-table th { background-color: #f2f2f2; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>StyleFinder ID® Assessment Results</h1>
        <p>Complete results and detailed response breakdown</p>
      </div>

      <div class="client-info">
        <h2>Client Information</h2>
        <p><strong>Name:</strong> ${userName}</p>
        <p><strong>Email:</strong> ${userEmail}</p>
        <p><strong>Completed:</strong> ${timestamp.toLocaleString()}</p>
      </div>

      <div class="results">
        <h2>Style Profile Results</h2>
        <div class="style-score primary">
          <strong>Primary Style:</strong> ${primary.name} (${primary.id}) - Score: ${primary.score}/24
        </div>
        <div class="style-score secondary">
          <strong>Secondary Style:</strong> ${secondary.name} (${secondary.id}) - Score: ${secondary.score}/24
        </div>
        <div class="style-score supporting">
          <strong>Supporting Style:</strong> ${supporting.name} (${supporting.id}) - Score: ${supporting.score}/24
        </div>

        <h3>All Style Scores</h3>
        <table class="score-table">
          <tr>
            <th>Style</th>
            <th>Name</th>
            <th>Score</th>
            <th>Category</th>
          </tr>
          ${Object.entries(results.allScores)
            .sort(([,a], [,b]) => b - a)
            .map(([id, score]) => {
              const styleNames = {
                A: 'Dramatic', B: 'Whimsical', C: 'Classic', D: 'Romantic',
                E: 'Sporty', F: 'Delicate', G: 'Contemporary', H: 'Natural'
              };
              const category = ['A', 'C', 'E', 'G'].includes(id) ? 'Yang' : 'Yin';
              const isHighlight = id === primary.id ? ' style="background-color: #ffe6f0;"' : 
                                 id === secondary.id ? ' style="background-color: #f0e6ff;"' : 
                                 id === supporting.id ? ' style="background-color: #e6fff9;"' : '';
              return `<tr${isHighlight}><td>${id}</td><td>${styleNames[id as keyof typeof styleNames]}</td><td>${score}/24</td><td>${category}</td></tr>`;
            }).join('')}
        </table>
      </div>

      <div class="response-detail">
        <h2>Detailed Response Breakdown</h2>
        ${responseBreakdown}
      </div>

      <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #eee; font-size: 0.9em; color: #666;">
        <p>Generated by StyleFinder ID® Assessment System</p>
        <p>For questions about these results, please contact your StyleFinder coach.</p>
      </div>
    </body>
    </html>
  `;

  const textContent = `
StyleFinder ID® Assessment Results

CLIENT INFORMATION:
Name: ${userName}
Email: ${userEmail}
Completed: ${timestamp.toLocaleString()}

STYLE PROFILE RESULTS:
Primary Style: ${primary.name} (${primary.id}) - Score: ${primary.score}/24
Secondary Style: ${secondary.name} (${secondary.id}) - Score: ${secondary.score}/24  
Supporting Style: ${supporting.name} (${supporting.id}) - Score: ${supporting.score}/24

ALL STYLE SCORES:
${Object.entries(results.allScores)
  .sort(([,a], [,b]) => b - a)
  .map(([id, score]) => {
    const styleNames = {
      A: 'Dramatic', B: 'Whimsical', C: 'Classic', D: 'Romantic',
      E: 'Sporty', F: 'Delicate', G: 'Contemporary', H: 'Natural'
    };
    const category = ['A', 'C', 'E', 'G'].includes(id) ? 'Yang' : 'Yin';
    return `${id} - ${styleNames[id as keyof typeof styleNames]}: ${score}/24 (${category})`;
  }).join('\n')}

${responseBreakdown}

Generated by StyleFinder ID® Assessment System
  `;

  return {
    to: process.env.COACH_EMAIL || 'coach@example.com',
    subject,
    html: htmlContent,
    text: textContent
  };
}

/**
 * Check rate limiting for email sending
 */
function checkRateLimit(): boolean {
  const now = Date.now();
  const hourInMs = 60 * 60 * 1000;
  const limit = parseInt(process.env.EMAIL_RATE_LIMIT || '100');
  const key = 'email_count';
  
  const current = emailSentCount.get(key);
  
  if (!current || now > current.resetTime) {
    // Reset counter if hour has passed or first time
    emailSentCount.set(key, { count: 1, resetTime: now + hourInMs });
    return true;
  }
  
  if (current.count >= limit) {
    return false; // Rate limit exceeded
  }
  
  // Increment counter
  emailSentCount.set(key, { count: current.count + 1, resetTime: current.resetTime });
  return true;
}

/**
 * Send email using configured transporter with rate limiting and error handling
 */
export async function sendEmail(emailData: EmailTemplate): Promise<boolean> {
  try {
    // Check if email is enabled
    if (process.env.EMAIL_ENABLED === 'false') {
      console.log('Email sending is disabled in environment configuration');
      return false;
    }

    // Check rate limit
    if (!checkRateLimit()) {
      logger.warn('email', 'Email rate limit exceeded', { 
        recipient: emailData.to,
        limit: process.env.EMAIL_RATE_LIMIT || '100'
      });
      return false;
    }

    const transporter = createEmailTransporter();
    
    // Add sender info if not present
    const emailWithSender = {
      ...emailData,
      from: emailData.from || process.env.SMTP_USER || 'noreply@stylefinder.com',
      replyTo: process.env.COACH_EMAIL || emailData.to
    };
    
    // Verify transporter configuration with timeout
    const verifyPromise = transporter.verify();
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('SMTP verification timeout')), 10000)
    );
    
    await Promise.race([verifyPromise, timeoutPromise]);
    
    // Send email with timeout
    const sendPromise = transporter.sendMail(emailWithSender);
    const sendTimeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Email sending timeout')), 30000)
    );
    
    const info = await Promise.race([sendPromise, sendTimeoutPromise]);
    
    console.log('Email sent successfully:', {
      messageId: info.messageId,
      recipient: emailData.to,
      timestamp: new Date().toISOString()
    });
    
    return true;
  } catch (error: any) {
    console.error('Failed to send email:', {
      error: error.message,
      code: error.code,
      command: error.command,
      response: error.response,
      recipient: emailData.to,
      timestamp: new Date().toISOString()
    });
    
    // Try to send to backup email if this is a critical failure
    if (process.env.BACKUP_EMAIL && emailData.to !== process.env.BACKUP_EMAIL) {
      try {
        const backupEmail = {
          ...emailData,
          to: process.env.BACKUP_EMAIL,
          subject: `FAILED EMAIL DELIVERY: ${emailData.subject}`,
          text: `Original recipient: ${emailData.to}\nError: ${error.message}\n\n--- ORIGINAL EMAIL ---\n${emailData.text}`
        };
        
        const backupTransporter = createEmailTransporter();
        await backupTransporter.sendMail(backupEmail);
        console.log('Backup email sent successfully to:', process.env.BACKUP_EMAIL);
      } catch (backupError) {
        console.error('Failed to send backup email:', backupError);
      }
    }
    
    return false;
  }
}

/**
 * Validate email configuration with comprehensive checks
 */
export function validateEmailConfig(): string[] {
  const errors: string[] = [];
  
  // Required configuration
  if (!process.env.SMTP_HOST) {
    errors.push('SMTP_HOST environment variable is required');
  }
  
  if (!process.env.SMTP_USER) {
    errors.push('SMTP_USER environment variable is required');
  }
  
  if (!process.env.SMTP_PASS) {
    errors.push('SMTP_PASS environment variable is required');
  }
  
  if (!process.env.COACH_EMAIL) {
    errors.push('COACH_EMAIL environment variable is required');
  }
  
  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (process.env.COACH_EMAIL && !emailRegex.test(process.env.COACH_EMAIL)) {
    errors.push('COACH_EMAIL must be a valid email address');
  }
  
  if (process.env.BACKUP_EMAIL && !emailRegex.test(process.env.BACKUP_EMAIL)) {
    errors.push('BACKUP_EMAIL must be a valid email address');
  }
  
  // Port validation
  const port = parseInt(process.env.SMTP_PORT || '587');
  if (isNaN(port) || port < 1 || port > 65535) {
    errors.push('SMTP_PORT must be a valid port number (1-65535)');
  }
  
  // Rate limit validation
  const rateLimit = parseInt(process.env.EMAIL_RATE_LIMIT || '100');
  if (isNaN(rateLimit) || rateLimit < 1 || rateLimit > 10000) {
    errors.push('EMAIL_RATE_LIMIT must be a number between 1 and 10000');
  }
  
  // Provider-specific validations
  const host = process.env.SMTP_HOST?.toLowerCase();
  if (host?.includes('sendgrid') && process.env.SMTP_USER !== 'apikey') {
    errors.push('SendGrid requires SMTP_USER to be "apikey"');
  }
  
  if (host?.includes('gmail') && !process.env.SMTP_PASS?.includes('-')) {
    console.warn('Gmail users should use App Passwords, not regular passwords');
  }
  
  return errors;
}

/**
 * Get email provider-specific setup instructions
 */
export function getEmailProviderInstructions(provider?: string): string {
  const detectedProvider = provider || detectEmailProvider();
  
  const instructions = {
    gmail: `
Gmail Setup Instructions:
1. Enable 2-factor authentication on your Google account
2. Generate an App Password at https://myaccount.google.com/apppasswords
3. Set environment variables:
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-16-character-app-password
`,
    sendgrid: `
SendGrid Setup Instructions:
1. Create account at https://sendgrid.com
2. Generate API key at https://app.sendgrid.com/settings/api_keys
3. Set environment variables:
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_USER=apikey
   SMTP_PASS=your-sendgrid-api-key
`,
    mailgun: `
Mailgun Setup Instructions:
1. Create account at https://mailgun.com
2. Get SMTP credentials from dashboard
3. Set environment variables:
   SMTP_HOST=smtp.mailgun.org
   SMTP_PORT=587
   SMTP_USER=your-mailgun-smtp-username
   SMTP_PASS=your-mailgun-smtp-password
`,
    aws: `
AWS SES Setup Instructions:
1. Set up AWS SES in your AWS Console
2. Create SMTP credentials
3. Set environment variables:
   SMTP_HOST=email-smtp.your-region.amazonaws.com
   SMTP_PORT=587
   SMTP_USER=your-ses-smtp-username
   SMTP_PASS=your-ses-smtp-password
`
  };

  return instructions[detectedProvider as keyof typeof instructions] || 
    'Unknown provider. Please configure SMTP settings manually.';
}

/**
 * Detect email provider from SMTP host
 */
function detectEmailProvider(): string {
  const host = process.env.SMTP_HOST?.toLowerCase();
  if (host?.includes('gmail')) return 'gmail';
  if (host?.includes('sendgrid')) return 'sendgrid';
  if (host?.includes('mailgun')) return 'mailgun';
  if (host?.includes('amazonaws')) return 'aws';
  return 'unknown';
}