'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, Target, Calendar, Flame, BookOpen, Code, Zap, Clock, Trophy, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function Hero() {
  const [currentExample, setCurrentExample] = useState(0)

  const streakExamples = [
    { 
      subject: "Interview Prep Plan", 
      day: "Day 5/7", 
      progress: 71,
      quote: "Actually practicing behavioral questions daily!",
      avatar: "💼"
    },
    { 
      subject: "Workout Routine", 
      day: "Day 3/7", 
      progress: 43,
      quote: "Haven't skipped a single day yet!",
      avatar: "💪"
    },
    { 
      subject: "Learn Python", 
      day: "Day 7/7", 
      progress: 100,
      quote: "Built my first web scraper today!",
      avatar: "🐍"
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentExample((prev) => (prev + 1) % streakExamples.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-100/20 to-indigo-100/20 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center">
        <div className="container mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left side - Main content */}
            <div className="text-center lg:text-left">
              
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center px-4 py-2 bg-blue-100/80 backdrop-blur-sm border border-blue-200/50 rounded-full mb-6"
              >
                <Flame className="w-4 h-4 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-blue-700">Turn Plans Into Progress</span>
              </motion.div>

              {/* Main Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-4xl md:text-6xl font-bold mb-6 text-gray-900 leading-tight"
              >
                Turn AI Plans Into
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Real Progress
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0"
              >
                Finally, a way to take those amazing ChatGPT plans and actually follow through. 
                Get structured 7-day learning journeys with daily AI coaching and progress tracking.
              </motion.p>

              {/* Solution Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex flex-wrap justify-center lg:justify-start gap-6 mb-8"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-gray-700 font-medium">Focused 7-Day Plans</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Target className="w-4 h-4 text-indigo-600" />
                  </div>
                  <span className="text-gray-700 font-medium">Daily AI Coaching</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Trophy className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700 font-medium">Progress Tracking</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Flame className="w-4 h-4 text-orange-600" />
                  </div>
                  <span className="text-gray-700 font-medium">Stay Accountable</span>
                </div>
              </motion.div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="space-y-4"
              >
                <Link href="/onboarding">
                  <Button 
                    size="lg"
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-lg font-medium rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 group"
                  >
                    Turn My Plans Into Progress
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                
                <p className="text-gray-500 text-sm">
                  🎯 Free to start • No credit card required • Finally follow through
                </p>
                
                <p className="text-gray-500 text-sm mt-4">
                  Already have an account?{' '}
                  <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                    Sign in here
                  </Link>
                </p>
              </motion.div>

            </div>

            {/* Right side - Interactive example */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative"
            >
              {/* Main card */}
              <div className="bg-white/90 backdrop-blur-sm border border-gray-300 rounded-3xl p-8 shadow-2xl shadow-blue-500/10">
                <div className="text-center mb-6">
                  <div className="text-4xl mb-3">{streakExamples[currentExample].avatar}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {streakExamples[currentExample].subject}
                  </h3>
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <Flame className="w-5 h-5 text-orange-500" />
                    <span className="text-lg font-semibold text-gray-700">
                      {streakExamples[currentExample].day}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-700 font-medium mb-2">
                    <span>Progress</span>
                    <span>{streakExamples[currentExample].progress}%</span>
                  </div>
                  <div className="w-full bg-gray-300 rounded-full h-3">
                    <motion.div 
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${streakExamples[currentExample].progress}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                </div>

                {/* Quote */}
                <div className="bg-blue-50/50 rounded-2xl p-4 mb-6">
                  <p className="text-gray-700 italic text-center">
                    "{streakExamples[currentExample].quote}"
                  </p>
                </div>

                {/* Days indicator */}
                <div className="flex justify-center space-x-2">
                  {[1,2,3,4,5,6,7].map((day) => {
                    const currentDay = parseInt(streakExamples[currentExample].day.split('/')[0].replace('Day ', ''))
                    const isCompleted = day <= currentDay
                    const isCurrent = day === currentDay + 1 && currentDay < 7
                    
                    return (
                      <div
                        key={day}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                          isCompleted 
                            ? 'bg-green-500 text-white shadow-md' 
                            : isCurrent 
                            ? 'bg-blue-500 text-white ring-4 ring-blue-200 shadow-md' 
                            : 'bg-gray-300 text-gray-600 border border-gray-400'
                        }`}
                      >
                        {isCompleted ? <CheckCircle className="w-4 h-4" /> : day}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Floating elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-4 -right-4 bg-orange-500 text-white p-3 rounded-2xl shadow-lg"
              >
                <Flame className="w-6 h-6" />
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="absolute -bottom-4 -left-4 bg-green-500 text-white p-3 rounded-2xl shadow-lg"
              >
                <Trophy className="w-6 h-6" />
              </motion.div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  )
} 