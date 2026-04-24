import { createClient } from '@/lib/supabase/server'
import { Users, Trophy, Heart, Gift, TrendingUp, AlertCircle } from 'lucide-react'

export default async function AdminPage() {
  const supabase = await createClient()

  const [usersRes, subsRes, charityRes, winnersRes, drawsRes] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact' }),
    supabase.from('subscriptions').select('id', { count: 'exact' }).eq('status', 'active'),
    supabase.from('charities').select('id', { count: 'exact' }),
    supabase.from('winners').select('prize_amount, status, payment_status'),
    supabase.from('draws').select('id', { count: 'exact' }),
  ])

  const totalUsers = usersRes.count || 0
  const activeSubscriptions = subsRes.count || 0
  const totalCharities = charityRes.count || 0
  const winners = winnersRes.data || []
  const totalPaidOut = winners.filter(w => w.payment_status === 'paid').reduce((s, w) => s + (w.prize_amount || 0), 0)
  const pendingVerifications = winners.filter(w => w.status === 'pending').length

  const stats = [
    { label: 'Total Users', value: totalUsers, icon: Users, color: 'from-violet-500 to-purple-600' },
    { label: 'Active Subscribers', value: activeSubscriptions, icon: TrendingUp, color: 'from-emerald-500 to-teal-600' },
    { label: 'Charities', value: totalCharities, icon: Heart, color: 'from-pink-500 to-rose-600' },
    { label: 'Total Prize Paid', value: `₹${totalPaidOut.toLocaleString('en-IN')}`, icon: Trophy, color: 'from-amber-500 to-orange-500' },
  ]

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Admin Overview</h1>
        <p className="text-gray-500 text-sm">Platform health at a glance.</p>
      </div>

      {pendingVerifications > 0 && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-4 mb-6 text-sm">
          <AlertCircle size={16} />
          <span><strong>{pendingVerifications}</strong> winner verification{pendingVerifications > 1 ? 's' : ''} pending review.</span>
          <a href="/admin/winners" className="ml-auto text-amber-700 font-semibold hover:underline">Review →</a>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
                <Icon size={18} className="text-white" />
              </div>
              <p className="text-2xl font-extrabold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{stat.value}</p>
              <p className="text-gray-500 text-sm">{stat.label}</p>
            </div>
          )
        })}
      </div>

      {/* Quick actions */}
      <h2 className="font-bold text-gray-900 mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Manage Users', href: '/admin/users', icon: Users, desc: 'View, edit and manage all users' },
          { label: 'Run Draw', href: '/admin/draws', icon: Trophy, desc: 'Configure and publish monthly draws' },
          { label: 'Verify Winners', href: '/admin/winners', icon: Gift, desc: 'Review proof and approve payouts' },
        ].map((action) => {
          const Icon = action.icon
          return (
            <a key={action.label} href={action.href} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-purple-200 transition-all group">
              <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center mb-3 group-hover:bg-purple-600 transition-colors">
                <Icon size={16} className="text-purple-600 group-hover:text-white transition-colors" />
              </div>
              <p className="font-bold text-gray-900 mb-1">{action.label}</p>
              <p className="text-gray-400 text-sm">{action.desc}</p>
            </a>
          )
        })}
      </div>
    </div>
  )
}
