'use client'

import { motion } from 'framer-motion'
import { Heart, ArrowRight, Leaf, BookOpen, Stethoscope, PawPrint } from 'lucide-react'
import Link from 'next/link'

const charities = [
  {
    id: 1, name: 'Green Hope Foundation', category: 'Environment',
    description: 'Environmental sustainability and green initiatives for a cleaner tomorrow.',
    impact: '50,000+ trees planted', icon: Leaf,
    color: 'from-emerald-400 to-teal-500', bg: 'bg-emerald-50', tag: 'text-emerald-700 bg-emerald-100',
  },
  {
    id: 2, name: 'Education For All', category: 'Education',
    description: 'Providing quality education to underprivileged children across India.',
    impact: '1,200+ children helped', icon: BookOpen,
    color: 'from-blue-400 to-indigo-500', bg: 'bg-blue-50', tag: 'text-blue-700 bg-blue-100',
  },
  {
    id: 3, name: 'Health & Hope', category: 'Healthcare',
    description: 'Supporting healthcare and medical aid in underserved communities.',
    impact: '5,000+ patients monthly', icon: Stethoscope,
    color: 'from-rose-400 to-pink-500', bg: 'bg-rose-50', tag: 'text-rose-700 bg-rose-100',
  },
  {
    id: 4, name: 'Animal Care Trust', category: 'Animals',
    description: 'Rescuing and caring for animals in need across urban and rural areas.',
    impact: '800+ animals rescued', icon: PawPrint,
    color: 'from-amber-400 to-orange-500', bg: 'bg-amber-50', tag: 'text-amber-700 bg-amber-100',
  },
]

export default function CharitiesSection() {
  return (
    <section id="charities" className="section-padding" style={{ background: 'linear-gradient(180deg, #F5F3FF 0%, #fff 100%)' }}>
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block bg-pink-100 text-pink-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
            FEATURED CHARITIES
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Your subscription, <span className="gradient-text">their future</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Choose a cause you care about. A portion of every subscription goes directly to them every month.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {charities.map((charity, index) => {
            const Icon = charity.icon
            return (
              <motion.div
                key={charity.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover-card group"
              >
                {/* Card image area */}
                <div className={`${charity.bg} p-8 flex items-center justify-center`}>
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${charity.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                </div>

                <div className="p-5">
                  <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-3 ${charity.tag}`}>
                    {charity.category}
                  </span>
                  <h3 className="font-bold text-gray-900 mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {charity.name}
                  </h3>
                  <p className="text-gray-500 text-sm mb-3 leading-relaxed">{charity.description}</p>
                  <div className="flex items-center gap-1.5 mb-4">
                    <Heart className="w-3.5 h-3.5 text-pink-500" fill="currentColor" />
                    <span className="text-xs font-semibold text-gray-700">{charity.impact}</span>
                  </div>
                  <Link
                    href={`/charities`}
                    className="flex items-center gap-1 text-purple-600 text-sm font-semibold hover:gap-2 transition-all"
                  >
                    Learn More <ArrowRight size={14} />
                  </Link>
                </div>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link href="/charities" className="btn-secondary">
            View All Charities <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
