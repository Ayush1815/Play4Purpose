import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { formatDate, getDaysUntil, getNextDrawDate, getScoreColor } from '@/lib/utils'
import { CreditCard, Heart, ClipboardList, Trophy, Gift, ArrowRight, TrendingUp, Check } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const params = await searchParams
  const isNewUser = params.welcome === 'true'
  const selectedPlan = params.plan as string | undefined

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [profileRes, subscriptionRes, scoresRes, participationsRes, winningsRes] = await Promise.all([
    supabase.from('profiles').select('*, charities(name)').eq('id', user.id).single(),
    supabase.from('subscriptions').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1).maybeSingle(),
    supabase.from('scores').select('*').eq('user_id', user.id).order('score_date', { ascending: false }).limit(5),
    supabase.from('draw_participations').select('id', { count: 'exact' }).eq('user_id', user.id),
    supabase.from('winners').select('prize_amount, payment_status').eq('user_id', user.id),
  ])

  const profile = profileRes.data
  const subscription = subscriptionRes.data
  const scores = scoresRes.data || []
  const participationCount = participationsRes.count || 0
  const winnings = winningsRes.data || []
  const totalWon = winnings.reduce((sum, w) => sum + (w.prize_amount || 0), 0)
  const nextDrawDate = getNextDrawDate()
  const daysLeft = getDaysUntil(nextDrawDate.toISOString())

  const needsCharity = !profile?.selected_charity_id
  const needsSubscription = !subscription || subscription.status !== 'active'

  const subscriptionStart = subscription?.created_at ? new Date(subscription.created_at) : new Date()
  const monthsActive = Math.max(1, (new Date().getFullYear() - subscriptionStart.getFullYear()) * 12 + (new Date().getMonth() - subscriptionStart.getMonth()))
  const estimatedDonation = subscription?.status === 'active' 
    ? (monthsActive * (subscription.plan_type === 'yearly' ? 4999 / 12 : 499) * (profile?.contribution_percentage || 10) / 100)
    : 0

  return (
    <div className="max-w-5xl mx-auto">
      {/* Welcome / Onboarding Banner */}
      {(isNewUser || needsCharity || needsSubscription) && (
        <div className="mb-10 bg-gradient-to-r from-purple-600 to-violet-700 rounded-3xl p-8 text-white shadow-xl shadow-purple-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-24 translate-x-24 blur-3xl" />
          <div className="relative z-10">
            <h2 className="text-3xl font-extrabold mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {isNewUser ? `Welcome, ${profile?.full_name || 'there'}! ✨` : 'Complete your setup'}
            </h2>
            <p className="text-purple-100 mb-8 max-w-lg">
              You're just a few steps away from making an impact and winning rewards.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`p-4 rounded-2xl border ${needsCharity ? 'bg-white/20 border-white/40' : 'bg-emerald-500/20 border-emerald-400/40 opacity-60'}`}>
                <div className="flex items-center justify-between mb-3">
                  <Heart size={18} className={needsCharity ? 'text-white' : 'text-emerald-300'} />
                  {!needsCharity && <Check size={16} className="text-emerald-300" />}
                </div>
                <p className="font-bold text-sm mb-1">1. Select Charity</p>
                {needsCharity ? (
                  <Link href="/dashboard/charity" className="text-xs font-semibold text-yellow-300 hover:underline">Choose now →</Link>
                ) : (
                  <p className="text-xs text-emerald-200">Completed</p>
                )}
              </div>

              <div className={`p-4 rounded-2xl border ${needsSubscription ? 'bg-white/20 border-white/40' : 'bg-emerald-500/20 border-emerald-400/40 opacity-60'}`}>
                <div className="flex items-center justify-between mb-3">
                  <CreditCard size={18} className={needsSubscription ? 'text-white' : 'text-emerald-300'} />
                  {!needsSubscription && <Check size={16} className="text-emerald-300" />}
                </div>
                <p className="font-bold text-sm mb-1">2. Subscribe</p>
                {needsSubscription ? (
                  <Link href={`/dashboard/settings${selectedPlan ? `?plan=${selectedPlan}` : ''}`} className="text-xs font-semibold text-yellow-300 hover:underline">View plans →</Link>
                ) : (
                  <p className="text-xs text-emerald-200">Completed</p>
                )}
              </div>

              <div className={`p-4 rounded-2xl border ${scores.length === 0 ? 'bg-white/20 border-white/40' : 'bg-emerald-500/20 border-emerald-400/40 opacity-60'}`}>
                <div className="flex items-center justify-between mb-3">
                  <ClipboardList size={18} className={scores.length === 0 ? 'text-white' : 'text-emerald-300'} />
                  {scores.length > 0 && <Check size={16} className="text-emerald-300" />}
                </div>
                <p className="font-bold text-sm mb-1">3. Add first score</p>
                {scores.length === 0 ? (
                  <Link href="/dashboard/scores" className="text-xs font-semibold text-yellow-300 hover:underline">Add now →</Link>
                ) : (
                  <p className="text-xs text-emerald-200">Completed</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Your Impact Overview
        </h2>
        <p className="text-gray-500 text-sm">Here's your journey at a glance.</p>
      </div>

      {/* Top stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide">Subscription</p>
            <CreditCard size={16} className="text-gray-400" />
          </div>
          <p className={`text-xl font-bold ${subscription?.status === 'active' ? 'text-emerald-600' : 'text-red-500'} capitalize`}>
            {subscription?.status || 'Inactive'}
          </p>
          <p className="text-gray-400 text-xs mt-1">
            {subscription?.status === 'active' && subscription.renewal_date ? `Renews ${formatDate(subscription.renewal_date)}` : (
              <Link href="/dashboard/settings" className="text-purple-500 hover:underline">Subscribe now →</Link>
            )}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide">Personal Impact</p>
            <Heart size={16} className="text-pink-400" />
          </div>
          <p className="text-xl font-bold text-gray-900 truncate">
            ₹{estimatedDonation.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </p>
          <p className="text-gray-400 text-xs mt-1">
            Raised for {(profile as any)?.charities?.name || 'Charity'}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide">Match Count</p>
            <Trophy size={16} className="text-amber-400" />
          </div>
          <p className="text-xl font-bold text-gray-900">
            {participationCount}
          </p>
          <p className="text-gray-400 text-xs mt-1">Draws entered</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide">Lifetime Winnings</p>
            <TrendingUp size={16} className="text-purple-500" />
          </div>
          <p className="text-xl font-bold text-gray-900">
            ₹{totalWon.toLocaleString('en-IN')}
          </p>
          <p className="text-gray-400 text-xs mt-1">{winnings.length} win{winnings.length !== 1 ? 's' : ''} total</p>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Latest Scores */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <ClipboardList size={18} className="text-purple-500" />
              <h3 className="font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Latest Scores
              </h3>
            </div>
            <Link href="/dashboard/scores" className="text-purple-600 text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              View All <ArrowRight size={14} />
            </Link>
          </div>

          {scores.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center mx-auto mb-3">
                <ClipboardList size={22} className="text-purple-400" />
              </div>
              <p className="text-gray-500 text-sm mb-3">No scores yet. Enter your first golf score!</p>
              <Link href="/dashboard/scores" className="btn-primary py-2 px-5 text-sm">Add Score</Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {scores.map((score, i) => (
                <div key={score.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400 text-xs w-4">{i + 1}</span>
                    <p className="text-gray-700 text-sm font-medium">{formatDate(score.score_date)}</p>
                  </div>
                  <span className={`score-badge text-sm font-bold ${getScoreColor(score.score)}`}>
                    {score.score}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Next Draw + Participation */}
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl p-6 text-white shadow-lg" style={{ background: 'linear-gradient(135deg, #7C3AED, #A855F7)' }}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-white/70 text-xs font-semibold uppercase tracking-wide">Next Draw</p>
              <Trophy size={18} className="text-yellow-300" />
            </div>
            <p className="text-2xl font-extrabold mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {nextDrawDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            <p className="text-yellow-300 text-sm font-semibold mb-4">{daysLeft} day{daysLeft !== 1 ? 's' : ''} left!</p>
            <Link href="/dashboard/draws" className="flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 transition-colors rounded-xl py-2.5 text-sm font-semibold">
              View Draw Details <ArrowRight size={14} />
            </Link>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Gift size={18} className="text-purple-500" />
              <h3 className="font-bold text-gray-900 text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Participation Summary
              </h3>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <p className="text-gray-500 text-sm">Draws Entered</p>
                <p className="font-bold text-gray-900">{participationCount}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-gray-500 text-sm">Scores Submitted</p>
                <p className="font-bold text-gray-900">{scores.length}/5</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-gray-500 text-sm">Payment Status</p>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  winnings.some(w => w.payment_status === 'pending') ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'
                }`}>
                  {winnings.some(w => w.payment_status === 'pending') ? 'Pending' : 'Clear'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
