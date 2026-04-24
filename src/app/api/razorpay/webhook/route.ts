import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('x-razorpay-signature')
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET!

  // Verify signature
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex')

  if (expectedSignature !== signature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const payload = JSON.parse(body)
  const event = payload.event
  const supabase = await createClient()

  console.log('Razorpay Webhook Event:', event)

  if (event === 'subscription.charged') {
    const subscription = payload.payload.subscription.entity
    const payment = payload.payload.payment.entity
    const userId = subscription.notes.user_id
    const planType = subscription.notes.plan_type

    // Update or Insert subscription in Supabase
    const { error } = await supabase
      .from('subscriptions')
      .upsert({
        user_id: userId,
        plan_type: planType,
        status: 'active',
        razorpay_subscription_id: subscription.id,
        renewal_date: new Date(subscription.charge_at * 1000).toISOString(),
      })
      .eq('user_id', userId)

    if (error) console.error('Supabase update error:', error)
  }

  if (event === 'subscription.cancelled') {
    const subscription = payload.payload.subscription.entity
    const userId = subscription.notes.user_id

    await supabase
      .from('subscriptions')
      .update({ status: 'cancelled' })
      .eq('user_id', userId)
  }

  return NextResponse.json({ received: true })
}
