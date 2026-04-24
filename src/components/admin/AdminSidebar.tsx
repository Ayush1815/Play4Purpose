'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, Trophy, Heart, Gift, BarChart3, Target, LogOut, BookOpen } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const navItems = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Draws', href: '/admin/draws', icon: Trophy },
  { label: 'Charities', href: '/admin/charities', icon: Heart },
  { label: 'Winners', href: '/admin/winners', icon: Gift },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { label: 'Blog', href: '/admin/blog', icon: BookOpen },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <aside className="w-56 bg-[#0F0A1E] text-white flex flex-col flex-shrink-0 sticky top-0 h-screen">
      <div className="flex items-center gap-2 px-4 py-5 border-b border-white/10">
        <div className="w-7 h-7 rounded-lg gradient-bg flex items-center justify-center">
          <Target className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="font-bold text-sm text-white">Play4Purpose</p>
          <p className="text-white/40 text-xs">Admin Panel</p>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = pathname === item.href
          return (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active ? 'bg-purple-600 text-white' : 'text-white/60 hover:bg-white/10 hover:text-white'
              }`}>
              <Icon size={16} />{item.label}
            </Link>
          )
        })}
      </nav>
      <div className="px-3 py-4 border-t border-white/10">
        <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/60 hover:bg-white/10 hover:text-white transition-colors w-full">
          <LogOut size={16} /> Logout
        </button>
      </div>
    </aside>
  )
}
