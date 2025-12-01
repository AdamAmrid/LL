import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { applyActionCode, checkActionCode, onAuthStateChanged, reload } from 'firebase/auth'
import { auth } from '../firebase'
import { CheckCircle, XCircle, Loader } from 'lucide-react'
import Section from '../components/Section'

export default function VerifyEmailCallback() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState('loading') // loading, success, error
  const [message, setMessage] = useState('Verifying your email...')

  useEffect(() => {
    const verifyEmail = async () => {
      // Handle both URL formats:
      // 1. Direct: /verify-email-callback?mode=verifyEmail&oobCode=...
      // 2. From Firebase handler: /verify-email-callback?mode=verifyEmail&oobCode=... (after redirect)
      const mode = searchParams.get('mode')
      const actionCode = searchParams.get('oobCode')

      console.log('Verification callback - mode:', mode, 'oobCode:', actionCode ? 'present' : 'missing')

      if (!mode || !actionCode) {
        setStatus('error')
        setMessage('Invalid verification link. Missing parameters. Please request a new verification email.')
        return
      }

      if (mode !== 'verifyEmail') {
        setStatus('error')
        setMessage(`Invalid verification mode: ${mode}. Expected verifyEmail.`)
        return
      }

      try {
        // First, check the action code to get the email
        const actionCodeInfo = await checkActionCode(auth, actionCode)
        const email = actionCodeInfo.data.email
        
        // Verify the email using the action code
        await applyActionCode(auth, actionCode)
        console.log('✅ Email verified successfully for:', email)
        
        // Reload auth state to ensure emailVerified is updated
        // Check if user is currently signed in and reload their token
        const currentUser = auth.currentUser
        if (currentUser && currentUser.email === email) {
          await reload(currentUser)
          console.log('✅ User auth state reloaded, emailVerified:', currentUser.emailVerified)
        }
        
        setStatus('success')
        setMessage('Email verified successfully! Redirecting to login...')
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate('/login', { replace: true })
        }, 2000)
      } catch (err) {
        console.error('❌ Verification error:', err)
        console.error('Error code:', err.code)
        console.error('Error message:', err.message)
        
        setStatus('error')
        
        if (err.code === 'auth/invalid-action-code') {
          setMessage('This verification link has expired or is invalid. Please request a new one from the login page.')
        } else if (err.code === 'auth/expired-action-code') {
          setMessage('This verification link has expired. Please request a new verification email from the login page.')
        } else if (err.code === 'auth/user-disabled') {
          setMessage('Your account has been disabled. Please contact support.')
        } else {
          setMessage(`Failed to verify email: ${err.message || 'Unknown error'}. Please try requesting a new verification email.`)
        }
      }
    }

    verifyEmail()
  }, [searchParams, navigate])

  return (
    <Section className="py-16 min-h-[calc(100vh-8rem)] flex items-center">
      <div className="max-w-md w-full mx-auto">
        <div className="bg-white rounded-2xl shadow-um6p border border-gray/10 p-8 sm:p-10 text-center">
          {status === 'loading' && (
            <>
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Loader className="text-accent animate-spin" size={32} />
              </div>
              <h1 className="font-mont font-extrabold text-2xl sm:text-3xl text-dark mb-2">
                Verifying...
              </h1>
              <p className="text-gray text-sm">{message}</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-green-600" size={32} />
              </div>
              <h1 className="font-mont font-extrabold text-2xl sm:text-3xl text-dark mb-2">
                Email Verified!
              </h1>
              <p className="text-gray text-sm">{message}</p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="text-red-600" size={32} />
              </div>
              <h1 className="font-mont font-extrabold text-2xl sm:text-3xl text-dark mb-2">
                Verification Failed
              </h1>
              <p className="text-red-600 text-sm mb-4">{message}</p>
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-3 rounded-xl bg-accent text-white font-semibold shadow-um6p hover:bg-accent/90 transition-all duration-300"
              >
                Go to Login
              </button>
            </>
          )}
        </div>
      </div>
    </Section>
  )
}

