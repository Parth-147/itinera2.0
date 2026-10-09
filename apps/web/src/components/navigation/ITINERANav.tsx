import { useState, useRef, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

interface NavItem {
  label: string
  to: string
  icon: React.ReactNode
}

/* ── Icon components ─────────────────────────────────────────────── */

function HomeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-[18px]">
      <path fillRule="evenodd" d="M9.293 2.293a1 1 0 0 1 1.414 0l7 7A1 1 0 0 1 17 11h-1v6a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6H3a1 1 0 0 1-.707-1.707l7-7Z" clipRule="evenodd" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-[18px]">
      <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
    </svg>
  )
}

function CreateIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-[18px]">
      <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
    </svg>
  )
}

function InboxIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-[18px]">
      <path fillRule="evenodd" d="M2 3a1 1 0 0 0-1 1v1.07a7.002 7.002 0 0 0 6 6.93V16H5a1 1 0 1 0 0 2h10a1 1 0 1 0 0-2h-2v-3.998a7.002 7.002 0 0 0 6-6.93V4a1 1 0 0 0-1-1H2Zm1.07 2H4v1a5 5 0 0 0 4 4.9V5h1v5.9A5 5 0 0 0 16 6V5h-2.07A7.022 7.022 0 0 0 10 3.07 7.022 7.022 0 0 0 3.07 5Z" clipRule="evenodd" />
    </svg>
  )
}

function SavedIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-[18px]">
      <path fillRule="evenodd" d="M10 2c-1.716 0-3.408.106-5.07.31C3.806 2.45 3 3.414 3 4.517V17.25a.75.75 0 0 0 1.075.676L10 15.082l5.925 2.844A.75.75 0 0 0 17 17.25V4.517c0-1.103-.806-2.068-1.93-2.207A41.403 41.403 0 0 0 10 2Z" clipRule="evenodd" />
    </svg>
  )
}

function MagnifyingGlassIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className ?? 'size-[18px]'}>
      <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
    </svg>
  )
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className ?? 'size-[18px]'}>
      <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
    </svg>
  )
}

/* ── Navigation items ────────────────────────────────────────────── */

const navItems: NavItem[] = [
  { label: 'Home', to: '/', icon: <HomeIcon /> },
  { label: 'Search', to: '/search', icon: <SearchIcon /> },
  { label: 'Create', to: '/create', icon: <CreateIcon /> },
  { label: 'Inbox', to: '/inbox', icon: <InboxIcon /> },
  { label: 'Saved', to: '/saved', icon: <SavedIcon /> },
]

/* ── Component ───────────────────────────────────────────────────── */

export default function ITINERANav() {
  const navigate = useNavigate()
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  /* Focus the input when search opens */
  useEffect(() => {
    if (searchOpen) {
      // Small delay so the transition has started and width is non-zero
      const id = setTimeout(() => inputRef.current?.focus(), 80)
      return () => clearTimeout(id)
    }
  }, [searchOpen])

  /* Close search on Escape */
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && searchOpen) {
        setSearchOpen(false)
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [searchOpen])

  return (
    <header className="fixed top-0 right-0 left-0 z-50 flex justify-center px-4 pt-4 sm:px-6 sm:pt-5">
      <nav
        aria-label="Main navigation"
        className="flex w-full max-w-3xl items-center justify-between gap-2 rounded-2xl border border-white/[0.08] bg-slate-950/80 px-3 py-2 shadow-lg shadow-black/10 backdrop-blur-xl sm:gap-3 sm:px-4"
      >
        {/* ── Brand ────────────────────────────────────────────── */}
        <NavLink
          to="/"
          className="mr-1 shrink-0 text-[13px] font-bold tracking-[0.22em] text-white select-none sm:mr-2 sm:text-sm"
        >
          ITINERA
        </NavLink>

        {/* ── Nav links ────────────────────────────────────────── */}
        <ul className="flex items-center gap-0.5 sm:gap-1">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  [
                    'flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[13px] font-medium transition-colors duration-200',
                    'sm:px-3 sm:py-1.5 sm:text-sm',
                    isActive
                      ? 'bg-white text-slate-950'
                      : 'text-slate-400 hover:bg-white/[0.07] hover:text-white',
                  ].join(' ')
                }
              >
                <span className="shrink-0">{item.icon}</span>
                <span className="hidden md:inline">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        {/* ── Search interaction ───────────────────────────────── */}
        <div className="relative ml-auto flex items-center">
          {/* Expanded search input */}
          <div
            className={[
              'flex items-center overflow-hidden rounded-lg transition-all duration-300 ease-in-out',
              searchOpen
                ? 'mr-1 w-40 border border-white/10 bg-white/[0.07] sm:w-52'
                : 'w-0',
            ].join(' ')}
          >
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const trimmed = searchQuery.trim()
                  navigate(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : '/search')
                  setSearchOpen(false)
                }
              }}
              placeholder="Where to?"
              aria-label="Search destinations"
              className="w-full bg-transparent px-3 py-1.5 text-[13px] text-white outline-none placeholder:text-slate-500 sm:text-sm"
            />
          </div>

          {/* Toggle button */}
          <button
            type="button"
            onClick={() => {
              setSearchOpen((prev) => !prev)
              if (searchOpen) setSearchQuery('')
            }}
            aria-label={searchOpen ? 'Close search' : 'Open search'}
            className="flex size-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors duration-200 hover:bg-white/[0.07] hover:text-white"
          >
            {searchOpen ? (
              <XIcon className="size-4" />
            ) : (
              <MagnifyingGlassIcon className="size-4" />
            )}
          </button>
        </div>
      </nav>
    </header>
  )
}
