import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { signInWithEmailAndPassword, signOut, sendEmailVerification, onAuthStateChanged } from 'firebase/auth'
import { auth, getCallbackUrl } from '../firebase'
import { Mail, RefreshCw, CheckCircle, AlertCircle, ArrowLeft, Lock } from 'lucide-react'
import Section from '../components/Section'

export default function VerifyEmail() {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [resendingEmail, setResendingEmail] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)
  const [error, setError] = useState(null)
  const [isVerified, setIsVerified] = useState(false)

  // Get email from location state (passed from signup) or URL params (fallback)
  useEffect(() => {
    console.log('VerifyEmail page loaded')
    console.log('Location state:', location.state)
    console.log('Location search:', location.search)

    // Try to get email from location state first
    if (location.state?.email) {
      console.log('Setting email from location state:', location.state.email)
      setEmail(location.state.email)
    }
    // Fallback: get email from URL params if state is not available
    else {
      const urlParams = new URLSearchParams(location.search)
      const emailFromUrl = urlParams.get('email')
      if (emailFromUrl) {
        console.log('Setting email from URL params:', emailFromUrl)
        setEmail(emailFromUrl)
      } else {
        console.warn('No email found in location state or URL params. User may have navigated directly to this page.')
      }
    }
  }, [location.state, location.search])

  // Check if email is verified
  useEffect(() => {
    if (!email) return

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email === email && user.emailVerified) {
        setIsVerified(true)
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate('/login', { replace: true })
        }, 2000)
      }
    })

    return () => unsubscribe()
  }, [email, navigate])

  const handleResendVerification = async () => {
    if (!email.trim()) {
      setError('Email address is required.')
      return
    }

    if (!password) {
      setError('Please enter your password to resend the verification email.')
      return
    }

    setResendingEmail(true)
    setResendSuccess(false)
    setError(null)

    try {
      // Sign in temporarily to get the user object
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      )

      const user = userCredential.user

      if (user.emailVerified) {
        setIsVerified(true)
        setError(null)
        setResendingEmail(false)
        setTimeout(() => {
          navigate('/login', { replace: true })
        }, 2000)
        return
      }

      // Send verification email
      const actionCodeSettings = {
        url: `${getCallbackUrl()}/verify-email-callback`,
        handleCodeInApp: false,
      }

      await sendEmailVerification(user, actionCodeSettings)

      // Sign out again since email is not verified
      await signOut(auth)

      setResendSuccess(true)
      setError(null)
    } catch (err) {
      console.error('Resend verification error:', err)

      if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setError('Incorrect email or password. Please check your credentials.')
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address.')
      } else {
        setError('Failed to resend verification email. Please try again.')
      }
    } finally {
      setResendingEmail(false)
    }
  }

  return (
    <Section className="py-16 min-h-[calc(100vh-8rem)] flex items-center">
      <div className="max-w-md w-full mx-auto">
        <div className="bg-white rounded-2xl shadow-um6p border border-gray/10 p-8 sm:p-10">
          {/* Back to Signup Link */}
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 text-sm text-gray hover:text-accent mb-6 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Sign Up</span>
          </Link>

          {/* Header */}
          <div className="mb-8 text-center">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="text-accent" size={32} />
            </div>
            <h1 className="font-mont font-extrabold text-2xl sm:text-3xl text-dark mb-4">
              Verify Your Account
            </h1>
            <p className="text-gray text-sm sm:text-base mb-2">
              We've sent a verification email to:
            </p>
            {email && (
              <p className="text-dark font-semibold mb-4">{email}</p>
            )}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mt-4">
              <p className="text-yellow-800 text-sm font-medium">
                <strong>⚠️ Don't forget to check your spam/junk folder!</strong>
              </p>
            </div>
          </div>

          {/* Success Message - Email Verified */}
          {isVerified && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-center justify-center gap-3">
                <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
                <p className="text-green-700 text-sm font-medium">
                  Email verified successfully! Redirecting to login...
                </p>
              </div>
            </div>
          )}

          {/* Success Message - Email Resent */}
          {resendSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-center justify-center gap-3">
                <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
                <p className="text-green-700 text-sm font-medium">
                  Verification email sent! Please check your inbox (including spam folder).
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Instructions */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-blue-800 text-sm font-medium mb-2">
              📧 What to do next:
            </p>
            <ul className="text-blue-700 text-sm space-y-2 list-disc list-inside">
              <li>Check your email inbox for a verification email</li>
              <li><strong>Check your spam/junk folder if you don't see it</strong></li>
              <li>Click the verification link in the email</li>
              <li>Emails may take 1-2 minutes to arrive</li>
            </ul>
          </div>

          {/* Resend Verification Form */}
          {!isVerified && (
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-dark mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray" size={18} />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-3 border border-gray/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-dark mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray" size={18} />
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-4 py-3 border border-gray/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                    required
                  />
                </div>
                <p className="text-xs text-gray mt-1">
                  Enter your password to resend the verification email
                </p>
              </div>

              <button
                type="button"
                onClick={handleResendVerification}
                disabled={resendingEmail || !email || !password}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent text-white font-semibold rounded-xl shadow-um6p hover:bg-accent/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resendingEmail ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw size={18} />
                    <span>Resend Verification Email</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray">
              Already verified?{' '}
              <Link to="/login" className="text-accent font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Section>
  )
}

