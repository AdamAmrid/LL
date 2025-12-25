import { Outlet, useLocation, Navigate, useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import AdminDashboard from './pages/AdminDashboard'

function RouteProgress({ isNavigating }) {
  return isNavigating ? <div className="route-progress animate-[pulse_1.2s_ease-in-out_infinite]" /> : null
}

export default function App() {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const [isNavigating, setIsNavigating] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Track authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Check if we need to redirect verification links from root path
  const mode = searchParams.get('mode')
  const oobCode = searchParams.get('oobCode')
  const needsVerificationRedirect = location.pathname === '/' && mode === 'verifyEmail' && oobCode

  // Redirect verification links from root path to callback handler
  if (needsVerificationRedirect) {
    const params = new URLSearchParams()
    params.set('mode', mode)
    params.set('oobCode', oobCode)
    // Preserve other params if they exist
    if (searchParams.get('apiKey')) params.set('apiKey', searchParams.get('apiKey'))
    if (searchParams.get('continueUrl')) params.set('continueUrl', searchParams.get('continueUrl'))
    if (searchParams.get('lang')) params.set('lang', searchParams.get('lang'))

    return <Navigate to={`/verify-email?${params.toString()}`} replace />
  }

  useEffect(() => {
    setIsNavigating(true)
    const t = setTimeout(() => setIsNavigating(false), 450)
    return () => clearTimeout(t)
  }, [location])



  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray">Loading...</p>
        </div>
      </div>
    )
  }

  // Check if current route is an auth route
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/verify-email'

  // Redirect authenticated and verified users away from auth pages
  if (isAuthRoute && user && user.emailVerified) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="min-h-screen bg-white text-dark flex flex-col">
      <RouteProgress isNavigating={isNavigating} />
      <Navbar user={user} />
      <main className="pt-20 flex-grow pb-8">
        <Outlet />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  )
}


