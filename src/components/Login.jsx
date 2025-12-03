import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { signInWithEmailAndPassword, signOut, sendEmailVerification } from 'firebase/auth'
import { auth, getCallbackUrl } from '../firebase'
import { Mail, Lock, LogIn, AlertCircle, RefreshCw, CheckCircle } from 'lucide-react'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [resendingEmail, setResendingEmail] = useState(false)
  const [successMessage, setSuccessMessage] = useState(null)

  // Effect: Check location.state.email and auto-fill
  useEffect(() => {
    if (location.state?.email) {
      setFormData(prev => ({
        ...prev,
        email: location.state.email
      }))
    }
  }, [location.state])

  // Effect: Check location.state.successMessage and show it
  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccessMessage(location.state.successMessage)
      // Clear the state to prevent showing the message again on refresh
      window.history.replaceState({}, document.title)
    }
  }, [location.state])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Sign in user
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      )

      const user = userCredential.user

      // Check if email is verified
      if (!user.emailVerified) {
        // Sign them out immediately
        await signOut(auth)
        setLoading(false)
        setError('Email not verified. Please check your inbox.')
        return
      }

      // Success: If verified, navigate to home
      setLoading(false)
      navigate('/', { replace: true })

    } catch (err) {
      console.error('Login error:', err)
      let errorMessage = 'Failed to sign in. Please try again.'

      if (err.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email. Please sign up first.'
      } else if (err.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again.'
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.'
      } else if (err.code === 'auth/invalid-credential') {
        errorMessage = 'Invalid email or password.'
      } else if (err.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your connection and try again.'
      }

      setError(errorMessage)
      setLoading(false)
    }
  }

  const handleResendVerification = async () => {
    if (!formData.email.trim() || !formData.password) {
      setError('Please enter your email and password first.')
      return
    }

    setResendingEmail(true)
    setError(null)

    try {
      // Sign in temporarily to get the user object
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      )

      const user = userCredential.user

      if (user.emailVerified) {
        setError('Your email is already verified. You can log in now.')
        await signOut(auth)
        setResendingEmail(false)
        return
      }

      // Send verification email
      const actionCodeSettings = {
        url: `${getCallbackUrl()}/verify-email`,
        handleCodeInApp: false,
      }

      await sendEmailVerification(user, actionCodeSettings)

      // Sign out again since email is not verified
      await signOut(auth)

      setSuccessMessage('Verification email sent! Please check your inbox (including spam folder).')
      setError(null)
    } catch (err) {
      console.error('Resend verification error:', err)
      if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setError('Please enter the correct email and password to resend verification email.')
      } else {
        setError('Failed to resend verification email. Please try again.')
      }
    } finally {
      setResendingEmail(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-8 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-mont font-extrabold text-3xl sm:text-4xl text-dark mb-2">
              Welcome Back
            </h1>
            <p className="text-gray text-sm sm:text-base">
              Sign in to your account
            </p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
              <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-green-700 text-sm font-medium">{successMessage}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-dark mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                  placeholder="your.name@um6p.ma"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-dark mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full group inline-flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-accent text-white font-semibold shadow-um6p hover:bg-accent/90 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-soft disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 mt-6"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <LogIn size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Resend Verification Email Button - Show when email is not verified */}
          {error && error.includes('Email not verified') && (
            <div className="mt-4">
              <button
                type="button"
                onClick={handleResendVerification}
                disabled={resendingEmail || !formData.email || !formData.password}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-accent border border-accent rounded-xl hover:bg-accent/5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resendingEmail ? (
                  <>
                    <div className="w-4 h-4 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw size={16} />
                    <span>Resend Verification Email</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Signup Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray">
              Don't have an account?{' '}
              <Link to="/signup" className="text-accent font-semibold hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Visual Section */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-accent via-accent/90 to-orange/80">
        {/* Background Pattern/Image Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80")',
          }}
        />

        {/* Colored Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/85 via-accent/80 to-orange/75" />

        {/* Content Overlay */}
        <div className="relative z-10 flex items-center justify-center p-12 text-center">
          <div className="max-w-lg">
            <h2 className="font-mont font-extrabold text-4xl sm:text-5xl text-white mb-6 leading-tight">
              Welcome Back to USN
            </h2>
            <p className="text-white/90 text-lg sm:text-xl leading-relaxed">
              Continue your journey of mutual support and solidarity. Log in to access your account and connect with the community.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
