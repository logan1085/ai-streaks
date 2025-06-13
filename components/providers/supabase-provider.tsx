'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { type SupabaseClient } from '@supabase/supabase-js'
import type { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

type SupabaseContextType = {
  user: User | null
  loading: boolean
  supabase: SupabaseClient | null
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
  
  useEffect(() => {
    try {
      // Get initial session
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null)
        setLoading(false)
      })

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      })

      return () => {
        subscription.unsubscribe()
      }
    } catch (error) {
      console.error('Failed to initialize Supabase client:', error)
      setLoading(false)
    }
  }, [])

  return (
    <SupabaseContext.Provider value={{ user, loading, supabase }}>
      {children}
    </SupabaseContext.Provider>
  )
} 