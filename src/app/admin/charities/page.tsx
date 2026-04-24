'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Plus, Search, Loader2, Check, AlertCircle, X, Pencil, Trash2, Leaf, BookOpen, Stethoscope, PawPrint } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Charity } from '@/types'

const categoryIcons: Record<string, React.ElementType> = {
  environment: Leaf, education: BookOpen, health: Stethoscope, animals: PawPrint, other: Heart
}

export default function AdminCharitiesPage() {
  const [charities, setCharities] = useState<Charity[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCharity, setEditingCharity] = useState<Charity | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [form, setForm] = useState({
    name: '',
    description: '',
    category: 'other' as Charity['category'],
    impact_stat: ''
  })

  const supabase = createClient()

  const fetchCharities = useCallback(async () => {
    const { data } = await supabase.from('charities').select('*').order('name')
    setCharities(data || [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { fetchCharities() }, [fetchCharities])

  function resetForm() {
    setForm({ name: '', description: '', category: 'other', impact_stat: '' })
    setEditingCharity(null)
    setShowModal(false)
    setError('')
  }

  function startEdit(charity: Charity) {
    setEditingCharity(charity)
    setForm({
      name: charity.name,
      description: charity.description,
      category: charity.category,
      impact_stat: charity.impact_stat || ''
    })
    setShowModal(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')

    const charityData = {
      name: form.name,
      description: form.description,
      category: form.category,
      impact_stat: form.impact_stat || null
    }

    let error
    if (editingCharity) {
      const { error: updateError } = await supabase
        .from('charities')
        .update(charityData)
        .eq('id', editingCharity.id)
      error = updateError
    } else {
      const { error: insertError } = await supabase
        .from('charities')
        .insert(charityData)
      error = insertError
    }

    if (error) {
      setError(error.message)
    } else {
      setSuccess(editingCharity ? 'Charity updated!' : 'Charity added!')
      fetchCharities()
      resetForm()
    }
    setSaving(false)
    setTimeout(() => setSuccess(''), 3000)
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this charity?')) return
    const { error } = await supabase.from('charities').delete().eq('id', id)
    if (error) setError(error.message)
    else fetchCharities()
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Charity Management</h1>
          <p className="text-gray-500 text-sm">Add and manage charities available for subscribers.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="btn-primary py-2.5 px-5 text-sm flex items-center gap-2"
        >
          <Plus size={16} /> Add Charity
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex items-center justify-center py-24">
            <Loader2 className="animate-spin text-purple-600" size={32} />
          </div>
        ) : charities.length === 0 ? (
          <div className="col-span-full text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <Heart className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No charities found</p>
          </div>
        ) : (
          charities.map((charity) => {
            const Icon = categoryIcons[charity.category] || Heart
            return (
              <motion.div 
                key={charity.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                    <Icon size={20} />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(charity)} className="text-gray-400 hover:text-purple-600 p-1 transition-colors"><Pencil size={16} /></button>
                    <button onClick={() => handleDelete(charity.id)} className="text-gray-400 hover:text-red-500 p-1 transition-colors"><Trash2 size={16} /></button>
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 mb-2 truncate" title={charity.name}>{charity.name}</h3>
                <p className="text-gray-500 text-xs leading-relaxed line-clamp-3 mb-4 flex-grow">{charity.description}</p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                  <span className="text-[10px] font-bold text-purple-600 uppercase tracking-widest">{charity.category}</span>
                  {charity.impact_stat && (
                    <span className="text-[10px] font-semibold text-gray-400">{charity.impact_stat}</span>
                  )}
                </div>
              </motion.div>
            )
          })
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={resetForm} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl border border-white/20"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-extrabold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {editingCharity ? 'Edit Charity' : 'New Charity'}
                </h3>
                <button onClick={resetForm} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Name</label>
                  <input 
                    type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 text-sm outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Category</label>
                  <select 
                    value={form.category} onChange={e => setForm({...form, category: e.target.value as any})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 text-sm outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  >
                    <option value="environment">Environment</option>
                    <option value="education">Education</option>
                    <option value="health">Health</option>
                    <option value="animals">Animals</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Description</label>
                  <textarea 
                    rows={3} required value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 text-sm outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Impact Stat (Optional)</label>
                  <input 
                    type="text" value={form.impact_stat} onChange={e => setForm({...form, impact_stat: e.target.value})}
                    placeholder="e.g. 1000+ trees planted"
                    className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 text-sm outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  />
                </div>
                <button type="submit" disabled={saving} className="btn-primary py-3 w-full mt-2">
                  {saving ? <Loader2 size={16} className="animate-spin" /> : editingCharity ? 'Update Charity' : 'Add Charity'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
