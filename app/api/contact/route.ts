import { NextRequest, NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, projectType, budget, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
    const SENDGRID_FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL;

    if (!SENDGRID_API_KEY) {
      console.error('SENDGRID_API_KEY is not configured');
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      );
    }

    if (!SENDGRID_FROM_EMAIL) {
      console.error('SENDGRID_FROM_EMAIL is not configured');
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      );
    }

    // Configure SendGrid
    sgMail.setApiKey(SENDGRID_API_KEY);

    const projectTypeDisplay = projectType || 'General Inquiry';

    const msg = {
      to: 'cwaffiliateinvestments@gmail.com',
      from: SENDGRID_FROM_EMAIL,
      replyTo: email,
      subject: `New Contact Form Submission - ${projectTypeDisplay}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563EB; border-bottom: 2px solid #2563EB; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>

          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr>
              <td style="padding: 12px; background-color: #f3f4f6; font-weight: bold; width: 140px;">Name</td>
              <td style="padding: 12px; background-color: #f9fafb;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 12px; background-color: #f3f4f6; font-weight: bold;">Email</td>
              <td style="padding: 12px; background-color: #f9fafb;">
                <a href="mailto:${email}" style="color: #2563EB;">${email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 12px; background-color: #f3f4f6; font-weight: bold;">Project Type</td>
              <td style="padding: 12px; background-color: #f9fafb;">${projectType || 'Not specified'}</td>
            </tr>
            <tr>
              <td style="padding: 12px; background-color: #f3f4f6; font-weight: bold;">Budget Range</td>
              <td style="padding: 12px; background-color: #f9fafb;">${budget || 'Not specified'}</td>
            </tr>
          </table>

          <h3 style="color: #374151; margin-top: 24px;">Message</h3>
          <div style="background-color: #f9fafb; padding: 16px; border-radius: 8px; border-left: 4px solid #10B981;">
            <p style="margin: 0; white-space: pre-wrap; line-height: 1.6;">${message}</p>
          </div>

          <p style="color: #6b7280; font-size: 12px; margin-top: 24px; padding-top: 16px; border-top: 1px solid #e5e7eb;">
            This message was sent from the contact form at claudeweidner.com
          </p>
        </div>
      `,
      text: `
New Contact Form Submission

Name: ${name}
Email: ${email}
Project Type: ${projectType || 'Not specified'}
Budget Range: ${budget || 'Not specified'}

Message:
${message}

---
This message was sent from the contact form at claudeweidner.com
      `.trim(),
    };

    await sgMail.send(msg);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
