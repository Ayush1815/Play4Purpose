'use client'

import { motion } from 'framer-motion'
import { CreditCard, ClipboardList, Trophy, Heart } from 'lucide-react'

const steps = [
  {
    step: '01', icon: CreditCard, title: 'Subscribe',
    description: 'Choose a monthly or yearly plan and join a community playing for purpose. Cancel anytime.',
    color: 'from-violet-500 to-purple-600',
  },
  {
    step: '02', icon: ClipboardList, title: 'Enter Scores',
    description: 'Submit your last 5 golf scores. One score per date — rolling average tracked automatically.',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    step: '03', icon: Trophy, title: 'Win Rewards',
    description: 'Participate in monthly draws. Match 3, 4, or 5 numbers to win from the prize pool.',
    color: 'from-amber-500 to-orange-600',
  },
  {
    step: '04', icon: Heart, title: 'Support Charity',
    description: 'A portion of every subscription goes directly to your chosen charity — creating real impact.',
    color: 'from-pink-500 to-rose-600',
  },
]

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="section-padding bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block bg-purple-100 text-purple-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
            HOW IT WORKS
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Simple steps to <span className="gradient-text">make a difference</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            From signing up to winning rewards — it takes less than 5 minutes to get started.
          </p>
        </motion.div>

        <div className="relative">
          <div className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-violet-200 via-amber-200 to-pink-200 z-0" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  className="relative z-10 flex flex-col items-center text-center group"
                >
                  <div className="relative mb-6">
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-9 h-9 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center">
                      <span className="text-xs font-bold text-gray-600">{step.step}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {step.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
