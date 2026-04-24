'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Plus, Search, Calendar, Hash, Loader2, Check, AlertCircle, X, ExternalLink, Zap } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatDate } from '@/lib/utils'
import type { Draw } from '@/types'

export default function AdminDrawsPage() {
  const [draws, setDraws] = useState<Draw[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [creating, setCreating] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    month: '',
    prize_pool: '50000',
    draw_type: 'random' as 'random' | 'algorithm',
    jackpot_rolled_over: false
  })

  const supabase = createClient()

  const fetchDraws = useCallback(async () => {
    const { data } = await supabase
      .from('draws')
      .select('*')
      .order('created_at', { ascending: false })
    setDraws(data || [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { fetchDraws() }, [fetchDraws])

  async function handleCreateDraw(e: React.FormEvent) {
    e.preventDefault()
    setCreating(true)
    setError('')

    const { error: insertError } = await supabase
      .from('draws')
      .insert({
        month: formData.month,
        prize_pool_amount: parseFloat(formData.prize_pool),
        draw_type: formData.draw_type,
        jackpot_rolled_over: formData.jackpot_rolled_over,
        status: 'upcoming'
      })

    if (insertError) {
      setError(insertError.message)
      setCreating(false)
      return
    }

    setSuccess('Draw created successfully!')
    setShowModal(false)
    fetchDraws()
    setCreating(false)
    setTimeout(() => setSuccess(''), 3000)
  }

  async function handleGenerateNumbers(drawId: string) {
    setLoading(true)
    // In a real app, this might be a more complex algorithm or random gen
    // We'll generate 5 unique numbers between 1-45
    const numbers: number[] = []
    while (numbers.length < 5) {
      const n = Math.floor(Math.random() * 45) + 1
      if (!numbers.includes(n)) numbers.push(n)
    }
    numbers.sort((a, b) => a - b)

    const { error } = await supabase
      .from('draws')
      .update({ 
        draw_numbers: numbers,
        status: 'published'
      })
      .eq('id', drawId)

    if (error) {
      setError(error.message)
    } else {
      setSuccess('Numbers generated and published!')
      fetchDraws()
    }
    setLoading(false)
    setTimeout(() => setSuccess(''), 3000)
  }

  async function handleProcessWinners(drawId: string) {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/draws/process-winners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ drawId }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setSuccess(`Winners processed! Found ${data.winnersCount} winners.`)
      fetchDraws()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
      setTimeout(() => setSuccess(''), 3000)
    }
  }

  const currentMonthYear = new Date().toLocaleString('en-IN', { month: 'long', year: 'numeric' })

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Draw Management</h1>
          <p className="text-gray-500 text-sm">Schedule and publish monthly results.</p>
        </div>
        <button 
          onClick={() => {
            setFormData({ ...formData, month: currentMonthYear })
            setShowModal(true)
          }}
          className="btn-primary py-2.5 px-5 text-sm flex items-center gap-2"
        >
          <Plus size={16} /> New Draw
        </button>
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

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100">
          <p className="col-span-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Month</p>
          <p className="col-span-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</p>
          <p className="col-span-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Numbers</p>
          <p className="col-span-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Pool</p>
          <p className="col-span-2 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Actions</p>
        </div>

        {loading && draws.length === 0 ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="animate-spin text-purple-600" size={32} />
          </div>
        ) : draws.length === 0 ? (
          <div className="text-center py-16">
            <Trophy className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No draws scheduled yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {draws.map((draw) => (
              <div key={draw.id} className="grid grid-cols-12 gap-4 px-6 py-5 hover:bg-gray-50/50 transition-colors items-center">
                <div className="col-span-3">
                  <p className="text-gray-900 font-bold text-sm">{draw.month}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{formatDate(draw.created_at)}</p>
                </div>
                <div className="col-span-2">
                  <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full ${
                    draw.status === 'published' ? 'bg-emerald-100 text-emerald-700' :
                    draw.status === 'completed' ? 'bg-gray-100 text-gray-500' :
                    'bg-amber-100 text-amber-700 shadow-sm shadow-amber-100'
                  }`}>
                    {draw.status}
                  </span>
                </div>
                <div className="col-span-3">
                  {draw.draw_numbers && draw.draw_numbers.length > 0 ? (
                    <div className="flex gap-1.5 flex-wrap">
                      {draw.draw_numbers.map((n, i) => (
                        <span key={i} className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center text-[11px] font-bold border border-purple-200/50">
                          {n}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-300 text-xs italic">Not yet drawn</span>
                  )}
                </div>
                <div className="col-span-2">
                  <p className="text-gray-700 font-semibold text-sm">₹{draw.prize_pool_amount.toLocaleString('en-IN')}</p>
                  {draw.jackpot_rolled_over && <span className="text-[10px] text-amber-600 font-bold">Rollover</span>}
                </div>
                <div className="col-span-2 flex justify-end">
                  {draw.status === 'upcoming' && (
                    <button 
                      onClick={() => handleGenerateNumbers(draw.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 text-white rounded-lg text-xs font-bold hover:bg-purple-700 transition-all shadow-sm shadow-purple-100"
                    >
                      <Zap size={12} fill="currentColor" /> Publish
                    </button>
                  )}
                  {draw.status === 'published' && (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleProcessWinners(draw.id)}
                        disabled={loading}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-all shadow-sm"
                      >
                        {loading ? <Loader2 size={12} className="animate-spin" /> : <Trophy size={12} />} Process
                      </button>
                      <button className="text-gray-400 hover:text-purple-600 transition-colors">
                        <ExternalLink size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl border border-white/20"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-extrabold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Create New Draw</h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 p-1"><X size={20} /></button>
              </div>

              <form onSubmit={handleCreateDraw} className="flex flex-col gap-5">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Month & Year</label>
                  <input 
                    type="text" required 
                    placeholder="e.g. May 2026"
                    value={formData.month}
                    onChange={e => setFormData({...formData, month: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Prize Pool (₹)</label>
                    <input 
                      type="number" required 
                      value={formData.prize_pool}
                      onChange={e => setFormData({...formData, prize_pool: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Type</label>
                    <select 
                      value={formData.draw_type}
                      onChange={e => setFormData({...formData, draw_type: e.target.value as any})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                    >
                      <option value="random">Random</option>
                      <option value="algorithm">Algorithm</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-3 py-2">
                  <input 
                    type="checkbox" id="rollover"
                    checked={formData.jackpot_rolled_over}
                    onChange={e => setFormData({...formData, jackpot_rolled_over: e.target.checked})}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500 border-gray-300"
                  />
                  <label htmlFor="rollover" className="text-sm text-gray-600">Jackpot rolled over from last month</label>
                </div>

                <button 
                  type="submit" 
                  disabled={creating}
                  className="btn-primary py-3 w-full mt-2"
                >
                  {creating ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                  {creating ? 'Creating...' : 'Schedule Draw'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
