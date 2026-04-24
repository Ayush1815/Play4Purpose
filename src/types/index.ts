export type UserRole = 'subscriber' | 'admin'

export interface Profile {
  id: string
  full_name: string
  role: UserRole
  selected_charity_id: string | null
  contribution_percentage: number
  currency: string
  referral_code: string | null
  referred_by: string | null
  created_at: string
}

export interface Subscription {
  id: string
  user_id: string
  plan_type: 'monthly' | 'yearly'
  status: 'active' | 'inactive' | 'cancelled' | 'past_due'
  razorpay_subscription_id: string | null
  renewal_date: string | null
  created_at: string
}

export interface Score {
  id: string
  user_id: string
  score: number
  score_date: string
  created_at: string
}

export interface Charity {
  id: string
  name: string
  description: string
  image_url: string | null
  category: 'education' | 'health' | 'environment' | 'animals' | 'other'
  impact_stat: string | null
  created_at: string
}

export interface Draw {
  id: string
  draw_numbers: number[]
  month: string
  status: 'upcoming' | 'published' | 'completed'
  prize_pool_amount: number
  jackpot_rolled_over: boolean
  draw_type: 'random' | 'algorithm'
  created_at: string
}

export interface Winner {
  id: string
  user_id: string
  draw_id: string
  match_count: 3 | 4 | 5
  status: 'pending' | 'verified' | 'rejected'
  payment_status: 'pending' | 'paid'
  proof_url: string | null
  prize_amount: number
  created_at: string
}

export interface DrawParticipation {
  id: string
  user_id: string
  draw_id: string
  created_at: string
}

export interface PricingPlan {
  id: string
  name: string
  price: number
  period: 'month' | 'year'
  razorpayPlanId: string
  features: string[]
  popular?: boolean
  savings?: string
}
