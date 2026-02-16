import { NextResponse } from 'next/server';
import { testEmailConfiguration, sendNotificationEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/test-email
 * Test email configuration status
 */
export async function GET() {
    try {
        const result = await testEmailConfiguration();
        
        return NextResponse.json({
            success: true,
            email: result
        });
    } catch (error) {
        console.error('Email config test error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to test email configuration' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/admin/test-email
 * Send a test email
 * 
 * Body: { email: "test@example.com" }
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json(
                { success: false, error: 'Email address is required' },
                { status: 400 }
            );
        }

        // Send test email
        const result = await sendNotificationEmail(
            email,
            '🧪 IAF 2026 - Test Email',
            `
            <h2 style="color: #FF4500; margin-bottom: 20px;">Test Email Successful! 🎉</h2>
            <p>If you're reading this, your email configuration is working correctly.</p>
            <p style="margin-top: 20px;"><strong>Configuration Details:</strong></p>
            <ul style="color: #888;">
                <li>Email Service: Resend</li>
                <li>Time Sent: ${new Date().toLocaleString()}</li>
                <li>Recipient: ${email}</li>
            </ul>
            <p style="margin-top: 20px; padding: 15px; background: #222; border-radius: 8px; border-left: 4px solid #00F0FF;">
                Your IAF 2026 ticketing system is ready to send confirmation emails!
            </p>
            `
        );

        if (result.success) {
            return NextResponse.json({
                success: true,
                message: 'Test email sent successfully',
                messageId: result.messageId
            });
        } else {
            return NextResponse.json(
                { success: false, error: result.error },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error('Test email error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to send test email' },
            { status: 500 }
        );
    }
}
