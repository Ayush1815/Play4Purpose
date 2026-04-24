import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'
import { notFound } from 'next/navigation'
import { Calendar, User, ArrowLeft, Share2, MessageSquare, Briefcase } from 'lucide-react'
import Link from 'next/link'

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  
  const { data: post } = await supabase
    .from('posts')
    .select('*, profiles(full_name)')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!post) notFound()

  return (
    <>
      <Navbar />
      <main className="pt-32 pb-20">
        <article className="container-custom max-w-4xl">
          {/* Back link */}
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-purple-600 mb-8 transition-colors">
            <ArrowLeft size={16} /> Back to Blog
          </Link>

          {/* Post Header */}
          <header className="mb-12">
            <div className="flex items-center gap-4 mb-4 text-xs font-bold text-purple-600 uppercase tracking-widest">
              <span>{post.category}</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1E1B4B] mb-6 leading-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 border-y border-gray-100 py-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-white text-[10px] font-bold">
                  {post.profiles?.full_name?.[0] || 'A'}
                </div>
                <span className="font-bold text-[#1E1B4B]">{post.profiles?.full_name || 'Admin'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-gray-400" />
                {formatDate(post.published_at || post.created_at)}
              </div>
              <div className="ml-auto flex items-center gap-4">
                <span className="text-xs font-bold text-gray-400">SHARE:</span>
                <div className="flex gap-2">
                   <button className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-purple-50 hover:text-purple-600 transition-all"><Share2 size={14} /></button>
                   <button className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-purple-50 hover:text-purple-500 transition-all"><MessageSquare size={14} /></button>
                   <button className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-purple-50 hover:text-purple-700 transition-all"><Briefcase size={14} /></button>
                </div>
              </div>
            </div>
          </header>

          {/* Cover Image */}
          {post.cover_image && (
            <div className="rounded-3xl overflow-hidden mb-12 shadow-2xl">
              <img src={post.cover_image} alt={post.title} className="w-full h-auto" />
            </div>
          )}

          {/* Content */}
          <div className="prose prose-lg prose-purple max-w-none text-gray-600 leading-relaxed">
            {post.content.split('\n').map((para: string, i: number) => (
              para ? <p key={i}>{para}</p> : <br key={i} />
            ))}
          </div>

          {/* Bottom section */}
          <div className="mt-16 pt-16 border-t border-gray-100">
             <div className="bg-purple-50 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-xl font-bold text-purple-900 mb-2">Want more updates?</h3>
                  <p className="text-purple-700/70 text-sm">Join our newsletter to receive the latest stories and results.</p>
                </div>
                <Link href="/signup" className="btn-primary whitespace-nowrap">Join Play4Purpose</Link>
             </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  )
}
