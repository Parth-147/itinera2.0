import { useEffect, useState, type ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from '../services/supabase'
import { AuthContext, type AuthContextType } from './authContext'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(() => isSupabaseConfigured)

  useEffect(() => {
    let isMounted = true

    if (!isSupabaseConfigured) {
      return
    }

    // 1. Initial session restoration on application mount / reload
    supabase.auth
      .getSession()
      .then(({ data: { session: initialSession }, error }) => {
        if (!isMounted) return
        if (error) {
          console.error('[ITINERA Auth] Session restoration failed:', error.message)
        }
        setSession(initialSession)
        setUser(initialSession?.user ?? null)
        setIsLoading(false)
      })
      .catch((err) => {
        if (!isMounted) return
        console.error('[ITINERA Auth] Unexpected error restoring session:', err)
        setIsLoading(false)
      })

    // 2. Real-time auth state subscription
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      if (!isMounted) return
      setSession(currentSession)
      setUser(currentSession?.user ?? null)
      setIsLoading(false)
    })

    // Clean up subscription properly on unmount
    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signOut = async () => {
    if (!isSupabaseConfigured) {
      setSession(null)
      setUser(null)
      return
    }

    try {
      await supabase.auth.signOut()
    } catch (err) {
      console.error('[ITINERA Auth] Sign out error:', err)
    } finally {
      setSession(null)
      setUser(null)
    }
  }

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    isAuthenticated: Boolean(user),
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
