'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, Target, Calendar, Flame, BookOpen, Code, Zap } from 'lucide-react'
import Link from 'next/link'

export default function Hero() {
  const [selectedGoal, setSelectedGoal] = useState(0)

  const goalExamples = [
    { icon: BookOpen, title: "Studying for LSAT", streak: 12, progress: "Daily practice questions" },
    { icon: Code, title: "Learning React", streak: 8, progress: "Building small projects" },
    { icon: Target, title: "Interview Prep", streak: 5, progress: "Mock interviews with AI" },
  ]

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Simple background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-pink-500/5"></div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            
            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold mb-6 text-white leading-tight"
            >
              Build Streaks for
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Anything You Study
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto"
            >
              Track daily progress on your goals. Study for tests, learn new skills, 
              practice interviews - with AI as your study partner.
            </motion.p>

            {/* Goal Examples */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto"
            >
              {goalExamples.map((goal, index) => {
                const Icon = goal.icon
                return (
                  <motion.div
                    key={goal.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
                    className="bg-slate-900/30 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm hover:border-slate-600/60 transition-all duration-300"
                  >
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg flex items-center justify-center mr-4">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Flame className="w-5 h-5 text-orange-400" />
                        <span className="text-white font-bold">{goal.streak} days</span>
                      </div>
                    </div>
                    <h3 className="text-white font-semibold mb-2">{goal.title}</h3>
                    <p className="text-slate-400 text-sm">{goal.progress}</p>
                  </motion.div>
                )
              })}
            </motion.div>

            {/* Simple CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="space-y-4"
            >
              <Link href="/onboarding">
                <Button 
                  size="lg"
                  className="px-12 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white text-lg font-medium rounded-xl shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 group"
                >
                  Start Your First Streak
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              
              <p className="text-slate-500 text-sm">
                🔥 Free to start • No credit card required
              </p>
              
              <p className="text-slate-400 text-sm mt-4">
                Already have an account?{' '}
                <Link href="/login" className="text-cyan-400 hover:text-cyan-300 font-medium">
                  Sign in here
                </Link>
              </p>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  )
} 