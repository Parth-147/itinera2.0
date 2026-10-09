import { useState, useMemo, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { signup } from '../services/auth'

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

function UserIcon({ className = 'size-5' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
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

function ShieldCheckIcon({ className = 'size-5' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
    </svg>
  )
}

function SparklesIcon({ className = 'size-5' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
    </svg>
  )
}

function CheckCircleIcon({ className = 'size-4', filled = false }: { className?: string; filled?: boolean }) {
  if (filled) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
      </svg>
    )
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z" clipRule="evenodd" />
    </svg>
  )
}

/* ── Password strength rules ───────────────────────────────────────── */

interface PasswordRule {
  label: string
  test: (pw: string) => boolean
}

const PASSWORD_RULES: PasswordRule[] = [
  { label: 'At least 8 characters', test: (pw) => pw.length >= 8 },
  { label: 'Contains uppercase letter', test: (pw) => /[A-Z]/.test(pw) },
  { label: 'Contains a number', test: (pw) => /\d/.test(pw) },
  { label: 'Contains special character', test: (pw) => /[^A-Za-z0-9]/.test(pw) },
]

/* ── Component ─────────────────────────────────────────────────────── */

export default function Signup() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  /* ── Password strength ───────────────────────────────────────────── */
  const passwordMet = useMemo(() => PASSWORD_RULES.map((r) => r.test(password)), [password])
  const strengthScore = useMemo(() => passwordMet.filter(Boolean).length, [passwordMet])
  const strengthLabel = useMemo(() => {
    if (password.length === 0) return ''
    if (strengthScore <= 1) return 'Weak'
    if (strengthScore <= 2) return 'Fair'
    if (strengthScore <= 3) return 'Good'
    return 'Strong'
  }, [password, strengthScore])
  const strengthColor = useMemo(() => {
    if (strengthScore <= 1) return 'bg-red-400'
    if (strengthScore <= 2) return 'bg-amber-400'
    if (strengthScore <= 3) return 'bg-sky-400'
    return 'bg-emerald-400'
  }, [strengthScore])

  /* ── Validation ──────────────────────────────────────────────────── */
  function validate(): boolean {
    const errs: Record<string, string> = {}

    if (!fullName.trim()) {
      errs.fullName = 'Full name is required'
    } else if (fullName.trim().length < 2) {
      errs.fullName = 'Name must be at least 2 characters'
    }

    if (!email.trim()) {
      errs.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Please enter a valid email address'
    }

    if (!password) {
      errs.password = 'Password is required'
    } else if (password.length < 8) {
      errs.password = 'Password must be at least 8 characters'
    }

    if (!confirmPassword) {
      errs.confirmPassword = 'Please confirm your password'
    } else if (confirmPassword !== password) {
      errs.confirmPassword = 'Passwords do not match'
    }

    if (!agreedToTerms) {
      errs.terms = 'You must agree to the terms and conditions'
    }

    setFieldErrors(errs)
    return Object.keys(errs).length === 0
  }

  /* ── Submit ──────────────────────────────────────────────────────── */
  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    if (!validate()) return

    setIsLoading(true)
    try {
      const result = await signup({ fullName: fullName.trim(), email, password })
      if (result.error) {
        setError(result.error.message)
      }
    } catch {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  /* ── Helper to clear a single field error on change ──────────────── */
  function clearFieldError(field: string) {
    setFieldErrors((prev) => {
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  /* ── Render ──────────────────────────────────────────────────────── */
  return (
    <div className="auth-page-bg flex min-h-screen items-center justify-center p-4 sm:p-6">
      {/* ── Ambient decorative orbs ─────────────────────────────── */}
      <div className="auth-orb auth-orb-1" />
      <div className="auth-orb auth-orb-2" />
      <div className="auth-orb auth-orb-3" />

      {/* ── Card ────────────────────────────────────────────────── */}
      <div className="auth-card animate-auth-card-in relative z-10 flex w-full max-w-[1020px] overflow-hidden rounded-3xl shadow-2xl">
        {/* ── Left Panel — Branding / Visual ─────────────────────── */}
        <div className="auth-left-panel hidden w-[42%] flex-col justify-between p-10 lg:flex">
          {/* Top */}
          <div>
            <Link to="/" className="inline-flex items-center gap-2.5">
              <div className="flex size-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <GlobeIcon className="size-5 text-white" />
              </div>
              <span className="text-lg font-bold tracking-[0.18em] text-white">ITINERA</span>
            </Link>
            <div className="mt-14 max-w-xs">
              <h1 className="text-[26px] leading-tight font-semibold text-white">
                Start your travel<br />story today.
              </h1>
              <p className="mt-4 text-[15px] leading-relaxed text-indigo-100/80">
                Join thousands of travelers who plan smarter, discover more, and create unforgettable memories with ITINERA.
              </p>
            </div>
          </div>

          {/* Bottom decorative feature pills */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-xl bg-white/[0.08] px-4 py-3 backdrop-blur-sm">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/15">
                <ShieldCheckIcon className="size-4 text-white" />
              </div>
              <div>
                <p className="text-[13px] font-medium text-white">Secure & Private</p>
                <p className="text-[11px] text-indigo-200/60">Your data is encrypted end-to-end</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-white/[0.08] px-4 py-3 backdrop-blur-sm">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/15">
                <SparklesIcon className="size-4 text-white" />
              </div>
              <div>
                <p className="text-[13px] font-medium text-white">Free to Get Started</p>
                <p className="text-[11px] text-indigo-200/60">No credit card required</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Panel — Signup Form ───────────────────────────── */}
        <div className="flex w-full flex-col justify-center bg-white px-6 py-8 sm:px-10 lg:w-[58%] lg:px-14 lg:py-10">
          {/* Mobile-only brand */}
          <div className="mb-6 flex items-center gap-2 lg:hidden">
            <div className="flex size-9 items-center justify-center rounded-xl bg-indigo-600">
              <GlobeIcon className="size-4.5 text-white" />
            </div>
            <span className="text-base font-bold tracking-[0.18em] text-slate-900">ITINERA</span>
          </div>

          <div className="animate-auth-form-in">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-[26px]">Create your account</h2>
            <p className="mt-2 text-sm text-slate-500">
              Set up your profile in a few quick steps.
            </p>

            {/* ── Global Error ────────────────────────────────────── */}
            {error && (
              <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-[13px] text-red-700 animate-auth-shake">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 size-4 shrink-0 text-red-500">
                  <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* ── Form ────────────────────────────────────────────── */}
            <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
              {/* Full Name */}
              <div>
                <label htmlFor="signup-name" className="mb-1.5 block text-[13px] font-medium text-slate-700">
                  Full name
                </label>
                <div className={`auth-input-wrapper ${fieldErrors.fullName ? 'auth-input-error' : ''}`}>
                  <UserIcon className="size-[18px] shrink-0 text-slate-400" />
                  <input
                    id="signup-name"
                    type="text"
                    autoComplete="name"
                    placeholder="Jane Doe"
                    value={fullName}
                    onChange={(e) => { setFullName(e.target.value); clearFieldError('fullName') }}
                    className="auth-input"
                  />
                </div>
                {fieldErrors.fullName && (
                  <p className="mt-1 text-[12px] text-red-500 animate-auth-fade-in">{fieldErrors.fullName}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="signup-email" className="mb-1.5 block text-[13px] font-medium text-slate-700">
                  Email address
                </label>
                <div className={`auth-input-wrapper ${fieldErrors.email ? 'auth-input-error' : ''}`}>
                  <MailIcon className="size-[18px] shrink-0 text-slate-400" />
                  <input
                    id="signup-email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); clearFieldError('email') }}
                    className="auth-input"
                  />
                </div>
                {fieldErrors.email && (
                  <p className="mt-1 text-[12px] text-red-500 animate-auth-fade-in">{fieldErrors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="signup-password" className="mb-1.5 block text-[13px] font-medium text-slate-700">
                  Password
                </label>
                <div className={`auth-input-wrapper ${fieldErrors.password ? 'auth-input-error' : ''}`}>
                  <LockIcon className="size-[18px] shrink-0 text-slate-400" />
                  <input
                    id="signup-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); clearFieldError('password') }}
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
                  <p className="mt-1 text-[12px] text-red-500 animate-auth-fade-in">{fieldErrors.password}</p>
                )}

                {/* Strength meter */}
                {password.length > 0 && (
                  <div className="mt-2.5 animate-auth-fade-in">
                    <div className="flex items-center gap-2">
                      <div className="flex flex-1 gap-1">
                        {PASSWORD_RULES.map((_, i) => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                              i < strengthScore ? strengthColor : 'bg-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                      <span className={`text-[11px] font-medium ${
                        strengthScore <= 1 ? 'text-red-500' :
                        strengthScore <= 2 ? 'text-amber-500' :
                        strengthScore <= 3 ? 'text-sky-500' :
                        'text-emerald-500'
                      }`}>
                        {strengthLabel}
                      </span>
                    </div>

                    {/* Rules checklist */}
                    <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1">
                      {PASSWORD_RULES.map((rule, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <CheckCircleIcon
                            className={`size-3.5 shrink-0 transition-colors duration-200 ${
                              passwordMet[i] ? 'text-emerald-500' : 'text-slate-300'
                            }`}
                            filled={passwordMet[i]}
                          />
                          <span className={`text-[11px] transition-colors duration-200 ${
                            passwordMet[i] ? 'text-slate-600' : 'text-slate-400'
                          }`}>
                            {rule.label}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="signup-confirm" className="mb-1.5 block text-[13px] font-medium text-slate-700">
                  Confirm password
                </label>
                <div className={`auth-input-wrapper ${fieldErrors.confirmPassword ? 'auth-input-error' : ''}`}>
                  <LockIcon className="size-[18px] shrink-0 text-slate-400" />
                  <input
                    id="signup-confirm"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); clearFieldError('confirmPassword') }}
                    className="auth-input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((p) => !p)}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    className="shrink-0 text-slate-400 transition-colors hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeSlashIcon className="size-[18px]" /> : <EyeIcon className="size-[18px]" />}
                  </button>
                </div>
                {fieldErrors.confirmPassword && (
                  <p className="mt-1 text-[12px] text-red-500 animate-auth-fade-in">{fieldErrors.confirmPassword}</p>
                )}
              </div>

              {/* Terms */}
              <div>
                <label className="flex cursor-pointer items-start gap-2.5 select-none">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => { setAgreedToTerms(e.target.checked); clearFieldError('terms') }}
                    className="auth-checkbox mt-0.5"
                  />
                  <span className="text-[13px] leading-relaxed text-slate-600">
                    I agree to ITINERA&apos;s{' '}
                    <button type="button" className="font-medium text-indigo-600 hover:text-indigo-700">Terms of Service</button>
                    {' '}and{' '}
                    <button type="button" className="font-medium text-indigo-600 hover:text-indigo-700">Privacy Policy</button>
                  </span>
                </label>
                {fieldErrors.terms && (
                  <p className="mt-1 pl-6 text-[12px] text-red-500 animate-auth-fade-in">{fieldErrors.terms}</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="auth-btn-primary mt-1"
              >
                {isLoading ? (
                  <>
                    <SpinnerIcon className="size-[18px]" />
                    <span>Creating account…</span>
                  </>
                ) : (
                  <span>Create account</span>
                )}
              </button>
            </form>

            {/* ── Login link ──────────────────────────────────────── */}
            <p className="mt-6 text-center text-[13px] text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-indigo-600 transition-colors hover:text-indigo-700">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
