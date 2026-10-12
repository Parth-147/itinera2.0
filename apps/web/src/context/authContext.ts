import { createContext, useContext } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import type { UserRole } from '../services/auth'

export type AppUser = (User & {
  displayName?: string
  role?: UserRole
  uid?: string
}) | null

export interface AuthContextType {
  user: AppUser
  session: Session | null
  role: UserRole
  isOperator: boolean
  isLoading: boolean
  isAuthenticated: boolean
  switchRole: (role: UserRole) => void
  signOut: () => Promise<void>
  logout: () => Promise<void>
  loginAsDemo?: (role: UserRole) => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
