'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Sparkles, Trophy, Heart } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1E1B4B] via-[#4C1D95] to-[#7C3AED]" />

      {/* Animated orbs */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-pink-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-3xl" />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="container-custom relative z-10 pt-24 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left — Text content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6"
            >
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-white/90 text-sm font-medium">Monthly draws. Real impact. Always.</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Play.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400">
                Win.
              </span>
              <br />
              Make an{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-300">
                Impact.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-white/75 text-lg md:text-xl leading-relaxed mb-8 max-w-lg"
            >
              Track your golf scores, enter monthly draws, and support charities that matter. Every subscription drives real change.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              <Link
                id="hero-get-started"
                href="/signup"
                className="inline-flex items-center justify-center gap-2 bg-white text-purple-700 font-bold px-8 py-4 rounded-xl text-base hover:bg-white/90 transition-all hover:shadow-2xl hover:shadow-white/20 hover:-translate-y-0.5"
              >
                Get Started
                <ArrowRight size={18} />
              </Link>
              <Link
                id="hero-explore-charities"
                href="/#charities"
                className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-semibold px-8 py-4 rounded-xl text-base hover:bg-white/20 transition-all"
              >
                <Heart size={16} />
                Explore Charities
              </Link>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex items-center gap-6"
            >
              <div className="flex -space-x-2">
                {['A', 'B', 'C', 'D'].map((char, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-purple-500 flex items-center justify-center text-xs font-bold text-white"
                    style={{
                      background: `hsl(${260 + i * 15}, 70%, ${45 + i * 5}%)`,
                    }}
                  >
                    {char}
                  </div>
                ))}
              </div>
              <p className="text-white/70 text-sm">
                <span className="text-white font-semibold">10,000+</span> members already playing for purpose
              </p>
            </motion.div>
          </div>

          {/* Right — Floating UI mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            {/* Main dashboard card */}
            <div className="relative">
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                className="glass-card rounded-2xl p-6 shadow-2xl"
                style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.2)' }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-white/60 text-xs font-medium">WELCOME BACK</p>
                    <p className="text-white font-bold text-lg">Arjun Singh 👋</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold">
                    A
                  </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { label: 'Subscription', value: 'Active', color: 'text-emerald-400' },
                    { label: 'Your Charity', value: 'Green Hope', color: 'text-purple-300' },
                    { label: 'Total Won', value: '₹12,500', color: 'text-yellow-400' },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-white/10 rounded-xl p-3">
                      <p className="text-white/50 text-xs mb-1">{stat.label}</p>
                      <p className={`font-bold text-sm ${stat.color}`}>{stat.value}</p>
                    </div>
                  ))}
                </div>

                {/* Latest scores */}
                <div className="mb-4">
                  <p className="text-white/60 text-xs font-medium mb-2">LATEST SCORES</p>
                  <div className="flex gap-2">
                    {[34, 28, 32, 30, 26].map((score, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-white/10 rounded-lg py-2 text-center"
                      >
                        <span className="text-white font-bold text-sm">{score}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Next draw */}
                <div className="bg-gradient-to-r from-purple-600/50 to-pink-600/50 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-xs">Next Draw</p>
                    <p className="text-white font-bold">25 May 2026</p>
                    <p className="text-yellow-300 text-xs font-medium">5 days left!</p>
                  </div>
                  <Trophy className="text-yellow-400 w-10 h-10" />
                </div>
              </motion.div>

              {/* Floating win notification */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, duration: 0.4 }}
                className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-xl p-4 w-52"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center">
                    🏆
                  </div>
                  <div>
                    <p className="text-gray-800 font-bold text-sm">Winner!</p>
                    <p className="text-gray-500 text-xs">Rahul won ₹5,000</p>
                  </div>
                </div>
              </motion.div>

              {/* Floating charity card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5, duration: 0.4 }}
                className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 w-48"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Heart className="w-4 h-4 text-pink-500" />
                  <p className="text-gray-800 font-bold text-xs">Impact Today</p>
                </div>
                <p className="text-purple-600 font-bold">₹25L+ Raised</p>
                <p className="text-gray-500 text-xs">for 50+ charities</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 80L1440 80L1440 40C1200 80 960 0 720 20C480 40 240 80 0 40L0 80Z" fill="white" />
        </svg>
      </div>
    </section>
  )
}
