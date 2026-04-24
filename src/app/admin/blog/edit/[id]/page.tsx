import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import BlogEditor from '@/components/admin/BlogEditor'

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single()

  if (!post) notFound()

  return (
    <div className="py-8">
      <div className="mb-8 px-4 md:px-0">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Edit Post</h1>
        <p className="text-gray-500 text-sm">Update your existing content.</p>
      </div>
      <BlogEditor initialData={post} isEditing={true} />
    </div>
  )
}
