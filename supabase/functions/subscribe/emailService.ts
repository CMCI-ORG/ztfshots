export async function sendVerificationEmail(
  email: string,
  name: string,
  verificationToken: string,
  resendApiKey: string,
  siteUrl: string
) {
  try {
    const verificationUrl = `${siteUrl}/verify-email?token=${verificationToken}`;
    
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`
      },
      body: JSON.stringify({
        from: 'Daily Dose from Z.T. Fomum <onboarding@resend.dev>',
        to: [email],
        subject: 'Verify your subscription',
        html: `
          <h2>Welcome to Daily Dose from Z.T. Fomum!</h2>
          <p>Hello ${name},</p>
          <p>Thank you for subscribing to our daily inspirational quotes. Please verify your email address by clicking the link below:</p>
          <p><a href="${verificationUrl}">Verify Email Address</a></p>
          <p>This link will expire in 24 hours.</p>
          <p>If you did not create this account, no further action is required.</p>
          <p>Best regards,<br>Daily Dose from Z.T. Fomum Team</p>
        `
      })
    });

    if (!res.ok) {
      const error = await res.text();
      console.error('Error sending verification email:', error);
      throw new Error('Failed to send verification email');
    }

    const data = await res.json();
    console.log('Verification email sent successfully:', data);
    return data;
  } catch (error) {
    console.error('Error in sendVerificationEmail:', error);
    throw new Error('Email service error: Failed to send verification email');
  }
}