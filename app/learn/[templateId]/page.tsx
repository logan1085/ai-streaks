'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useSupabase } from '@/components/providers/supabase-provider'
import { 
  ArrowLeft, 
  Send,
  Flame,
  Target,
  Trophy,
  Heart,
  BookOpen,
  CheckCircle,
  MessageCircle
} from 'lucide-react'

interface Lesson {
  id: string
  template_id: string
  day_number: number
  lesson_title: string
  lesson_content: {
    objectives: string[]
    key_concepts: string[]
    practice_focus: string
  }
}

interface LearningTemplate {
  id: string
  title: string
  description: string
  subject: string
  difficulty_level: string
  total_lessons: number
  estimated_days: number
}

interface TutorMessage {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

interface UserProgress {
  previous_days_completed: number
  current_day: number
  streak_count: number
  previous_sessions: any[]
}

export default function LearnPage() {
  const { templateId } = useParams()
  const router = useRouter()
  const { user, supabase } = useSupabase()
  
  const [template, setTemplate] = useState<LearningTemplate | null>(null)
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null)
  const [openaiKey, setOpenaiKey] = useState('')
  
  // AI Tutor Session State
  const [messages, setMessages] = useState<TutorMessage[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null)
  const [isSessionComplete, setIsSessionComplete] = useState(false)
  const [completionScore, setCompletionScore] = useState(0)
  const [questionsAsked, setQuestionsAsked] = useState(0)
  const [correctResponses, setCorrectResponses] = useState(0)

