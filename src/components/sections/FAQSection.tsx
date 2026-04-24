'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, HelpCircle } from 'lucide-react'

const faqs = [
  {
    question: 'How do the monthly draws work?',
    answer: 'Every month, we host a prize draw. To participate, you simply need to have an active subscription and submit at least one golf score. Winning numbers are generated at the end of the month, and prizes are awarded based on how many of your numbers match the winning set.'
  },
  {
    question: 'How much of my subscription goes to charity?',
    answer: 'You have full control! You can choose any percentage between 10% and 50% of your monthly subscription to go directly to your chosen charity. The rest covers the prize pool and platform operations.'
  },
  {
    question: 'Is my data secure?',
    answer: 'Absolutely. We use industry-standard encryption for all your personal data and golf scores. Payments are handled securely through Razorpay, and we never store your credit card information on our servers.'
  },
  {
    question: 'Can I change my charity selection?',
    answer: 'Yes, you can change your chosen charity and your contribution percentage at any time from your dashboard. The changes will take effect from your next billing cycle.'
  },
  {
    question: 'How are winners notified?',
    answer: 'Winners are automatically notified via email and through their dashboard notifications. If you win, you\'ll see a "Claim Prize" button in your winnings history where you can upload proof of your score if required.'
  },
  {
    question: 'What if I want to cancel my subscription?',
    answer: 'You can cancel your subscription at any time through your account settings. There are no long-term contracts or cancellation fees. You will continue to have access to the platform until the end of your current billing period.'
  }
]

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="section-padding bg-gray-50">
      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full mb-4"
          >
            <HelpCircle size={16} />
            <span className="text-xs font-bold uppercase tracking-widest">Support</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold text-[#1E1B4B] mb-6"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Frequently Asked <span className="text-purple-600">Questions</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 text-lg"
          >
            Everything you need to know about Play4Purpose.
          </motion.p>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="mb-4"
              >
                <button
                  id={`faq-toggle-${index}`}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className={`w-full text-left p-6 rounded-2xl border transition-all flex items-center justify-between ${
                    isOpen ? 'bg-white border-purple-200 shadow-xl shadow-purple-500/5' : 'bg-white/50 border-gray-100 hover:border-purple-100'
                  }`}
                >
                  <span className={`font-bold text-lg ${isOpen ? 'text-purple-700' : 'text-[#1E1B4B]'}`}>
                    {faq.question}
                  </span>
                  <ChevronDown 
                    size={20} 
                    className={`text-purple-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
                  />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 pt-2 text-gray-500 leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
