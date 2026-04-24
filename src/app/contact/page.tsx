'use client'

import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Mail, Phone, MapPin, Send, MessageSquare, Loader2, Check } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setSubmitting(false)
    setSubmitted(true)
  }

  return (
    <>
      <Navbar />
      <main className="pt-24 min-h-screen">
        <section className="section-padding overflow-hidden">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              {/* Left side - Info */}
              <div>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8"
                >
                  <h1 className="text-5xl font-extrabold text-[#1E1B4B] mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Get in <span className="text-purple-600">Touch.</span>
                  </h1>
                  <p className="text-xl text-gray-500 leading-relaxed max-w-md">
                    Have questions about the draws, charities, or your account? We're here to help.
                  </p>
                </motion.div>

                <div className="space-y-8">
                  {[
                    { icon: Mail, label: 'Email Us', value: 'hello@play4purpose.com', href: 'mailto:hello@play4purpose.com' },
                    { icon: Phone, label: 'Call Us', value: '+91 12345 67890', href: 'tel:+911234567890' },
                    { icon: MapPin, label: 'Our Office', value: 'Bangalore, India', href: '#' },
                    { icon: MessageSquare, label: 'Live Chat', value: 'Available 9am - 6pm IST', href: '#' }
                  ].map((item, i) => {
                    const Icon = item.icon
                    return (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-4"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 shadow-sm shadow-purple-100 flex-shrink-0">
                          <Icon size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">{item.label}</p>
                          <a href={item.href} className="text-lg font-bold text-[#1E1B4B] hover:text-purple-600 transition-colors">
                            {item.value}
                          </a>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>

              {/* Right side - Form */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl p-8 md:p-10 border border-gray-100 shadow-2xl shadow-purple-500/5 relative"
              >
                {submitted ? (
                  <div className="text-center py-20">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-6">
                      <Check size={32} strokeWidth={3} />
                    </div>
                    <h2 className="text-2xl font-bold text-[#1E1B4B] mb-2">Message Sent!</h2>
                    <p className="text-gray-500 mb-8">We'll get back to you within 24 hours.</p>
                    <button 
                      onClick={() => setSubmitted(false)}
                      className="text-purple-600 font-bold hover:underline"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Full Name</label>
                        <input 
                          type="text" required placeholder="John Doe"
                          className="w-full px-5 py-4 rounded-xl border border-gray-100 bg-gray-50 text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
                        <input 
                          type="email" required placeholder="john@example.com"
                          className="w-full px-5 py-4 rounded-xl border border-gray-100 bg-gray-50 text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Subject</label>
                      <select 
                        required
                        className="w-full px-5 py-4 rounded-xl border border-gray-100 bg-gray-50 text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all appearance-none"
                      >
                        <option value="">Select a reason</option>
                        <option value="subscription">Subscription Question</option>
                        <option value="draw">Monthly Draws</option>
                        <option value="charity">Charity Partnerships</option>
                        <option value="technical">Technical Support</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Your Message</label>
                      <textarea 
                        rows={4} required placeholder="How can we help you?"
                        className="w-full px-5 py-4 rounded-xl border border-gray-100 bg-gray-50 text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all resize-none"
                      />
                    </div>
                    <button 
                      type="submit" 
                      disabled={submitting}
                      className="btn-primary py-4 w-full flex items-center justify-center gap-2 group shadow-xl shadow-purple-200"
                    >
                      {submitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                      {submitting ? 'Sending...' : 'Send Message'}
                    </button>
                  </form>
                )}
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
