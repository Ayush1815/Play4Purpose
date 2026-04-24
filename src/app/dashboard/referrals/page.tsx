'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Share2, Copy, Check, Users, Gift, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function ReferralsPage() {
  const [profile, setProfile] = useState<any>(null)
  const [referralCount, setReferralCount] = useState(0)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const [profileRes, referralsRes] = await Promise.all([
        supabase.from('profiles').select('referral_code').eq('id', user.id).single(),
        supabase.from('profiles').select('id', { count: 'exact' }).eq('referred_by', user.id)
      ])

      setProfile(profileRes.data)
      setReferralCount(referralsRes.count || 0)
      setLoading(false)
    }
    fetchData()
  }, [supabase])

  const referralLink = typeof window !== 'undefined' 
    ? `${window.location.origin}/signup?ref=${profile?.referral_code}`
    : ''

  function copyToClipboard() {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) return <div className="flex items-center justify-center py-24"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div></div>

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Refer & Earn Impact</h1>
        <p className="text-gray-500 text-sm">Invite fellow golfers and grow the community of purpose.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Main Referral Card */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-50 rounded-full -translate-y-32 translate-x-32 blur-3xl opacity-50" />
            
            <div className="relative z-10">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Your Referral Link</h2>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                Share this link with your friends. When they sign up using your link, they'll join your impact circle.
              </p>

              <div className="flex items-center gap-2 p-1.5 bg-gray-50 rounded-2xl border border-gray-100 mb-8">
                <div className="flex-1 px-4 text-xs font-mono text-gray-500 truncate">
                  {referralLink}
                </div>
                <button 
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 bg-white text-purple-600 font-bold px-4 py-2.5 rounded-xl text-xs hover:bg-purple-50 transition-all border border-purple-100"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-2 bg-[#1877F2] text-white py-3 rounded-xl text-sm font-bold hover:opacity-90 transition-all">
                  Facebook
                </button>
                <button className="flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 rounded-xl text-sm font-bold hover:opacity-90 transition-all">
                  WhatsApp
                </button>
              </div>
            </div>
          </div>

          {/* How it works */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-6">How Referrals Work</h3>
            <div className="space-y-6">
              {[
                { icon: Share2, title: 'Share your link', desc: 'Send your unique referral link to other golfers.' },
                { icon: Users, title: 'They join Play4Purpose', desc: 'Friends sign up and choose their favorite charity.' },
                { icon: Gift, title: 'Multiply your impact', desc: 'For every friend who subscribes, we boost your monthly impact stats.' }
              ].map((step, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 flex-shrink-0">
                    <step.icon size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{step.title}</h4>
                    <p className="text-gray-500 text-xs mt-0.5">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-3xl p-6 text-white shadow-lg">
            <p className="text-white/70 text-xs font-bold uppercase tracking-wider mb-1">Total Referrals</p>
            <h3 className="text-4xl font-extrabold mb-4">{referralCount}</h3>
            <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((referralCount / 5) * 100, 100)}%` }}
                className="h-full bg-white"
              />
            </div>
            <p className="text-white/60 text-[10px] mt-2 font-medium">
              {referralCount < 5 ? `${5 - referralCount} more to unlock 'Ambassador' badge` : 'You are a Purpose Ambassador!'}
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <h4 className="font-bold text-gray-900 text-sm mb-4">Milestones</h4>
            <div className="space-y-4">
              {[
                { label: 'First Referral', reward: 'Impact Badge', target: 1 },
                { label: '5 Referrals', reward: 'Custom Avatar', target: 5 },
                { label: '10 Referrals', reward: 'Elite Status', target: 10 }
              ].map((m) => (
                <div key={m.label} className={`flex items-center justify-between ${referralCount >= m.target ? 'opacity-100' : 'opacity-40'}`}>
                  <div>
                    <p className="text-xs font-bold text-gray-800">{m.label}</p>
                    <p className="text-[10px] text-gray-500">{m.reward}</p>
                  </div>
                  {referralCount >= m.target ? (
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <Check size={12} strokeWidth={3} />
                    </div>
                  ) : (
                    <div className="text-[10px] font-bold text-gray-400">{referralCount}/{m.target}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
