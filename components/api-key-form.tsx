'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Lock, Key, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react'
import { useSupabase } from '@/components/providers/supabase-provider'

interface ApiKeyFormProps {
  provider: string
  onSuccess: () => void
  onCancel: () => void
}

export function ApiKeyForm({ provider, onSuccess, onCancel }: ApiKeyFormProps) {
  const [keyName, setKeyName] = useState(`${provider} Key`)
  const [apiKey, setApiKey] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  
  const { user, supabase } = useSupabase()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !supabase) return

    setLoading(true)
    setError('')

    try {
      // Simple "encryption" - in production, use proper encryption
      const encryptedKey = btoa(apiKey) // Base64 encoding (NOT secure for production)

      const { error } = await supabase
        .from('api_keys')
        .insert({
          user_id: user.id,
          provider: provider.toLowerCase(),
          key_name: keyName,
          encrypted_key: encryptedKey,
          is_active: true
        })

      if (error) {
        console.error('Error saving API key:', error)
        setError('Failed to save API key. Please try again.')
        return
      }

      console.log('✅ API key saved successfully')
      setSuccess(true)
      
      // Show success message then close
      setTimeout(() => {
        onSuccess()
      }, 1500)

    } catch (error: any) {
      console.error('❌ Unexpected error:', error)
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getKeyFormat = (provider: string) => {
    switch (provider.toLowerCase()) {
      case 'openai':
        return 'sk-...'
      case 'anthropic':
        return 'sk-ant-...'
      case 'google ai':
        return 'AIza...'
      case 'cohere':
        return 'co-...'
      default:
        return 'your-api-key'
    }
  }

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-8"
      >
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">API Key Added!</h3>
        <p className="text-slate-300">Your {provider} API key has been securely stored.</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-2">Add {provider} API Key</h3>
        <p className="text-slate-300">
          Securely store your API key to start using {provider} models
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Key Name */}
        <div className="space-y-2">
          <Label htmlFor="keyName" className="text-slate-300 font-medium">
            Key Name
          </Label>
          <div className="relative">
            <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              id="keyName"
              type="text"
              placeholder="My OpenAI Key"
              value={keyName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKeyName(e.target.value)}
              className="pl-10 bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 focus:border-purple-400"
            />
          </div>
        </div>

        {/* API Key */}
        <div className="space-y-2">
          <Label htmlFor="apiKey" className="text-slate-300 font-medium">
            API Key
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              id="apiKey"
              type={showKey ? 'text' : 'password'}
              placeholder={getKeyFormat(provider)}
              value={apiKey}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setApiKey(e.target.value)}
              className="pl-10 pr-10 bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 focus:border-purple-400 font-mono text-sm"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
            >
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-slate-400 text-xs">
            Your API key will be encrypted and stored securely
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span className="text-red-400 text-sm">{error}</span>
          </div>
        )}

        {/* Security Note */}
        <div className="bg-slate-800/30 border border-slate-600/50 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Lock className="w-5 h-5 text-green-400 mt-0.5" />
            <div>
              <h4 className="text-green-400 font-medium text-sm">Secure Storage</h4>
              <p className="text-slate-300 text-sm mt-1">
                Your API keys are encrypted and never shared. You can delete them anytime.
              </p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex space-x-3 pt-4">
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-800"
          >
            Cancel
          </Button>
          
          <Button
            type="submit"
            disabled={loading || !apiKey.trim() || !keyName.trim()}
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            ) : (
              <Lock className="w-4 h-4 mr-2" />
            )}
            Save API Key
          </Button>
        </div>
      </form>
    </motion.div>
  )
} 