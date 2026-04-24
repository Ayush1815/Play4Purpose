'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Shield, Calendar, Loader2, Check, AlertCircle, Save } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatDate } from '@/lib/utils'
import type { Profile } from '@/types'

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  
  const [fullName, setFullName] = useState('')

  const supabase = createClient()

  const fetchProfile = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    
    setEmail(user.email || '')
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    setProfile(data)
    setFullName(data?.full_name || '')
    setLoading(false)
  }, [supabase])

  useEffect(() => { fetchProfile() }, [fetchProfile])

  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ full_name: fullName })
      .eq('id', user.id)

    if (updateError) {
      setError(updateError.message)
    } else {
      setSuccess('Profile updated successfully!')
      setTimeout(() => setSuccess(''), 3000)
    }
    setSaving(false)
  }

  if (loading) return <div className="flex items-center justify-center py-24"><Loader2 className="animate-spin text-purple-600" size={32} /></div>

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>My Profile</h2>
        <p className="text-gray-500 text-sm">Manage your personal information and account security.</p>
      </div>

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl p-4 mb-6 text-sm flex items-center gap-2">
          <Check size={16} /> {success}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6 text-sm flex items-center gap-2">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-50">
            <div className="w-20 h-20 rounded-2xl gradient-bg flex items-center justify-center text-white text-3xl font-bold shadow-xl shadow-purple-200">
              {fullName?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{fullName || 'Unnamed User'}</h3>
              <p className="text-gray-500 text-sm">{email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full ${profile?.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                  {profile?.role}
                </span>
                <span className="text-[10px] text-gray-400 font-medium">Member since {formatDate(profile?.created_at || '')}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleUpdateProfile} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text" required value={fullName} onChange={e => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-100 bg-gray-50 text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                  <input 
                    type="email" disabled value={email}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-100 bg-gray-100 text-gray-400 text-sm cursor-not-allowed outline-none"
                  />
                </div>
                <p className="text-[10px] text-gray-400 mt-2 px-1">Email cannot be changed. Contact support for assistance.</p>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={saving}
              className="btn-primary py-4 w-full flex items-center justify-center gap-2 shadow-xl shadow-purple-100"
            >
              {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {saving ? 'Saving changes...' : 'Save Profile'}
            </button>
          </form>
        </div>

        {/* Account Info */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Shield size={18} className="text-purple-600" />
            Security & Account
          </h3>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="flex items-center gap-3">
                <Calendar size={18} className="text-gray-400" />
                <div>
                  <p className="text-sm font-bold text-gray-900">Account Created</p>
                  <p className="text-xs text-gray-500">{formatDate(profile?.created_at || '')}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100 opacity-60">
              <div className="flex items-center gap-3">
                <Shield size={18} className="text-gray-400" />
                <div>
                  <p className="text-sm font-bold text-gray-900">Password</p>
                  <p className="text-xs text-gray-500">Last changed 2 months ago</p>
                </div>
              </div>
              <button disabled className="text-xs font-bold text-purple-600 hover:underline cursor-not-allowed">Update</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
