'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Heart, Medal, TrendingUp, Users, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { getScoreColor } from '@/lib/utils'

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<'scores' | 'charities'>('scores')
  const [scoreLeaders, setScoreLeaders] = useState<any[]>([])
  const [charityLeaders, setCharityLeaders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  const fetchData = useCallback(async () => {
    setLoading(true)
    
    // Fetch top scores of current month
    const now = new Date()
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    
    const { data: scores } = await supabase
      .from('scores')
      .select('score, score_date, profiles(full_name)')
      .gte('score_date', firstDay)
      .order('score', { ascending: false })
      .limit(10)

    // Fetch top charities by profile count
    const { data: charities } = await supabase
      .from('charities')
      .select('id, name, category, profiles(count)')
      .order('name')

    // Since Supabase count in select is tricky for groups, we'll fetch profile counts per charity
    const { data: counts } = await supabase
      .from('profiles')
      .select('selected_charity_id')
    
    const charityCounts: Record<string, number> = {}
    counts?.forEach(p => {
      if (p.selected_charity_id) {
        charityCounts[p.selected_charity_id] = (charityCounts[p.selected_charity_id] || 0) + 1
      }
    })

    const formattedCharities = (charities || [])
      .map(c => ({ ...c, count: charityCounts[c.id] || 0 }))
      .sort((a, b) => b.count - a.count)

    setScoreLeaders(scores || [])
    setCharityLeaders(formattedCharities)
    setLoading(false)
  }, [supabase])

  useEffect(() => { fetchData() }, [fetchData])

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Community Leaderboards</h1>
          <p className="text-gray-500 text-sm">Celebrating top players and impactful charities.</p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('scores')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'scores' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500'}`}
          >
            Top Scores
          </button>
          <button 
            onClick={() => setActiveTab('charities')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'charities' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500'}`}
          >
            Top Charities
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24"><Loader2 className="animate-spin text-purple-600" size={32} /></div>
      ) : activeTab === 'scores' ? (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="grid grid-cols-12 gap-4 px-8 py-4 bg-gray-50 border-b border-gray-100">
            <p className="col-span-1 text-xs font-bold text-gray-400 uppercase tracking-widest">Rank</p>
            <p className="col-span-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Golfer</p>
            <p className="col-span-3 text-xs font-bold text-gray-400 uppercase tracking-widest">Score</p>
            <p className="col-span-2 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Date</p>
          </div>
          <div className="divide-y divide-gray-50">
            {scoreLeaders.length === 0 ? (
              <div className="py-16 text-center text-gray-400 text-sm">No scores submitted this month yet.</div>
            ) : scoreLeaders.map((s, i) => (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                key={i} 
                className="grid grid-cols-12 gap-4 px-8 py-5 items-center hover:bg-gray-50/50 transition-colors"
              >
                <div className="col-span-1">
                  {i < 3 ? (
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-sm ${
                      i === 0 ? 'bg-yellow-100 text-yellow-700' : 
                      i === 1 ? 'bg-gray-200 text-gray-700' : 
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {i + 1}
                    </div>
                  ) : (
                    <span className="text-gray-400 font-bold ml-2 text-sm">{i + 1}</span>
                  )}
                </div>
                <div className="col-span-6 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-white text-[10px] font-bold">
                    {s.profiles?.full_name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <p className="text-gray-900 font-bold text-sm">{s.profiles?.full_name || 'Anonymous'}</p>
                </div>
                <div className="col-span-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getScoreColor(s.score)}`}>
                    {s.score}
                  </span>
                </div>
                <div className="col-span-2 text-right">
                  <p className="text-gray-400 text-[10px] font-medium">{new Date(s.score_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {charityLeaders.map((c, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={c.id} 
              className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-5 group hover:shadow-md transition-all"
            >
              <div className="w-16 h-16 rounded-2xl bg-purple-50 flex flex-col items-center justify-center text-purple-600 flex-shrink-0 group-hover:scale-110 transition-transform">
                <Users size={20} />
                <span className="text-xs font-bold mt-1">{c.count}</span>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold text-purple-600 uppercase tracking-widest">{c.category}</span>
                  {i === 0 && <span className="bg-yellow-100 text-yellow-700 text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><Medal size={10} /> Most Supported</span>}
                </div>
                <h3 className="font-bold text-gray-900 text-lg truncate">{c.name}</h3>
                <p className="text-gray-400 text-xs">Supported by {c.count} golfers</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Hero Stats Section */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-purple-600 rounded-3xl p-6 text-white shadow-xl shadow-purple-100">
          <TrendingUp className="mb-4 text-purple-200" size={24} />
          <p className="text-purple-200 text-xs font-bold uppercase tracking-wider mb-1">Total Scores Shared</p>
          <h3 className="text-3xl font-extrabold">2,451</h3>
          <p className="text-purple-300 text-[10px] mt-2">+12% from last month</p>
        </div>
        <div className="bg-[#1E1B4B] rounded-3xl p-6 text-white">
          <Heart className="mb-4 text-pink-400" size={24} />
          <p className="text-white/50 text-xs font-bold uppercase tracking-wider mb-1">Community Impact</p>
          <h3 className="text-3xl font-extrabold">₹1.2L</h3>
          <p className="text-white/30 text-[10px] mt-2">Raised this month alone</p>
        </div>
        <div className="bg-emerald-600 rounded-3xl p-6 text-white">
          <Trophy className="mb-4 text-emerald-200" size={24} />
          <p className="text-emerald-200 text-xs font-bold uppercase tracking-wider mb-1">Winners Announced</p>
          <h3 className="text-3xl font-extrabold">124</h3>
          <p className="text-emerald-300 text-[10px] mt-2">₹4.5L total prizes paid</p>
        </div>
      </div>
    </div>
  )
}
