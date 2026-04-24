import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'
import { Users } from 'lucide-react'

export default async function AdminUsersPage() {
  const supabase = await createClient()
  const { data: users } = await supabase
    .from('profiles')
    .select('*, subscriptions(plan_type, status), charities(name)')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>User Management</h1>
        <p className="text-gray-500 text-sm">{users?.length || 0} total users</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100">
          <p className="col-span-4 text-xs font-semibold text-gray-400">USER</p>
          <p className="col-span-2 text-xs font-semibold text-gray-400">ROLE</p>
          <p className="col-span-2 text-xs font-semibold text-gray-400">PLAN</p>
          <p className="col-span-2 text-xs font-semibold text-gray-400">CHARITY</p>
          <p className="col-span-2 text-xs font-semibold text-gray-400">JOINED</p>
        </div>

        {!users || users.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No users yet</p>
          </div>
        ) : (
          users.map((user: any) => {
            const sub = user.subscriptions?.[0]
            return (
              <div key={user.id} className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 items-center">
                <div className="col-span-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {user.full_name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <p className="text-gray-800 text-sm font-medium truncate">{user.full_name || 'Unnamed'}</p>
                </div>
                <div className="col-span-2">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                    {user.role}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${sub?.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                    {sub?.plan_type || 'None'}
                  </span>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-600 text-xs truncate">{user.charities?.name || '—'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-400 text-xs">{formatDate(user.created_at)}</p>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
