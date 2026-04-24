import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendEmail, EMAIL_TEMPLATES } from '@/lib/mail'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { drawId } = await req.json()

  // 1. Fetch the draw
  const { data: draw, error: drawError } = await supabase
    .from('draws')
    .select('*')
    .eq('id', drawId)
    .single()

  if (drawError || !draw) return NextResponse.json({ error: 'Draw not found' }, { status: 404 })
  if (draw.status !== 'published') return NextResponse.json({ error: 'Draw must be published to process winners' }, { status: 400 })

  const winningNumbers = draw.draw_numbers as number[]
  if (!winningNumbers || winningNumbers.length === 0) {
    return NextResponse.json({ error: 'No winning numbers found for this draw' }, { status: 400 })
  }

  // 2. Fetch all active subscribers
  const { data: subscriptions, error: subsError } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('status', 'active')

  if (subsError) return NextResponse.json({ error: subsError.message }, { status: 500 })

  const activeUserIds = subscriptions.map(s => s.user_id)

  // 3. Find all winners and their match counts
  const tierWinners: Record<number, string[]> = { 3: [], 4: [], 5: [] }

  for (const userId of activeUserIds) {
    const { data: scores } = await supabase
      .from('scores')
      .select('score')
      .eq('user_id', userId)
      .order('score_date', { ascending: false })
      .limit(5)

    if (!scores || scores.length === 0) continue

    const userNumbers = scores.map(s => s.score)
    const matches = userNumbers.filter(n => winningNumbers.includes(n)).length

    if (matches >= 3 && matches <= 5) {
      tierWinners[matches].push(userId)
    }
  }

  // 4. Calculate prizes and prepare inserts
  const winnersToInsert: {
    user_id: string;
    draw_id: string;
    match_count: number;
    prize_amount: number;
    status: string;
    payment_status: string;
  }[] = []
  const pool = draw.prize_pool_amount

  // Tier 3: 20% of pool
  if (tierWinners[3].length > 0) {
    const prize = (pool * 0.20) / tierWinners[3].length
    tierWinners[3].forEach(uid => {
      winnersToInsert.push({
        user_id: uid, draw_id: drawId, match_count: 3, prize_amount: prize,
        status: 'pending', payment_status: 'pending'
      })
    })
  }

  // Tier 4: 20% of pool
  if (tierWinners[4].length > 0) {
    const prize = (pool * 0.20) / tierWinners[4].length
    tierWinners[4].forEach(uid => {
      winnersToInsert.push({
        user_id: uid, draw_id: drawId, match_count: 4, prize_amount: prize,
        status: 'pending', payment_status: 'pending'
      })
    })
  }

  // Tier 5: 60% of pool
  if (tierWinners[5].length > 0) {
    const prize = (pool * 0.60) / tierWinners[5].length
    tierWinners[5].forEach(uid => {
      winnersToInsert.push({
        user_id: uid, draw_id: drawId, match_count: 5, prize_amount: prize,
        status: 'pending', payment_status: 'pending'
      })
    })
  }

  if (winnersToInsert.length > 0) {
    const { error: insertError } = await supabase
      .from('winners')
      .insert(winnersToInsert)

    if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 })

    // 6. Send Email Notifications
    // Fetch user details for winners to get their emails
    const winnerIds = winnersToInsert.map(w => w.user_id)
    const { data: userProfiles } = await supabase
      .from('profiles')
      .select('id, full_name')
      .in('id', winnerIds)

    for (const winner of winnersToInsert) {
      const profile = userProfiles?.find(p => p.id === winner.user_id)
      
      // Since we can't easily join auth.users without service role, 
      // in a real app you'd store email in profiles or use the admin API.
      // For now, we'll try to fetch the email from auth (requires service role)
      
      const { data: userData } = await supabase.auth.admin.getUserById(winner.user_id)
      const email = userData.user?.email

      if (email) {
        await sendEmail(
          email,
          `You won ₹${winner.prize_amount.toLocaleString('en-IN')}! 🎊`,
          EMAIL_TEMPLATES.WINNER_NOTIFICATION(winner.prize_amount)
        ).catch(err => console.error('Failed to send winner email:', err))
      }
    }
  }

  // 7. Update draw status to completed
  await supabase
    .from('draws')
    .update({ status: 'completed' })
    .eq('id', drawId)

  return NextResponse.json({ 
    success: true, 
    winnersCount: winnersToInsert.length 
  })
}
