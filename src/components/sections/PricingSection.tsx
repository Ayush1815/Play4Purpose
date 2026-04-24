'use client'

import { motion } from 'framer-motion'
import { Check, Zap, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const plans = [
  {
    id: 'monthly', name: 'Monthly Plan', price: 499, period: 'month',
    features: ['Enter monthly draws', 'Track your scores', 'Support your charity', 'Cancel anytime'],
    cta: 'Get Started', popular: false,
  },
  {
    id: 'yearly', name: 'Yearly Plan', price: 4999, period: 'year',
    features: ['All monthly plan benefits', 'Save 17% with yearly plan', 'Priority support', 'Early access to features'],
    cta: 'Get Started', popular: true, savings: 'Save ₹989/year',
  },
]

export default function PricingSection() {
  return (
    <section id="pricing" className="section-padding bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block bg-purple-100 text-purple-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
            PRICING
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Join the <span className="gradient-text">movement</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-lg mx-auto">
            Choose a plan, play your game, win rewards, and make a difference — starting today.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-16">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className={`relative rounded-2xl p-8 border-2 hover-card ${
                plan.popular
                  ? 'border-purple-500 bg-gradient-to-br from-purple-600 to-violet-700 text-white shadow-xl shadow-purple-200'
                  : 'border-gray-200 bg-white text-gray-900'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="flex items-center gap-1 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                    <Zap size={12} /> MOST POPULAR
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-bold text-lg mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {plan.name}
                </h3>
                {plan.savings && (
                  <span className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
                    {plan.savings}
                  </span>
                )}
                <div className="flex items-baseline gap-1 mt-2">
                  <span className={`text-4xl font-extrabold ${plan.popular ? 'text-white' : 'text-gray-900'}`}
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    ₹{plan.price.toLocaleString('en-IN')}
                  </span>
                  <span className={`text-sm ${plan.popular ? 'text-white/70' : 'text-gray-500'}`}>
                    /{plan.period}
                  </span>
                </div>
              </div>

              <ul className="flex flex-col gap-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                      plan.popular ? 'bg-white/20' : 'bg-purple-100'
                    }`}>
                      <Check size={11} className={plan.popular ? 'text-white' : 'text-purple-600'} strokeWidth={3} />
                    </div>
                    <span className={plan.popular ? 'text-white/90' : 'text-gray-600'}>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                id={`pricing-${plan.id}`}
                href={`/signup?plan=${plan.id}`}
                className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-sm transition-all ${
                  plan.popular
                    ? 'bg-white text-purple-700 hover:bg-white/90 hover:shadow-lg'
                    : 'bg-gradient-to-r from-purple-600 to-violet-600 text-white hover:shadow-lg hover:shadow-purple-200 hover:-translate-y-0.5'
                }`}
              >
                {plan.cta} <ArrowRight size={15} />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #1E1B4B 0%, #4C1D95 50%, #7C3AED 100%)' }}
        >
          <div className="flex flex-col lg:flex-row items-center justify-between p-10 gap-8">
            <div>
              <p className="text-white/70 text-sm font-semibold mb-2">JOIN THE MOVEMENT</p>
              <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Play for more than just yourself.
              </h3>
              <p className="text-white/70">
                Play for a <span className="text-purple-300 font-bold">purpose.</span>
              </p>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="flex -space-x-2 mb-1">
                {['R', 'S', 'A', 'M'].map((c, i) => (
                  <div key={i} className="w-9 h-9 rounded-full border-2 border-purple-500 flex items-center justify-center text-sm font-bold text-white"
                    style={{ background: `hsl(${260 + i * 20}, 70%, 50%)` }}>
                    {c}
                  </div>
                ))}
              </div>
              <p className="text-white/60 text-sm text-center">10,000+ members joined</p>
              <Link href="/signup" className="inline-flex items-center gap-2 bg-white text-purple-700 font-bold px-8 py-3.5 rounded-xl hover:bg-white/90 transition-all hover:shadow-xl">
                Start Today <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
