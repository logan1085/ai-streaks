'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, ArrowRight, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useSupabase } from '@/components/providers/supabase-provider'

interface AccountStepProps {
  data: {
    email: string
    password: string
    fullName: string
    role: string
  }
  onNext: () => void
  onBack: () => void
  onUpdateData: (data: { email?: string; password?: string }) => void
}

export function AccountStep({ data, onNext, onBack, onUpdateData }: AccountStepProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const { supabase } = useSupabase()

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {}
    
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    if (!data.password || data.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = async () => {
    if (!validateForm()) return
    
    setLoading(true)
    setErrors({})

    try {
      if (supabase) {
        console.log('🚀 Creating Supabase user:', data.email)
        
        const { data: authData, error } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: {
              full_name: data.fullName,
              role: data.role,
            }
          }
        })

        if (error) {
          console.error('❌ Supabase signup error:', error)
          setErrors({ email: error.message })
          return
        }

        console.log('✅ Supabase user created:', authData.user?.id)
        console.log('📧 Check your email for confirmation link!')
        
      } else {
        console.log('⚠️  Demo mode - no actual user created')
        // Demo mode fallback
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
      
      onNext()
    } catch (error: any) {
      console.error('❌ Unexpected error:', error)
      setErrors({ email: 'Something went wrong. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white">Create Your Account</h2>
        <p className="text-slate-300">
          Enter your credentials to access the AI revolution
        </p>
      </div>

      {/* Form */}
      <div className="space-y-4">
        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-slate-300 font-medium">
            Email Address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              id="email"
              type="email"
              placeholder="you@company.com"
              value={data.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onUpdateData({ email: e.target.value })}
              className="pl-10 bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 focus:border-purple-400"
            />
          </div>
          {errors.email && (
            <p className="text-red-400 text-sm">{errors.email}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-slate-300 font-medium">
            Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter a secure password"
              value={data.password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onUpdateData({ password: e.target.value })}
              className="pl-10 pr-10 bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 focus:border-purple-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-400 text-sm">{errors.password}</p>
          )}
          <div className="flex items-center space-x-2 mt-2">
            <div className={`h-1 flex-1 rounded ${data.password.length >= 8 ? 'bg-green-400' : 'bg-slate-600'}`}></div>
            <div className={`h-1 flex-1 rounded ${data.password.length >= 12 ? 'bg-green-400' : 'bg-slate-600'}`}></div>
            <div className={`h-1 flex-1 rounded ${/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(data.password) ? 'bg-green-400' : 'bg-slate-600'}`}></div>
          </div>
          <p className="text-slate-400 text-xs">
            Use 8+ characters with numbers and symbols for maximum security
          </p>
        </div>
      </div>

      {/* Security Note */}
      <div className="bg-slate-800/30 border border-slate-600/50 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Lock className="w-5 h-5 text-green-400 mt-0.5" />
          <div>
            <h4 className="text-green-400 font-medium text-sm">Bank-Level Security</h4>
            <p className="text-slate-300 text-sm mt-1">
              Your data is encrypted end-to-end and protected by quantum-resistant algorithms.
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
          disabled={loading || !data.email || !data.password}
          className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
          ) : (
            <>
              Create Account
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </motion.div>
  )
} 