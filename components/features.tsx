'use client'

import { motion } from 'framer-motion'
import { Target, Calendar, TrendingUp, CheckCircle, BookOpen, Zap } from 'lucide-react'

const features = [
  {
    icon: Target,
    title: "Set Your Goal",
    description: "Define what you want to achieve - studying for a test, learning a new skill, preparing for interviews.",
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    icon: Calendar,
    title: "Track Daily Progress",
    description: "Mark each day you work toward your goal. Build momentum with visual streak tracking.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: TrendingUp,
    title: "See Your Growth",
    description: "Watch your streaks grow over time. Get motivated by your consistency and progress.",
    gradient: "from-emerald-500 to-teal-500",
  },
]

const examples = [
  "Study for MCAT - 30 days straight",
  "Learn Python - 2 weeks and counting",
  "Interview prep - Daily practice for 10 days",
  "French lessons - 45 day streak",
]

export default function Features() {
  return (
    <section className="relative py-20 bg-black">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Simple Streak Tracking
          </h2>
          
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            No complex setup. Just set a goal and start your streak.
          </p>
        </motion.div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="text-center"
              >
                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mx-auto mb-6`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            )
          })}
        </div>

        {/* Examples */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center"
        >
          <h3 className="text-2xl font-bold text-white mb-8">
            What People Are Tracking
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {examples.map((example, index) => (
              <motion.div
                key={example}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.8 }}
                className="bg-slate-900/30 border border-slate-700/50 rounded-lg p-4 backdrop-blur-sm"
              >
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                  <span className="text-slate-300">{example}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
} 