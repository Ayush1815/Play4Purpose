'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, ClipboardList, Loader2, X, Check } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatDate, getScoreColor, validateScore } from '@/lib/utils'
import type { Score } from '@/types'

export default function ScoresPage() {
  const [scores, setScores] = useState<Score[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingScore, setEditingScore] = useState<Score | null>(null)
  const [form, setForm] = useState({ score: '', score_date: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const supabase = createClient()

  const fetchScores = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase
      .from('scores')
      .select('*')
      .eq('user_id', user.id)
      .order('score_date', { ascending: false })
    setScores(data || [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { fetchScores() }, [fetchScores])

  function resetForm() {
    setForm({ score: '', score_date: '' })
    setEditingScore(null)
    setShowForm(false)
    setError('')
  }

  function startEdit(score: Score) {
    setEditingScore(score)
    setForm({ score: String(score.score), score_date: score.score_date })
    setShowForm(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    const scoreNum = parseInt(form.score)
    if (!validateScore(scoreNum)) {
      setError('Score must be a whole number between 1 and 45.')
      setSubmitting(false)
      return
    }
    if (!form.score_date) {
      setError('Please select a date.')
      setSubmitting(false)
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    if (editingScore) {
      // Edit existing score
      const { error: updateError } = await supabase
        .from('scores')
        .update({ score: scoreNum, score_date: form.score_date })
        .eq('id', editingScore.id)
        .eq('user_id', user.id)
      if (updateError) {
        setError(updateError.message.includes('unique') ? 'A score for this date already exists.' : updateError.message)
        setSubmitting(false)
        return
      }
    } else {
      // Check if date already has a score
      const { data: existing } = await supabase
        .from('scores')
        .select('id')
        .eq('user_id', user.id)
        .eq('score_date', form.score_date)
        .single()

      if (existing) {
        setError('A score for this date already exists. Please edit the existing entry.')
        setSubmitting(false)
        return
      }

      // PRD REQUIREMENT: Last 5 scores only. Replace oldest if adding a 6th.
      if (scores.length >= 5) {
        const oldestScore = scores[scores.length - 1] // Assuming scores are sorted by score_date desc
        await supabase
          .from('scores')
          .delete()
          .eq('id', oldestScore.id)
          .eq('user_id', user.id)
      }

      const { error: insertError } = await supabase
        .from('scores')
        .insert({ user_id: user.id, score: scoreNum, score_date: form.score_date })

      if (insertError) {
        setError(insertError.message)
        setSubmitting(false)
        return
      }
    }

    setSuccess(editingScore ? 'Score updated!' : 'Score added!')
    
    // Automatically enter the user into the upcoming draw if not already entered
    try {
      const { data: upcomingDraw } = await supabase
        .from('draws')
        .select('id')
        .eq('status', 'upcoming')
        .order('created_at', { ascending: true })
        .limit(1)
        .maybeSingle()

      if (upcomingDraw) {
        await supabase.from('draw_participations').upsert({
          user_id: user.id,
          draw_id: upcomingDraw.id
        }, { onConflict: 'user_id, draw_id' })
      }
    } catch (e) {
      console.error('Failed to enter draw:', e)
    }

    setTimeout(() => setSuccess(''), 3000)
    resetForm()
    fetchScores()
    setSubmitting(false)
  }

  async function handleDelete(id: string) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('scores').delete().eq('id', id).eq('user_id', user.id)
    fetchScores()
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            My Scores
          </h2>
          <p className="text-gray-500 text-sm">Track your last 5 golf scores. Oldest auto-removed when you add a 6th.</p>
        </div>
        {!showForm && (
          <button
            id="add-score-btn"
            onClick={() => setShowForm(true)}
            className="btn-primary py-2.5 px-5 text-sm"
          >
            <Plus size={16} /> Add Score
          </button>
        )}
      </div>

      {/* Score limit indicator */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-6 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          <span className="font-bold text-purple-700">{scores.length}</span> / 5 scores submitted
        </p>
        <div className="flex gap-1.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={`w-8 h-2 rounded-full transition-colors ${i < scores.length ? 'bg-purple-500' : 'bg-gray-200'}`} />
          ))}
        </div>
      </div>

      {/* Success message */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl p-4 mb-4 text-sm"
          >
            <Check size={16} /> {success}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add/Edit form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-2xl p-6 border-2 border-purple-200 shadow-sm mb-6"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {editingScore ? 'Edit Score' : 'Add New Score'}
              </h3>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 mb-4 text-sm">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="score-input" className="block text-sm font-semibold text-gray-700 mb-2">
                    Score (1–45)
                  </label>
                  <input
                    id="score-input"
                    type="number" min={1} max={45} required
                    placeholder="e.g. 32"
                    value={form.score}
                    onChange={(e) => setForm({ ...form, score: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="score-date" className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                  <input
                    id="score-date"
                    type="date" required
                    max={today}
                    value={form.score_date}
                    onChange={(e) => setForm({ ...form, score_date: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  id="score-submit"
                  type="submit"
                  disabled={submitting}
                  className="btn-primary py-2.5 px-6 text-sm disabled:opacity-60"
                >
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : null}
                  {submitting ? 'Saving...' : editingScore ? 'Update Score' : 'Save Score'}
                </button>
                <button type="button" onClick={resetForm} className="btn-secondary py-2.5 px-5 text-sm">Cancel</button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scores list */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="animate-spin text-purple-500" size={28} />
          </div>
        ) : scores.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center mx-auto mb-4">
              <ClipboardList size={26} className="text-purple-400" />
            </div>
            <p className="text-gray-500 text-sm mb-1">No scores yet</p>
            <p className="text-gray-400 text-xs">Add your first golf score to get started</p>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-gray-100 bg-gray-50">
              <p className="col-span-1 text-xs font-semibold text-gray-400">#</p>
              <p className="col-span-5 text-xs font-semibold text-gray-400">DATE</p>
              <p className="col-span-3 text-xs font-semibold text-gray-400">SCORE</p>
              <p className="col-span-3 text-xs font-semibold text-gray-400 text-right">ACTIONS</p>
            </div>
            <AnimatePresence>
              {scores.map((score, index) => (
                <motion.div
                  key={score.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors items-center"
                >
                  <span className="col-span-1 text-gray-400 text-sm">{index + 1}</span>
                  <p className="col-span-5 text-gray-700 text-sm font-medium">{formatDate(score.score_date)}</p>
                  <div className="col-span-3">
                    <span className={`score-badge ${getScoreColor(score.score)}`}>{score.score}</span>
                  </div>
                  <div className="col-span-3 flex justify-end gap-2">
                    <button
                      id={`edit-score-${score.id}`}
                      onClick={() => startEdit(score)}
                      className="w-8 h-8 rounded-lg bg-purple-50 hover:bg-purple-100 flex items-center justify-center text-purple-600 transition-colors"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      id={`delete-score-${score.id}`}
                      onClick={() => handleDelete(score.id)}
                      className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500 transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Note */}
      <p className="text-xs text-gray-400 mt-4 text-center">
        Only one score per date is allowed. Existing entries can only be edited or deleted.
      </p>
    </div>
  )
}
