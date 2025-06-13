'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, ArrowRight, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useSupabase } from '@/components/providers/supabase-provider'
import { supabase } from '@/lib/supabase'

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
      console.log('🚀 Creating Supabase user:', data.email)
      
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            role: data.role,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        console.error('❌ Supabase signup error:', error)
        if (error.message.includes('email')) {
          setErrors({ email: error.message })
        } else if (error.message.includes('password')) {
          setErrors({ password: error.message })
        } else {
          setErrors({ email: error.message })
        }
        return
      }

      if (!authData.user) {
        throw new Error('No user returned from signup')
      }

      console.log('✅ Supabase user created:', authData.user.id)
      console.log('📧 Check your email for confirmation link!')
      
      onNext()
    } catch (error: any) {
      console.error('❌ Unexpected error:', error)
      setErrors({ 
        email: 'Something went wrong. Please try again. If the problem persists, contact support.' 
      })
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
        <h2 className="text-2xl font-bold text-gray-900">Create Your Account</h2>
        <p className="text-gray-600">
          Enter your credentials to start your 7-day learning journey
        </p>
      </div>

      {/* Form */}
      <div className="space-y-4">
        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-700 font-medium">
            Email Address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              id="email"
              type="email"
              placeholder="you@company.com"
              value={data.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onUpdateData({ email: e.target.value })}
              className="pl-10 bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          {errors.email && (
            <p className="text-red-600 text-sm">{errors.email}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-gray-700 font-medium">
            Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter a secure password"
              value={data.password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onUpdateData({ password: e.target.value })}
              className="pl-10 pr-10 bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-600 text-sm">{errors.password}</p>
          )}
          <div className="flex items-center space-x-2 mt-2">
            <div className={`h-1 flex-1 rounded ${data.password.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <div className={`h-1 flex-1 rounded ${data.password.length >= 12 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <div className={`h-1 flex-1 rounded ${/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(data.password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
          </div>
          <p className="text-gray-600 text-xs">
            Use 8+ characters with numbers and symbols for maximum security
          </p>
        </div>
      </div>

      {/* Security Note */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Lock className="w-5 h-5 text-green-600 mt-0.5" />
          <div>
            <h4 className="text-green-700 font-medium text-sm">Bank-Level Security</h4>
            <p className="text-green-700 text-sm mt-1">
              Your data is encrypted end-to-end and protected with industry-standard security.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex space-x-3 pt-4">
        <Button
          onClick={onBack}
          variant="outline"
          className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        
        <Button
          onClick={handleNext}
          disabled={loading || !data.email || !data.password}
          className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
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