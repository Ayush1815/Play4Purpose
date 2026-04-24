import Razorpay from 'razorpay'

export const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export const RAZORPAY_PLANS = {
  monthly: {
    name: 'Monthly Plan',
    price: 499,
    period: 'month',
    planId: process.env.RAZORPAY_MONTHLY_PLAN_ID!,
    features: [
      'Enter monthly draws',
      'Track your scores',
      'Support your charity',
      'Cancel anytime',
    ],
  },
  yearly: {
    name: 'Yearly Plan',
    price: 4999,
    period: 'year',
    planId: process.env.RAZORPAY_YEARLY_PLAN_ID!,
    popular: true,
    savings: 'Save ₹989/year',
    features: [
      'All monthly plan benefits',
      'Save 17% with yearly plan',
      'Priority support',
      'Early access to features',
    ],
  },
}
