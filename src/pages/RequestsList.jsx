import { useState, useEffect } from 'react'
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore'
import { db } from '../firebase'
import Section from '../components/Section'
import {
    BookOpen,
    Wrench,
    Bus,
    Users,
    Heart,
    Clock,
    Calendar,
    User
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

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                // Create a query against the collection.
                // Note: You might need to create a composite index in Firestore for this query to work:
                // Collection: requests, Fields: status Ascending, createdAt Descending
                const q = query(
                    collection(db, 'requests'),
                    where('status', '==', 'open'),
                    orderBy('createdAt', 'desc')
                )

                const querySnapshot = await getDocs(q)
                const requestsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    // Convert Timestamp to Date object if it exists
                    createdAt: doc.data().createdAt?.toDate() || new Date()
                }))

                setRequests(requestsData)
                setLoading(false)
            } catch (err) {
                console.error('Error fetching requests:', err)
                setError('Failed to load requests. Please try again later.')
                setLoading(false)
            }
        }

        fetchRequests()
    }, [])

    const formatDate = (date) => {
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date)
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

                                    {/* Action Button (Placeholder for now) */}
                                    <button className="mt-4 w-full py-2 rounded-lg border border-accent text-accent font-medium text-sm hover:bg-accent hover:text-white transition-colors">
                                        Offer Help
                                    </button>
                                </div>
                            )
                        })}
                    </div>
                )}
            </Section>
        </div>
    )
}
