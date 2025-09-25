import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function GET(request: NextRequest) {
  try {
    // Get email configuration from environment variables
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT || '587';
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const coachEmail = process.env.COACH_EMAIL;

    // Check if all required env vars are present
    const missingVars = [];
    if (!smtpHost) missingVars.push('SMTP_HOST');
    if (!smtpPort) missingVars.push('SMTP_PORT');
    if (!smtpUser) missingVars.push('SMTP_USER');
    if (!smtpPass) missingVars.push('SMTP_PASS');
    if (!coachEmail) missingVars.push('COACH_EMAIL');

    if (missingVars.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Missing environment variables',
        missingVars,
        instructions: 'Please set these environment variables in your .env.local file'
      }, { status: 400 });
    }

    // Create transporter with guaranteed string values
    const transporter = nodemailer.createTransport({
      host: smtpHost!,
      port: parseInt(smtpPort),
      secure: parseInt(smtpPort) === 465,
      auth: {
        user: smtpUser!,
        pass: smtpPass!,
      },
    });

    // Test the connection
    await transporter.verify();

    // Send test email
    const testEmailResult = await transporter.sendMail({
      from: smtpUser,
      to: coachEmail,
      subject: 'StyleFinder Quiz - Email Test',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Email Configuration Test Successful!</h2>
          <p>This test email confirms that your SMTP settings are configured correctly.</p>
          <hr style="border: 1px solid #eee; margin: 20px 0;">
          <h3>Configuration Details:</h3>
          <ul style="list-style: none; padding: 0;">
            <li><strong>SMTP Host:</strong> ${smtpHost}</li>
            <li><strong>SMTP Port:</strong> ${smtpPort}</li>
            <li><strong>From:</strong> ${smtpUser}</li>
            <li><strong>To:</strong> ${coachEmail}</li>
            <li><strong>Timestamp:</strong> ${new Date().toISOString()}</li>
          </ul>
          <hr style="border: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            This is an automated test email from the StyleFinder Quiz application.
          </p>
        </div>
      `,
      text: `
        Email Configuration Test Successful!

        This test email confirms that your SMTP settings are configured correctly.

        Configuration Details:
        - SMTP Host: ${smtpHost}
        - SMTP Port: ${smtpPort}
        - From: ${smtpUser}
        - To: ${coachEmail}
        - Timestamp: ${new Date().toISOString()}
      `
    });

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully!',
      details: {
        messageId: testEmailResult.messageId,
        accepted: testEmailResult.accepted,
        to: coachEmail,
        from: smtpUser,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error('Email test error:', error);

    // Provide detailed error information
    return NextResponse.json({
      success: false,
      error: 'Failed to send test email',
      details: {
        message: error.message,
        code: error.code,
        command: error.command,
        responseCode: error.responseCode,
        response: error.response
      }
    }, { status: 500 });
  }
}