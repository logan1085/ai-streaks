'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, Target, Calendar, Flame, BookOpen, Code, Zap, Clock, Trophy, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function Hero() {
  const [mounted, setMounted] = useState(false)
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
    setMounted(true)
    const timer = setInterval(() => {
      setCurrentExample((prev) => (prev + 1) % streakExamples.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  // Prevent hydration errors by not rendering motion elements until mounted
  const MotionDiv = mounted ? motion.div : 'div'
  const example = streakExamples[currentExample]

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 sm:top-20 sm:left-20 w-48 sm:w-72 h-48 sm:h-72 bg-blue-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 sm:bottom-20 sm:right-20 w-64 sm:w-96 h-64 sm:h-96 bg-indigo-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[800px] h-[400px] sm:h-[800px] bg-gradient-to-r from-blue-100/20 to-indigo-100/20 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center">
        <div className="container mx-auto px-4 py-8 sm:py-12 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            
            {/* Left side - Main content */}
            <div className="text-center lg:text-left space-y-6 sm:space-y-8">
              
              {/* Badge */}
              <MotionDiv
                initial={mounted ? { opacity: 0, y: 20 } : false}
                animate={mounted ? { opacity: 1, y: 0 } : false}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-100/80 backdrop-blur-sm border border-blue-200/50 rounded-full"
              >
                <Flame className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-blue-600 mr-1.5 sm:mr-2" />
                <span className="text-xs sm:text-sm font-medium text-blue-700">Turn Plans Into Progress</span>
              </MotionDiv>

              {/* Main Headline */}
              <MotionDiv
                initial={mounted ? { opacity: 0, y: 30 } : false}
                animate={mounted ? { opacity: 1, y: 0 } : false}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight"
              >
                Turn AI Plans Into
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Real Progress
                </span>
              </MotionDiv>

              {/* Subtitle */}
              <MotionDiv
                initial={mounted ? { opacity: 0, y: 20 } : false}
                animate={mounted ? { opacity: 1, y: 0 } : false}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0"
              >
                Finally, a way to take those amazing ChatGPT plans and actually follow through. 
                Get structured 7-day learning journeys with daily AI coaching and progress tracking.
              </MotionDiv>

              {/* Solution Stats */}
              <MotionDiv
                initial={mounted ? { opacity: 0, y: 20 } : false}
                animate={mounted ? { opacity: 1, y: 0 } : false}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center lg:justify-start gap-4 sm:gap-6"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
                  </div>
                  <span className="text-sm sm:text-base text-gray-700 font-medium">7-Day Plans</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600" />
                  </div>
                  <span className="text-sm sm:text-base text-gray-700 font-medium">AI Coaching</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />
                  </div>
                  <span className="text-sm sm:text-base text-gray-700 font-medium">Progress</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-600" />
                  </div>
                  <span className="text-sm sm:text-base text-gray-700 font-medium">Accountable</span>
                </div>
              </MotionDiv>

              {/* CTA */}
              <MotionDiv
                initial={mounted ? { opacity: 0, y: 20 } : false}
                animate={mounted ? { opacity: 1, y: 0 } : false}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="space-y-4 pt-2 sm:pt-4"
              >
                <Link href="/onboarding" className="block sm:inline-block">
                  <Button 
                    size="lg"
                    className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-base sm:text-lg font-medium rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 group"
                  >
                    Turn My Plans Into Progress
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                
                <p className="text-gray-500 text-xs sm:text-sm">
                  🎯 Free to start • No credit card required • Finally follow through
                </p>
                
                <p className="text-gray-500 text-xs sm:text-sm">
                  Already have an account?{' '}
                  <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                    Sign in here
                  </Link>
                </p>
              </MotionDiv>
            </div>

            {/* Right side - Interactive example */}
            <MotionDiv
              initial={mounted ? { opacity: 0, x: 30 } : false}
              animate={mounted ? { opacity: 1, x: 0 } : false}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative max-w-md mx-auto lg:max-w-none"
            >
              {/* Main card */}
              <div className="bg-white/90 backdrop-blur-sm border border-gray-300 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl shadow-blue-500/10">
                <div className="text-center mb-4 sm:mb-6">
                  <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">{example.avatar}</div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                    {example.subject}
                  </h3>
                  <div className="flex items-center justify-center space-x-2 mb-3 sm:mb-4">
                    <Flame className="w-4 sm:w-5 h-4 sm:h-5 text-orange-500" />
                    <span className="text-base sm:text-lg font-semibold text-gray-700">
                      {example.day}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mb-4 sm:mb-6">
                  <div className="flex justify-between text-xs sm:text-sm text-gray-700 font-medium mb-1.5 sm:mb-2">
                    <span>Progress</span>
                    <span>{example.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-300 rounded-full h-2 sm:h-3">
                    {mounted && (
                      <MotionDiv 
                        key={example.progress}
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 sm:h-3 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${example.progress}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                    )}
                  </div>
                </div>

                {/* Quote */}
                <div className="bg-blue-50/50 rounded-xl sm:rounded-2xl p-3 sm:p-4">
                  <p className="text-sm sm:text-base text-gray-700 italic text-center">
                    "{example.quote}"
                  </p>
                </div>

                {/* Days indicator */}
                <div className="flex justify-center space-x-2">
                  {[1,2,3,4,5,6,7].map((day) => {
                    const currentDay = parseInt(example.day.split('/')[0].replace('Day ', ''))
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
              <div className="absolute -top-6 -right-6 bg-white rounded-2xl p-3 shadow-lg rotate-6 hidden sm:block">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Task Complete!</span>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-3 shadow-lg -rotate-6 hidden sm:block">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">+1 Day Streak!</span>
                </div>
              </div>
            </MotionDiv>
          </div>
        </div>
      </div>
    </div>
  )
} 