import sgMail from '@sendgrid/mail'

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
}

const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || 'hello@play4purpose.com'

export const sendEmail = async (to: string, subject: string, html: string) => {
  if (!process.env.SENDGRID_API_KEY) {
    console.log('Skipping email send — SENDGRID_API_KEY not set')
    console.log(`To: ${to}, Subject: ${subject}`)
    return
  }

  const msg = {
    to,
    from: FROM_EMAIL,
    subject,
    html,
  }

  try {
    await sgMail.send(msg)
  } catch (error) {
    console.error('Error sending email:', error)
    if ((error as any).response) {
      console.error((error as any).response.body)
    }
  }
}

export const EMAIL_TEMPLATES = {
  WELCOME: (name: string) => `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #7C3AED;">Welcome to Play4Purpose, ${name}! ✨</h2>
      <p>We're thrilled to have you join our community of golfers making a difference.</p>
      <p>Start by choosing a charity and submitting your first score to enter this month's draw.</p>
      <div style="margin-top: 30px;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="background: #7C3AED; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Go to Dashboard</a>
      </div>
      <p style="margin-top: 30px; font-size: 12px; color: #666;">If you have any questions, just reply to this email!</p>
    </div>
  `,
  DRAW_ENTRY: (month: string) => `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #7C3AED;">You're in! 🏆</h2>
      <p>You have successfully entered the <strong>${month}</strong> prize draw.</p>
      <p>Winners will be announced at the end of the month. Good luck!</p>
      <p style="margin-top: 30px; font-size: 12px; color: #666;">Keep playing, keep winning, keep making an impact.</p>
    </div>
  `,
  WINNER_NOTIFICATION: (amount: number) => `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #10B981;">Congratulations! You Won! 🎊</h2>
      <p>You matched the numbers in our latest draw and won <strong>₹${amount.toLocaleString('en-IN')}</strong>.</p>
      <p>Log in to your dashboard to claim your prize and upload your score proof.</p>
      <div style="margin-top: 30px;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/winnings" style="background: #10B981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Claim My Prize</a>
      </div>
    </div>
  `
}
