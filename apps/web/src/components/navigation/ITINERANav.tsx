import { useState, useRef, useEffect } from 'react'
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom'
import {
  Compass,
  Search,
  Sparkles,
  Bookmark,
  Bell,
  Briefcase,
  User,
  Menu,
  X,
  ChevronRight,
  LogOut,
} from 'lucide-react'
import { useAuth } from '../../context/authContext'

export default function ITINERANav() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, role, switchRole, signOut } = useAuth()

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 80)
    }
  }, [searchOpen])

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false)
    setSearchOpen(false)
  }, [location.pathname])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = searchQuery.trim()
    navigate(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : '/search')
    setSearchOpen(false)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-xs transition-all duration-200">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-16 sm:h-[70px]">
          {/* ── Left: Brand Logo ────────────────────────────────────── */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="size-9 rounded-full bg-[#1F4D45] text-white flex items-center justify-center shadow-sm group-hover:bg-[#2A6559] transition-colors">
                <Compass className="size-5 text-amber-300" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-[0.16em] text-gray-900 leading-none">
                  ITINERA
                </span>
                <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#1F4D45] mt-0.5">
                  Adaptive Intelligence
                </span>
              </div>
            </Link>
          </div>

          {/* ── Center: Main Navigation ─────────────────────────────── */}
          <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-1 xl:gap-2">
            <NavLink
              to="/search"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-full text-xs font-semibold transition-colors duration-150 ${
                  isActive
                    ? 'bg-[#1F4D45]/10 text-[#1F4D45]'
                    : 'text-gray-600 hover:text-[#1F4D45] hover:bg-gray-50'
                }`
              }
            >
              Destinations
            </NavLink>

            <Link
              to="/#treks"
              className="px-3 py-1.5 rounded-full text-xs font-semibold text-gray-600 hover:text-[#1F4D45] hover:bg-gray-50 transition-colors"
            >
              Greatest Treks
            </Link>

            <NavLink
              to="/create"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-full text-xs font-semibold transition-colors duration-150 flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#1F4D45]/10 text-[#1F4D45]'
                    : 'text-gray-600 hover:text-[#1F4D45] hover:bg-gray-50'
                }`
              }
            >
              <Sparkles className="size-3.5 text-amber-500" />
              AI Architect
            </NavLink>

            <NavLink
              to="/saved"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-full text-xs font-semibold transition-colors duration-150 ${
                  isActive
                    ? 'bg-[#1F4D45]/10 text-[#1F4D45]'
                    : 'text-gray-600 hover:text-[#1F4D45] hover:bg-gray-50'
                }`
              }
            >
              Saved Trips
            </NavLink>

            <NavLink
              to="/inbox"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-full text-xs font-semibold transition-colors duration-150 flex items-center gap-1 ${
                  isActive
                    ? 'bg-[#1F4D45]/10 text-[#1F4D45]'
                    : 'text-gray-600 hover:text-[#1F4D45] hover:bg-gray-50'
                }`
              }
            >
              <Bell className="size-3.5" />
              Bulletins
            </NavLink>

            <NavLink
              to="/operator"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-full text-xs font-semibold transition-colors duration-150 flex items-center gap-1 ${
                  isActive
                    ? 'bg-[#1F4D45]/10 text-[#1F4D45]'
                    : 'text-gray-600 hover:text-[#1F4D45] hover:bg-gray-50'
                }`
              }
            >
              <Briefcase className="size-3.5" />
              Operator Hub
            </NavLink>
          </nav>

          {/* ── Right: Search, Role & Actions ───────────────────────── */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Quick Search Widget */}
            <div className="relative flex items-center">
              {searchOpen ? (
                <form
                  onSubmit={handleSearchSubmit}
                  className="flex items-center rounded-full border border-gray-300 bg-gray-50 pl-3 pr-2 py-1 shadow-xs transition-all w-44 sm:w-60"
                >
                  <Search className="size-3.5 text-gray-400 shrink-0" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Where to wander?..."
                    className="w-full bg-transparent px-2 text-xs text-gray-800 outline-none placeholder:text-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="p-1 text-gray-400 hover:text-gray-700 rounded-full"
                  >
                    <X className="size-3.5" />
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setSearchOpen(true)}
                  aria-label="Search"
                  className="p-2 text-gray-600 hover:text-[#1F4D45] hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Search className="size-4" />
                </button>
              )}
            </div>

            {/* Persona Switcher Toggle Pill */}
            <button
              onClick={() => switchRole(role === 'operator' ? 'traveler' : 'operator')}
              title={`Currently in ${role} mode. Click to toggle.`}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
            >
              <span className={`size-2 rounded-full ${role === 'operator' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
              <span className="capitalize">{role}</span>
            </button>

            {/* Profile Avatar / Auth Button */}
            {user ? (
              <div className="flex items-center gap-1.5">
                <Link
                  to="/profile"
                  className="p-1.5 text-gray-700 hover:text-[#1F4D45] hover:bg-gray-100 rounded-full transition"
                  title={`Signed in as ${user.email || user.displayName || 'Traveler'}`}
                >
                  <div className="size-7 rounded-full bg-slate-100 border border-gray-300 flex items-center justify-center text-xs font-bold text-gray-800">
                    {user?.displayName ? user.displayName.charAt(0) : <User className="size-3.5 text-gray-600" />}
                  </div>
                </Link>
                <button
                  type="button"
                  onClick={async () => {
                    await signOut()
                    navigate('/')
                  }}
                  title="Sign out"
                  aria-label="Sign out"
                  className="p-1.5 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors"
                >
                  <LogOut className="size-3.5" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-3 py-1.5 rounded-full text-xs font-semibold text-gray-700 hover:text-[#1F4D45] hover:bg-gray-100 transition-colors"
                title="Sign in to your account"
              >
                Sign In
              </Link>
            )}

            {/* Primary Action CTA */}
            <Link
              to="/create"
              className="px-5 py-2.5 rounded-full bg-[#1F4D45] hover:bg-[#2A6559] text-white text-xs sm:text-sm font-semibold shadow-sm transition-all hover:scale-105 active:scale-95 whitespace-nowrap inline-flex items-center gap-1.5"
            >
              <span>Plan Free</span>
              <ChevronRight className="size-3.5" />
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:text-[#1F4D45] hover:bg-gray-100 rounded-lg transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Drawer ────────────────────────────────────────── */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-6 py-5 shadow-lg space-y-3 animate-fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Navigation</span>
            <button
              onClick={() => switchRole(role === 'operator' ? 'traveler' : 'operator')}
              className="text-xs font-bold text-[#1F4D45] px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-100"
            >
              Mode: {role}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-gray-700">
            <Link to="/search" className="p-2.5 rounded-xl hover:bg-gray-50 flex items-center gap-2">
              <Compass className="size-4 text-[#1F4D45]" />
              Destinations
            </Link>
            <Link to="/create" className="p-2.5 rounded-xl hover:bg-gray-50 flex items-center gap-2">
              <Sparkles className="size-4 text-amber-500" />
              AI Architect
            </Link>
            <Link to="/saved" className="p-2.5 rounded-xl hover:bg-gray-50 flex items-center gap-2">
              <Bookmark className="size-4 text-[#1F4D45]" />
              Saved Journeys
            </Link>
            <Link to="/operator" className="p-2.5 rounded-xl hover:bg-gray-50 flex items-center gap-2">
              <Briefcase className="size-4 text-[#1F4D45]" />
              Operator Hub
            </Link>
            <Link to="/inbox" className="p-2.5 rounded-xl hover:bg-gray-50 flex items-center gap-2">
              <Bell className="size-4 text-[#1F4D45]" />
              Bulletins
            </Link>
            <Link to="/profile" className="p-2.5 rounded-xl hover:bg-gray-50 flex items-center gap-2">
              <User className="size-4 text-[#1F4D45]" />
              Profile & DNA
            </Link>
          </div>

          <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
            {user ? (
              <button
                type="button"
                onClick={async () => {
                  await signOut()
                  navigate('/')
                }}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1.5 p-1"
              >
                <LogOut className="size-3.5" />
                Sign Out ({user.email || user.displayName || 'User'})
              </button>
            ) : (
              <Link
                to="/login"
                className="text-xs font-semibold text-[#1F4D45] hover:underline"
              >
                Sign In to ITINERA
              </Link>
            )}
            <Link
              to="/create"
              className="py-2 px-4 rounded-full bg-[#1F4D45] text-white text-xs font-bold shadow-sm"
            >
              Plan Free
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
