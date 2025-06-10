'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { CheckCircle, Sparkles, ArrowRight, Brain } from 'lucide-react'
import Link from 'next/link'

interface FinalStepProps {
  data: {
    email: string
    password: string
    fullName: string
    role: string
  }
}

const roleMessages = {
  developer: 'Ready to build the future with AI',
  designer: 'Design experiences beyond imagination',
  founder: 'Lead the AI revolution in your industry',
  researcher: 'Push the boundaries of artificial intelligence',
  student: 'Learn from the cutting edge of AI technology',
  other: 'Explore limitless possibilities with AI',
}

export function FinalStep({ data }: FinalStepProps) {
  const roleMessage = roleMessages[data.role as keyof typeof roleMessages] || roleMessages.other

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-6"
    >
      {/* Success Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="flex justify-center"
      >
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <div className="absolute -top-2 -right-2">
            <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
          </div>
        </div>
      </motion.div>

      {/* Welcome Message */}
      <div className="space-y-3">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold text-white"
        >
          Welcome aboard, {data.fullName.split(' ')[0]}! 🎉
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-slate-300 text-lg"
        >
          {roleMessage}
        </motion.p>
      </div>

      {/* Setup Complete Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-3"
      >
        <div className="bg-slate-800/30 border border-slate-600/50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div className="text-left">
              <p className="text-white font-medium text-sm">Account Created</p>
              <p className="text-slate-400 text-xs">{data.email}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/30 border border-slate-600/50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div className="text-left">
              <p className="text-white font-medium text-sm">Profile Configured</p>
              <p className="text-slate-400 text-xs">Personalized for {data.role}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/30 border border-slate-600/50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div className="text-left">
              <p className="text-white font-medium text-sm">AI Engine Ready</p>
              <p className="text-slate-400 text-xs">Quantum-powered neural networks active</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Next Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-6 space-y-4"
      >
        <div className="flex items-center justify-center space-x-2">
          <Brain className="w-5 h-5 text-purple-400" />
          <h3 className="text-purple-400 font-semibold">What's Next?</h3>
        </div>
        
        <div className="space-y-2 text-sm text-slate-300">
          <p>✨ Access exclusive AI models and tools</p>
          <p>🚀 Join our private community of early adopters</p>
          <p>🧠 Get priority support from our AI research team</p>
        </div>
      </motion.div>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="space-y-3 pt-4"
      >
        <Button
          asChild
          size="lg"
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-3 rounded-xl"
        >
          <Link href="/dashboard">
            Enter the AI Lab
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
        
        <Button
          asChild
          variant="outline"
          className="w-full border-slate-600 text-slate-300 hover:bg-slate-800"
        >
          <Link href="/">
            Return to Home
          </Link>
        </Button>
      </motion.div>

      {/* Background glow effect */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-green-500/5 to-emerald-500/5 rounded-3xl blur-xl"></div>
    </motion.div>
  )
} 