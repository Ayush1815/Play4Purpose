'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Users, Heart, TrendingUp, Trophy } from 'lucide-react'

const stats = [
  { icon: Users, label: 'Members Playing', value: 10000, suffix: '+', prefix: '', color: 'from-violet-500 to-purple-600' },
  { icon: Heart, label: 'Charities Supported', value: 50, suffix: '+', prefix: '', color: 'from-pink-500 to-rose-600' },
  { icon: TrendingUp, label: 'Raised for Good', value: 2500000, suffix: '', prefix: '₹', color: 'from-emerald-500 to-teal-600' },
  { icon: Trophy, label: 'Winners this year', value: 240, suffix: '+', prefix: '', color: 'from-amber-500 to-orange-600' },
]

function CountUp({ target, prefix = '', suffix = '', duration = 2000 }: {
  target: number
  prefix?: string
  suffix?: string
  duration?: number
}) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    const start = Date.now()
    const timer = setInterval(() => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress === 1) clearInterval(timer)
    }, 16)
    return () => clearInterval(timer)
  }, [inView, target, duration])

  const formatted =
    target >= 100000
      ? `${(count / 100000).toFixed(1)}L`
      : count.toLocaleString('en-IN')

  return (
    <span ref={ref}>
      {prefix}{formatted}{suffix}
    </span>
  )
}

export default function StatsStrip() {
  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-center text-center p-6 rounded-2xl border border-gray-100 hover-card shadow-sm"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <p
                  className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-1"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  <CountUp
                    target={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                  />
                </p>
                <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
