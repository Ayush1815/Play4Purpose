'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Check, X, Eye, Loader2, AlertCircle, Search, ExternalLink, Filter, Ban, Banknote } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatDate } from '@/lib/utils'
import type { Winner } from '@/types'

export default function AdminWinnersPage() {
  const [winners, setWinners] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'pending' | 'verified' | 'paid'>('pending')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const supabase = createClient()

  const fetchWinners = useCallback(async () => {
    setLoading(true)
    let query = supabase
      .from('winners')
      .select('*, profiles(full_name), draws(month)')
      .order('created_at', { ascending: false })
    
    if (filter === 'pending') query = query.eq('status', 'pending')
    if (filter === 'verified') query = query.eq('status', 'verified')
    if (filter === 'paid') query = query.eq('payment_status', 'paid')

    const { data } = await query
    setWinners(data || [])
    setLoading(false)
  }, [supabase, filter])

  useEffect(() => { fetchWinners() }, [fetchWinners])

  async function handleUpdateStatus(id: string, status: 'verified' | 'rejected') {
    setProcessing(id)
    const { error } = await supabase
      .from('winners')
      .update({ status })
      .eq('id', id)

    if (error) {
      setError(error.message)
    } else {
      setSuccess(`Winner ${status}!`)
      fetchWinners()
    }
    setProcessing(null)
    setTimeout(() => setSuccess(''), 3000)
  }

  async function handleMarkAsPaid(id: string) {
    setProcessing(id)
    const { error } = await supabase
      .from('winners')
      .update({ payment_status: 'paid' })
      .eq('id', id)

    if (error) {
      setError(error.message)
    } else {
      setSuccess(`Marked as paid!`)
      fetchWinners()
    }
    setProcessing(null)
    setTimeout(() => setSuccess(''), 3000)
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Winner Verification</h1>
          <p className="text-gray-500 text-sm">Review proof and approve payouts.</p>
        </div>
        <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
          {(['pending', 'verified', 'paid', 'all'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filter === f ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl p-4 mb-6 text-sm flex items-center gap-2">
          <Check size={16} /> {success}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100">
          <p className="col-span-3 text-xs font-semibold text-gray-400 uppercase">Winner</p>
          <p className="col-span-2 text-xs font-semibold text-gray-400 uppercase">Draw</p>
          <p className="col-span-2 text-xs font-semibold text-gray-400 uppercase">Matches</p>
          <p className="col-span-2 text-xs font-semibold text-gray-400 uppercase">Prize</p>
          <p className="col-span-3 text-xs font-semibold text-gray-400 uppercase text-right">Verification</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="animate-spin text-purple-600" size={32} />
          </div>
        ) : winners.length === 0 ? (
          <div className="text-center py-16">
            <Filter className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No {filter !== 'all' ? filter : ''} winners found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {winners.map((winner) => (
              <div key={winner.id} className="grid grid-cols-12 gap-4 px-6 py-5 hover:bg-gray-50/50 transition-colors items-center">
                <div className="col-span-3">
                  <p className="text-gray-900 font-bold text-sm">{winner.profiles?.full_name || 'Anonymous'}</p>
                  <p className="text-gray-400 text-[10px] mt-0.5">{winner.user_id}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-700 text-xs font-medium">{winner.draws?.month}</p>
                </div>
                <div className="col-span-2 flex gap-0.5">
                  {Array.from({ length: winner.match_count }).map((_, i) => (
                    <Trophy key={i} size={12} className="text-amber-400" fill="currentColor" />
                  ))}
                  <span className="ml-1 text-xs font-bold text-gray-600">{winner.match_count}</span>
                </div>
                <div className="col-span-2">
                  <p className="text-purple-600 font-extrabold text-sm">₹{winner.prize_amount.toLocaleString('en-IN')}</p>
                  <span className={`text-[10px] font-bold ${winner.payment_status === 'paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {winner.payment_status === 'paid' ? 'PAID' : 'UNPAID'}
                  </span>
                </div>
                <div className="col-span-3 flex justify-end gap-2">
                  {winner.proof_url ? (
                    <a href={winner.proof_url} target="_blank" rel="noopener noreferrer" 
                      className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-purple-100 hover:text-purple-600 transition-all"
                      title="View Proof"
                    >
                      <Eye size={14} />
                    </a>
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-300" title="No Proof Uploaded">
                      <Eye size={14} />
                    </div>
                  )}

                  {winner.status === 'pending' && (
                    <>
                      <button 
                        onClick={() => handleUpdateStatus(winner.id, 'verified')}
                        disabled={processing === winner.id}
                        className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 disabled:opacity-50"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleUpdateStatus(winner.id, 'rejected')}
                        disabled={processing === winner.id}
                        className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-bold hover:bg-red-100 disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {winner.status === 'verified' && winner.payment_status === 'pending' && (
                    <button 
                      onClick={() => handleMarkAsPaid(winner.id)}
                      disabled={processing === winner.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 text-white rounded-lg text-xs font-bold hover:bg-purple-700 disabled:opacity-50"
                    >
                      <Banknote size={12} /> Pay Now
                    </button>
                  )}

                  {winner.status === 'rejected' && (
                    <span className="text-red-500 text-xs font-bold flex items-center gap-1"><Ban size={12} /> Rejected</span>
                  )}
                  
                  {winner.payment_status === 'paid' && (
                    <span className="text-emerald-600 text-xs font-bold flex items-center gap-1"><Check size={14} strokeWidth={3} /> Completed</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
