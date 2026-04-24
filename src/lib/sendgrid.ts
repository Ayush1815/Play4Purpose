import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || 'noreply@play4purpose.com'

export async function sendWelcomeEmail(to: string, name: string) {
  await sgMail.send({
    to,
    from: FROM_EMAIL,
    subject: 'Welcome to Play4Purpose 🎯',
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #7C3AED, #A855F7); padding: 40px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; font-size: 28px; margin: 0;">Play4Purpose</h1>
          <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0;">Play. Win. Make an Impact.</p>
        </div>
        <div style="background: #fff; padding: 40px; border-radius: 0 0 12px 12px; border: 1px solid #E5E7EB; border-top: none;">
          <h2 style="color: #1E1B4B; font-size: 22px;">Welcome aboard, ${name}! 👋</h2>
          <p style="color: #6B7280; line-height: 1.6;">You're now part of a community that plays with purpose. Every score you enter, every draw you participate in — it all contributes to causes that matter.</p>
          <div style="margin: 32px 0; padding: 24px; background: #F5F3FF; border-radius: 8px;">
            <p style="color: #7C3AED; font-weight: 600; margin: 0 0 8px;">Your next steps:</p>
            <ol style="color: #4B5563; line-height: 2; margin: 0; padding-left: 20px;">
              <li>Choose a subscription plan</li>
              <li>Enter your last 5 golf scores</li>
              <li>Select a charity to support</li>
              <li>Wait for the monthly draw!</li>
            </ol>
          </div>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display: inline-block; background: linear-gradient(135deg, #7C3AED, #A855F7); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">Go to Dashboard →</a>
        </div>
      </div>
    `,
  })
}

export async function sendSubscriptionConfirmationEmail(
  to: string,
  name: string,
  plan: 'monthly' | 'yearly',
  renewalDate: string
) {
  await sgMail.send({
    to,
    from: FROM_EMAIL,
    subject: 'Subscription Confirmed — Play4Purpose ✅',
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #7C3AED, #A855F7); padding: 40px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; font-size: 28px; margin: 0;">Play4Purpose</h1>
        </div>
        <div style="background: #fff; padding: 40px; border-radius: 0 0 12px 12px; border: 1px solid #E5E7EB; border-top: none;">
          <h2 style="color: #1E1B4B;">Subscription Confirmed! 🎉</h2>
          <p style="color: #6B7280;">Hi ${name}, your <strong>${plan} plan</strong> is now active.</p>
          <p style="color: #6B7280;">Your next renewal date is <strong>${renewalDate}</strong>.</p>
          <p style="color: #6B7280;">You're now eligible to participate in monthly draws. Start entering your golf scores!</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/scores" style="display: inline-block; background: linear-gradient(135deg, #7C3AED, #A855F7); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">Enter Scores →</a>
        </div>
      </div>
    `,
  })
}

export async function sendDrawResultEmail(
  to: string,
  name: string,
  isWinner: boolean,
  matchCount?: number,
  prizeAmount?: number
) {
  const subject = isWinner
    ? `🏆 You Won in the Monthly Draw! — Play4Purpose`
    : `Monthly Draw Results — Play4Purpose`

  await sgMail.send({
    to,
    from: FROM_EMAIL,
    subject,
    html: isWinner
      ? `
        <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #7C3AED, #A855F7); padding: 40px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: white; font-size: 40px; margin: 0;">🏆</h1>
            <h2 style="color: white; margin: 8px 0 0;">You're a Winner!</h2>
          </div>
          <div style="background: #fff; padding: 40px; border-radius: 0 0 12px 12px; border: 1px solid #E5E7EB; border-top: none;">
            <h2 style="color: #1E1B4B;">Congratulations, ${name}!</h2>
            <p style="color: #6B7280;">You matched <strong>${matchCount} numbers</strong> in this month's draw and won <strong>₹${prizeAmount?.toLocaleString('en-IN')}</strong>!</p>
            <p style="color: #6B7280;">Please upload your score verification screenshot to claim your prize.</p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/winnings" style="display: inline-block; background: linear-gradient(135deg, #7C3AED, #A855F7); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">Claim Prize →</a>
          </div>
        </div>
      `
      : `
        <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #7C3AED, #A855F7); padding: 40px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: white; font-size: 28px; margin: 0;">Play4Purpose</h1>
          </div>
          <div style="background: #fff; padding: 40px; border-radius: 0 0 12px 12px; border: 1px solid #E5E7EB; border-top: none;">
            <h2 style="color: #1E1B4B;">This Month's Draw Results</h2>
            <p style="color: #6B7280;">Hi ${name}, unfortunately you didn't win this month. But every draw is a new chance — and your subscription is still supporting your chosen charity!</p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display: inline-block; background: linear-gradient(135deg, #7C3AED, #A855F7); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">View Dashboard →</a>
          </div>
        </div>
      `,
  })
}
