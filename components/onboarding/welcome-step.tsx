'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, Target, Calendar, Flame } from 'lucide-react'

interface WelcomeStepProps {
  onNext: () => void
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-slate-900/80 to-slate-800/40 border border-slate-700/50 rounded-2xl p-8 backdrop-blur-sm text-center"
    >
      {/* Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
        className="relative mx-auto mb-8"
      >
        <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/25">
          <Flame className="w-10 h-10 text-white" />
        </div>
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-3xl font-bold mb-4 text-white"
      >
        Start Your First Streak
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-slate-400 mb-8 leading-relaxed"
      >
        Set a goal. Track your daily progress. Build the habit that matters to you.
      </motion.p>

      {/* Feature highlights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="space-y-3 mb-8"
      >
        <div className="flex items-center text-slate-300 text-sm">
          <Target className="w-4 h-4 text-cyan-400 mr-3 flex-shrink-0" />
          <span>Set any goal you want to achieve</span>
        </div>
        <div className="flex items-center text-slate-300 text-sm">
          <Calendar className="w-4 h-4 text-purple-400 mr-3 flex-shrink-0" />
          <span>Track daily progress with simple check-ins</span>
        </div>
        <div className="flex items-center text-slate-300 text-sm">
          <Flame className="w-4 h-4 text-orange-400 mr-3 flex-shrink-0" />
          <span>Build streaks that motivate you to keep going</span>
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <Button
          onClick={onNext}
          size="lg"
          className="w-full px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white border-0 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 group"
        >
          Let's Get Started
          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </motion.div>

      {/* Trust indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="mt-6 text-center"
      >
        <p className="text-slate-500 text-xs">🔥 Free to start • No complex setup</p>
      </motion.div>
    </motion.div>
  )
} 