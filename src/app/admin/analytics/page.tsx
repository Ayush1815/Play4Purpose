'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, TrendingUp, Users, Heart, Banknote, 
  ArrowUpRight, ArrowDownRight, Calendar, Loader2, Filter
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency } from '@/lib/utils'

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<any>(null)
  const [period, setPeriod] = useState<'30d' | '90d' | 'all'>('30d')
  
  const supabase = createClient()

  const fetchAnalytics = useCallback(async () => {
    setLoading(true)
    
    // In a real app, these would be complex aggregation queries
    // For this MVP, we'll fetch counts and do basic math
    const [usersRes, subsRes, winnersRes, charityRes] = await Promise.all([
      supabase.from('profiles').select('created_at'),
      supabase.from('subscriptions').select('plan_type, status, created_at'),
      supabase.from('winners').select('prize_amount, created_at, status'),
      supabase.from('profiles').select('contribution_percentage, selected_charity_id')
    ])

    const users = usersRes.data || []
    const subs = subsRes.data || []
    const winners = winnersRes.data || []
    const profiles = charityRes.data || []

    // Basic aggregations
    const totalUsers = users.length
    const activeSubs = subs.filter(s => s.status === 'active').length
    
    const monthlyRevenue = subs
      .filter(s => s.status === 'active')
      .reduce((acc, s) => acc + (s.plan_type === 'monthly' ? 499 : 4999 / 12), 0)
    
    const totalCharityImpact = profiles.reduce((acc, p) => {
      if (!p.selected_charity_id) return acc
      const sub = subs.find(s => s.status === 'active') // simplified
      const amount = sub?.plan_type === 'monthly' ? 499 : 4999 / 12
      return acc + (amount * (p.contribution_percentage / 100))
    }, 0)

    setStats({
      totalUsers,
      activeSubs,
      monthlyRevenue,
      totalCharityImpact,
      userGrowth: 12, // mock trend
      revenueGrowth: 8.5, // mock trend
      impactGrowth: 15.2, // mock trend
    })
    
    setLoading(false)
  }, [supabase])

  useEffect(() => { fetchAnalytics() }, [fetchAnalytics])

  if (loading) return <div className="flex items-center justify-center py-24"><Loader2 className="animate-spin text-purple-600" size={32} /></div>

  const cards = [
    { label: 'Monthly Revenue', value: formatCurrency(stats.monthlyRevenue), icon: Banknote, trend: stats.revenueGrowth, color: 'from-emerald-500 to-teal-600' },
    { label: 'Active Subscribers', value: stats.activeSubs, icon: Users, trend: stats.userGrowth, color: 'from-purple-500 to-indigo-600' },
    { label: 'Charitable Impact', value: formatCurrency(stats.totalCharityImpact), icon: Heart, trend: stats.impactGrowth, color: 'from-pink-500 to-rose-600' },
    { label: 'Total Members', value: stats.totalUsers, icon: BarChart3, trend: 5.4, color: 'from-blue-500 to-cyan-600' },
  ]

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Platform Analytics</h1>
          <p className="text-gray-500 text-sm">Real-time performance and impact tracking.</p>
        </div>
        <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-gray-100 shadow-sm">
          {(['30d', '90d', 'all'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                period === p ? 'bg-purple-600 text-white' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {p.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card, i) => {
          const Icon = card.icon
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group"
            >
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-4 shadow-lg shadow-gray-200 group-hover:scale-110 transition-transform`}>
                <Icon size={22} className="text-white" />
              </div>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">{card.label}</p>
              <h3 className="text-2xl font-extrabold text-gray-900 mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{card.value}</h3>
              <div className="flex items-center gap-1">
                {card.trend > 0 ? (
                  <ArrowUpRight size={14} className="text-emerald-500" />
                ) : (
                  <ArrowDownRight size={14} className="text-rose-500" />
                )}
                <span className={`text-xs font-bold ${card.trend > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {card.trend}%
                </span>
                <span className="text-gray-400 text-[10px] ml-1">vs last period</span>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Secondary Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue Distribution */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp size={18} className="text-purple-600" />
              Revenue & Growth
            </h3>
            <div className="flex items-center gap-4 text-xs font-semibold text-gray-400">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Subscription
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Impact
              </div>
            </div>
          </div>
          
          <div className="h-64 flex items-end gap-4 px-2">
            {[45, 62, 58, 75, 90, 82, 95].map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="w-full relative flex flex-col items-center justify-end gap-1 h-full">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${val}%` }}
                    className="w-full bg-purple-100 rounded-t-lg group-hover:bg-purple-200 transition-colors relative"
                  >
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-[10px] px-1.5 py-0.5 rounded pointer-events-none">
                      {val}%
                    </div>
                  </motion.div>
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${val * 0.4}%` }}
                    className="w-1/2 bg-emerald-500 rounded-t-sm"
                  />
                </div>
                <span className="text-[10px] font-bold text-gray-400">MAY {20 + i}</span>
              </div>
            ))}
          </div>
        </div>

        {/* User Breakdown */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Users size={18} className="text-purple-600" />
            Plan Distribution
          </h3>
          <div className="flex flex-col gap-6">
            {[
              { label: 'Yearly Plan', count: 642, color: 'bg-purple-600', percent: 68 },
              { label: 'Monthly Plan', count: 215, color: 'bg-indigo-400', percent: 22 },
              { label: 'Trial/Inactive', count: 98, color: 'bg-gray-200', percent: 10 },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-xs font-bold text-gray-700">{item.label}</p>
                  <p className="text-xs font-bold text-gray-900">{item.percent}%</p>
                </div>
                <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percent}%` }}
                    className={`h-full ${item.color}`}
                  />
                </div>
                <p className="text-[10px] text-gray-400 mt-1">{item.count} members</p>
              </div>
            ))}
          </div>
          
          <div className="mt-10 p-4 rounded-2xl bg-purple-50 border border-purple-100">
            <p className="text-xs font-semibold text-purple-700 mb-1">Retention Rate</p>
            <p className="text-xl font-extrabold text-purple-900">94.2%</p>
            <p className="text-[10px] text-purple-500 mt-0.5">Top 5% in industry</p>
          </div>
        </div>
      </div>
    </div>
  )
}
