'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Heart, Check, Loader2, Leaf, BookOpen, Stethoscope, PawPrint, ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Charity } from '@/types'

const categoryIcons: Record<string, React.ElementType> = {
  environment: Leaf, education: BookOpen, health: Stethoscope, animals: PawPrint,
}
const categoryColors: Record<string, string> = {
  environment: 'from-emerald-400 to-teal-500',
  education: 'from-blue-400 to-indigo-500',
  health: 'from-rose-400 to-pink-500',
  animals: 'from-amber-400 to-orange-500',
  other: 'from-purple-400 to-violet-500',
}
const categoryBg: Record<string, string> = {
  environment: 'bg-emerald-50', education: 'bg-blue-50', health: 'bg-rose-50',
  animals: 'bg-amber-50', other: 'bg-purple-50',
}

export default function CharityPage() {
  const [charities, setCharities] = useState<Charity[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [contribution, setContribution] = useState(10)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const supabase = createClient()

  const fetchData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const [{ data: charityList }, { data: profile }] = await Promise.all([
      supabase.from('charities').select('*').order('name'),
      supabase.from('profiles').select('selected_charity_id, contribution_percentage').eq('id', user.id).single(),
    ])
    setCharities(charityList || [])
    setSelectedId(profile?.selected_charity_id || null)
    setContribution(profile?.contribution_percentage || 10)
    setLoading(false)
  }, [supabase])

  useEffect(() => { fetchData() }, [fetchData])

  async function handleSave() {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('profiles').update({
      selected_charity_id: selectedId,
      contribution_percentage: contribution,
    }).eq('id', user.id)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
    setSaving(false)
  }

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <Loader2 className="animate-spin text-purple-500" size={32} />
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Choose Your Charity
        </h2>
        <p className="text-gray-500 text-sm">Select one charity and set how much of your subscription goes to them each month.</p>
      </div>

      {/* Charity grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {charities.map((charity, index) => {
          const Icon = categoryIcons[charity.category] || Heart
          const isSelected = selectedId === charity.id
          return (
            <motion.button
              key={charity.id}
              id={`charity-select-${charity.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              onClick={() => setSelectedId(charity.id)}
              className={`text-left rounded-2xl p-5 border-2 transition-all hover-card w-full ${
                isSelected ? 'border-purple-500 bg-purple-50/50 shadow-md shadow-purple-100' : 'border-gray-200 bg-white hover:border-purple-200'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${categoryColors[charity.category] || categoryColors.other} flex items-center justify-center shadow-md`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                    <Check size={12} className="text-white" strokeWidth={3} />
                  </div>
                )}
              </div>
              <h3 className="font-bold text-gray-900 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {charity.name}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-3">{charity.description}</p>
              {charity.impact_stat && (
                <div className="flex items-center gap-1.5">
                  <Heart className="w-3 h-3 text-pink-500" fill="currentColor" />
                  <span className="text-xs font-semibold text-gray-600">{charity.impact_stat}</span>
                </div>
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Contribution slider */}
      {selectedId && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Contribution Percentage
            </h3>
            <span className="text-2xl font-extrabold text-purple-600">{contribution}%</span>
          </div>
          <input
            id="contribution-slider"
            type="range" min={10} max={50} step={5}
            value={contribution}
            onChange={(e) => setContribution(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-purple-600 mb-3"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>Min 10%</span><span>Max 50%</span>
          </div>
          <p className="text-gray-500 text-sm mt-3">
            <span className="font-semibold text-purple-700">{contribution}%</span> of your monthly subscription will go directly to your chosen charity.
          </p>
        </motion.div>
      )}

      {/* Save button */}
      <div className="flex items-center gap-4">
        <button
          id="save-charity-btn"
          onClick={handleSave}
          disabled={!selectedId || saving}
          className="btn-primary py-3 px-8 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <ChevronRight size={16} />}
          {saving ? 'Saving...' : 'Save Selection'}
        </button>
        {saved && <span className="text-emerald-600 text-sm font-semibold flex items-center gap-1"><Check size={14} /> Saved!</span>}
      </div>
    </div>
  )
}
