import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function GET(request: NextRequest) {
  try {
    // Get email configuration from environment variables
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
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

    // Create transporter
    const transporter = nodemailer.createTransporter({
      host: smtpHost,
      port: parseInt(smtpPort),
      secure: parseInt(smtpPort) === 465, // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPass,
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
          <h2 style="color: #e11d48;">StyleFinder Quiz Email Test</h2>
          <p>This is a test email to verify the email configuration is working correctly.</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Configuration Details:</h3>
            <ul>
              <li><strong>SMTP Host:</strong> ${smtpHost}</li>
              <li><strong>SMTP Port:</strong> ${smtpPort}</li>
              <li><strong>SMTP User:</strong> ${smtpUser}</li>
              <li><strong>Coach Email:</strong> ${coachEmail}</li>
              <li><strong>Test Time:</strong> ${new Date().toISOString()}</li>
            </ul>
          </div>
          
          <p>If you receive this email, your StyleFinder quiz email configuration is working correctly!</p>
          
          <hr style="margin: 30px 0;">
          <p style="color: #666; font-size: 12px;">
            This is an automated test email from the StyleFinder Quiz application.
          </p>
        </div>
      `,
      text: `
        StyleFinder Quiz Email Test
        
        This is a test email to verify the email configuration is working correctly.
        
        Configuration Details:
        - SMTP Host: ${smtpHost}
        - SMTP Port: ${smtpPort}
        - SMTP User: ${smtpUser}
        - Coach Email: ${coachEmail}
        - Test Time: ${new Date().toISOString()}
        
        If you receive this email, your StyleFinder quiz email configuration is working correctly!
      `
    });

    return NextResponse.json({
      success: true,
      message: 'Email test successful!',
      details: {
        messageId: testEmailResult.messageId,
        response: testEmailResult.response,
        to: coachEmail,
        from: smtpUser,
        testTime: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error('Email test failed:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Email test failed',
      details: {
        message: error.message,
        code: error.code,
        command: error.command,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { testEmail } = body;

    if (!testEmail) {
      return NextResponse.json({
        success: false,
        error: 'testEmail parameter required in request body'
      }, { status: 400 });
    }

    // Same logic as GET but send to custom email
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    const transporter = nodemailer.createTransporter({
      host: smtpHost,
      port: parseInt(smtpPort || '587'),
      secure: parseInt(smtpPort || '587') === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    await transporter.verify();

    const testEmailResult = await transporter.sendMail({
      from: smtpUser,
      to: testEmail,
      subject: 'StyleFinder Quiz - Custom Email Test',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #e11d48;">StyleFinder Quiz Custom Email Test</h2>
          <p>This test email was sent to: <strong>${testEmail}</strong></p>
          <p>Test completed at: ${new Date().toISOString()}</p>
          <p>If you receive this, the email configuration is working!</p>
        </div>
      `,
      text: `
        StyleFinder Quiz Custom Email Test
        
        This test email was sent to: ${testEmail}
        Test completed at: ${new Date().toISOString()}
        If you receive this, the email configuration is working!
      `
    });

    return NextResponse.json({
      success: true,
      message: 'Custom email test successful!',
      details: {
        messageId: testEmailResult.messageId,
        to: testEmail,
        from: smtpUser,
        testTime: new Date().toISOString()
      }
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: 'Custom email test failed',
      details: {
        message: error.message,
        code: error.code
      }
    }, { status: 500 });
  }
}