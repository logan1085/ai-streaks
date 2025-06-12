'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, MessageCircle, Calendar, Flame, Clock } from 'lucide-react'

interface WelcomeStepProps {
  onNext: () => void
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white border border-gray-300 rounded-3xl p-8 backdrop-blur-sm text-center shadow-2xl shadow-blue-500/10"
    >
      {/* Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
        className="relative mx-auto mb-8"
      >
        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-blue-500/25">
          <Flame className="w-10 h-10 text-white" />
        </div>
        {/* Floating badge */}
        <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          7 Days
        </div>
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-3xl font-bold mb-4 text-gray-900"
      >
        Master Any Skill in 7 Days
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-gray-600 mb-8 leading-relaxed"
      >
        Chat with AI to create your personalized learning plan. Get daily tutoring sessions that adapt to your progress.
      </motion.p>

      {/* Feature highlights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="space-y-4 mb-8"
      >
        <div className="flex items-center text-gray-700 text-sm bg-blue-50 rounded-xl p-3">
          <MessageCircle className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
          <span>Tell AI what you want to learn</span>
        </div>
        <div className="flex items-center text-gray-700 text-sm bg-indigo-50 rounded-xl p-3">
          <Calendar className="w-5 h-5 text-indigo-500 mr-3 flex-shrink-0" />
          <span>Get a personalized 7-day curriculum</span>
        </div>
        <div className="flex items-center text-gray-700 text-sm bg-orange-50 rounded-xl p-3">
          <Clock className="w-5 h-5 text-orange-500 mr-3 flex-shrink-0" />
          <span>Daily AI tutoring sessions</span>
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
          className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 group"
        >
          Start Your 7-Day Journey
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
        <p className="text-gray-500 text-xs">🎯 Free to start • Perfect for busy people</p>
      </motion.div>
    </motion.div>
  )
} 