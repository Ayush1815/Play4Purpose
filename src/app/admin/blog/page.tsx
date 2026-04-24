'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Plus, Search, Loader2, Check, AlertCircle, X, Pencil, Trash2, Eye, Calendar, User, Zap } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const supabase = createClient()

  const fetchPosts = useCallback(async () => {
    const { data } = await supabase
      .from('posts')
      .select('*, profiles(full_name)')
      .order('created_at', { ascending: false })
    setPosts(data || [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { fetchPosts() }, [fetchPosts])

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this post?')) return
    setDeleting(id)
    const { error } = await supabase.from('posts').delete().eq('id', id)
    if (error) {
      setError(error.message)
    } else {
      setSuccess('Post deleted!')
      fetchPosts()
    }
    setDeleting(null)
    setTimeout(() => setSuccess(''), 3000)
  }

  async function toggleStatus(id: string, currentStatus: string) {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published'
    const publishedAt = newStatus === 'published' ? new Date().toISOString() : null
    
    const { error } = await supabase
      .from('posts')
      .update({ status: newStatus, published_at: publishedAt })
      .eq('id', id)
    
    if (error) {
      setError(error.message)
    } else {
      setSuccess(`Post ${newStatus}!`)
      fetchPosts()
    }
    setTimeout(() => setSuccess(''), 3000)
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Blog Management</h1>
          <p className="text-gray-500 text-sm">Create and manage content for your community.</p>
        </div>
        <Link 
          href="/admin/blog/new"
          className="btn-primary py-2.5 px-5 text-sm flex items-center gap-2"
        >
          <Plus size={16} /> New Post
        </Link>
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
        <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100 font-bold text-xs text-gray-400 uppercase tracking-wider">
          <p className="col-span-5">Post Details</p>
          <p className="col-span-2">Category</p>
          <p className="col-span-2">Status</p>
          <p className="col-span-3 text-right">Actions</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="animate-spin text-purple-600" size={32} />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No posts found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {posts.map((post) => (
              <div key={post.id} className="grid grid-cols-12 gap-4 px-6 py-5 hover:bg-gray-50/50 transition-colors items-center">
                <div className="col-span-5">
                  <p className="text-gray-900 font-bold text-sm truncate" title={post.title}>{post.title}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-gray-400 text-[10px] flex items-center gap-1"><Calendar size={10} /> {formatDate(post.created_at)}</span>
                    <span className="text-gray-400 text-[10px] flex items-center gap-1"><User size={10} /> {post.profiles?.full_name || 'Admin'}</span>
                  </div>
                </div>
                <div className="col-span-2">
                  <span className="text-[10px] font-bold text-purple-600 uppercase tracking-widest">{post.category}</span>
                </div>
                <div className="col-span-2">
                  <button 
                    onClick={() => toggleStatus(post.id, post.status)}
                    className={`text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full transition-all ${
                      post.status === 'published' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                    }`}
                  >
                    {post.status}
                  </button>
                </div>
                <div className="col-span-3 flex justify-end gap-2">
                  <Link 
                    href={`/blog/${post.slug}`} target="_blank"
                    className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-purple-100 hover:text-purple-600 transition-all"
                  >
                    <Eye size={14} />
                  </Link>
                  <Link 
                    href={`/admin/blog/edit/${post.id}`}
                    className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-purple-100 hover:text-purple-600 transition-all"
                  >
                    <Pencil size={14} />
                  </Link>
                  <button 
                    onClick={() => handleDelete(post.id)}
                    disabled={deleting === post.id}
                    className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all"
                  >
                    {deleting === post.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
