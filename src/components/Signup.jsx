import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db, getCallbackUrl } from '../firebase'
import { User, Mail, Lock, ChevronDown, AlertCircle, CheckCircle, CreditCard, Building2, GraduationCap, Briefcase } from 'lucide-react'

const departments = [
  'SCI',
  'ABS',
  'College of Computing (UM6P-CS)',
  'SHBM',
  'SAP+D',
  'FMS',
  'GTI',
  'IST&I',
  'EMINES',
  'FGSES'
]

const educationalLevels = ['L1', 'L2', 'L3', 'M1', 'M2', 'PhD']

export default function Signup() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
    role: '',
    campus: '',
    napsCardNumber: '',
    department: '',
    educationalLevel: ''
  })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

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
      console.log('Starting signup process...')

      // Validation: Check all fields
      if (!formData.fullName.trim()) {
        setError('Please enter your full name')
        setLoading(false)
        return
      }

      if (!formData.email.trim()) {
        setError('Please enter your email address')
        setLoading(false)
        return
      }

      // Validation: Check if email ends with @um6p.ma
      if (!formData.email.endsWith('@um6p.ma')) {
        setError('Registration is restricted to UM6P emails (@um6p.ma)')
        setLoading(false)
        return
      }

      if (!formData.password || formData.password.length < 6) {
        setError('Password must be at least 6 characters long')
        setLoading(false)
        return
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match')
        setLoading(false)
        return
      }

      if (!formData.gender) {
        setError('Please select your gender')
        setLoading(false)
        return
      }

      if (!formData.role) {
        setError('Please select your role')
        setLoading(false)
        return
      }

      if (!formData.campus) {
        setError('Please select your campus')
        setLoading(false)
        return
      }

      if (!formData.napsCardNumber.trim()) {
        setError('Please enter your Naps Card Number')
        setLoading(false)
        return
      }

      // Validate Naps Card Number: exactly 16 digits
      const napsCardRegex = /^\d{16}$/
      if (!napsCardRegex.test(formData.napsCardNumber.replace(/\s/g, ''))) {
        setError('Naps Card Number must be exactly 16 digits')
        setLoading(false)
        return
      }

      // If role is Student, validate department and educational level
      if (formData.role === 'Student') {
        if (!formData.department) {
          setError('Please select your department')
          setLoading(false)
          return
        }

        if (!formData.educationalLevel) {
          setError('Please select your educational level')
          setLoading(false)
          return
        }
      }

      console.log('Creating user with email:', formData.email)

      // Create User
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      )

      const user = userCredential.user
      console.log('User created successfully:', user.uid)

      // Update user display name
      await updateProfile(user, {
        displayName: formData.fullName
      })
      console.log('Profile updated')

      // Prepare Firestore data
      const userData = {
        fullName: formData.fullName,
        email: formData.email,
        gender: formData.gender,
        role: formData.role,
        campus: formData.campus,
        napsCardNumber: formData.napsCardNumber.replace(/\s/g, ''), // Remove spaces
        createdAt: new Date().toISOString()
      }

      // Add student-specific fields if role is Student
      if (formData.role === 'Student') {
        userData.department = formData.department
        userData.educationalLevel = formData.educationalLevel
      }

      // Save Data to Firestore (non-blocking - continue if it fails)
      try {
        await setDoc(doc(db, 'users', user.uid), userData)
        console.log('Firestore data saved')
      } catch (firestoreError) {
        console.warn('⚠️ Firestore save failed, but continuing:', firestoreError)
        console.error('Firestore error code:', firestoreError.code)
        console.error('Firestore error message:', firestoreError.message)
        // Continue anyway - user account is created
      }

      // Try to send verification email, but don't block on failure
      try {
        const actionCodeSettings = {
          url: `${getCallbackUrl()}/verify-email`,
          handleCodeInApp: false,
        }
        await sendEmailVerification(user, actionCodeSettings)
        console.log('✅ Verification email sent successfully')
      } catch (emailError) {
        console.warn('⚠️ Email verification failed, but continuing:', emailError)
        // Continue anyway - don't block signup for email issues
      }

      // DON'T sign out - keep user signed in so they can access account after verification
      // The App.jsx will handle redirecting unverified users appropriately
      console.log('✅ User remains signed in - will be able to access account after email verification')

      // Show success message
      setSuccess(true)
      setLoading(false)

      console.log('Redirecting to login in 2 seconds...')

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login', {
          state: {
            email: formData.email,
            successMessage: 'Account created! Please check your Outlook email (including spam folder) to verify your account.'
          },
          replace: true
        })
      }, 2000)

    } catch (err) {
      console.error('❌ Signup error:', err)
      console.error('Error code:', err.code)
      console.error('Error message:', err.message)

      let errorMessage = 'Failed to create account. Please try again.'

      if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered. Please log in instead.'
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.'
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please use a stronger password.'
      } else if (err.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your connection and try again.'
      } else if (err.message) {
        errorMessage = err.message
      }

      setError(errorMessage)
      setLoading(false)
    }
  }

  const isStudent = formData.role === 'Student'

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-8 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-mont font-extrabold text-3xl sm:text-4xl text-dark mb-2">
              Create Account
            </h1>
            <p className="text-gray text-sm sm:text-base">
              Join the UM6P Solidarity Network
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
              <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="text-green-700 text-sm font-semibold">Account created successfully!</p>
                <p className="text-green-600 text-xs mt-1">Redirecting to login...</p>
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

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-dark mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                  placeholder="Enter your full name"
                  required
                  disabled={loading || success}
                />
              </div>
            </div>

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
                  disabled={loading || success}
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
                  placeholder="Enter your password (min. 6 characters)"
                  required
                  minLength={6}
                  disabled={loading || success}
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-dark mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                  placeholder="Confirm your password"
                  required
                  minLength={6}
                  disabled={loading || success}
                />
              </div>
            </div>

            {/* Gender */}
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-dark mb-2">
                Gender
              </label>
              <div className="relative">
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full pl-4 pr-10 py-3 border border-gray/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all appearance-none bg-white"
                  required
                  disabled={loading || success}
                >
                  <option value="">Select your gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
              </div>
            </div>

            {/* Role */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-dark mb-2">
                Role
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-10 py-3 border border-gray/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all appearance-none bg-white"
                  required
                  disabled={loading || success}
                >
                  <option value="">Select your role</option>
                  <option value="Student">Student</option>
                  <option value="Staff">Staff</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
              </div>
            </div>

            {/* Campus */}
            <div>
              <label htmlFor="campus" className="block text-sm font-medium text-dark mb-2">
                Campus
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <select
                  id="campus"
                  name="campus"
                  value={formData.campus}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-10 py-3 border border-gray/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all appearance-none bg-white"
                  required
                  disabled={loading || success}
                >
                  <option value="">Select your campus</option>
                  <option value="Benguerir">Benguerir</option>
                  <option value="Rabat">Rabat</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
              </div>
            </div>

            {/* Naps Card Number */}
            <div>
              <label htmlFor="napsCardNumber" className="block text-sm font-medium text-dark mb-2">
                Naps Card Number
              </label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  id="napsCardNumber"
                  name="napsCardNumber"
                  value={formData.napsCardNumber}
                  onChange={(e) => {
                    // Only allow digits and spaces, max 19 characters (16 digits + 3 spaces for formatting)
                    const value = e.target.value.replace(/\D/g, '').slice(0, 16)
                    setFormData(prev => ({
                      ...prev,
                      napsCardNumber: value
                    }))
                    setError(null)
                  }}
                  className="w-full pl-10 pr-4 py-3 border border-gray/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all font-mono tracking-wider"
                  placeholder="1234567890123456"
                  maxLength={16}
                  required
                  disabled={loading || success}
                />
              </div>
              <p className="mt-1 text-xs text-gray">Enter your 16-digit Naps Card Number</p>
            </div>

            {/* Department - Only show if Role is Student */}
            {isStudent && (
              <div>
                <label htmlFor="department" className="block text-sm font-medium text-dark mb-2">
                  Department
                </label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <select
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-10 py-3 border border-gray/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all appearance-none bg-white"
                    required={isStudent}
                    disabled={loading || success}
                  >
                    <option value="">Select your department</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                </div>
              </div>
            )}

            {/* Educational Level - Only show if Role is Student */}
            {isStudent && (
              <div>
                <label htmlFor="educationalLevel" className="block text-sm font-medium text-dark mb-2">
                  Educational Level
                </label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <select
                    id="educationalLevel"
                    name="educationalLevel"
                    value={formData.educationalLevel}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-10 py-3 border border-gray/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all appearance-none bg-white"
                    required={isStudent}
                    disabled={loading || success}
                  >
                    <option value="">Select your educational level</option>
                    {educationalLevels.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || success}
              className="w-full group inline-flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-accent text-white font-semibold shadow-um6p hover:bg-accent/90 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-soft disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 mt-6"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : success ? (
                <>
                  <CheckCircle size={20} />
                  <span>Success!</span>
                </>
              ) : (
                <>
                  <User size={20} className="group-hover:scale-110 transition-transform duration-300" />
                  <span>Sign Up</span>
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray">
              Already have an account?{' '}
              <Link to="/login" className="text-accent font-semibold hover:underline">
                Log in
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
              Building a Community of Solidarity
            </h2>
            <p className="text-white/90 text-lg sm:text-xl leading-relaxed">
              Every student deserves to thrive. Together, we can help each other succeed through solidarity, empathy, and collective responsibility.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
