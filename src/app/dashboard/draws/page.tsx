import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { formatDate, getNextDrawDate, getDaysUntil } from '@/lib/utils'
import { Trophy, Calendar, Clock, Hash } from 'lucide-react'

export default async function DrawsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [drawsRes, participationsRes] = await Promise.all([
    supabase.from('draws').select('*').order('created_at', { ascending: false }).limit(6),
    supabase.from('draw_participations').select('draw_id').eq('user_id', user.id),
  ])

  const draws = drawsRes.data || []
  const participatedIds = new Set((participationsRes.data || []).map(p => p.draw_id))
  const nextDraw = getNextDrawDate()
  const daysLeft = getDaysUntil(nextDraw.toISOString())

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Monthly Draws
        </h2>
        <p className="text-gray-500 text-sm">Participate in monthly draws. Match 3, 4, or 5 numbers to win prizes.</p>
      </div>

      {/* Next draw hero */}
      <div className="rounded-2xl p-8 text-white mb-8 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1E1B4B 0%, #4C1D95 50%, #7C3AED 100%)' }}>
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-12 translate-x-12" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={16} className="text-purple-300" />
            <span className="text-purple-300 text-sm font-semibold">UPCOMING DRAW</span>
          </div>
          <h3 className="text-3xl font-extrabold mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {nextDraw.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </h3>
          <div className="flex items-center gap-2 mb-6">
            <Clock size={14} className="text-yellow-300" />
            <span className="text-yellow-300 font-semibold">{daysLeft} day{daysLeft !== 1 ? 's' : ''} remaining</span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { match: '3 Numbers', prize: '20% of pool' },
              { match: '4 Numbers', prize: '20% of pool' },
              { match: '5 Numbers', prize: '60% Jackpot!' },
            ].map((tier) => (
              <div key={tier.match} className="bg-white/10 rounded-xl p-4 text-center">
                <p className="text-white/70 text-xs mb-1">{tier.match}</p>
                <p className="text-white font-bold text-sm">{tier.prize}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Draw history */}
      <h3 className="font-bold text-gray-900 mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        Draw History
      </h3>

      {draws.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center border border-gray-100 shadow-sm">
          <Trophy className="w-12 h-12 text-purple-200 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No draws published yet. Check back soon!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {draws.map((draw) => {
            const participated = participatedIds.has(draw.id)
            const numbers: number[] = draw.draw_numbers || []
            return (
              <div key={draw.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{draw.month}</p>
                    <p className="text-gray-400 text-xs">{formatDate(draw.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {participated && (
                      <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-2.5 py-1 rounded-full">Participated</span>
                    )}
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      draw.status === 'completed' ? 'bg-gray-100 text-gray-500' :
                      draw.status === 'published' ? 'bg-emerald-100 text-emerald-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>{draw.status}</span>
                  </div>
                </div>
                {numbers.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Hash size={12} className="text-gray-400" />
                    <div className="flex gap-2 flex-wrap">
                      {numbers.map((n, i) => (
                        <span key={i} className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center text-sm font-bold">
                          {n}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
