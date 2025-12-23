import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { collection, addDoc, serverTimestamp, doc, getDoc, updateDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'
import {
    BookOpen,
    Wrench,
    Bus,
    Users,
    Heart,
    AlertCircle,
    CheckCircle,
    Send,
    Shield,
    Clock,
    Save
} from 'lucide-react'

const categories = [
    { id: 'Academic', label: 'Academic', icon: BookOpen, fieldLabel: 'Course Name / Subject' },
    { id: 'Materials', label: 'Materials', icon: Wrench, fieldLabel: 'Item Name (Book, Tool, etc.)' },
    { id: 'Transport', label: 'Transport', icon: Bus, fieldLabel: 'Destination / Route' },
    { id: 'Mentorship', label: 'Mentorship', icon: Users, fieldLabel: 'Topic / Area of Interest' },
    { id: 'Well-being', label: 'Well-being', icon: Heart, fieldLabel: 'Type of Support Needed' }
]

export default function RequestHelp() {
    const navigate = useNavigate()
    const { id } = useParams() // Get ID from URL if editing
    const isEditing = !!id

    const [formData, setFormData] = useState({
        category: '',
        specificDetail: '', // Dynamic field based on category
        details: '',
        isUrgent: false,
        isAnonymous: false
    })
    const [loading, setLoading] = useState(false)
    const [initialLoading, setInitialLoading] = useState(isEditing)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)

    // Fetch existing request if editing
    useEffect(() => {
        const fetchRequest = async () => {
            if (!isEditing) return

            try {
                // Auth check is now handled at component level

                const docRef = doc(db, 'requests', id)
                const docSnap = await getDoc(docRef)

                if (docSnap.exists()) {
                    const data = docSnap.data()
                    // Verify ownership
                    if (auth.currentUser && data.userId !== auth.currentUser.uid) {
                        setError("You don't have permission to edit this request.")
                        setInitialLoading(false)
                        return
                    }

                    setFormData({
                        category: data.category,
                        specificDetail: data.specificDetail,
                        details: data.details,
                        isUrgent: data.urgency === 'urgent',
                        isAnonymous: data.isAnonymous
                    })
                } else {
                    setError('Request not found.')
                }
            } catch (err) {
                console.error('Error fetching request:', err)
                setError('Failed to load request details.')
            } finally {
                setInitialLoading(false)
            }
        }

        fetchRequest()
    }, [id, isEditing])

    const handleCategorySelect = (categoryId) => {
        setFormData(prev => ({
            ...prev,
            category: categoryId,
            specificDetail: prev.category === categoryId ? prev.specificDetail : ''
        }))
        setError(null)
    }

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
        setError(null)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)

        if (!auth.currentUser) {
            setError('You must be logged in.')
            return
        }

        if (!formData.category) {
            setError('Please select a category.')
            return
        }

        if (!formData.specificDetail.trim()) {
            const category = categories.find(c => c.id === formData.category)
            setError(`Please enter the ${category?.fieldLabel || 'details'}.`)
            return
        }

        if (!formData.details.trim()) {
            setError('Please provide more details about your request.')
            return
        }

        setLoading(true)

        try {
            const requestData = {
                userId: auth.currentUser.uid,
                userEmail: auth.currentUser.email,
                userName: auth.currentUser.displayName || auth.currentUser.email.split('@')[0], // Store name
                category: formData.category,
                specificDetail: formData.specificDetail,
                details: formData.details,
                urgency: formData.isUrgent ? 'urgent' : 'normal',
                isAnonymous: formData.isAnonymous,
                // Don't update status or createdAt on edit usually, or maybe update updatedAt
                updatedAt: serverTimestamp()
            }

            if (!isEditing) {
                requestData.status = 'open'
                requestData.createdAt = serverTimestamp()
                await addDoc(collection(db, 'requests'), requestData)
            } else {
                const docRef = doc(db, 'requests', id)
                await updateDoc(docRef, requestData)
            }

            setSuccess(true)
            setLoading(false)
            window.scrollTo({ top: 0, behavior: 'smooth' })

            // Reset form after success (optional, or redirect)
            setTimeout(() => navigate('/my-requests'), 1500)
        } catch (err) {
            console.error('Error submitting request:', err)
            setError('Failed to submit request. Please try again.')
            setLoading(false)
        }
    }

    const selectedCategory = categories.find(c => c.id === formData.category)

    if (!auth.currentUser) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center p-8 max-w-md">
                    <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Shield className="text-accent" size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-dark mb-3">Authentication Required</h2>
                    <p className="text-gray mb-8">
                        Please log in to submit a help request. This helps us ensure the safety and trust of our community.
                    </p>
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => navigate('/login')}
                            className="w-full px-6 py-3 bg-accent text-white rounded-xl font-semibold hover:bg-accent/90 transition-colors shadow-um6p"
                        >
                            Log In
                        </button>
                        <button
                            onClick={() => navigate('/signup')}
                            className="w-full px-6 py-3 bg-white text-dark border border-gray/20 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                        >
                            Create Account
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    if (initialLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-accent/30 border-t-accent rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Form Section */}
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-8 sm:p-12 overflow-y-auto">
                <div className="w-full max-w-lg">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="font-mont font-extrabold text-3xl sm:text-4xl text-dark mb-2">
                            {isEditing ? 'Update Request' : 'Request Assistance'}
                        </h1>
                        <p className="text-gray text-sm sm:text-base">
                            {isEditing ? 'Update the details of your request.' : "Let the community know what you need. We're here to help."}
                        </p>
                    </div>

                    {/* Success Modal / Message - Redirecting... */}
                    {success && (
                        <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center animate-fade-in">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="text-green-600" size={32} />
                            </div>
                            <h2 className="font-mont font-bold text-2xl text-dark mb-2">
                                {isEditing ? 'Request Updated!' : 'Request Received!'}
                            </h2>
                            <p className="text-gray mb-6">
                                Redirecting to your requests...
                            </p>
                        </div>
                    )}
                    {!success && (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Error Message */}
                            {error && (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                                    <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                                    <p className="text-red-700 text-sm font-medium">{error}</p>
                                </div>
                            )}

                            {/* 1. Category Selection */}
                            <div>
                                <label className="block text-sm font-medium text-dark mb-3">
                                    What kind of help do you need?
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {categories.map((cat) => {
                                        const Icon = cat.icon
                                        const isSelected = formData.category === cat.id
                                        return (
                                            <button
                                                key={cat.id}
                                                type="button"
                                                onClick={() => handleCategorySelect(cat.id)}
                                                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${isSelected
                                                    ? 'border-accent bg-accent/5 text-accent'
                                                    : 'border-gray/10 hover:border-accent/50 text-gray hover:text-accent'
                                                    }`}
                                            >
                                                <Icon size={24} className="mb-2" />
                                                <span className="text-xs font-semibold">{cat.label}</span>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* 2. Dynamic Field (only if category selected) */}
                            <div className={`transition-all duration-300 ${formData.category ? 'opacity-100 max-h-32' : 'opacity-0 max-h-0 overflow-hidden'}`}>
                                <label htmlFor="specificDetail" className="block text-sm font-medium text-dark mb-2">
                                    {selectedCategory?.fieldLabel}
                                </label>
                                <input
                                    type="text"
                                    id="specificDetail"
                                    name="specificDetail"
                                    value={formData.specificDetail}
                                    onChange={handleInputChange}
                                    placeholder={`e.g., ${selectedCategory?.label === 'Academic' ? 'Calculus I' : '...'}`}
                                    className="w-full px-4 py-3 border border-gray/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                                    required={!!formData.category}
                                />
                            </div>

                            {/* 3. Details */}
                            <div>
                                <label htmlFor="details" className="block text-sm font-medium text-dark mb-2">
                                    Additional Details
                                </label>
                                <textarea
                                    id="details"
                                    name="details"
                                    value={formData.details}
                                    onChange={handleInputChange}
                                    rows={4}
                                    placeholder="Describe your situation and what specific help you're looking for..."
                                    className="w-full px-4 py-3 border border-gray/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
                                    required
                                />
                            </div>

                            {/* 4. Toggles (Urgency & Anonymity) */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                {/* Urgency Toggle */}
                                <label className={`flex-1 flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.isUrgent ? 'border-red-200 bg-red-50' : 'border-gray/10 hover:border-gray/30'
                                    }`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${formData.isUrgent ? 'bg-red-100 text-red-600' : 'bg-gray/10 text-gray'
                                            }`}>
                                            <Clock size={20} />
                                        </div>
                                        <div>
                                            <span className={`block font-semibold ${formData.isUrgent ? 'text-red-700' : 'text-dark'}`}>Urgent</span>
                                            <span className="text-xs text-gray">I need help ASAP</span>
                                        </div>
                                    </div>
                                    <input
                                        type="checkbox"
                                        name="isUrgent"
                                        checked={formData.isUrgent}
                                        onChange={handleInputChange}
                                        className="w-5 h-5 text-red-600 rounded focus:ring-red-500 border-gray-300"
                                    />
                                </label>

                                {/* Anonymity Toggle */}
                                <label className={`flex-1 flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.isAnonymous ? 'border-blue-200 bg-blue-50' : 'border-gray/10 hover:border-gray/30'
                                    }`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${formData.isAnonymous ? 'bg-blue-100 text-blue-600' : 'bg-gray/10 text-gray'
                                            }`}>
                                            <Shield size={20} />
                                        </div>
                                        <div>
                                            <span className={`block font-semibold ${formData.isAnonymous ? 'text-blue-700' : 'text-dark'}`}>Anonymous</span>
                                            <span className="text-xs text-gray">Hide my name</span>
                                        </div>
                                    </div>
                                    <input
                                        type="checkbox"
                                        name="isAnonymous"
                                        checked={formData.isAnonymous}
                                        onChange={handleInputChange}
                                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                                    />
                                </label>
                            </div>

                            {/* 5. Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full group inline-flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-accent text-white font-semibold shadow-um6p hover:bg-accent/90 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-soft disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>{isEditing ? 'Updating...' : 'Submitting Request...'}</span>
                                    </>
                                ) : (
                                    <>
                                        {isEditing ? <Save size={20} /> : <Send size={20} className="group-hover:translate-x-1 transition-transform duration-300" />}
                                        <span>{isEditing ? 'Save Changes' : 'Submit Request'}</span>
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>

            {/* Right Side - Visual Section */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
                    style={{
                        backgroundImage: 'url("https://images.unsplash.com/photo-1531545514256-b1400bc00f31?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80")',
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-accent/90 to-orange/80 mix-blend-multiply" />

                <div className="relative z-10 flex items-center justify-center p-12 text-center h-full">
                    <div className="max-w-lg">
                        <h2 className="font-mont font-extrabold text-4xl sm:text-5xl text-white mb-6 leading-tight">
                            {isEditing ? 'Refine your request.' : 'Asking for help is a strength, not a weakness.'}
                        </h2>
                        <p className="text-white/90 text-lg sm:text-xl leading-relaxed">
                            {isEditing
                                ? 'Updating your request helps us find the best match for you.'
                                : "Our community is built on mutual support. Whether it's academic struggles or personal challenges, you don't have to face them alone."
                            }
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
