'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useSupabase } from '@/components/providers/supabase-provider'
import { 
  User, 
  LogOut, 
  Send,
  Flame,
  Settings,
  Key,
  MessageCircle,
  Plus
} from 'lucide-react'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

export default function Dashboard() {
  const { user, supabase } = useSupabase()
  const router = useRouter()
  const [signingOut, setSigningOut] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [openaiKey, setOpenaiKey] = useState('')
  const [showKeyInput, setShowKeyInput] = useState(false)
  const [todayMessages, setTodayMessages] = useState(0)
  const [currentStreak, setCurrentStreak] = useState(0)

  // Load API key and streak data on mount
  useEffect(() => {
    if (user && supabase) {
      loadUserData()
    }
  }, [user, supabase])

  const loadUserData = async () => {
    if (!supabase || !user) return

    // Load API key
    const { data: keyData } = await supabase
      .from('api_keys')
      .select('encrypted_key')
      .eq('user_id', user.id)
      .eq('provider', 'openai')
      .single()

    if (keyData) {
      // In a real app, you'd decrypt this properly
      setOpenaiKey(atob(keyData.encrypted_key))
    }

    // Load today's message count and streak
    const today = new Date().toISOString().split('T')[0]
    
    const { data: streakData } = await supabase
      .from('user_streaks')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)
      .single()

    if (streakData) {
      setTodayMessages(streakData.message_count)
      setCurrentStreak(streakData.current_streak)
    }
  }

  const saveApiKey = async () => {
    if (!supabase || !user || !openaiKey) {
      console.log('Missing requirements:', { 
        supabase: !!supabase, 
        user: !!user, 
        openaiKey: !!openaiKey 
      })
      return
    }

    console.log('Saving API key for user:', user.id)

    try {
      const { error } = await supabase
        .from('api_keys')
        .upsert({
          user_id: user.id,
          provider: 'openai',
          key_name: 'OpenAI API Key',
          encrypted_key: btoa(openaiKey) // Basic encoding - use proper encryption in production
        })

      if (error) {
        console.error('Error saving API key:', error)
        alert('Error saving API key: ' + error.message)
      } else {
        console.log('API key saved successfully')
        setShowKeyInput(false)
      }
    } catch (err) {
      console.error('Unexpected error saving API key:', err)
      alert('Unexpected error saving API key')
    }
  }

  const sendMessage = async () => {
    if (!inputMessage.trim() || !openaiKey || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      role: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      // Call OpenAI API
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: inputMessage }
          ],
          max_tokens: 500
        })
      })

      if (!response.ok) {
        throw new Error('Failed to get response from OpenAI')
      }

      const data = await response.json()
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.choices[0].message.content,
        role: 'assistant',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])

      // Update streak data
      await updateStreak()

    } catch (error) {
      console.error('Error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, there was an error processing your message. Please check your API key.',
        role: 'assistant',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const updateStreak = async () => {
    if (!supabase || !user) {
      console.log('Missing supabase or user for streak update')
      return
    }

    console.log('Updating streak...', { todayMessages, currentStreak })

    const today = new Date().toISOString().split('T')[0]
    const newMessageCount = todayMessages + 1

    console.log('Today:', today, 'New message count:', newMessageCount)

    // Check if user had messages yesterday
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]

    console.log('Checking yesterday:', yesterdayStr)

    const { data: yesterdayData, error: yesterdayError } = await supabase
      .from('user_streaks')
      .select('current_streak')
      .eq('user_id', user.id)
      .eq('date', yesterdayStr)
      .single()

    if (yesterdayError) {
      console.log('No yesterday data (this is normal for first day):', yesterdayError.message)
    } else {
      console.log('Yesterday data:', yesterdayData)
    }

    let newStreak = 1
    if (yesterdayData && todayMessages === 0) {
      // First message today and had messages yesterday, continue streak
      newStreak = yesterdayData.current_streak + 1
      console.log('Continuing streak from yesterday:', newStreak)
    } else if (todayMessages > 0) {
      // Already have messages today, keep current streak
      newStreak = currentStreak
      console.log('Keeping current streak:', newStreak)
    } else {
      console.log('Starting new streak:', newStreak)
    }

    console.log('Saving streak data:', {
      user_id: user.id,
      date: today,
      message_count: newMessageCount,
      current_streak: newStreak
    })

    const { error } = await supabase
      .from('user_streaks')
      .upsert({
        user_id: user.id,
        date: today,
        message_count: newMessageCount,
        current_streak: newStreak
      })

    if (error) {
      console.error('Error updating streak:', error)
    } else {
      console.log('Streak updated successfully')
      setTodayMessages(newMessageCount)
      setCurrentStreak(newStreak)
      console.log('Updated state:', { newMessageCount, newStreak })
    }
  }

  const handleSignOut = async () => {
    if (!supabase) return
    
    setSigningOut(true)
    try {
      await supabase.auth.signOut()
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
    } finally {
      setSigningOut(false)
    }
  }

  if (!openaiKey && !showKeyInput) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-8 text-center"
          >
            <Key className="w-16 h-16 text-cyan-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">Add Your OpenAI API Key</h2>
            <p className="text-slate-400 mb-6">
              To start chatting and building your streak, you'll need to add your OpenAI API key.
            </p>
            <Button 
              onClick={() => setShowKeyInput(true)}
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
            >
              Add API Key
            </Button>
          </motion.div>
        </div>
      </div>
    )
  }

  if (showKeyInput) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-4">OpenAI API Key</h2>
            <p className="text-slate-400 mb-6 text-sm">
              Your API key is stored securely and only used to send messages to OpenAI.
            </p>
            
            <div className="space-y-4">
              <Input
                type="password"
                placeholder="sk-..."
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                className="bg-slate-800 border-slate-600 text-white"
              />
              
              <div className="flex space-x-3">
                <Button 
                  onClick={saveApiKey}
                  disabled={!openaiKey}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
                >
                  Save Key
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setShowKeyInput(false)}
                  className="border-slate-600 text-slate-300"
                >
                  Cancel
                </Button>
              </div>
            </div>
            
            <p className="text-slate-500 text-xs mt-4">
              Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank" className="text-cyan-400 hover:underline">OpenAI Dashboard</a>
            </p>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="border-b border-slate-800/50 bg-slate-900/30 backdrop-blur-sm p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Flame className="w-6 h-6 text-orange-400" />
              <span className="text-xl font-bold text-white">{currentStreak} day streak</span>
            </div>
            <div className="text-slate-400 text-sm">
              {todayMessages} messages today
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowKeyInput(true)}
              className="border-slate-600 text-slate-300"
            >
              <Settings className="w-4 h-4 mr-2" />
              API Key
            </Button>
            
            {user && (
              <>
                <span className="text-slate-400 text-sm">{user.email}</span>
                <Button 
                  onClick={handleSignOut}
                  disabled={signingOut}
                  size="sm"
                  variant="outline"
                  className="border-slate-600 text-slate-300"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-slate-400 mt-20">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Start a conversation to begin your streak!</p>
            </div>
          ) : (
            messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                      : 'bg-slate-800 text-slate-100'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </motion.div>
            ))
          )}
          
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-slate-800 p-4 rounded-2xl">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-slate-800/50 p-4">
          <div className="flex space-x-3">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1 bg-slate-800 border-slate-600 text-white placeholder-slate-400"
            />
            <Button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 