import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const { razorpay_payment_id, razorpay_subscription_id, razorpay_signature } = await req.json()
  const secret = process.env.RAZORPAY_KEY_SECRET!

  const generated_signature = crypto
    .createHmac('sha256', secret)
    .update(razorpay_payment_id + '|' + razorpay_subscription_id)
    .digest('hex')

  if (generated_signature === razorpay_signature) {
    const supabase = await createClient()
    await supabase.from('subscriptions')
      .update({ status: 'active' })
      .eq('razorpay_subscription_id', razorpay_subscription_id)

    return NextResponse.json({ success: true })
  } else {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }
}
