'use client'

import { useState, useEffect, useCallback } from 'react'
import { Check, CreditCard, Zap, ArrowRight, Loader2, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatDate } from '@/lib/utils'
import { useSearchParams } from 'next/navigation'

const plans = [
  {
    id: 'monthly', name: 'Monthly Plan', price: 499, period: 'month',
    features: ['Enter monthly draws', 'Track your scores', 'Support your charity', 'Cancel anytime'],
  },
  {
    id: 'yearly', name: 'Yearly Plan', price: 4999, period: 'year', popular: true, savings: 'Save ₹989/year',
    features: ['All monthly plan benefits', 'Save 17% with yearly plan', 'Priority support', 'Early access to features'],
  },
]

export default function SettingsPage() {
  const searchParams = useSearchParams()
  const [subscription, setSubscription] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null)
  const supabase = createClient()

  const fetchSubscription = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase.from('subscriptions').select('*').eq('user_id', user.id).single()
    setSubscription(data)
    setLoading(false)
  }, [supabase])

  useEffect(() => { fetchSubscription() }, [fetchSubscription])

  async function handleSubscribe(planId: string) {
    setCheckoutLoading(planId)
    
    try {
      const res = await fetch('/api/razorpay/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId }),
      })
      const data = await res.json()
      
      if (data.error) throw new Error(data.error)

      // Load Razorpay Script
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.async = true
      document.body.appendChild(script)

      script.onload = () => {
        const options = {
          key: data.key,
          subscription_id: data.id,
          name: 'Play4Purpose',
          description: `Subscription for ${planId} plan`,
          handler: async function (response: any) {
            // Verify payment on server
            const verifyRes = await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_subscription_id: response.razorpay_subscription_id,
                razorpay_signature: response.razorpay_signature,
              }),
            })
            const verifyData = await verifyRes.json()
            if (verifyData.success) {
              window.location.href = '/dashboard/settings?success=true'
            } else {
              alert('Payment verification failed. Please contact support.')
            }
          },
          prefill: {
            email: '', // will be fetched from user if needed
          },
          theme: {
            color: '#7C3AED',
          },
        }
        const rzp = new (window as any).Razorpay(options)
        rzp.open()
      }
    } catch (err: any) {
      alert(err.message)
    } finally {
      setCheckoutLoading(null)
    }
  }

  const success = searchParams.get('success')
  const cancelled = searchParams.get('cancelled')

  if (loading) return <div className="flex items-center justify-center py-24"><Loader2 className="animate-spin text-purple-500" size={32} /></div>

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Subscription & Settings
        </h2>
        <p className="text-gray-500 text-sm">Manage your plan and account preferences.</p>
      </div>

      {success && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl p-4 mb-6 text-sm">
          <Check size={16} /> Subscription activated! Welcome to Play4Purpose.
        </div>
      )}
      {cancelled && (
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 rounded-xl p-4 mb-6 text-sm">
          <AlertCircle size={16} /> Checkout cancelled. You can try again anytime.
        </div>
      )}

      {/* Current subscription */}
      {subscription?.status === 'active' && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-8">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard size={18} className="text-purple-500" />
            <h3 className="font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Current Plan</h3>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-gray-900 capitalize">{subscription.plan_type} Plan</p>
              <p className="text-gray-500 text-sm">Renews on {subscription.renewal_date ? formatDate(subscription.renewal_date) : '—'}</p>
            </div>
            <span className="bg-emerald-100 text-emerald-700 text-sm font-bold px-3 py-1.5 rounded-full">Active</span>
          </div>
        </div>
      )}

      {/* Plan selection */}
      <h3 className="font-bold text-gray-900 mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        {subscription?.status === 'active' ? 'Change Plan' : 'Choose a Plan'}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative rounded-2xl p-6 border-2 ${
              plan.popular ? 'border-purple-500 bg-gradient-to-br from-purple-600 to-violet-700 text-white' : 'border-gray-200 bg-white'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="flex items-center gap-1 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                  <Zap size={11} /> MOST POPULAR
                </span>
              </div>
            )}
            <h4 className={`font-bold mb-1 ${plan.popular ? 'text-white' : 'text-gray-900'}`}>{plan.name}</h4>
            {(plan as any).savings && <span className="inline-block bg-white/20 text-white text-xs font-semibold px-2 py-0.5 rounded-full mb-2">{(plan as any).savings}</span>}
            <div className="flex items-baseline gap-1 mb-4">
              <span className={`text-3xl font-extrabold ${plan.popular ? 'text-white' : 'text-gray-900'}`}>₹{plan.price.toLocaleString('en-IN')}</span>
              <span className={`text-sm ${plan.popular ? 'text-white/70' : 'text-gray-500'}`}>/{plan.period}</span>
            </div>
            <ul className="flex flex-col gap-2 mb-5">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-xs">
                  <Check size={11} className={plan.popular ? 'text-white' : 'text-purple-600'} strokeWidth={3} />
                  <span className={plan.popular ? 'text-white/85' : 'text-gray-600'}>{f}</span>
                </li>
              ))}
            </ul>
            <button
              id={`subscribe-${plan.id}`}
              onClick={() => handleSubscribe(plan.id)}
              disabled={checkoutLoading !== null}
              className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-60 ${
                plan.popular
                  ? 'bg-white text-purple-700 hover:bg-white/90'
                  : 'bg-gradient-to-r from-purple-600 to-violet-600 text-white hover:shadow-lg hover:-translate-y-0.5'
              }`}
            >
              {checkoutLoading === plan.id ? <Loader2 size={14} className="animate-spin" /> : <ArrowRight size={14} />}
              {checkoutLoading === plan.id ? 'Redirecting...' : 'Get Started'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
