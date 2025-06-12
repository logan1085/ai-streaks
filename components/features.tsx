'use client'

import { motion } from 'framer-motion'
import { MessageCircle, Calendar, Trophy, CheckCircle, BookOpen, Zap, Clock, Target, Flame } from 'lucide-react'

const features = [
  {
    icon: MessageCircle,
    title: "Chat with AI to Plan",
    description: "Tell AI what you want to learn. It creates a personalized 7-day curriculum just for you.",
    gradient: "from-blue-500 to-indigo-500",
  },
  {
    icon: Target,
    title: "Daily AI Tutoring",
    description: "Get personalized coaching every day. AI adapts to your learning style and progress.",
    gradient: "from-indigo-500 to-purple-500",
  },
  {
    icon: Trophy,
    title: "Complete in 7 Days",
    description: "Build momentum with short, focused learning bursts. See real progress in just one week.",
    gradient: "from-purple-500 to-pink-500",
  },
]

const successStories = [
  {
    subject: "JavaScript Fundamentals",
    days: 7,
    outcome: "Built first web app",
    avatar: "🚀"
  },
  {
    subject: "Public Speaking",
    days: 7,
    outcome: "Gave confident presentation",
    avatar: "🎤"
  },
  {
    subject: "Spanish Basics",
    days: 7,
    outcome: "Had first conversation",
    avatar: "🇪🇸"
  },
  {
    subject: "Data Analysis",
    days: 7,
    outcome: "Created first dashboard",
    avatar: "📊"
  },
]

const howItWorks = [
  {
    step: "1",
    title: "Tell AI Your Goal",
    description: "Chat with our AI about what you want to learn. Be specific about your timeline and goals.",
    icon: MessageCircle,
    color: "blue"
  },
  {
    step: "2", 
    title: "Get Your 7-Day Plan",
    description: "AI creates a personalized curriculum with daily objectives and learning materials.",
    icon: Calendar,
    color: "indigo"
  },
  {
    step: "3",
    title: "Daily Tutoring Sessions",
    description: "Each day, chat with AI for personalized tutoring that adapts to your progress.",
    icon: BookOpen,
    color: "purple"
  },
  {
    step: "4",
    title: "Track Your Streak",
    description: "Build momentum by completing each day. See your progress and celebrate wins.",
    icon: Flame,
    color: "orange"
  }
]

export default function Features() {
  return (
    <div className="bg-white">
      {/* Problem Statement Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            {/* Problem */}
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-200 mb-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">😤</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Sound Familiar?
                </h2>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div className="p-6">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Great AI Plans</h3>
                  <p className="text-gray-600 text-sm">ChatGPT creates amazing plans for diet, workout, interview prep, personal development</p>
                </div>
                
                <div className="p-6">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">No Follow-Through</h3>
                  <p className="text-gray-600 text-sm">You get fired up, but there's no way to track progress or continue updating as you work</p>
                </div>
                
                <div className="p-6">
                  <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Target className="w-6 h-6 text-yellow-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">No Accountability</h3>
                  <p className="text-gray-600 text-sm">There's no push to stay focused or stay on topic</p>
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex justify-center mb-8">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>

            {/* Solution */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 md:p-12 border border-blue-200">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
                  We Fix This
                </h2>
                <p className="text-xl text-blue-800 max-w-2xl mx-auto leading-relaxed">
                  Turn your AI-generated plans into <strong>structured 7-day learning journeys</strong> with daily coaching, 
                  progress tracking, and accountability to keep you focused and moving forward.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              How It Works
            </h2>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From idea to expertise in just 7 days. Here's how we make it happen.
            </p>
          </motion.div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((item, index) => {
              const Icon = item.icon
              const getStepClasses = (color: string) => {
                switch (color) {
                  case 'blue': return {
                    step: 'bg-blue-100 text-blue-700 border-blue-300',
                    icon: 'bg-blue-100 text-blue-700'
                  }
                  case 'indigo': return {
                    step: 'bg-indigo-100 text-indigo-700 border-indigo-300', 
                    icon: 'bg-indigo-100 text-indigo-700'
                  }
                  case 'purple': return {
                    step: 'bg-purple-100 text-purple-700 border-purple-300',
                    icon: 'bg-purple-100 text-purple-700'
                  }
                  case 'orange': return {
                    step: 'bg-orange-100 text-orange-700 border-orange-300',
                    icon: 'bg-orange-100 text-orange-700'
                  }
                  default: return {
                    step: 'bg-gray-100 text-gray-700 border-gray-300',
                    icon: 'bg-gray-100 text-gray-700'
                  }
                }
              }
              
              const stepClasses = getStepClasses(item.color)
              
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="text-center relative"
                >
                  {/* Step number */}
                  <div className={`w-12 h-12 rounded-full border-2 ${stepClasses.step} flex items-center justify-center mx-auto mb-4 font-bold text-lg shadow-sm`}>
                    {item.step}
                  </div>

                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl ${stepClasses.icon} flex items-center justify-center mx-auto mb-6 shadow-sm`}>
                    <Icon className="w-8 h-8" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Connector line */}
                  {index < howItWorks.length - 1 && (
                    <div className="hidden lg:block absolute top-6 left-full w-full h-0.5 bg-gray-200 -translate-x-1/2 z-0" />
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Why 7-Day Streaks Work
            </h2>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Short, focused learning bursts with AI guidance. Perfect for busy people who want real results.
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
                  className="bg-white border border-gray-200 rounded-3xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mx-auto mb-6`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Real Results in 7 Days
            </h2>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See what others accomplished with their 7-day learning streaks.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {successStories.map((story, index) => (
              <motion.div
                key={story.subject}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="text-center">
                  <div className="text-3xl mb-3">{story.avatar}</div>
                  <h3 className="font-semibold text-gray-900 mb-2">{story.subject}</h3>
                  <div className="flex items-center justify-center space-x-2 mb-3">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-medium text-gray-600">{story.days} days</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-sm text-gray-700">{story.outcome}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
} 