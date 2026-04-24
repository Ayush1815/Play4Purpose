import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { Calendar, User, ArrowRight, BookOpen } from 'lucide-react'

export default async function BlogPage() {
  const supabase = await createClient()
  const { data: posts } = await supabase
    .from('posts')
    .select('*, profiles(full_name)')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  return (
    <>
      <Navbar />
      <main className="pt-32 pb-20">
        <div className="container-custom">
          {/* Header */}
          <div className="max-w-2xl mb-16">
            <h1 className="text-5xl font-extrabold text-[#1E1B4B] mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Our <span className="text-purple-600">Blog.</span>
            </h1>
            <p className="text-xl text-gray-500">
              Stay updated with the latest draw results, winner stories, and charity impact reports.
            </p>
          </div>

          {!posts || posts.length === 0 ? (
            <div className="text-center py-32 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-400 font-medium">No posts published yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post: any) => (
                <article key={post.id} className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all">
                  {/* Cover Image Placeholder */}
                  <div className="aspect-video bg-gradient-to-br from-purple-100 to-indigo-100 relative overflow-hidden">
                    {post.cover_image ? (
                      <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center opacity-30">
                         <BookOpen size={48} className="text-purple-500" />
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 backdrop-blur-sm text-purple-700 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={12} />
                        {formatDate(post.published_at || post.created_at)}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <User size={12} />
                        {post.profiles?.full_name || 'Admin'}
                      </div>
                    </div>
                    
                    <h2 className="text-xl font-bold text-[#1E1B4B] mb-3 group-hover:text-purple-600 transition-colors">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h2>
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-6">
                      {post.excerpt || post.content.substring(0, 150) + '...'}
                    </p>
                    
                    <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-2 text-sm font-bold text-purple-600 hover:gap-3 transition-all">
                      Read More <ArrowRight size={16} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
