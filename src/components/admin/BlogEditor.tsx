'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Save, ArrowLeft, Loader2, Image as ImageIcon, Link as LinkIcon, Type } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface BlogEditorProps {
  initialData?: any
  isEditing?: boolean
}

export default function BlogEditor({ initialData, isEditing = false }: BlogEditorProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    content: initialData?.content || '',
    excerpt: initialData?.excerpt || '',
    cover_image: initialData?.cover_image || '',
    category: initialData?.category || 'news',
    status: initialData?.status || 'draft'
  })

  const supabase = createClient()

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const postData = {
      ...form,
      author_id: user.id,
      published_at: form.status === 'published' ? new Date().toISOString() : null
    }

    let error
    if (isEditing) {
      const { error: updateError } = await supabase.from('posts').update(postData).eq('id', initialData.id)
      error = updateError
    } else {
      const { error: insertError } = await supabase.from('posts').insert(postData)
      error = insertError
    }

    if (error) {
      alert(error.message)
      setLoading(false)
    } else {
      router.push('/admin/blog')
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <Link href="/admin/blog" className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-purple-600 transition-colors">
          <ArrowLeft size={16} /> Back to Blog
        </Link>
        <div className="flex gap-3">
          <button 
            type="button"
            onClick={() => setForm({ ...form, status: 'draft' })}
            className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all ${
              form.status === 'draft' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
            }`}
          >
            Draft
          </button>
          <button 
            type="button"
            onClick={() => setForm({ ...form, status: 'published' })}
            className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all ${
              form.status === 'published' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-emerald-600 border-emerald-100 hover:border-emerald-200'
            }`}
          >
            Publish
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <div className="grid grid-cols-1 gap-6">
            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Post Title</label>
              <input 
                type="text" required placeholder="Enter an engaging title"
                value={form.title}
                onChange={(e) => {
                  const title = e.target.value
                  setForm({ ...form, title, slug: isEditing ? form.slug : generateSlug(title) })
                }}
                className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 text-xl font-bold focus:ring-2 focus:ring-purple-500 outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Slug */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Slug</label>
                <div className="relative">
                  <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                  <input 
                    type="text" required placeholder="post-url-slug"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: generateSlug(e.target.value) })}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-100 bg-gray-50 text-xs text-gray-500 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Category</label>
                <select 
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-5 py-3 rounded-xl border border-gray-100 bg-gray-50 text-xs font-bold text-[#1E1B4B] focus:ring-2 focus:ring-purple-500 outline-none transition-all appearance-none"
                >
                  <option value="news">News</option>
                  <option value="story">Winner Story</option>
                  <option value="charity">Charity Update</option>
                  <option value="draw">Draw Result</option>
                </select>
              </div>
            </div>

            {/* Cover Image */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Cover Image URL</label>
              <div className="relative">
                <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                <input 
                  type="url" placeholder="https://images.unsplash.com/..."
                  value={form.cover_image}
                  onChange={(e) => setForm({ ...form, cover_image: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-100 bg-gray-50 text-xs focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Short Excerpt</label>
              <textarea 
                rows={2} placeholder="A brief summary for the blog list page..."
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                className="w-full px-5 py-3 rounded-xl border border-gray-100 bg-gray-50 text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all resize-none"
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Full Content</label>
              <textarea 
                rows={12} required placeholder="Write your post content here..."
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="w-full px-6 py-6 rounded-2xl border border-gray-100 bg-gray-50 text-base leading-relaxed focus:ring-2 focus:ring-purple-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-50">
            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary py-4 w-full flex items-center justify-center gap-2 shadow-xl shadow-purple-100"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {loading ? 'Saving Post...' : isEditing ? 'Update Post' : 'Create Post'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
