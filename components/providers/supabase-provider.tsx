'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import type { User } from '@supabase/supabase-js'

type SupabaseContextType = {
  user: User | null
  loading: boolean
  supabase: any
}

const SupabaseContext = createContext<SupabaseContextType>({
  user: null,
  loading: true,
  supabase: null
})

export const useSupabase = () => {
  return useContext(SupabaseContext)
}

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Check if environment variables are properly set
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  // Debug: Log what we're getting
  console.log('Supabase URL:', supabaseUrl)
  console.log('Supabase Key exists:', !!supabaseKey)
  console.log('Supabase Key length:', supabaseKey?.length || 0)

  // Create supabase client only if we have valid credentials
  let supabase: any = null
  
  if (supabaseUrl && supabaseKey && 
      supabaseUrl !== 'https://your-project.supabase.co' && 
      supabaseKey !== 'your-anon-key-here') {
    try {
      supabase = createBrowserClient(supabaseUrl, supabaseKey)
    } catch (error) {
      console.error('Failed to create Supabase client:', error)
    }
  } else {
    console.warn('Supabase credentials not properly configured. Running in demo mode.')
  }

  useEffect(() => {
    if (!supabase) {
      // Demo mode - no real auth
      setUser(null)
      setLoading(false)
      return
    }

    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user ?? null)
        setLoading(false)
      } catch (error) {
        console.error('Error getting session:', error)
        setUser(null)
        setLoading(false)
      }
    }

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event: any, session: any) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase])

  return (
    <SupabaseContext.Provider value={{ user, loading, supabase }}>
      {children}
    </SupabaseContext.Provider>
  )
} 