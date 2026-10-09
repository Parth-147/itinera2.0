/**
 * ITINERA Authentication Service
 * ─────────────────────────────────────────────────────────────────────
 * This module provides a clean interface for authentication operations.
 *
 * STATUS: UI-only — no real backend is connected yet.
 * NEXT STEP: Replace the method bodies with Supabase Auth calls once
 *            the Supabase project is configured.
 *
 * All methods return { data, error } tuples so consumers never need
 * to refactor when the real backend is wired in.
 */

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
}

/* ── Helpers ────────────────────────────────────────────────────────── */

/** Simulates async network latency */
function simulateLatency(ms = 1200): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/* ── Service Methods ────────────────────────────────────────────────── */

/**
 * Attempt to sign in with email + password.
 * Currently returns an error indicating that the backend is not connected.
 */
export async function login(_credentials: LoginCredentials): Promise<AuthResult> {
  await simulateLatency()

  // TODO: Replace with Supabase auth
  // const { data, error } = await supabase.auth.signInWithPassword({
  //   email: credentials.email,
  //   password: credentials.password,
  // })

  return {
    data: null,
    error: {
      message: 'Authentication service is not connected yet. Please configure Supabase.',
      code: 'AUTH_NOT_CONFIGURED',
    },
  }
}

/**
 * Create a new account.
 * Currently returns an error indicating that the backend is not connected.
 */
export async function signup(_credentials: SignupCredentials): Promise<AuthResult> {
  await simulateLatency()

  // TODO: Replace with Supabase auth
  // const { data, error } = await supabase.auth.signUp({
  //   email: credentials.email,
  //   password: credentials.password,
  //   options: { data: { full_name: credentials.fullName } },
  // })

  return {
    data: null,
    error: {
      message: 'Authentication service is not connected yet. Please configure Supabase.',
      code: 'AUTH_NOT_CONFIGURED',
    },
  }
}

/**
 * Sign out the current user.
 */
export async function logout(): Promise<AuthResult> {
  await simulateLatency(400)

  return {
    data: null,
    error: {
      message: 'Authentication service is not connected yet.',
      code: 'AUTH_NOT_CONFIGURED',
    },
  }
}

/**
 * Send a password-reset email.
 */
export async function resetPassword(_email: string): Promise<AuthResult> {
  await simulateLatency()

  return {
    data: null,
    error: {
      message: 'Authentication service is not connected yet.',
      code: 'AUTH_NOT_CONFIGURED',
    },
  }
}
