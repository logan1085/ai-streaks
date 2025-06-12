'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { WelcomeStep } from '@/components/onboarding/welcome-step'
import { AccountStep } from '@/components/onboarding/account-step'
import { ProfileStep } from '@/components/onboarding/profile-step'
import { FinalStep } from '@/components/onboarding/final-step'

type OnboardingData = {
  email: string
  password: string
  fullName: string
  role: string
}

const steps = [
  { id: 'welcome', title: 'Welcome' },
  { id: 'account', title: 'Create Account' },
  { id: 'profile', title: 'Profile Setup' },
  { id: 'final', title: 'You\'re In' },
]

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    email: '',
    password: '',
    fullName: '',
    role: '',
  })

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const updateData = (data: Partial<OnboardingData>) => {
    setOnboardingData(prev => ({ ...prev, ...data }))
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <WelcomeStep onNext={nextStep} />
      case 1:
        return (
          <AccountStep
            data={onboardingData}
            onNext={nextStep}
            onBack={prevStep}
            onUpdateData={updateData}
          />
        )
      case 2:
        return (
          <ProfileStep
            data={onboardingData}
            onNext={nextStep}
            onBack={prevStep}
            onUpdateData={updateData}
          />
        )
      case 3:
        return <FinalStep data={onboardingData} />
      default:
        return <WelcomeStep onNext={nextStep} />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 via-white/30 to-indigo-100/20"></div>
        
        {/* Floating orbs */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-20 left-20 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl"
        />
      </div>

      <div className="relative w-full max-w-md z-10">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index <= currentStep
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg shadow-blue-500/25'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          <div className="text-center">
            <p className="text-gray-600 text-sm">
              Step {currentStep + 1} of {steps.length}
            </p>
          </div>
        </div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
} 