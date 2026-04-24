'use client'

import { useState, useEffect, useCallback } from 'react'
import { Gift, Upload, Loader2, Check, Trophy, Clock } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatDate } from '@/lib/utils'

export default function WinningsPage() {
  const [winnings, setWinnings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [uploadingId, setUploadingId] = useState<string | null>(null)
  const supabase = createClient()

  const fetchWinnings = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase
      .from('winners')
      .select('*, draws(month)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    setWinnings(data || [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { fetchWinnings() }, [fetchWinnings])

  async function handleProofUpload(winnerId: string, file: File) {
    setUploadingId(winnerId)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const path = `proof/${user.id}/${winnerId}-${file.name}`
    const { data: uploadData } = await supabase.storage.from('winner-proofs').upload(path, file, { upsert: true })
    if (uploadData) {
      const { data: urlData } = supabase.storage.from('winner-proofs').getPublicUrl(path)
      await supabase.from('winners').update({ proof_url: urlData.publicUrl, status: 'pending' }).eq('id', winnerId)
    }
    setUploadingId(null)
    fetchWinnings()
  }

  const totalWon = winnings.reduce((s, w) => s + (w.prize_amount || 0), 0)

  if (loading) return <div className="flex items-center justify-center py-24"><Loader2 className="animate-spin text-purple-500" size={32} /></div>

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>My Winnings</h2>
        <p className="text-gray-500 text-sm">Track your prize winnings and verification status.</p>
      </div>

      {/* Total card */}
      <div className="rounded-2xl p-6 text-white mb-6" style={{ background: 'linear-gradient(135deg, #7C3AED, #A855F7)' }}>
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="text-yellow-300" size={22} />
          <p className="text-white/70 text-sm font-semibold">TOTAL WINNINGS</p>
        </div>
        <p className="text-4xl font-extrabold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          ₹{totalWon.toLocaleString('en-IN')}
        </p>
        <p className="text-white/60 text-sm mt-1">{winnings.length} draw{winnings.length !== 1 ? 's' : ''} won</p>
      </div>

      {winnings.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center mx-auto mb-4">
            <Gift size={26} className="text-purple-400" />
          </div>
          <p className="text-gray-700 font-semibold mb-1">No winnings yet</p>
          <p className="text-gray-400 text-sm">Keep entering draws — your big win could be this month!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {winnings.map((w) => (
            <div key={w.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {w.draws?.month || 'Draw'}
                  </p>
                  <p className="text-gray-400 text-xs">{formatDate(w.created_at)}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    w.payment_status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {w.payment_status === 'paid' ? 'Paid' : 'Payment Pending'}
                  </span>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    w.status === 'verified' ? 'bg-emerald-100 text-emerald-700' :
                    w.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {w.status === 'verified' ? '✓ Verified' : w.status === 'rejected' ? '✗ Rejected' : '⏳ Under Review'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-gray-500 text-xs">Matched {w.match_count} numbers</p>
                  <p className="text-2xl font-extrabold text-gray-900">₹{w.prize_amount?.toLocaleString('en-IN')}</p>
                </div>
                <div className="flex gap-1">
                  {Array.from({ length: w.match_count || 0 }).map((_, i) => (
                    <div key={i} className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold">★</div>
                  ))}
                </div>
              </div>

              {/* Proof upload */}
              {w.status === 'pending' && !w.proof_url && (
                <div>
                  <p className="text-gray-600 text-sm mb-2 font-medium">Upload your score screenshot to claim:</p>
                  <label htmlFor={`proof-upload-${w.id}`} className="flex items-center gap-2 btn-secondary py-2 px-4 text-sm cursor-pointer w-fit">
                    {uploadingId === w.id ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                    {uploadingId === w.id ? 'Uploading...' : 'Upload Proof'}
                    <input
                      id={`proof-upload-${w.id}`}
                      type="file" accept="image/*" className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleProofUpload(w.id, e.target.files[0])}
                    />
                  </label>
                </div>
              )}
              {w.proof_url && (
                <div className="flex items-center gap-2 text-emerald-600 text-sm">
                  <Check size={14} /> Proof submitted — awaiting admin review
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
