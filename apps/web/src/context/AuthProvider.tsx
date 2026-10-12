import { useEffect, useState, type ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from '../services/supabase'
import {
  type UserRole,
  getActiveSessionUser,
  setActiveSessionUser,
  loginAsDemo as serviceLoginAsDemo,
} from '../services/auth'
import { AuthContext, type AuthContextType, type AppUser } from './authContext'

function mapSupabaseUserToAppUser(user: User | null, currentRole: UserRole): AppUser {
  if (!user) return null
  const displayName = (user.user_metadata?.full_name as string) || (user.email ? user.email.split('@')[0] : 'Traveler')
  return Object.assign(user, {
    displayName,
    role: currentRole,
    uid: user.id,
  })
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [rawUser, setRawUser] = useState<User | null>(null)
  const [role, setRole] = useState<UserRole>(() => {
    const cached = getActiveSessionUser()
    return cached?.role || 'traveler'
  })
  const [isLoading, setIsLoading] = useState<boolean>(() => isSupabaseConfigured)

  useEffect(() => {
    let isMounted = true

    if (!isSupabaseConfigured) {
      return
    }

    // 1. Initial session restoration
    supabase.auth
      .getSession()
      .then(({ data: { session: initialSession }, error }) => {
        if (!isMounted) return
        if (error) {
          console.error('[ITINERA Auth] Session restoration failed:', error.message)
        }
        setSession(initialSession)
        setRawUser(initialSession?.user ?? null)
        if (initialSession?.user?.email?.includes('operator')) {
          setRole('operator')
        }
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
      setRawUser(currentSession?.user ?? null)
      if (currentSession?.user?.email?.includes('operator')) {
        setRole('operator')
      }
      setIsLoading(false)
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  const switchRole = (newRole: UserRole) => {
    setRole(newRole)
    const demo = serviceLoginAsDemo(newRole)
    setActiveSessionUser(demo)
  }

  const signOut = async () => {
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut()
      } catch (err) {
        console.error('[ITINERA Auth] Sign out error:', err)
      }
    }
    setSession(null)
    setRawUser(null)
    setActiveSessionUser(null)
  }

  const user = mapSupabaseUserToAppUser(rawUser, role)
  const isOperator = role === 'operator'

  const value: AuthContextType = {
    user,
    session,
    role,
    isOperator,
    isLoading,
    isAuthenticated: Boolean(rawUser),
    switchRole,
    signOut,
    logout: signOut,
    loginAsDemo: switchRole,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
