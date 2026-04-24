'use client'

import { Bell } from 'lucide-react'
import type { Profile } from '@/types'
import type { User } from '@supabase/supabase-js'

export default function DashboardTopbar({ user, profile }: { user: User; profile: Profile | null }) {
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <header className="bg-white border-b border-gray-100 px-6 md:px-8 py-4 flex items-center justify-between sticky top-0 z-30">
      <div>
        <p className="text-gray-500 text-sm">{greeting} 👋</p>
        <h1 className="font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {profile?.full_name || user.email}
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <button id="notifications-btn" className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors relative">
          <Bell size={17} className="text-gray-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-purple-500 rounded-full" />
        </button>
        <div className="w-9 h-9 rounded-full gradient-bg flex items-center justify-center text-white text-sm font-bold">
          {profile?.full_name?.[0]?.toUpperCase() || 'U'}
        </div>
      </div>
    </header>
  )
}
