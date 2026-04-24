import BlogEditor from '@/components/admin/BlogEditor'

export default function NewPostPage() {
  return (
    <div className="py-8">
      <div className="mb-8 px-4 md:px-0">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Create New Post</h1>
        <p className="text-gray-500 text-sm">Draft your next community update.</p>
      </div>
      <BlogEditor />
    </div>
  )
}
