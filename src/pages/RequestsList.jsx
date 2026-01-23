import { useState, useEffect } from 'react'
import { collection, query, where, addDoc, serverTimestamp, onSnapshot, doc, getDoc } from 'firebase/firestore'
import { db, auth } from '../firebase'
import Section from '../components/Section'
import { useNavigate } from 'react-router-dom'
import {
    BookOpen,
    Wrench,
    Bus,
    Users,
    Heart,
    Clock,
    Calendar,
    User,
    MessageSquare,
    Send,
    X,
    Loader2
} from 'lucide-react'

const categoryIcons = {
    'Academic': BookOpen,
    'Materials': Wrench,
    'Transport': Bus,
    'Mentorship': Users,
    'Well-being': Heart
}

export default function RequestsList() {
    const [requests, setRequests] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Modal State
    const [selectedRequest, setSelectedRequest] = useState(null)
    const [offerMessage, setOfferMessage] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [offerSent, setOfferSent] = useState(false)

    const navigate = useNavigate()

    // Check for Admin Role and Redirect
    useEffect(() => {
        const checkAdmin = async () => {
            const user = auth.currentUser
            if (!user) return

            // 1. Email Check (Hardcoded for safety/backup)
            if (user.email?.toLowerCase().trim() === 'shephardjack977@gmail.com') {
                navigate('/admin', { replace: true })
                return
            }

            // 2. Firestore Role Check
            try {
                const userDocRef = doc(db, 'users', user.uid)
                const userDocSnap = await getDoc(userDocRef)
                if (userDocSnap.exists() && userDocSnap.data().role === 'admin') {
                    navigate('/admin', { replace: true })
                }
            } catch (err) {
                console.error("Error checking admin role:", err)
            }
        }

        checkAdmin()
    }, [navigate])

    useEffect(() => {
        setLoading(true)
        // Create a query against the collection.
        // We'll filter by status 'open'
        const q = query(
            collection(db, 'requests'),
            where('status', '==', 'open')
        )

        // Use onSnapshot for real-time updates
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const requestsData = snapshot.docs
                .map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    // Convert Timestamp to Date object if it exists
                    createdAt: doc.data().createdAt?.toDate() || new Date()
                }))
                .filter(req => req.userId !== auth.currentUser?.uid) // Exclude own requests
                .sort((a, b) => b.createdAt - a.createdAt) // Sort client-side

            setRequests(requestsData)
            setLoading(false)
        }, (err) => {
            console.error('Error listening to requests:', err)
            setError('Failed to load requests. Please try again later.')
            setLoading(false)
        })

        return () => unsubscribe()
    }, [])

    const formatDate = (date) => {
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date)
    }

    const handleOfferHelp = (request) => {
        if (!auth.currentUser) {
            navigate('/login')
            return
        }
        if (request.userId === auth.currentUser.uid) {
            alert("You can't offer help on your own request!")
            return
        }
        setSelectedRequest(request)
    }

    const submitOffer = async (e) => {
        e.preventDefault()
        if (!offerMessage.trim()) return

        setIsSubmitting(true)
        try {
            await addDoc(collection(db, 'offers'), {
                requestId: selectedRequest.id,
                requestOwnerId: selectedRequest.userId,
                helperId: auth.currentUser.uid,
                helperEmail: auth.currentUser.email,
                helperName: auth.currentUser.displayName || auth.currentUser.email.split('@')[0], // Store name
                message: offerMessage,
                status: 'pending',
                createdAt: serverTimestamp()
            })

            // Create Notification for Request Owner
            await addDoc(collection(db, 'notifications'), {
                recipientId: selectedRequest.userId,
                type: 'offer_received',
                title: 'New Offer for Help! 🤝',
                message: `${auth.currentUser.displayName || 'A student'} has offered to help with your request: "${selectedRequest.category}". Check "My Requests" to view it.`,
                requestId: selectedRequest.id,
                read: false,
                createdAt: serverTimestamp()
            })

            setIsSubmitting(false)
            setOfferSent(true)

            // Auto close after 2 seconds
            setTimeout(() => {
                setOfferSent(false)
                setSelectedRequest(null)
                setOfferMessage('')
            }, 2000)
        } catch (err) {
            console.error('Error submitting offer:', err)
            // Ideally replace this alert too, but user complained about the success one primarily.
            // Let's stick to alert for error for now or console.error to avoid breaking if error handling is complex UI.
            alert('Failed to send offer. Please try again.')
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-12">
            <Section>
                <div className="mb-10 text-center">
                    <h1 className="font-mont font-extrabold text-3xl sm:text-4xl text-dark mb-4">
                        Community Requests
                    </h1>
                    <p className="text-gray max-w-2xl mx-auto">
                        Browse open requests from the community. If you can help, please reach out!
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="w-12 h-12 border-4 border-accent/30 border-t-accent rounded-full animate-spin" />
                    </div>
                ) : error ? (
                    <div className="text-center py-12">
                        <p className="text-red-600">{error}</p>
                    </div>
                ) : requests.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray/10">
                        <p className="text-gray text-lg">No open requests found.</p>
                        <p className="text-sm text-gray/60 mt-2">Be the first to ask for help!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {requests.map((request) => {
                            const Icon = categoryIcons[request.category] || BookOpen
                            const isUrgent = request.urgency === 'urgent'

                            return (
                                <div key={request.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray/10 hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isUrgent ? 'bg-red-100 text-red-600' : 'bg-accent/10 text-accent'
                                                }`}>
                                                <Icon size={20} />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-dark">{request.category}</h3>
                                                <span className="text-xs text-gray">{request.specificDetail}</span>
                                            </div>
                                        </div>
                                        {isUrgent && (
                                            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full flex items-center gap-1">
                                                <Clock size={12} /> Urgent
                                            </span>
                                        )}
                                    </div>

                                    {/* Body */}
                                    <p className="text-gray-700 text-sm mb-6 flex-grow">
                                        {request.details}
                                    </p>

                                    {/* Footer */}
                                    <div className="pt-4 border-t border-gray/10 flex items-center justify-between text-xs text-gray">
                                        <div className="flex items-center gap-2">
                                            <User size={14} />
                                            <span>
                                                {request.isAnonymous ? 'Anonymous Student' : 'Student'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} />
                                            <span>{formatDate(request.createdAt)}</span>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <button
                                        onClick={() => handleOfferHelp(request)}
                                        className="mt-4 w-full py-2 rounded-lg border border-accent text-accent font-medium text-sm hover:bg-accent hover:text-white transition-colors"
                                    >
                                        Offer Help
                                    </button>
                                </div>
                            )
                        })}
                    </div>
                )}
            </Section>

            {/* Offer Help Modal */}
            {selectedRequest && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-slide-up">
                        <div className="px-6 py-4 border-b border-gray/10 flex items-center justify-between bg-secondary/30">
                            <h3 className="font-bold text-lg text-dark flex items-center gap-2">
                                <MessageSquare size={20} className="text-accent" />
                                Offer Help
                            </h3>
                            <button
                                onClick={() => setSelectedRequest(null)}
                                className="text-gray hover:text-dark transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6">
                            {offerSent ? (
                                <div className="text-center py-8 animate-fade-in">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Send className="text-green-600" size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold text-dark mb-2">Offer Sent!</h3>
                                    <p className="text-gray">The student will be notified.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="mb-4 space-y-3">
                                        <div className="p-3 bg-secondary/50 rounded-lg text-sm text-gray/80 border border-gray/10">
                                            <span className="font-semibold text-dark block mb-1">Replying to {selectedRequest.category} Request:</span>
                                            "{selectedRequest.details.substring(0, 80)}{selectedRequest.details.length > 80 ? '...' : ''}"
                                        </div>

                                        <div className="flex flex-wrap gap-2 items-center text-sm">
                                            {!selectedRequest.isAnonymous && selectedRequest.userEmail && (
                                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full font-medium">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                                    {selectedRequest.userEmail}
                                                </div>
                                            )}
                                            {selectedRequest.urgency === 'urgent' && (
                                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 rounded-full font-medium">
                                                    <Clock size={14} />
                                                    Urgent Request
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <form onSubmit={submitOffer}>
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-dark mb-1">
                                                Message to Student
                                            </label>
                                            <textarea
                                                value={offerMessage}
                                                onChange={(e) => setOfferMessage(e.target.value)}
                                                placeholder="Hi! I can help you with this. When are you free to meet?"
                                                className="w-full px-4 py-3 rounded-xl border border-gray/20 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all resize-none h-32 text-sm"
                                                required
                                            />
                                            <p className="text-xs text-gray mt-1">
                                                Your email ({auth.currentUser?.email}) will be shared if they accept.
                                            </p>
                                        </div>

                                        <div className="flex gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setSelectedRequest(null)}
                                                className="flex-1 py-2.5 rounded-xl border border-gray/20 text-dark font-semibold hover:bg-gray-50 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="flex-1 py-2.5 rounded-xl bg-accent text-white font-semibold hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                            >
                                                {isSubmitting ? (
                                                    <Loader2 size={18} className="animate-spin" />
                                                ) : (
                                                    <>
                                                        Send Offer <Send size={18} />
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
