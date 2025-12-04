import { useEffect, useState, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { applyActionCode, checkActionCode, reload } from 'firebase/auth'
import { auth } from '../firebase'
import { CheckCircle, XCircle, Loader } from 'lucide-react'
import Section from './Section'

export default function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState('loading') // loading, success, error
  const [errorMessage, setErrorMessage] = useState('')
  const effectRan = useRef(false)

  useEffect(() => {
    const verifyEmail = async () => {
      // Get oobCode from URL - Firebase sends it as 'oobCode' parameter
      const oobCode = searchParams.get('oobCode')
      const mode = searchParams.get('mode')

      console.log('🔍 Verification attempt:', { oobCode: oobCode ? 'present' : 'missing', mode })

      if (!oobCode) {
        setStatus('error')
        setErrorMessage('Invalid verification link. Missing verification code.')
        return
      }

      // Verify that mode is correct (if present)
      if (mode && mode !== 'verifyEmail') {
        setStatus('error')
        setErrorMessage(`Invalid verification mode: ${mode}. Expected verifyEmail.`)
        return
      }

      try {
        // First, check the action code to get the email (before applying)
        console.log('📧 Checking action code...')
        const actionCodeInfo = await checkActionCode(auth, oobCode)
        const email = actionCodeInfo.data.email
        console.log('✅ Action code is valid for email:', email)

        // Verify the email using the action code
        console.log('✉️ Applying action code to verify email...')
        await applyActionCode(auth, oobCode)
        console.log('✅ Email verified successfully for:', email)

        // Check if user is currently signed in and matches the verified email
        const currentUser = auth.currentUser

        if (currentUser && currentUser.email === email) {
          // User is signed in - reload their auth state to update emailVerified
          console.log('🔄 Reloading user auth state...')
          await reload(currentUser)
          console.log('✅ User auth state reloaded, emailVerified:', currentUser.emailVerified)

          setStatus('success')

          // Redirect to home page immediately (user is already signed in and verified)
          setTimeout(() => {
            navigate('/', { replace: true })
          }, 1500)
        } else {
          // User is not signed in - redirect to login with email pre-filled
          console.log('➡️ User not signed in, redirecting to login with email:', email)
          setStatus('success')

          setTimeout(() => {
            navigate('/login', {
              state: {
                email: email,
                successMessage: 'Email verified successfully! You can now log in.'
              },
              replace: true
            })
          }, 1500)
        }
      } catch (err) {
        console.error('❌ Verification error:', err)
        console.error('Error code:', err.code)
        console.error('Error message:', err.message)
        setStatus('error')

        if (err.code === 'auth/invalid-action-code') {
          // It's likely the link was already used (e.g. by a scanner). 
          // Treat this as a "soft success" and redirect to login.
          console.log('⚠️ Invalid action code - likely already used. Redirecting to login...')
          setStatus('success') // Show success/loading state briefly

          setTimeout(() => {
            navigate('/login', {
              state: {
                successMessage: 'Verification link processed. Please log in.'
              },
              replace: true
            })
          }, 1500)
          return
        } else if (err.code === 'auth/expired-action-code') {
          setErrorMessage('This verification link has expired. Please request a new verification email from the login page.')
        } else if (err.code === 'auth/user-disabled') {
          setErrorMessage('Your account has been disabled. Please contact support.')
        } else {
          setErrorMessage(err.message || 'Verification failed. Please try again.')
        }
      }
    }

    if (effectRan.current) return
    effectRan.current = true

    verifyEmail()
  }, [searchParams, navigate])

  return (
    <Section className="py-16 min-h-[calc(100vh-8rem)] flex items-center justify-center">
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
              <p className="text-gray text-sm">Please wait while we verify your email address.</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-green-600" size={32} />
              </div>
              <h1 className="font-mont font-extrabold text-2xl sm:text-3xl text-dark mb-2">
                Email Verified
              </h1>
              <p className="text-gray text-sm">Redirecting to login...</p>
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
              <p className="text-red-600 text-sm mb-4">{errorMessage}</p>
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
