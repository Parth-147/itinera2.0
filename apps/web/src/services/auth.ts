/**
 * ITINERA Authentication Service
 * ─────────────────────────────────────────────────────────────────────
 * This module provides a clean interface for authentication operations
 * connected directly to Supabase Auth, with support for UI persona modes.
 *
 * All methods return { data, error } tuples so consumers never need
 * to refactor when calling auth methods. Passwords and security tokens
 * are NEVER logged.
 */

import type { Session, User, AuthChangeEvent, Subscription } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from './supabase'

export type UserRole = 'traveler' | 'operator'

export interface UserProfile {
  uid: string
  email: string
  displayName: string
  role: UserRole
  avatarUrl?: string
}

export interface AuthError {
  message: string
  code?: string
}

export interface AuthResult<T = unknown> {
  data: T | null
  error: AuthError | null
}

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface SignupCredentials {
  fullName: string
  email: string
  password: string
  role?: UserRole
}

export interface LoginResultData {
  user: User
  session: Session
}

export interface SignupResultData {
  user: User | null
  session: Session | null
  needsEmailConfirmation: boolean
}

/* ── Demo Personas Support ─────────────────────────────────────────── */

export const DEMO_USERS: Record<UserRole, UserProfile> = {
  traveler: {
    uid: 'traveler-user-1',
    email: 'alex.mercer@itinera.travel',
    displayName: 'Alex Mercer',
    role: 'traveler',
  },
  operator: {
    uid: 'operator-user-1',
    email: 'elena.rostova@operations.itinera.travel',
    displayName: 'Elena Rostova (Operations Alpha)',
    role: 'operator',
  },
}

let activeDemoUser: UserProfile | null = DEMO_USERS.traveler

export function getActiveSessionUser(): UserProfile | null {
  const cached = localStorage.getItem('itinera_user_session')
  if (cached) {
    try {
      return JSON.parse(cached)
    } catch {
      // ignore
    }
  }
  return activeDemoUser
}

export function setActiveSessionUser(user: UserProfile | null): void {
  activeDemoUser = user
  if (user) {
    localStorage.setItem('itinera_user_session', JSON.stringify(user))
  } else {
    localStorage.removeItem('itinera_user_session')
  }
}

export function loginAsDemo(role: UserRole): UserProfile {
  const user = DEMO_USERS[role]
  setActiveSessionUser(user)
  return user
}

/* ── Service Methods ────────────────────────────────────────────────── */

/**
 * Attempt to sign in with email + password using Supabase Auth.
 */
export async function login(credentials: LoginCredentials): Promise<AuthResult<LoginResultData>> {
  if (!isSupabaseConfigured) {
    // If Supabase is not configured, fall back to demo persona
    const isOp = credentials.email.toLowerCase().includes('operator')
    const demoUser = isOp ? DEMO_USERS.operator : DEMO_USERS.traveler
    setActiveSessionUser(demoUser)
    return {
      data: null,
      error: {
        message: 'Authentication service is not configured. Missing Supabase environment variables.',
        code: 'AUTH_NOT_CONFIGURED',
      },
    }
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email.trim(),
      password: credentials.password,
    })

    if (error) {
      let friendlyMessage = error.message

      // Enhance known Supabase error messages for clear user guidance
      if (error.message.toLowerCase().includes('invalid login credentials')) {
        friendlyMessage = 'Invalid email or password. Please verify your credentials and try again.'
      } else if (error.message.toLowerCase().includes('email not confirmed')) {
        friendlyMessage = 'Email address not verified yet. Please check your inbox for the confirmation link.'
      }

      return {
        data: null,
        error: {
          message: friendlyMessage,
          code: error.code,
        },
      }
    }

    if (!data.user || !data.session) {
      return {
        data: null,
        error: {
          message: 'Authentication succeeded but no active session was established.',
          code: 'NO_SESSION',
        },
      }
    }

    const isOp = (data.user.email || '').includes('operator')
    const profile: UserProfile = {
      uid: data.user.id,
      email: data.user.email || credentials.email,
      displayName: (data.user.user_metadata?.full_name as string) || (data.user.email || '').split('@')[0],
      role: isOp ? 'operator' : 'traveler',
    }
    setActiveSessionUser(profile)

    return {
      data: {
        user: data.user,
        session: data.session,
      },
      error: null,
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'An unexpected error occurred during sign in.'
    return {
      data: null,
      error: { message, code: 'UNEXPECTED_ERROR' },
    }
  }
}

