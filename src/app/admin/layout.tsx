import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  
  if (profile?.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-6">Your role in the database is <strong>"{profile?.role || 'null'}"</strong>.</p>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full text-left">
          <p className="text-xs font-bold text-gray-400 uppercase mb-2">Debug Info</p>
          <p className="text-sm font-mono break-all bg-gray-50 p-3 rounded-lg mb-4">User ID: {user.id}</p>
          <p className="text-sm text-gray-500 mb-4 italic">Copy the User ID above and ensure it matches the ID in your Supabase 'profiles' table exactly.</p>
          <a href="/dashboard" className="block w-full btn-primary py-3 text-center">Return to Dashboard</a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  )
}
