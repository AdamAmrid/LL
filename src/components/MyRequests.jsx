import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { collection, query, where, deleteDoc, doc, updateDoc, addDoc, serverTimestamp, onSnapshot, getDocs } from 'firebase/firestore'
import { auth, db } from '../firebase'
import Section from './Section'
import {
    BookOpen,
    Wrench,
    Bus,
    Users,
    Heart,
    Clock,
    Calendar,
    ArrowRight,
    Edit2,
    Trash2,
    MessageSquare,
    Check,
    X,
    User,
    AlertTriangle,
    Star
} from 'lucide-react'

const categoryIcons = {
    'Academic': BookOpen,
    'Materials': Wrench,
    'Transport': Bus,
    'Mentorship': Users,
    'Well-being': Heart
}

export default function MyRequests() {
    const [requests, setRequests] = useState([])
    const [offers, setOffers] = useState({}) // Map of requestId -> [offers]
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    // Confirmation Modal State
    const [confirmation, setConfirmation] = useState({
        isOpen: false,
        type: null, // 'delete' | 'accept' | 'decline'
        data: null,
        title: '',
        message: ''
    })

    // Rating Modal State
    const [ratingModal, setRatingModal] = useState({
        isOpen: false,
        requestId: null,
        helperId: null,
        rating: 0
    })

    const [isProcessing, setIsProcessing] = useState(false)



    useEffect(() => {
        if (!auth.currentUser) {
            setLoading(false)
            return
        }

        // 1. Listen for Requests (Real-time)
        const qRequests = query(
            collection(db, 'requests'),
            where('userId', '==', auth.currentUser.uid)
        )

        const unsubscribeRequests = onSnapshot(qRequests, (snapshot) => {
            const requestsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date()
            }))
            // Sort by createdAt desc
            requestsData.sort((a, b) => b.createdAt - a.createdAt)
            setRequests(requestsData)
        }, (err) => {
            console.error('Error listening to requests:', err)
            setError('Failed to load your requests.')
            setLoading(false)
        })

        // 2. Listen for Offers for these requests (Real-time)
        // We query by requestOwnerId which is the current user
        const qOffers = query(
            collection(db, 'offers'),
            where('requestOwnerId', '==', auth.currentUser.uid)
        )

        const unsubscribeOffers = onSnapshot(qOffers, (snapshot) => {
            const offersMap = {}
            snapshot.docs.forEach(doc => {
                const offer = { id: doc.id, ...doc.data() }
                // Only show non-declined offers
                if (offer.status !== 'declined') {
                    if (!offersMap[offer.requestId]) {
                        offersMap[offer.requestId] = []
                    }
                    offersMap[offer.requestId].push(offer)
                }
            })
            setOffers(offersMap)
            setLoading(false)
        }, (err) => {
            console.error('Error listening to offers:', err)
            // We don't necessarily block the UI if offers fail, but good to know
        })

        return () => {
            unsubscribeRequests()
            unsubscribeOffers()
        }
    }, [])

    const openConfirmation = (type, data, title, message) => {
        setConfirmation({
            isOpen: true,
            type,
            data,
            title,
            message
        })
    }

    const closeConfirmation = () => {
        setConfirmation({ ...confirmation, isOpen: false })
    }

    const handleConfirm = async () => {
        setIsProcessing(true)
        const { type, data } = confirmation

        try {
            if (type === 'delete') {
                await deleteDoc(doc(db, 'requests', data))
                // Optimistic update not strictly needed with onSnapshot but feels snappier
                // Actually with onSnapshot we should just wait, but let's let Firestore handle it.
            }
            else if (type === 'accept') {
                const { offer, request } = data
                // 1. Update Offer status
                await updateDoc(doc(db, 'offers', offer.id), {
                    status: 'accepted'
                })

                // 2. Update Request status
                await updateDoc(doc(db, 'requests', request.id), {
                    status: 'assigned',
                    assignedTo: offer.helperId
                })

                // 3. Create Notification for Helper
                const specificDetailStr = request.specificDetail ? `: ${request.specificDetail}` : ''

                await addDoc(collection(db, 'notifications'), {
                    recipientId: offer.helperId,
                    type: 'offer_accepted',
                    title: 'Offer Accepted! 🎉',
                    message: `Your offer to help with "${request.category}${specificDetailStr}" was accepted. You can contact the student at: ${auth.currentUser.email}`,
                    requestId: request.id,
                    read: false,
                    createdAt: serverTimestamp()
                })

                // 4. Create or Get Chat Conversation
                // Check if chat already exists
                const qChat = query(
                    collection(db, 'chats'),
                    where('requestId', '==', request.id),
                    where('participants', 'array-contains', offer.helperId)
                )
                const chatSnapshot = await getDocs(qChat)

                let chatId;
                if (!chatSnapshot.empty) {
                    // Found existing chat (shouldn't happen on fresh accept usually, but good for idempotency)
                    chatId = chatSnapshot.docs[0].id
                } else {
                    // Create new chat
                    const chatRef = await addDoc(collection(db, 'chats'), {
                        requestId: request.id,
                        requesterId: auth.currentUser.uid,
                        requesterName: request.userName || auth.currentUser.displayName || auth.currentUser.email.split('@')[0], // Store name
                        requesterEmail: auth.currentUser.email,
                        helperId: offer.helperId,
                        helperName: offer.helperName || offer.helperEmail.split('@')[0], // Store name
                        helperEmail: offer.helperEmail,
                        participants: [auth.currentUser.uid, offer.helperId],
                        lastMessage: 'Chat started',
                        lastMessageTimestamp: serverTimestamp(),
                        unreadCount: { [auth.currentUser.uid]: 0, [offer.helperId]: 0 }
                    })
                    chatId = chatRef.id
                }

                navigate(`/chat/${chatId}`)
            }
            else if (type === 'decline') {
                const { offerId, requestId, helperId } = data
                await updateDoc(doc(db, 'offers', offerId), { status: 'declined' })

                if (helperId) {
                    await addDoc(collection(db, 'notifications'), {
                        recipientId: helperId,
                        type: 'offer_declined',
                        title: 'Offer Declined',
                        message: `Your offer to help with the request was declined.`,
                        requestId: requestId,
                        read: false,
                        createdAt: serverTimestamp()
                    })
                }
            }
        } catch (err) {
            console.error(`Error performing ${type}:`, err)
        } finally {
            setIsProcessing(false)
            closeConfirmation()
        }
    }

    const handleDelete = (requestId) => {
        openConfirmation(
            'delete',
            requestId,
            'Delete Request?',
            'Are you sure you want to delete this help request? This action cannot be undone.'
        )
    }

    const handleAcceptOffer = (offer, request) => {
        openConfirmation(
            'accept',
            { offer, request },
            'Accept Offer?',
            `This will mark your request as "Assigned" and share your email with the helper.`
        )
    }

    const handleDeclineOffer = (offerId, requestId) => {
        // Find offer to get helperId, or pass it in. 
        // In the render loop we have the offer object, let's look below. 
        // We need to pass the full offer object or helperId to support notification
        // BUT `handleConfirm` expects data to have helperId. 
        // Let's modify handleDeclineOffer logic in the render to pass enough info.

        // Actually, looking at the render loop:
        // onClick={() => handleDeclineOffer(offer, request.id)}  <-- I should change this signature
    }

    // Corrected Declaration for use in render (hoisted effectively but needs to be defined before return)
    const onDeclineClick = (offer, requestId) => {
        openConfirmation(
            'decline',
            { offerId: offer.id, requestId, helperId: offer.helperId },
            'Decline Offer?',
            'Are you sure you want to decline this offer?'
        )
    }

    // Rating Logic
    const handleComplete = (request, helperId) => {
        setRatingModal({
            isOpen: true,
            requestId: request.id,
            helperId: helperId,
            rating: 0
        })
    }

    const submitRating = async () => {
        if (ratingModal.rating === 0) return
        setIsProcessing(true)

        try {
            // 1. Create Rating
            await addDoc(collection(db, 'ratings'), {
                helperId: ratingModal.helperId,
                requestId: ratingModal.requestId,
                requesterId: auth.currentUser.uid,
                raterId: auth.currentUser.uid,        // New Schema compatibility
                ratedId: ratingModal.helperId,        // New Schema compatibility
                raterRole: 'requester',               // New Schema compatibility
                ratedRole: 'helper',                  // New Schema compatibility
                rating: ratingModal.rating,
                createdAt: serverTimestamp()
            })

            // 2. Update Request Status to 'completed'
            await updateDoc(doc(db, 'requests', ratingModal.requestId), {
                status: 'completed'
            })

            // 3. Notify Helper
            await addDoc(collection(db, 'notifications'), {
                recipientId: ratingModal.helperId,
                type: 'rating_received',
                title: 'You received a rating! ⭐',
                message: `You received a new rating for your help!`,
                requestId: ratingModal.requestId,
                read: false,
                createdAt: serverTimestamp()
            })

            // 4. Close (Delete) the Chat Conversation
            const qChat = query(
                collection(db, 'chats'),
                where('requestId', '==', ratingModal.requestId)
            )
            const chatSnap = await getDocs(qChat)
            chatSnap.forEach(async (docSnap) => {
                await deleteDoc(doc(db, 'chats', docSnap.id))
            })

            setRatingModal({ ...ratingModal, isOpen: false })

        } catch (err) {
            console.error("Error submitting rating:", err)
        } finally {
            setIsProcessing(false)
        }
    }

    const formatDate = (date) => {
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date)
    }

    if (!auth.currentUser) {
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray mb-4">Please log in to view your requests.</p>
                    <Link to="/login" className="text-accent hover:underline font-semibold">Log In</Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-12">
            <Section>
                <div className="mb-10">
                    <h1 className="font-mont font-extrabold text-3xl text-dark mb-2">
                        My Requests
                    </h1>
                    <p className="text-gray">
                        Track the status of your help requests.
                    </p>
                </div>

                {
                    loading ? (
                        <div className="flex justify-center py-12">
                            <div className="w-12 h-12 border-4 border-accent/30 border-t-accent rounded-full animate-spin" />
                        </div>
                    ) : error ? (
                        <div className="text-center py-12">
                            <p className="text-red-600">{error}</p>
                        </div>
                    ) : requests.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray/10">
                            <div className="w-16 h-16 bg-gray/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                <BookOpen className="text-gray/40" size={32} />
                            </div>
                            <h3 className="text-lg font-semibold text-dark mb-2">No requests yet</h3>
                            <p className="text-gray mb-6 max-w-md mx-auto">
                                You haven't submitted any help requests. If you need assistance, don't hesitate to ask the community.
                            </p>
                            <Link
                                to="/request-help"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-semibold rounded-xl hover:bg-accent/90 transition-colors shadow-um6p"
                            >
                                Request Help <ArrowRight size={18} />
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {requests.map((request) => {
                                const Icon = categoryIcons[request.category] || BookOpen
                                const isUrgent = request.urgency === 'urgent'
                                const requestOffers = offers[request.id] || []

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
                                            <span className={`px-2 py-1 text-xs font-bold rounded-full ${request.status === 'open'
                                                ? 'bg-green-100 text-green-700'
                                                : request.status === 'assigned'
                                                    ? 'bg-blue-100 text-blue-700'
                                                    : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                {request.status.toUpperCase()}
                                            </span>
                                        </div>

                                        {/* Body */}
                                        <p className="text-gray-700 text-sm mb-6 flex-grow line-clamp-3">
                                            {request.details}
                                        </p>

                                        {/* Offers Section */}
                                        {requestOffers.length > 0 && (
                                            <div className="mb-4 bg-secondary/30 rounded-lg p-3 border border-gray/10">
                                                <h4 className="text-xs font-bold text-dark uppercase mb-2 flex items-center gap-1">
                                                    <MessageSquare size={12} /> Pending Offers
                                                </h4>
                                                <div className="space-y-2">
                                                    {requestOffers.map(offer => (
                                                        <div key={offer.id} className="bg-white p-3 rounded-lg border border-gray/10 text-sm shadow-sm">
                                                            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray/5">
                                                                <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                                                                    <User size={14} />
                                                                </div>
                                                                <span className="font-semibold text-dark text-xs">{offer.helperEmail}</span>
                                                            </div>
                                                            <p className="text-dark mb-1 italic">"{offer.message}"</p>

                                                            {offer.status === 'accepted' ? (
                                                                <div className="flex flex-col gap-2 mt-2">
                                                                    <div className="flex items-center gap-2 text-green-600 font-semibold text-xs flex-grow">
                                                                        <Check size={14} /> Accepted • {offer.helperEmail}
                                                                    </div>
                                                                    <div className="flex gap-2">
                                                                        <button
                                                                            onClick={() => {
                                                                                // Quick find chat logic could be better, but for now navigate to specific chat if we can find it, 
                                                                                // or just /chat to let list load. 
                                                                                // Ideal: We should probably fetch chat ID or navigate to /chat and let user find it.
                                                                                // Or, assume we can query it quickly.
                                                                                // Let's just go to /chat for now? No, user expects specific chat.
                                                                                // Let's do a quick lookup on click or better yet, link to it if we had it.
                                                                                // Since we don't have chatId in the 'offers' collection, we have to query.
                                                                                // We can do an async lookup here.
                                                                                const findChat = async () => {
                                                                                    try {
                                                                                        const q = query(
                                                                                            collection(db, 'chats'),
                                                                                            where('requestId', '==', request.id),
                                                                                            // Just query by participants containing helper, we'll filter client side for safety or check doc
                                                                                            where('participants', 'array-contains', offer.helperId)
                                                                                        )
                                                                                        const snap = await getDocs(q)
                                                                                        if (!snap.empty) {
                                                                                            const chatDoc = snap.docs[0]
                                                                                            const chatData = chatDoc.data()

                                                                                            // Check if I am in participants
                                                                                            if (!chatData.participants.includes(auth.currentUser.uid)) {
                                                                                                // I deleted it, so add me back (revive)
                                                                                                await updateDoc(doc(db, 'chats', chatDoc.id), {
                                                                                                    participants: [...chatData.participants, auth.currentUser.uid]
                                                                                                })
                                                                                            }
                                                                                            navigate(`/chat/${chatDoc.id}`)
                                                                                        } else {
                                                                                            // Should create if not exists, but 'accept' logic usually creates it.
                                                                                            navigate('/chat')
                                                                                        }
                                                                                    } catch (err) {
                                                                                        console.error("Error finding chat:", err)
                                                                                        navigate('/chat')
                                                                                    }
                                                                                }
                                                                                findChat()
                                                                            }}
                                                                            className="flex items-center gap-1 bg-accent/10 text-accent px-3 py-1.5 rounded-md text-xs font-semibold hover:bg-accent/20 transition-colors"
                                                                        >
                                                                            <MessageSquare size={14} /> Chat
                                                                        </button>

                                                                        {request.status !== 'completed' && (
                                                                            <button
                                                                                onClick={() => handleComplete(request, offer.helperId)}
                                                                                className="flex-1 flex items-center justify-center gap-1 bg-green-100 text-green-700 py-1.5 rounded-md text-xs font-semibold hover:bg-green-200 transition-colors"
                                                                            >
                                                                                <Check size={14} /> Mark Done
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center gap-2 mt-2">
                                                                    <button
                                                                        onClick={() => handleAcceptOffer(offer, request)}
                                                                        className="flex-1 flex items-center justify-center gap-1 bg-green-50 text-green-700 hover:bg-green-100 py-1.5 rounded-md text-xs font-semibold transition-colors"
                                                                    >
                                                                        <Check size={14} /> Accept
                                                                    </button>
                                                                    <button
                                                                        onClick={() => onDeclineClick(offer, request.id)}
                                                                        className="flex-1 flex items-center justify-center gap-1 bg-red-50 text-red-700 hover:bg-red-100 py-1.5 rounded-md text-xs font-semibold transition-colors"
                                                                    >
                                                                        <X size={14} /> Decline
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Footer */}
                                        <div className="pt-4 border-t border-gray/10 flex items-center justify-between text-xs text-gray">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} />
                                                <span>{formatDate(request.createdAt)}</span>
                                            </div>
                                            {isUrgent && (
                                                <div className="flex items-center gap-1 text-red-600 font-semibold">
                                                    <Clock size={14} />
                                                    <span>Urgent</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="mt-4 pt-4 border-t border-gray/10 flex items-center gap-2">
                                            <button
                                                onClick={() => navigate(`/edit-request/${request.id}`)}
                                                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border border-gray/20 text-gray hover:text-accent hover:border-accent hover:bg-accent/5 transition-all text-sm font-medium"
                                            >
                                                <Edit2 size={16} />
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(request.id)}
                                                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border border-gray/20 text-gray hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all text-sm font-medium"
                                            >
                                                <Trash2 size={16} />
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )
                }
            </Section>
            {/* Confirmation Modal */}
            {confirmation.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-slide-up">
                        <div className="p-6 text-center">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
                                {confirmation.type === 'accept' ? (
                                    <Check size={24} className="text-green-600" />
                                ) : (
                                    <AlertTriangle size={24} />
                                )}
                            </div>

                            {/* Dynamic Icon Color Override just for Accept case, ugly inline but works */}
                            {confirmation.type === 'accept' && (
                                <style>{`.w-12.bg-red-100 { background-color: #dcfce7 !important; color: #16a34a !important; }`}</style>
                            )}

                            <h3 className="text-xl font-bold text-dark mb-2">{confirmation.title}</h3>
                            <p className="text-gray text-sm mb-6">{confirmation.message}</p>

                            <div className="flex gap-3">
                                <button
                                    onClick={closeConfirmation}
                                    className="flex-1 py-2.5 rounded-xl border border-gray/20 text-dark font-semibold hover:bg-gray-50 transition-colors"
                                    disabled={isProcessing}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirm}
                                    disabled={isProcessing}
                                    className={`flex-1 py-2.5 rounded-xl font-semibold shadow-lg transition-colors flex items-center justify-center gap-2 ${confirmation.type === 'delete' || confirmation.type === 'decline'
                                        ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/20'
                                        : 'bg-green-600 hover:bg-green-700 text-white shadow-green-600/20'
                                        }`}
                                >
                                    {isProcessing ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        confirmation.title.split(' ')[0] // "Delete", "Accept", "Decline"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Rating Modal */}
            {ratingModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-slide-up">
                        <div className="p-6 text-center">
                            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 text-yellow-500">
                                <Star size={32} fill="currentColor" />
                            </div>

                            <h3 className="text-xl font-bold text-dark mb-2">
                                {ratingModal.title || 'Rate your Helper'}
                            </h3>
                            <p className="text-gray text-sm mb-6">
                                How was your experience? Your feedback helps the community grow.
                            </p>

                            <div className="flex justify-center gap-2 mb-8">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onClick={() => setRatingModal({ ...ratingModal, rating: star })}
                                        className="transition-transform hover:scale-110 focus:outline-none"
                                    >
                                        <Star
                                            size={32}
                                            className={`${ratingModal.rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                                        />
                                    </button>
                                ))}
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setRatingModal({ ...ratingModal, isOpen: false })}
                                    className="flex-1 py-2.5 rounded-xl border border-gray/20 text-dark font-semibold hover:bg-gray-50 transition-colors"
                                    disabled={isProcessing}
                                >
                                    Later
                                </button>
                                <button
                                    onClick={submitRating}
                                    disabled={isProcessing || ratingModal.rating === 0}
                                    className="flex-1 py-2.5 rounded-xl bg-accent text-white font-semibold hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isProcessing ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        'Submit Rating'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
