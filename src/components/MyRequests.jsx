import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { collection, query, where, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore'
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
    Trash2
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
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchRequests = async () => {
            if (!auth.currentUser) {
                setLoading(false)
                return
            }

            try {
                // Query requests where userId matches current user
                // Sorting is done client-side to avoid index issues
                const q = query(
                    collection(db, 'requests'),
                    where('userId', '==', auth.currentUser.uid)
                )

                const querySnapshot = await getDocs(q)
                const requestsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    createdAt: doc.data().createdAt?.toDate() || new Date()
                }))

                // Sort by createdAt descending (newest first)
                requestsData.sort((a, b) => b.createdAt - a.createdAt)

                setRequests(requestsData)
                setLoading(false)
            } catch (err) {
                console.error('Error fetching requests:', err)
                setError('Failed to load your requests. Please try again later.')
                setLoading(false)
            }
        }

        fetchRequests()
    }, [])

    const handleDelete = async (requestId) => {
        if (!window.confirm('Are you sure you want to delete this request?')) return

        try {
            await deleteDoc(doc(db, 'requests', requestId))
            setRequests(prev => prev.filter(req => req.id !== requestId))
        } catch (err) {
            console.error('Error deleting request:', err)
            alert('Failed to delete request. Please try again.')
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

                {loading ? (
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
                                            : 'bg-gray-100 text-gray-700'
                                            }`}>
                                            {request.status.toUpperCase()}
                                        </span>
                                    </div>

                                    {/* Body */}
                                    <p className="text-gray-700 text-sm mb-6 flex-grow line-clamp-3">
                                        {request.details}
                                    </p>

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
                )}
            </Section>
        </div>
    )
}
