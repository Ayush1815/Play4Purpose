import { NextRequest, NextResponse } from 'next/server'
import { sendEmail, EMAIL_TEMPLATES } from '@/lib/mail'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { fullName } = await req.json()
  
  await sendEmail(
    user.email!,
    'Welcome to Play4Purpose! ✨',
    EMAIL_TEMPLATES.WELCOME(fullName || 'User')
  )

  return NextResponse.json({ success: true })
}