  // Auto-focus input ref - MUST be at top level
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (user && supabase && templateId) {
      loadLearningSession()
    }
  }, [user, supabase, templateId])

  // Auto-focus effect - MUST be at top level
  useEffect(() => {
    if (!isSessionComplete && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isSessionComplete, messages.length])

  // Auto-scroll to bottom when new messages arrive
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const loadLearningSession = async () => {
    if (!supabase || !user || !templateId) return

    try {
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

      // Load template
      const { data: templateData, error: templateError } = await supabase
        .from('learning_templates')
        .select('*')
        .eq('id', templateId)
        .single()

      if (templateError) throw templateError
      setTemplate(templateData)

      // Load learning path to get current day
      const { data: pathData, error: pathError } = await supabase
        .from('user_learning_paths')
        .select('*')
        .eq('user_id', user.id)
        .eq('template_id', templateId)
        .single()

      if (pathError) throw pathError

      const currentDay = pathData.current_day
      setUserProgress({
        previous_days_completed: currentDay - 1,
        current_day: currentDay,
        streak_count: pathData.streak_count,
        previous_sessions: []
      })

      // Load today's lesson
      const { data: lessonData, error: lessonError } = await supabase
        .from('lessons')
        .select('*')
        .eq('template_id', templateId)
        .eq('day_number', currentDay)
        .single()

      if (lessonError) throw lessonError
      setCurrentLesson(lessonData)

      // Load previous completed sessions for context
      const { data: progressData } = await supabase
        .from('lesson_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('template_id', templateId)
        .eq('status', 'completed')
        .order('completed_at')

      if (progressData) {
        setUserProgress(prev => prev ? { ...prev, previous_sessions: progressData } : null)
      }

      // Start the AI tutoring session
      if (lessonData && openaiKey) {
        await startTutoringSession(lessonData, {
          previous_days_completed: currentDay - 1,
          current_day: currentDay,
          streak_count: pathData.streak_count,
          previous_sessions: progressData || []
        })
      }

    } catch (error) {
      console.error('Error loading learning session:', error)
    }
  }

  const startTutoringSession = async (lesson: Lesson, progress: UserProgress) => {
    setSessionStartTime(new Date())
    setQuestionsAsked(0)
    setCorrectResponses(0)
    setIsSessionComplete(false)

    // AI starts the session with personalized greeting
    const welcomeMessage: TutorMessage = {
      id: Date.now().toString(),
      content: await getAIResponse([], lesson, progress, true),
      role: 'assistant',
      timestamp: new Date()
    }

    setMessages([welcomeMessage])
  }

  const getAIResponse = async (
    currentMessages: TutorMessage[], 
    lesson: Lesson, 
    progress: UserProgress, 
    isWelcome: boolean = false
  ): Promise<string> => {
    if (!openaiKey) return "Please add your OpenAI API key to continue."

    try {
      // Build previous sessions context
      let previousSessionsContext = ''
      if (progress.previous_sessions && progress.previous_sessions.length > 0) {
        const recentSessions = progress.previous_sessions
          .filter(session => session.session_data?.conversation)
          .slice(-2) // Get last 2 sessions for context
          .map(session => {
            const sessionData = session.session_data
            const lastFewMessages = sessionData.conversation.slice(-4) // Last 4 messages from each session
            return `
Day ${sessionData.lesson_context.day_number} (${sessionData.lesson_context.lesson_title}):
Key concepts covered: ${sessionData.lesson_context.key_concepts.join(', ')}
Recent conversation:
${lastFewMessages.map((msg: any) => `${msg.role}: ${msg.content.substring(0, 200)}...`).join('\n')}
Session score: ${sessionData.session_stats.completion_score}%
`
          }).join('\n---\n')
        
        if (recentSessions) {
          previousSessionsContext = `
PREVIOUS LEARNING SESSIONS:
${recentSessions}

BUILD ON THIS: Reference previous concepts and adapt your teaching based on the user's demonstrated understanding and learning patterns.
`
        }
      }

      const systemPrompt = `You are an expert AI tutor conducting a personalized learning session. 

CONTEXT:
- Template: ${template?.title} (${template?.subject})
- Today is Day ${lesson.day_number}: ${lesson.lesson_title}
- User has completed ${progress.previous_days_completed} previous days
- Current streak: ${progress.streak_count} days
- Difficulty level: ${template?.difficulty_level}

${previousSessionsContext}

TODAY'S LESSON OBJECTIVES:
${lesson.lesson_content.objectives.map(obj => `- ${obj}`).join('\n')}

KEY CONCEPTS TO COVER:
${lesson.lesson_content.key_concepts.map(concept => `- ${concept}`).join('\n')}

PRACTICE FOCUS: ${lesson.lesson_content.practice_focus}

TUTORING GUIDELINES:
1. ${isWelcome ? 'Start with an encouraging welcome and outline today\'s goals' : 'Continue the interactive lesson'}
2. Ask thoughtful questions to check understanding
3. Provide explanations when needed
4. Give practical examples and exercises
5. Adapt difficulty based on responses
6. Build on previous days' learning and reference past sessions
7. Keep responses conversational but educational
8. After 8-12 meaningful exchanges, naturally conclude the lesson

IMPORTANT: Track the conversation. After substantial learning has occurred (8-12 exchanges), respond with "LESSON_COMPLETE:" followed by a summary and encouragement.`

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: systemPrompt },
            ...currentMessages.map(m => ({ role: m.role, content: m.content }))
          ],
          max_tokens: 600
        })
      })

      if (!response.ok) {
        throw new Error('Failed to get AI response')
      }

      const data = await response.json()
      return data.choices[0].message.content

    } catch (error) {
      console.error('Error getting AI response:', error)
      return "I'm having trouble connecting right now. Please try again."
    }
  }

  const sendMessage = async () => {
    if (!inputMessage.trim() || !currentLesson || !userProgress || isLoading) return

    const userMessage: TutorMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      role: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const aiResponse = await getAIResponse([...messages, userMessage], currentLesson, userProgress)
      
      // Check if lesson is complete
      if (aiResponse.startsWith('LESSON_COMPLETE:')) {
        const finalMessage = aiResponse.replace('LESSON_COMPLETE:', '').trim()
        const assistantMessage: TutorMessage = {
          id: (Date.now() + 1).toString(),
          content: finalMessage,
          role: 'assistant',
          timestamp: new Date()
        }
        
        setMessages(prev => [...prev, assistantMessage])
        setIsSessionComplete(true)
        setCompletionScore(85) // Base completion score
        
        // Complete the lesson
        await completeLesson()
      } else {
        const assistantMessage: TutorMessage = {
          id: (Date.now() + 1).toString(),
          content: aiResponse,
          role: 'assistant',
          timestamp: new Date()
        }
        
        setMessages(prev => [...prev, assistantMessage])
        setQuestionsAsked(prev => prev + 1)
      }

    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: TutorMessage = {
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

  const completeLesson = async () => {
    if (!supabase || !user || !currentLesson || !userProgress) return

    try {
      const timeSpent = sessionStartTime 
        ? Math.round((new Date().getTime() - sessionStartTime.getTime()) / 1000)
        : 0

      // Prepare session data to save
      const sessionData = {
        conversation: messages.map(msg => ({
          role: msg.role,
          content: msg.content,
          timestamp: msg.timestamp.toISOString()
        })),
        lesson_context: {
          day_number: currentLesson.day_number,
          lesson_title: currentLesson.lesson_title,
          objectives: currentLesson.lesson_content.objectives,
          key_concepts: currentLesson.lesson_content.key_concepts,
          practice_focus: currentLesson.lesson_content.practice_focus
        },
        session_stats: {
          questions_asked: questionsAsked,
          time_spent: timeSpent,
          completion_score: completionScore,
          session_start: sessionStartTime?.toISOString(),
          session_end: new Date().toISOString()
        },
        user_progress_snapshot: {
          previous_days_completed: userProgress.previous_days_completed,
          current_day: userProgress.current_day,
          streak_count: userProgress.streak_count
        }
      }

      // Save lesson progress with session data
      await supabase
        .from('lesson_progress')
        .upsert({
          user_id: user.id,
          lesson_id: currentLesson.id,
          template_id: templateId,
          status: 'completed',
          score: completionScore,
          attempts: 1,
          time_spent: timeSpent,
          session_data: sessionData,
          completed_at: new Date().toISOString(),
          last_attempted_at: new Date().toISOString()
        })

      // Update learning path
      const today = new Date().toISOString().split('T')[0]
      const newStreak = userProgress.streak_count + 1
      const nextDay = Math.min(userProgress.current_day + 1, 7)

      await supabase
        .from('user_learning_paths')
        .update({
          current_day: nextDay,
          streak_count: newStreak,
          last_lesson_date: today
        })
        .eq('user_id', user.id)
        .eq('template_id', templateId)

    } catch (error) {
      console.error('Error completing lesson:', error)
    }
  }

  const continueLearning = () => {
    router.push('/dashboard')
  }

  const markDayComplete = async () => {
    if (!confirm('Are you sure you want to mark this day as complete? This will end your current session.')) {
      return
    }
    
    setIsSessionComplete(true)
    setCompletionScore(100) // Full score for manual completion
    await completeLesson()
  }

  if (!template || !currentLesson || !userProgress) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-blue-600 animate-pulse" />
          </div>
          <p className="text-gray-900 text-xl font-medium">Starting your AI tutoring session...</p>
          <p className="text-gray-600 text-sm mt-2">Preparing your personalized learning experience</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white shadow-sm p-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/dashboard')}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            <div>
              <h1 className="text-xl font-bold text-gray-900">{template.title}</h1>
              <p className="text-gray-600 text-sm">Day {currentLesson.day_number}: {currentLesson.lesson_title}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-gray-900 font-medium text-sm">{userProgress.streak_count} day streak</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4 text-blue-500" />
              <span className="text-gray-900 font-medium text-sm">Day {userProgress.current_day}/7</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-4 h-4 text-green-500" />
              <span className="text-gray-900 font-medium text-sm">{messages.length} exchanges</span>
            </div>

            {!isSessionComplete && (
              <Button
                onClick={markDayComplete}
                size="sm"
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark Complete
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Learning Objectives - Collapsible */}
      <div className="bg-blue-50 border-b border-blue-200 px-6 py-3 flex-shrink-0">
        <div className="max-w-6xl mx-auto">
          <details className="group">
            <summary className="cursor-pointer flex items-center justify-between text-gray-900 font-medium">
              <span>📚 Today's Learning Objectives</span>
              <span className="text-blue-600 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentLesson.lesson_content.objectives.map((objective, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 text-sm">{objective}</span>
                </div>
              ))}
            </div>
          </details>
        </div>
      </div>

      {/* Chat Interface - Full Height */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to Learn!</h3>
                <p className="text-gray-600 mb-4">Your AI tutor is ready to guide you through today's lesson.</p>
                <p className="text-gray-500 text-sm">Start by asking a question or saying hello!</p>
              </div>
            )}

            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-3 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {message.role === 'user' ? '👤' : '🤖'}
                  </div>
                  
                  {/* Message */}
                  <div
                    className={`p-4 rounded-2xl shadow-sm ${
                      message.role === 'user'
                        ? 'bg-blue-500 text-white rounded-br-md'
                        : 'bg-white text-gray-900 border border-gray-200 rounded-bl-md'
                    }`}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    <div className={`text-xs mt-2 ${message.role === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="flex items-start space-x-3 max-w-[85%]">
                  <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center flex-shrink-0">
                    🤖
                  </div>
                  <div className="bg-white border border-gray-200 p-4 rounded-2xl rounded-bl-md shadow-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Completion Screen */}
        {isSessionComplete && (
          <div className="p-6 bg-green-50 border-t border-green-200">
            <div className="max-w-4xl mx-auto text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Day {userProgress.current_day} Complete! 🎉</h3>
              <p className="text-gray-600 mb-6">Great job! You've completed today's learning session.</p>
              
              <div className="flex justify-center space-x-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{completionScore}%</div>
                  <div className="text-gray-600 text-sm">Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{userProgress.current_day}</div>
                  <div className="text-gray-600 text-sm">Days Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{7 - userProgress.current_day}</div>
                  <div className="text-gray-600 text-sm">Days Remaining</div>
                </div>
              </div>
              
                              <Button
                  onClick={continueLearning}
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
                >
                  {userProgress.current_day >= 7 ? 'Complete Course! 🏆' : 'Continue Tomorrow'}
                </Button>
            </div>
          </div>
        )}

        {/* Input Section */}
        {!isSessionComplete && (
          <div className="border-t border-gray-200 bg-white p-4 flex-shrink-0">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-end space-x-3">
                <div className="flex-1 relative">
                  <textarea
                    ref={inputRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        sendMessage()
                      }
                    }}
                    placeholder="Ask questions, share your thoughts, or respond to your tutor..."
                    disabled={isLoading}
                    rows={1}
                    className="w-full resize-none rounded-2xl border border-gray-300 px-4 py-3 pr-12 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-200"
                    style={{
                      minHeight: '48px',
                      maxHeight: '120px',
                      height: 'auto'
                    }}
                    onInput={(e) => {
                      const target = e.target as HTMLTextAreaElement
                      target.style.height = 'auto'
                      target.style.height = Math.min(target.scrollHeight, 120) + 'px'
                    }}
                    maxLength={500}
                  />
                  
                  {/* Character count */}
                  <div className="absolute bottom-1 right-12 text-xs text-gray-400">
                    {inputMessage.length}/500
                  </div>
                </div>
                
                <Button
                  onClick={sendMessage}
                  disabled={!inputMessage.trim() || isLoading || inputMessage.length > 500}
                  className="h-12 w-12 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex-shrink-0"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
              
              <div className="flex items-center justify-between mt-2">
                <p className="text-gray-500 text-xs">
                  💡 Press Enter to send • Shift+Enter for new line
                </p>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>Session: {Math.floor((Date.now() - (sessionStartTime?.getTime() || Date.now())) / 60000)}m</span>
                  <span>Messages: {messages.length}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 