/**
 * Create a new account with email + password using Supabase Auth.
 * Automatically saves user full name into user_metadata.
 */
export async function signup(credentials: SignupCredentials): Promise<AuthResult<SignupResultData>> {
  if (!isSupabaseConfigured) {
    return {
      data: null,
      error: {
        message: 'Authentication service is not configured. Missing Supabase environment variables.',
        code: 'AUTH_NOT_CONFIGURED',
      },
    }
  }

  try {
    const redirectUrl = typeof window !== 'undefined' ? `${window.location.origin}/login` : undefined

    const { data, error } = await supabase.auth.signUp({
      email: credentials.email.trim(),
      password: credentials.password,
      options: {
        data: {
          full_name: credentials.fullName.trim(),
          role: credentials.role || 'traveler',
        },
        emailRedirectTo: redirectUrl,
      },
    })

    if (error) {
      return {
        data: null,
        error: {
          message: error.message,
          code: error.code,
        },
      }
    }

    // In Supabase Auth, when email confirmation is enabled and the user already exists,
    // signUp may return a user object with an empty identities array to avoid email enumeration.
    if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
      return {
        data: null,
        error: {
          message: 'An account with this email address already exists. Please sign in instead.',
          code: 'USER_ALREADY_EXISTS',
        },
      }
    }

    const needsEmailConfirmation = Boolean(data.user && !data.session)

    if (data.user) {
      const isOp = (data.user.email || '').includes('operator')
      setActiveSessionUser({
        uid: data.user.id,
        email: data.user.email || credentials.email,
        displayName: credentials.fullName,
        role: credentials.role || (isOp ? 'operator' : 'traveler'),
      })
    }

    return {
      data: {
        user: data.user,
        session: data.session,
        needsEmailConfirmation,
      },
      error: null,
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'An unexpected error occurred during signup.'
    return {
      data: null,
      error: { message, code: 'UNEXPECTED_ERROR' },
    }
  }
}

/**
 * Sign out the current user via Supabase Auth.
 */
export async function logout(): Promise<AuthResult<void>> {
  if (!isSupabaseConfigured) {
    setActiveSessionUser(null)
    return {
      data: null,
      error: {
        message: 'Authentication service is not configured.',
        code: 'AUTH_NOT_CONFIGURED',
      },
    }
  }

  try {
    const { error } = await supabase.auth.signOut()
    setActiveSessionUser(null)
    if (error) {
      return {
        data: null,
        error: {
          message: error.message,
          code: error.code,
        },
      }
    }

    return {
      data: undefined,
      error: null,
    }
  } catch (err) {
    setActiveSessionUser(null)
    const message = err instanceof Error ? err.message : 'An unexpected error occurred during sign out.'
    return {
      data: null,
      error: { message, code: 'UNEXPECTED_ERROR' },
    }
  }
}

/**
 * Send a password recovery email using Supabase Auth.
 */
export async function resetPassword(email: string): Promise<AuthResult<void>> {
  if (!isSupabaseConfigured) {
    return {
      data: null,
      error: {
        message: 'Authentication service is not configured. Missing Supabase environment variables.',
        code: 'AUTH_NOT_CONFIGURED',
      },
    }
  }

  try {
    const redirectUrl = typeof window !== 'undefined' ? `${window.location.origin}/login` : undefined

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: redirectUrl,
    })

    if (error) {
      return {
        data: null,
        error: {
          message: error.message,
          code: error.code,
        },
      }
    }

    return {
      data: undefined,
      error: null,
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'An unexpected error occurred during password reset.'
    return {
      data: null,
      error: { message, code: 'UNEXPECTED_ERROR' },
    }
  }
}

/**
 * Retrieve the current active session from Supabase.
 */
export async function getSession(): Promise<Session | null> {
  if (!isSupabaseConfigured) return null
  const { data } = await supabase.auth.getSession()
  return data.session
}

/**
 * Retrieve the current authenticated user from Supabase.
 */
export async function getCurrentUser(): Promise<User | null> {
  if (!isSupabaseConfigured) return null
  const { data } = await supabase.auth.getUser()
  return data.user
}

/**
 * Subscribe to Supabase auth state changes.
 */
export function onAuthStateChange(
  callback: (event: AuthChangeEvent, session: Session | null) => void
): { unsubscribe: () => void } {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(callback)

  return {
    unsubscribe: () => subscription.unsubscribe(),
  }
}

export type { Subscription }
