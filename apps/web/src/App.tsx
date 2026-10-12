import { BrowserRouter, Route, Routes, Navigate, Outlet, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider'
import { useAuth } from './context/authContext'
import AppLayout from './layouts/AppLayout'
import Home from './pages/Home'
import Search from './pages/Search'
import Create from './pages/Create'
import Inbox from './pages/Inbox'
import Saved from './pages/Saved'
import Login from './pages/Login'
import Signup from './pages/Signup'

/**
 * Route guard for genuinely private pages (/create, /inbox, /saved).
 * - Avoids flash-of-unauthenticated by waiting until session check completes.
 * - Stores the attempted URL in location.state so Login redirects back after sign in.
 */
function ProtectedRoute() {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
          <span className="text-xs font-medium tracking-wider text-slate-400 uppercase">
            Verifying session…
          </span>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}

/**
 * Route guard for public auth pages (/login, /signup).
 * Redirects already-authenticated users back to their intended route or home.
 */
function PublicAuthRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="auth-page-bg flex min-h-screen items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-2 border-white/60 border-t-transparent" />
      </div>
    )
  }

  if (user) {
    const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/'
    return <Navigate to={from} replace />
  }

  return <>{children}</>
}

function AppRoutes() {
  return (
    <Routes>
      {/* Auth pages — no nav / footer; redirects if already logged in */}
      <Route
        path="/login"
        element={
          <PublicAuthRoute>
            <Login />
          </PublicAuthRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicAuthRoute>
            <Signup />
          </PublicAuthRoute>
        }
      />

      {/* App pages — wrapped in AppLayout (nav + footer) */}
      <Route element={<AppLayout />}>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/create" element={<Create />} />
          <Route path="/inbox" element={<Inbox />} />
          <Route path="/saved" element={<Saved />} />
        </Route>
      </Route>
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App