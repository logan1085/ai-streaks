'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, ArrowRight, User, Briefcase } from 'lucide-react'

interface ProfileStepProps {
  data: {
    email: string
    password: string
    fullName: string
    role: string
  }
  onNext: () => void
  onBack: () => void
  onUpdateData: (data: { fullName?: string; role?: string }) => void
}

const roles = [
  { id: 'developer', label: 'Developer', icon: '💻' },
  { id: 'designer', label: 'Designer', icon: '🎨' },
  { id: 'founder', label: 'Founder/CEO', icon: '🚀' },
  { id: 'researcher', label: 'AI Researcher', icon: '🔬' },
  { id: 'student', label: 'Student', icon: '📚' },
  { id: 'other', label: 'Other', icon: '✨' },
]

export function ProfileStep({ data, onNext, onBack, onUpdateData }: ProfileStepProps) {
  const [loading, setLoading] = useState(false)

  const handleNext = async () => {
    if (!data.fullName || !data.role) return
    
    setLoading(true)
    // Simulate API call for demo
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLoading(false)
    onNext()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white">Tell Us About Yourself</h2>
        <p className="text-slate-300">
          Help us personalize your AI experience
        </p>
      </div>

      {/* Form */}
      <div className="space-y-6">
        {/* Name Field */}
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-slate-300 font-medium">
            Full Name
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              id="fullName"
              type="text"
              placeholder="Enter your full name"
              value={data.fullName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onUpdateData({ fullName: e.target.value })}
              className="pl-10 bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 focus:border-purple-400"
            />
          </div>
        </div>

        {/* Role Selection */}
        <div className="space-y-3">
          <Label className="text-slate-300 font-medium">
            What best describes your role?
          </Label>
          <div className="grid grid-cols-2 gap-3">
            {roles.map((role) => (
              <button
                key={role.id}
                type="button"
                onClick={() => onUpdateData({ role: role.id })}
                className={`p-4 rounded-lg border text-left transition-all duration-200 ${
                  data.role === role.id
                    ? 'border-purple-400 bg-purple-500/20 text-white'
                    : 'border-slate-600 bg-slate-800/30 text-slate-300 hover:border-slate-500 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{role.icon}</span>
                  <div>
                    <p className="font-medium text-sm">{role.label}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* AI Personalization Note */}
      <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Briefcase className="w-5 h-5 text-purple-400 mt-0.5" />
          <div>
            <h4 className="text-purple-400 font-medium text-sm">Personalized AI Experience</h4>
            <p className="text-slate-300 text-sm mt-1">
              Our AI will adapt to your specific role and use cases for maximum relevance.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex space-x-3 pt-4">
        <Button
          onClick={onBack}
          variant="outline"
          className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-800"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        
        <Button
          onClick={handleNext}
          disabled={loading || !data.fullName || !data.role}
          className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
          ) : (
            <>
              Complete Setup
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </motion.div>
  )
} 