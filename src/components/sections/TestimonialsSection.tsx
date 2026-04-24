'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Rahul Mehta', location: 'Mumbai',
    quote: "I won ₹5,000 in my second month and my favourite charity received a donation I actually chose. This is unlike anything else.",
    rating: 5, avatar: 'R', won: '₹5,000 winner',
  },
  {
    name: 'Priya Sharma', location: 'Bangalore',
    quote: "Finally a platform that combines my love for golf with giving back. The dashboard is beautiful and the draw system is so exciting.",
    rating: 5, avatar: 'P', won: '3-month subscriber',
  },
  {
    name: 'Arjun Singh', location: 'Delhi',
    quote: "The yearly plan is a no-brainer. I've entered every monthly draw and know my subscription is helping Education For All.",
    rating: 5, avatar: 'A', won: 'Yearly member',
  },
]

export default function TestimonialsSection() {
  return (
    <section className="section-padding" style={{ background: 'linear-gradient(180deg, #fff 0%, #F5F3FF 100%)' }}>
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-block bg-purple-100 text-purple-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
            COMMUNITY STORIES
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Real players, <span className="gradient-text">real impact</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-lg mx-auto">
            Thousands of golfers are already playing with purpose. Here's what they say.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100 hover-card relative"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-purple-100" />
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-amber-400" fill="currentColor" />
                ))}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-6 italic">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-white font-bold text-sm">
                  {t.avatar}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-gray-400 text-xs">{t.location} · {t.won}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
