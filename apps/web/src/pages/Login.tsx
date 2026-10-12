import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { login, resetPassword } from '../services/auth'

/* ── Inline SVG icons ──────────────────────────────────────────────── */

function EyeIcon({ className = 'size-5' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
  )
}

function EyeSlashIcon({ className = 'size-5' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
  )
}

function MailIcon({ className = 'size-5' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
    </svg>
  )
}

function LockIcon({ className = 'size-5' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
    </svg>
  )
}

function SpinnerIcon({ className = 'size-5' }: { className?: string }) {
  return (
    <svg className={`${className} animate-spin`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4Zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647Z" />
    </svg>
  )
}

function GlobeIcon({ className = 'size-6' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5a17.92 17.92 0 0 1-8.716-2.247m0 0A8.966 8.966 0 0 1 3 12c0-1.264.26-2.466.732-3.558" />
    </svg>
  )
}

function MapPinIcon({ className = 'size-5' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
    </svg>
  )
}

function PlaneIcon({ className = 'size-5' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
    </svg>
  )
}

/* ── Component ─────────────────────────────────────────────────────── */

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})
  const [resetSent, setResetSent] = useState(false)
  const [isResetting, setIsResetting] = useState(false)

  /* ── Validation ──────────────────────────────────────────────────── */
  function validate(): boolean {
    const errors: { email?: string; password?: string } = {}

    if (!email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email address'
    }

    if (!password) {
      errors.password = 'Password is required'
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  /* ── Submit ──────────────────────────────────────────────────────── */
  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (isLoading) return
    setError(null)
    setResetSent(false)

    if (!validate()) return

    setIsLoading(true)
    try {
      const result = await login({ email, password, rememberMe })
      if (result.error) {
        setError(result.error.message)
      } else {
        const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/'
        navigate(from, { replace: true })
      }
    } catch {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  /* ── Forgot Password ─────────────────────────────────────────────── */
  async function handleForgotPassword() {
    if (isResetting || isLoading) return
    setError(null)
    setResetSent(false)

    if (!email.trim()) {
      setFieldErrors((prev) => ({ ...prev, email: 'Enter your email address to receive a reset link' }))
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFieldErrors((prev) => ({ ...prev, email: 'Please enter a valid email address' }))
      return
    }

    setIsResetting(true)
    try {
      const result = await resetPassword(email)
      if (result.error) {
        setError(result.error.message)
      } else {
        setResetSent(true)
      }
    } catch {
      setError('An unexpected error occurred while requesting password reset.')
    } finally {
      setIsResetting(false)
    }
  }

  /* ── Render ──────────────────────────────────────────────────────── */
  return (
    <div className="auth-page-bg flex min-h-screen items-center justify-center p-4 sm:p-6">
      {/* ── Ambient decorative orbs ─────────────────────────────── */}
      <div className="auth-orb auth-orb-1" />
      <div className="auth-orb auth-orb-2" />
      <div className="auth-orb auth-orb-3" />

      {/* ── Card ────────────────────────────────────────────────── */}
      <div className="auth-card animate-auth-card-in relative z-10 flex w-full max-w-[960px] overflow-hidden rounded-3xl shadow-2xl">
        {/* ── Left Panel — Branding / Visual ─────────────────────── */}
        <div className="auth-left-panel hidden w-[45%] flex-col justify-between p-10 lg:flex">
          {/* Top */}
          <div>
            <Link to="/" className="inline-flex items-center gap-2.5">
              <div className="flex size-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <GlobeIcon className="size-5 text-white" />
              </div>
              <span className="text-lg font-bold tracking-[0.18em] text-white">ITINERA</span>
            </Link>
            <div className="mt-16 max-w-xs">
              <h1 className="text-[28px] leading-tight font-semibold text-white">
                Your journey<br />begins here.
              </h1>
              <p className="mt-4 text-[15px] leading-relaxed text-emerald-100/80">
                Intelligent travel planning crafted for modern explorers. Discover curated destinations and build unforgettable itineraries.
              </p>
            </div>
          </div>

          {/* Bottom decorative feature pills */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-xl bg-white/[0.08] px-4 py-3 backdrop-blur-sm">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/15">
                <MapPinIcon className="size-4 text-white" />
              </div>
              <div>
                <p className="text-[13px] font-medium text-white">500+ Curated Destinations</p>
                <p className="text-[11px] text-emerald-200/70">Handpicked locations worldwide</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-white/[0.08] px-4 py-3 backdrop-blur-sm">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/15">
                <PlaneIcon className="size-4 text-white" />
              </div>
              <div>
                <p className="text-[13px] font-medium text-white">AI-Powered Itineraries</p>
                <p className="text-[11px] text-emerald-200/70">Personalized to your travel style</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Panel — Login Form ────────────────────────────── */}
        <div className="flex w-full flex-col justify-center bg-white px-6 py-10 sm:px-10 lg:w-[55%] lg:px-14 lg:py-12">
          {/* Mobile-only brand */}
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex size-9 items-center justify-center rounded-xl bg-[#1F4D45]">
              <GlobeIcon className="size-4.5 text-white" />
            </div>
            <span className="text-base font-bold tracking-[0.18em] text-slate-900">ITINERA</span>
          </div>

          <div className="animate-auth-form-in">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-[26px]">Welcome back</h2>
            <p className="mt-2 text-sm text-slate-500">
              Sign in to continue planning your next adventure.
            </p>

            {/* ── Global Error ────────────────────────────────────── */}
            {error && (
              <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-[13px] text-red-700 animate-auth-shake">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 size-4 shrink-0 text-red-500">
                  <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* ── Password Reset Success ──────────────────────────── */}
            {resetSent && (
              <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-[13px] text-emerald-800 animate-auth-fade-in">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 size-4 shrink-0 text-emerald-600">
                  <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
                </svg>
                <span>Password recovery email sent! Please check your inbox for instructions.</span>
              </div>
            )}

            {/* ── Form ────────────────────────────────────────────── */}
            <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
              {/* Email */}
              <div>
                <label htmlFor="login-email" className="mb-1.5 block text-[13px] font-medium text-slate-700">
                  Email address
                </label>
                <div className={`auth-input-wrapper ${fieldErrors.email ? 'auth-input-error' : ''}`}>
                  <MailIcon className="size-[18px] shrink-0 text-slate-400" />
                  <input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setFieldErrors((p) => ({ ...p, email: undefined })) }}
                    className="auth-input"
                  />
                </div>
                {fieldErrors.email && (
                  <p className="mt-1.5 text-[12px] text-red-500 animate-auth-fade-in">{fieldErrors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="login-password" className="mb-1.5 block text-[13px] font-medium text-slate-700">
                  Password
                </label>
                <div className={`auth-input-wrapper ${fieldErrors.password ? 'auth-input-error' : ''}`}>
                  <LockIcon className="size-[18px] shrink-0 text-slate-400" />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setFieldErrors((p) => ({ ...p, password: undefined })) }}
                    className="auth-input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="shrink-0 text-slate-400 transition-colors hover:text-slate-600"
                  >
                    {showPassword ? <EyeSlashIcon className="size-[18px]" /> : <EyeIcon className="size-[18px]" />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="mt-1.5 text-[12px] text-red-500 animate-auth-fade-in">{fieldErrors.password}</p>
                )}
              </div>

              {/* Remember / Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex cursor-pointer items-center gap-2 select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="auth-checkbox"
                  />
                  <span className="text-[13px] text-slate-600">Remember me</span>
                </label>
                <button
                  type="button"
                  disabled={isResetting || isLoading}
                  onClick={handleForgotPassword}
                  className="text-[13px] font-medium text-[#1F4D45] transition-colors hover:text-[#2A6559] disabled:opacity-50"
                >
                  {isResetting ? 'Sending link…' : 'Forgot password?'}
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="auth-btn-primary"
              >
                {isLoading ? (
                  <>
                    <SpinnerIcon className="size-[18px]" />
                    <span>Signing in…</span>
                  </>
                ) : (
                  <span>Sign in</span>
                )}
              </button>
            </form>

            {/* ── Signup link ─────────────────────────────────────── */}
            <p className="mt-8 text-center text-[13px] text-slate-500">
              Don&apos;t have an account?{' '}
              <Link to="/signup" className="font-semibold text-[#1F4D45] transition-colors hover:text-[#2A6559]">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
