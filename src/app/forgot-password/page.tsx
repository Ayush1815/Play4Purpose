'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Target, ArrowLeft, Loader2, Mail, Check } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (resetError) {
      setError(resetError.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
            <Target className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Play4Purpose</span>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-2 text-center" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Forgot password?
          </h1>
          <p className="text-gray-500 mb-8 text-center text-sm">
            No worries, we'll send you reset instructions.
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6 text-sm">
              {error}
            </div>
          )}

          {success ? (
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                <Check size={24} />
              </div>
              <p className="text-gray-900 font-bold mb-2">Check your email</p>
              <p className="text-gray-500 text-sm mb-8">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              <Link href="/login" className="text-purple-600 font-semibold hover:underline flex items-center justify-center gap-2">
                <ArrowLeft size={16} /> Back to login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleReset} className="flex flex-col gap-5">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <input
                    id="email" type="email" required
                    placeholder="arjun@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 pl-11 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  />
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary justify-center py-3.5 mt-2 disabled:opacity-60"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : 'Reset Password'}
              </button>

              <Link href="/login" className="text-center text-sm text-gray-500 hover:text-purple-600 font-medium mt-2 flex items-center justify-center gap-2">
                <ArrowLeft size={14} /> Back to login
              </Link>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  )
}
