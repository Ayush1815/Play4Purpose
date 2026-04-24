import { NextRequest, NextResponse } from 'next/server'
import { razorpay, RAZORPAY_PLANS } from '@/lib/razorpay'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { plan } = await req.json()
  const planConfig = RAZORPAY_PLANS[plan as keyof typeof RAZORPAY_PLANS]
  
  if (!planConfig || !planConfig.planId) {
    return NextResponse.json({ error: 'Invalid plan or Plan ID missing in .env' }, { status: 400 })
  }

  try {
    const subscription = await razorpay.subscriptions.create({
      plan_id: planConfig.planId,
      customer_notify: 1,
      total_count: plan === 'monthly' ? 120 : 10,
      notes: {
        user_id: user.id,
        plan_type: plan
      }
    })

    // Create pending subscription record
    await supabase.from('subscriptions').upsert({
      user_id: user.id,
      plan_type: plan,
      status: 'inactive',
      razorpay_subscription_id: subscription.id,
    }, { onConflict: 'user_id' })

    return NextResponse.json({ 
      id: subscription.id,
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID 
    })
  } catch (error: any) {
    console.error('Razorpay subscription error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
