'use client'

import { useState, useEffect, useRef } from 'react'
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
  Plus,
  BookOpen,
  Target,
  Calendar,
  Star,
  Play,
  CheckCircle,
  Clock,
  Sparkles,
  ArrowRight,
  Trash2
} from 'lucide-react'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

interface LearningTemplate {
  id: string
  title: string
  description: string
  subject: string
  difficulty_level: string
  total_lessons: number
  estimated_days: number
  created_at: string
}

interface UserLearningPath {
  id: string
  template_id: string
  current_day: number
  streak_count: number
  last_lesson_date: string
  template: LearningTemplate
}

export default function Dashboard() {
  const { user, supabase } = useSupabase()
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [signingOut, setSigningOut] = useState(false)
  const [view, setView] = useState<'templates' | 'create' | 'learn'>('templates')
  
  // Template creation state
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [openaiKey, setOpenaiKey] = useState('')
  const [showKeyInput, setShowKeyInput] = useState(false)
  const [canTemplatize, setCanTemplatize] = useState(false)
  
  // Learning state
  const [userTemplates, setUserTemplates] = useState<LearningTemplate[]>([])
  const [activePaths, setActivePaths] = useState<UserLearningPath[]>([])

  // Auto-focus input when switching to create view
  useEffect(() => {
    if (view === 'create' && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [view, messages.length])

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
      setOpenaiKey(atob(keyData.encrypted_key))
    }

    // Load user templates
    const { data: templates } = await supabase
      .from('learning_templates')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (templates) {
      setUserTemplates(templates)
    }

    // Load active learning paths
    const { data: paths } = await supabase
      .from('user_learning_paths')
      .select(`
        *,
        template:learning_templates(*)
      `)
      .eq('user_id', user.id)
      .eq('is_active', true)

    if (paths) {
      setActivePaths(paths as UserLearningPath[])
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

    try {
      const { error } = await supabase
        .from('api_keys')
        .upsert({
          user_id: user.id,
          provider: 'openai',
          key_name: 'OpenAI API Key',
          encrypted_key: btoa(openaiKey)
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

    // Auto-focus after sending
    setTimeout(() => {
      inputRef.current?.focus()
    }, 100)

    try {
      // Enhanced prompt for template generation focused on 7-day learning
      const systemPrompt = messages.length === 0 
        ? `You are an expert learning designer specializing in intensive 7-day learning programs. Help create focused, effective learning templates.

        APPROACH:
        1. First understand EXACTLY what they want to learn
        2. Assess their current level and available time
        3. Design a 7-day intensive learning plan
        4. Focus on practical, achievable daily goals

        REQUIREMENTS FOR TEMPLATES:
        - EXACTLY 7 days (no more, no less)
        - Each day should build on the previous
        - Include specific daily objectives
        - Focus on practical application
        - Provide clear key concepts for each day

        Keep conversations engaging and focused. Ask specific questions to understand their goals, then create a comprehensive 7-day learning plan that someone can actually complete.`
        : ''

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: inputMessage }
          ],
          max_tokens: 800
        })
      })

      if (!response.ok) {
        throw new Error('Failed to get AI response')
      }

      const data = await response.json()
      const aiResponse = data.choices[0].message.content

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        role: 'assistant',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])

      // Check if ready to create template
      await checkIfReadyToTemplatize([...messages, userMessage, assistantMessage])

    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error. Please try again.',
        role: 'assistant',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const checkIfReadyToTemplatize = async (currentMessages: Message[]) => {
    if (currentMessages.length < 4) return

    try {
      const conversation = currentMessages
        .map(m => `${m.role}: ${m.content}`)
        .join('\n\n')

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{
            role: 'system',
            content: `Analyze this conversation to determine if it contains enough information to create a 7-day learning template.

            A conversation is ready for templatization if it includes:
            1. Clear learning subject/topic
            2. Defined learning objectives
            3. Some discussion of structure or timeline
            4. Evidence of a complete learning plan discussion
            5. At least 4-6 meaningful exchanges

            Respond with only "YES" if ready to create a template, or "NO" if more conversation is needed.`
          }, {
            role: 'user',
            content: conversation
          }],
          max_tokens: 10
        })
      })

      const data = await response.json()
      const result = data.choices[0].message.content.trim()
      
      setCanTemplatize(result === 'YES')
    } catch (error) {
      console.error('Error checking templatization readiness:', error)
    }
  }

  const templatizeConversation = async () => {
    if (!canTemplatize || !openaiKey) return

    try {
      const conversation = messages
        .map(m => `${m.role}: ${m.content}`)
        .join('\n\n')

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{
            role: 'system',
            content: `Based on this conversation, create a structured 7-day learning template. Extract the learning plan and format it as JSON.

            Return ONLY valid JSON in this exact format:
            {
              "title": "Short descriptive title",
              "description": "Brief description of what will be learned",
              "subject": "Main subject area",
              "difficulty_level": "beginner|intermediate|advanced",
              "estimated_days": 7,
              "lessons": [
                {
                  "day": 1,
                  "title": "Day 1 lesson title",
                  "objectives": ["Learning objective 1", "Learning objective 2"],
                  "key_concepts": ["Concept 1", "Concept 2"],
                  "practice_focus": "What to practice today"
                },
                {
                  "day": 2,
                  "title": "Day 2 lesson title", 
                  "objectives": ["Learning objective 1", "Learning objective 2"],
                  "key_concepts": ["Concept 1", "Concept 2"],
                  "practice_focus": "What to practice today"
                }
              ]
            }

            IMPORTANT: Always create exactly 7 days of lessons, no more, no less.`
          }, {
            role: 'user',
            content: conversation
          }],
          max_tokens: 1500
        })
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(`OpenAI API error: ${data.error?.message || 'Unknown error'}`)
      }

      const aiResponse = data.choices[0].message.content
      console.log('AI Response:', aiResponse)
      
      // Clean the response to extract only JSON
      let jsonString = aiResponse.trim()
      
      // Remove any markdown code blocks
      if (jsonString.startsWith('```json')) {
        jsonString = jsonString.replace(/^```json\s*/, '').replace(/\s*```$/, '')
      } else if (jsonString.startsWith('```')) {
        jsonString = jsonString.replace(/^```\s*/, '').replace(/\s*```$/, '')
      }
      
      // Find JSON object boundaries
      const jsonStart = jsonString.indexOf('{')
      const jsonEnd = jsonString.lastIndexOf('}') + 1
      
      if (jsonStart === -1 || jsonEnd === 0) {
        throw new Error('No valid JSON found in AI response')
      }
      
      jsonString = jsonString.substring(jsonStart, jsonEnd)
      
      let templateData
      try {
        templateData = JSON.parse(jsonString)
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError)
        console.error('Attempted to parse:', jsonString)
        throw new Error('Failed to parse AI response as JSON')
      }

      // Validate template data structure
      if (!templateData.title || !templateData.description || !templateData.lessons || !Array.isArray(templateData.lessons)) {
        throw new Error('Invalid template data structure from AI')
      }

      if (templateData.lessons.length !== 7) {
        throw new Error(`Expected 7 lessons, got ${templateData.lessons.length}`)
      }

      // Ensure all lessons have required fields
      for (let i = 0; i < templateData.lessons.length; i++) {
        const lesson = templateData.lessons[i]
        if (!lesson.title || !lesson.objectives || !lesson.key_concepts || !lesson.practice_focus) {
          throw new Error(`Lesson ${i + 1} is missing required fields`)
        }
      }

      console.log('Template data validated:', templateData)

      // Save to database
      const { data: template, error: templateError } = await supabase
        .from('learning_templates')
        .insert({
          user_id: user?.id,
          title: templateData.title,
          description: templateData.description,
          subject: templateData.subject || 'General',
          difficulty_level: templateData.difficulty_level || 'intermediate',
          total_lessons: templateData.lessons.length,
          estimated_days: templateData.estimated_days || 7,
          chat_history: messages
        })
        .select()
        .single()

      if (templateError) throw templateError

      // Save lessons (simplified structure for AI tutoring)
      const lessons = templateData.lessons.map((lesson: any) => ({
        template_id: template.id,
        day_number: lesson.day,
        lesson_title: lesson.title,
        lesson_content: {
          objectives: lesson.objectives,
          key_concepts: lesson.key_concepts,
          practice_focus: lesson.practice_focus
        }
      }))

      const { error: lessonsError } = await supabase
        .from('lessons')
        .insert(lessons)

      if (lessonsError) throw lessonsError

      // Create learning path
      const { error: pathError } = await supabase
        .from('user_learning_paths')
        .insert({
          user_id: user?.id,
          template_id: template.id,
          current_day: 1,
          streak_count: 0,
          is_active: true
        })

      if (pathError) throw pathError

      alert('7-Day AI Tutoring Template Created! 🎉 Your personalized learning plan is ready with interactive AI sessions.')
      setView('templates')
      setMessages([])
      setCanTemplatize(false)
      await loadUserData()

    } catch (error: any) {
      console.error('Error creating template:', error)
      
      let errorMessage = 'Error creating template. Please try again.'
      
      if (error.message) {
        if (error.message.includes('JSON')) {
          errorMessage = 'AI response format error. Please try rephrasing your learning goals.'
        } else if (error.message.includes('OpenAI API')) {
          errorMessage = 'OpenAI API error. Please check your API key and try again.'
        } else if (error.message.includes('template data structure')) {
          errorMessage = 'AI generated incomplete template. Please provide more specific learning details.'
        } else if (error.message.includes('lessons')) {
          errorMessage = 'AI generated wrong number of lessons. Please try again.'
        } else {
          errorMessage = `Error: ${error.message}`
        }
      }
      
      alert(errorMessage)
    }
  }

  const startLearningPath = (templateId: string) => {
    router.push(`/learn/${templateId}`)
  }

  const deleteTemplate = async (templateId: string) => {
    if (!confirm('Are you sure you want to delete this learning template? This action cannot be undone.')) {
      return
    }

    try {
      // Delete associated lessons first
      const { error: lessonsError } = await supabase
        .from('lessons')
        .delete()
        .eq('template_id', templateId)

      if (lessonsError) throw lessonsError

      // Delete associated learning paths
      const { error: pathsError } = await supabase
        .from('user_learning_paths')
        .delete()
        .eq('template_id', templateId)

      if (pathsError) throw pathsError

      // Delete the template
      const { error: templateError } = await supabase
        .from('learning_templates')
        .delete()
        .eq('id', templateId)
        .eq('user_id', user?.id) // Ensure user can only delete their own templates

      if (templateError) throw templateError

      // Refresh the data
      await loadUserData()
    } catch (error) {
      console.error('Error deleting template:', error)
      alert('Failed to delete template. Please try again.')
    }
  }

  const handleSignOut = async () => {
    if (!supabase) return
    setSigningOut(true)
    await supabase.auth.signOut()
    router.push('/')
  }

  if (!openaiKey && !showKeyInput) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
                              className="bg-white border border-gray-300 rounded-3xl p-8 text-center shadow-2xl shadow-blue-500/10"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Key className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Add Your OpenAI API Key</h2>
                  <p className="text-gray-700 mb-6">
              To start creating 7-day learning templates with AI tutoring, you'll need your OpenAI API key.
            </p>
            <Button 
              onClick={() => setShowKeyInput(true)}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3"
            >
              Add API Key
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </div>
      </div>
    )
  }

  if (showKeyInput) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-300 rounded-3xl p-8 shadow-2xl shadow-blue-500/10"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">OpenAI API Key</h2>
            <p className="text-gray-700 mb-6 text-sm">
              Your API key is stored securely and only used to generate personalized learning templates.
            </p>
            
            <div className="space-y-4">
              <Input
                type="password"
                placeholder="sk-..."
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                autoFocus
              />
              
              <div className="flex space-x-3">
                <Button 
                  onClick={saveApiKey}
                  disabled={!openaiKey}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                >
                  Save Key
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setShowKeyInput(false)}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </Button>
              </div>
            </div>
            
            <p className="text-gray-500 text-xs mt-4">
              Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank" className="text-blue-600 hover:underline">OpenAI Dashboard</a>
            </p>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="border-b border-gray-200/50 bg-white/80 backdrop-blur-sm p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">7-Day Learning Lab</h1>
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant={view === 'templates' ? 'default' : 'outline'}
                onClick={() => setView('templates')}
                size="sm"
                className={view === 'templates' 
                  ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                My Learning
              </Button>
              <Button
                variant={view === 'create' ? 'default' : 'outline'}
                onClick={() => setView('create')}
                size="sm"
                className={view === 'create' 
                  ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New
              </Button>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowKeyInput(true)}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Settings className="w-4 h-4 mr-2" />
              API Key
            </Button>
            
            {user && (
              <>
                <span className="text-gray-600 text-sm">{user.email}</span>
                <Button 
                  onClick={handleSignOut}
                  disabled={signingOut}
                  size="sm"
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {view === 'templates' && (
          <div className="max-w-6xl mx-auto">
            {/* Active Learning Paths */}
            {activePaths.length > 0 && (
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Continue Your Journey</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activePaths.map((path) => (
                    <motion.div
                      key={path.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                                        className="bg-white border border-gray-300 rounded-3xl p-6 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Flame className="w-5 h-5 text-orange-500" />
                      <span className="text-gray-900 font-bold">{path.streak_count} day streak</span>
                    </div>
                    <div className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full font-medium">
                      Day {path.current_day}/7
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{path.template.title}</h3>
                  <p className="text-gray-700 text-sm mb-4">{path.template.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Target className="w-4 h-4 mr-1" />
                            {path.template.difficulty_level}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            7 days
                          </span>
                        </div>
                        
                        <Button
                          onClick={() => startLearningPath(path.template_id)}
                          size="sm"
                          className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Continue
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* All Templates */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">All Learning Templates</h2>
              {userTemplates.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl text-gray-700 mb-2">No learning templates yet</h3>
                  <p className="text-gray-500 mb-6">Create your first AI-powered 7-day learning template!</p>
                  <Button 
                    onClick={() => setView('create')}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Template
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userTemplates.map((template) => (
                    <motion.div
                      key={template.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white border border-gray-300 rounded-3xl p-6 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm px-3 py-1 rounded-full font-medium">
                          7 Days
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm text-gray-700 font-medium">{template.difficulty_level}</span>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{template.title}</h3>
                      <p className="text-gray-700 text-sm mb-4">{template.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(template.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button
                            onClick={() => deleteTemplate(template.id)}
                            size="sm"
                            variant="outline"
                            className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </Button>
                          <Button
                            onClick={() => startLearningPath(template.id)}
                            size="sm"
                            className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
                          >
                            Start Learning
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {view === 'create' && (
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Create Your 7-Day Learning Plan</h2>
              <p className="text-gray-600 text-lg">
                Tell our AI what you want to learn, and we'll create a personalized 7-day curriculum with daily tutoring sessions.
              </p>
            </div>

            {/* Chat Interface */}
            <div className="bg-white border border-gray-300 rounded-3xl shadow-2xl shadow-blue-500/10 overflow-hidden">
              {/* Messages Area */}
              <div className="h-96 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 && (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <MessageCircle className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Start Learning?</h3>
                    <p className="text-gray-600 mb-4">Tell me what you'd like to master in the next 7 days!</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-2xl mx-auto">
                      {[
                        "Learn Python basics",
                        "Master public speaking", 
                        "Build a mobile app"
                      ].map((suggestion) => (
                        <button
                          key={suggestion}
                          onClick={() => setInputMessage(suggestion)}
                          className="p-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-sm transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-4 rounded-2xl ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </motion.div>
                ))}

                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-gray-100 p-4 rounded-2xl">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Template Creation Button */}
              {canTemplatize && (
                <div className="px-6 py-4 bg-gradient-to-r from-green-50 to-blue-50 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">Ready to create your template!</h4>
                      <p className="text-gray-600 text-sm">We have enough information to build your 7-day learning plan.</p>
                    </div>
                    <Button
                      onClick={templatizeConversation}
                      className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Create Template
                    </Button>
                  </div>
                </div>
              )}

              {/* Input Area */}
              <div className="border-t border-gray-200 p-6">
                <div className="flex space-x-3">
                  <Input
                    ref={inputRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        sendMessage()
                      }
                    }}
                    placeholder={
                      messages.length === 0 
                        ? "What would you like to learn in 7 days?" 
                        : "Continue the conversation..."
                    }
                    disabled={isLoading}
                    className="flex-1 bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-gray-500 text-xs mt-2">
                  💡 Be specific about your goals and current experience level for the best results
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 