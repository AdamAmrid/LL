import { useState, useEffect } from 'react'
import { collection, query, getDocs, orderBy, where, doc, getDoc, updateDoc } from 'firebase/firestore'
import { db, auth } from '../firebase'
import { useNavigate } from 'react-router-dom'
import Section from '../components/Section'
import {
    Users,
    MessageSquare,
    HeartHandshake,
    Shield,
    Star,
    Search,
    Filter,
    ArrowUpRight,
    CheckCircle,
    XCircle,
    Clock,
    Mail,
    Calendar,
    Ban,
    Unlock,
    AlertTriangle
} from 'lucide-react'

const ADMIN_EMAIL = 'shephardjack977@gmail.com'

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        usersCount: 0,
        requestsCount: 0,
        offersCount: 0,
        completedCount: 0
    })

    // Data States
    const [activities, setActivities] = useState([]) // Requests (enriched)
    const [usersList, setUsersList] = useState([])
    const [offersList, setOffersList] = useState([])

    // Action State
    const [actionLoading, setActionLoading] = useState(null)
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        userId: null,
        currentStatus: null
    })

    // View State
    const [activeView, setActiveView] = useState('requests') // 'users', 'requests', 'offers', 'completed'

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [filter, setFilter] = useState('all') // for requests/offers
    const [searchTerm, setSearchTerm] = useState('')

    const navigate = useNavigate()

    useEffect(() => {
        const checkAdminAndFetchData = async () => {
            let isAdmin = false

            // 1. Check specific email
            if (auth.currentUser.email?.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase().trim()) {
                isAdmin = true
            } else {
                // 2. Check role from Firestore
                try {
                    const userDocRef = doc(db, 'users', auth.currentUser.uid)
                    const userDocSnap = await getDoc(userDocRef)
                    if (userDocSnap.exists() && userDocSnap.data().role === 'admin') {
                        isAdmin = true
                    }
                } catch (err) {
                    console.error("Error checking role:", err)
                }
            }

            if (!isAdmin) {
                navigate('/')
                return
            }

            try {
                // Fetch all collections
                const usersSnap = await getDocs(collection(db, 'users'))
                const requestsSnap = await getDocs(collection(db, 'requests'))
                const offersSnap = await getDocs(collection(db, 'offers'))
                const ratingsSnap = await getDocs(collection(db, 'ratings'))

                // Process Users
                const usersData = usersSnap.docs.map(d => ({ id: d.id, ...d.data() }))
                setUsersList(usersData)

                // Process Offers
                const offersData = offersSnap.docs.map(d => ({
                    id: d.id,
                    ...d.data(),
                    createdAt: d.data().createdAt?.toDate ? d.data().createdAt.toDate() : new Date(d.data().createdAt)
                }))
                setOffersList(offersData)

                // Process Requests (Activities)
                const allOffers = offersData
                const allRatings = ratingsSnap.docs.map(d => ({ id: d.id, ...d.data() }))

                const activityData = requestsSnap.docs.map(reqDoc => {
                    const req = { id: reqDoc.id, ...reqDoc.data() }
                    const acceptedOffer = allOffers.find(o => o.requestId === req.id && o.status === 'accepted')
                    const ratingObj = allRatings.find(r => r.requestId === req.id)

                    return {
                        id: req.id,
                        category: req.category,
                        title: req.specificDetail || 'Request',
                        requesterName: req.userName || 'Unknown',
                        requesterEmail: req.email || 'No email',
                        status: req.status,
                        createdAt: req.createdAt?.toDate ? req.createdAt.toDate() : new Date(req.createdAt),
                        helperName: acceptedOffer ? (acceptedOffer.helperName || 'Helper') : null,
                        helperEmail: acceptedOffer ? acceptedOffer.helperEmail : null,
                        rating: ratingObj ? ratingObj.rating : null
                    }
                })

                // Sort by date desc
                activityData.sort((a, b) => b.createdAt - a.createdAt)
                setActivities(activityData)

                // Set Stats
                setStats({
                    usersCount: usersSnap.size,
                    requestsCount: requestsSnap.size,
                    offersCount: offersSnap.size,
                    completedCount: activityData.filter(a => a.status === 'completed').length
                })

                setLoading(false)

            } catch (err) {
                console.error("Error fetching admin data:", err)
                setError('Failed to load dashboard data.')
                setLoading(false)
            }
        }

        checkAdminAndFetchData()
    }, [navigate])

    // -- Actions --
    const initiateToggleStatus = (userId, currentStatus) => {
        setConfirmModal({
            isOpen: true,
            userId,
            currentStatus
        })
    }

    const confirmToggleStatus = async () => {
        const { userId, currentStatus } = confirmModal
        if (!userId) return

        setActionLoading(userId)
        setConfirmModal(prev => ({ ...prev, isOpen: false })) // Close modal immediately

        try {
            const newStatus = currentStatus === 'suspended' ? 'active' : 'suspended'
            const userRef = doc(db, 'users', userId)

            await updateDoc(userRef, {
                status: newStatus
            })

            // Update local state
            setUsersList(prev => prev.map(user =>
                user.id === userId ? { ...user, status: newStatus } : user
            ))

        } catch (err) {
            console.error("Error updating user status:", err)
            alert("Failed to update user status")
        } finally {
            setActionLoading(null)
            setConfirmModal({ isOpen: false, userId: null, currentStatus: null })
        }
    }

    // -- Filtering Logic --
    const getFilteredData = () => {
        const lowerSearch = searchTerm.toLowerCase()

        if (activeView === 'users') {
            return usersList.filter(user =>
            (user.email?.toLowerCase().includes(lowerSearch) ||
                user.displayName?.toLowerCase().includes(lowerSearch))
            )
        }

        if (activeView === 'offers') {
            return offersList.filter(offer => {
                const matchesSearch =
                    offer.helperEmail?.toLowerCase().includes(lowerSearch) ||
                    offer.helperName?.toLowerCase().includes(lowerSearch)

                if (filter === 'all') return matchesSearch
                if (filter === 'accepted') return matchesSearch && offer.status === 'accepted'
                if (filter === 'pending') return matchesSearch && (offer.status === 'pending' || offer.status === 'open')
                return matchesSearch
            })
        }

        if (activeView === 'completed') {
            // Re-use activities but filter strictly for completed
            return activities.filter(item => {
                const matchesSearch =
                    item.title?.toLowerCase().includes(lowerSearch) ||
                    item.requesterName?.toLowerCase().includes(lowerSearch)
                return matchesSearch && item.status === 'completed'
            })
        }

        // Default: requests
        return activities.filter(item => {
            const matchesSearch =
                item.title?.toLowerCase().includes(lowerSearch) ||
                item.requesterName?.toLowerCase().includes(lowerSearch)

            if (filter === 'all') return matchesSearch
            if (filter === 'completed') return matchesSearch && item.status === 'completed'
            if (filter === 'pending') return matchesSearch && (item.status === 'open' || item.status === 'assigned')
            return matchesSearch
        })
    }

    const filteredData = getFilteredData()

    if (loading) {
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-accent/30 border-t-accent rounded-full animate-spin" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center text-red-600">
                {error}
            </div>
        )
    }

    // View Titles
    const viewTitles = {
        users: 'Registered Users',
        requests: 'All Requests',
        offers: 'Offers Made',
        completed: 'Completed History'
    }

    const resetView = () => {
        setActiveView('requests')
        setFilter('all')
        setSearchTerm('')
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            <Section>
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1
                            onClick={resetView}
                            className="font-mont font-extrabold text-3xl text-dark flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                        >
                            <Shield className="text-accent" size={32} />
                            Admin Dashboard
                        </h1>
                        <p className="text-gray mt-1">Overview of platform activity and performance.</p>
                    </div>
                    <div className="hidden sm:block px-4 py-2 bg-white border border-gray/10 rounded-lg shadow-sm text-sm font-medium text-gray">
                        {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                </div>

                {/* Stats Grid - Clickable */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <StatsCard
                        title="Total Users"
                        value={stats.usersCount}
                        icon={Users}
                        color="blue"
                        isActive={activeView === 'users'}
                        onClick={() => { setActiveView('users'); setFilter('all'); }}
                    />
                    <StatsCard
                        title="Total Requests"
                        value={stats.requestsCount}
                        icon={MessageSquare}
                        color="purple"
                        isActive={activeView === 'requests'}
                        onClick={() => { setActiveView('requests'); setFilter('all'); }}
                    />
                    <StatsCard
                        title="Offers Made"
                        value={stats.offersCount}
                        icon={HeartHandshake}
                        color="rose"
                        isActive={activeView === 'offers'}
                        onClick={() => { setActiveView('offers'); setFilter('all'); }}
                    />
                    <StatsCard
                        title="Completed Help"
                        value={stats.completedCount}
                        icon={CheckCircle}
                        color="green"
                        isActive={activeView === 'completed'}
                        onClick={() => { setActiveView('completed'); setFilter('all'); }}
                    />
                </div>

                {/* Dynamic Data Table Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray/10 overflow-hidden min-h-[400px]">
                    <div className="p-6 border-b border-gray/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            {activeView !== 'requests' && (
                                <button
                                    onClick={resetView}
                                    className="p-1.5 rounded-lg hover:bg-gray-100 text-gray transition-colors"
                                    title="Back to Overview"
                                >
                                    <ArrowUpRight className="rotate-[225deg]" size={20} />
                                </button>
                            )}
                            <h2 className="text-lg font-bold text-dark">{viewTitles[activeView]}</h2>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
                            <div className="relative w-full sm:w-auto">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9 pr-4 py-2 bg-gray-50 border border-gray/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 w-full sm:w-64"
                                />
                            </div>

                            {/* Filter Buttons (Hide for Users view as it doesn't utilize status filters yet) */}
                            {activeView !== 'users' && (
                                <div className="flex bg-gray-50 rounded-lg p-1 border border-gray/20 w-full sm:w-auto">
                                    <button
                                        onClick={() => setFilter('all')}
                                        className={`flex-1 sm:flex-none px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${filter === 'all' ? 'bg-white shadow-sm text-dark' : 'text-gray hover:text-dark'}`}
                                    >
                                        All
                                    </button>
                                    <button
                                        onClick={() => setFilter('pending')}
                                        className={`flex-1 sm:flex-none px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${filter === 'pending' ? 'bg-white shadow-sm text-dark' : 'text-gray hover:text-dark'}`}
                                    >
                                        Open
                                    </button>
                                    {activeView === 'offers' ? (
                                        <button
                                            onClick={() => setFilter('accepted')}
                                            className={`flex-1 sm:flex-none px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${filter === 'accepted' ? 'bg-white shadow-sm text-dark' : 'text-gray hover:text-dark'}`}
                                        >
                                            Accepted
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => setFilter('completed')}
                                            className={`flex-1 sm:flex-none px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${filter === 'completed' ? 'bg-white shadow-sm text-dark' : 'text-gray hover:text-dark'}`}
                                        >
                                            Done
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            {/* Render Table Header Based on View */}
                            <thead>
                                <tr className="bg-gray-50/50 text-xs text-gray uppercase tracking-wider border-b border-gray/10">
                                    {activeView === 'users' && (
                                        <>
                                            <th className="px-6 py-4 font-semibold">User</th>
                                            <th className="px-6 py-4 font-semibold">Email</th>
                                            <th className="px-6 py-4 font-semibold">Role</th>
                                            <th className="px-6 py-4 font-semibold">Status</th>
                                            <th className="px-6 py-4 font-semibold text-right">Action</th>
                                        </>
                                    )}
                                    {(activeView === 'requests' || activeView === 'completed') && (
                                        <>
                                            <th className="px-6 py-4 font-semibold">Request Detail</th>
                                            <th className="px-6 py-4 font-semibold">Requester</th>
                                            <th className="px-6 py-4 font-semibold">Status</th>
                                            <th className="px-6 py-4 font-semibold">Helper</th>
                                            <th className="px-6 py-4 font-semibold">Rating</th>
                                            <th className="px-6 py-4 font-semibold text-right">Date</th>
                                        </>
                                    )}
                                    {activeView === 'offers' && (
                                        <>
                                            <th className="px-6 py-4 font-semibold">Offer Detail</th>
                                            <th className="px-6 py-4 font-semibold">Helper</th>
                                            <th className="px-6 py-4 font-semibold">Status</th>
                                            <th className="px-6 py-4 font-semibold text-right">Date</th>
                                        </>
                                    )}
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray/5">
                                {filteredData.length > 0 ? (
                                    filteredData.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">

                                            {/* USERS VIEW ROWS */}
                                            {activeView === 'users' && (
                                                <>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold">
                                                                {(item.email || item.fullName || 'U')[0].toUpperCase()}
                                                            </div>
                                                            <span className="font-medium text-dark">{item.fullName || 'No Name'}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray">{item.email}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${item.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                                                            {item.role || 'User'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border ${item.status === 'suspended'
                                                            ? 'bg-red-50 text-red-700 border-red-100'
                                                            : 'bg-green-50 text-green-700 border-green-100'
                                                            }`}>
                                                            {item.status === 'suspended' ? 'Suspended' : 'Active'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                initiateToggleStatus(item.id, item.status)
                                                            }}
                                                            disabled={actionLoading === item.id || item.role === 'admin'} // Prevent blocking admins
                                                            className={`p-2 rounded-lg transition-colors ${item.status === 'suspended'
                                                                ? 'text-green-600 hover:bg-green-50'
                                                                : 'text-red-500 hover:bg-red-50'
                                                                } ${item.role === 'admin' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                            title={item.status === 'suspended' ? "Unblock User" : "Block User"}
                                                        >
                                                            {actionLoading === item.id ? (
                                                                <div className="w-4 h-4 border-2 border-currentColor border-t-transparent rounded-full animate-spin" />
                                                            ) : (
                                                                item.status === 'suspended' ? <Unlock size={18} /> : <Ban size={18} />
                                                            )}
                                                        </button>
                                                    </td>
                                                </>
                                            )}

                                            {/* REQUESTS / COMPLETED VIEW ROWS */}
                                            {(activeView === 'requests' || activeView === 'completed') && (
                                                <>
                                                    <td className="px-6 py-4">
                                                        <p className="font-medium text-dark text-sm">{item.category}</p>
                                                        <p className="text-xs text-gray truncate max-w-[150px]">{item.title}</p>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center text-accent text-xs font-bold">
                                                                {item.requesterEmail ? item.requesterEmail[0].toUpperCase() : '?'}
                                                            </div>
                                                            <div className="text-sm">
                                                                <p className="text-dark font-medium">{item.requesterName}</p>
                                                                <p className="text-xs text-gray">{item.requesterEmail}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <StatusBadge status={item.status} />
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {item.helperEmail ? (
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">
                                                                    {item.helperEmail[0].toUpperCase()}
                                                                </div>
                                                                <div className="text-sm">
                                                                    <p className="text-dark font-medium">{item.helperName}</p>
                                                                    <p className="text-xs text-gray">{item.helperEmail}</p>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <span className="text-xs text-gray italic">-</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {item.rating ? (
                                                            <div className="flex items-center text-yellow-400 gap-1">
                                                                <Star size={14} fill="currentColor" />
                                                                <span className="text-dark font-semibold text-sm">{item.rating}</span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-xs text-gray">-</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-right text-xs text-gray">
                                                        {item.createdAt.toLocaleDateString()}
                                                    </td>
                                                </>
                                            )}

                                            {/* OFFERS VIEW ROWS */}
                                            {activeView === 'offers' && (
                                                <>
                                                    <td className="px-6 py-4">
                                                        <p className="font-medium text-dark text-sm">Offer for Request #{item.requestId?.slice(0, 6)}</p>
                                                        <p className="text-xs text-gray truncate max-w-[200px]">{item.message || 'No message'}</p>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">
                                                                {item.helperEmail ? item.helperEmail[0].toUpperCase() : '?'}
                                                            </div>
                                                            <div className="text-sm">
                                                                <p className="text-dark font-medium">{item.helperName}</p>
                                                                <p className="text-xs text-gray">{item.helperEmail}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.status === 'accepted' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                            }`}>
                                                            {item.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right text-xs text-gray">
                                                        {item.createdAt?.toLocaleDateString ? item.createdAt.toLocaleDateString() : 'N/A'}
                                                    </td>
                                                </>
                                            )}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-gray">
                                            <div className="flex flex-col items-center justify-center">
                                                <Search className="text-gray/20 mb-2" size={40} />
                                                <p>No records found matching your selection.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Section>

            {/* Confirmation Modal */}
            {confirmModal.isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-slide-up">
                        <div className="p-6 text-center">
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${confirmModal.currentStatus === 'suspended' ? 'bg-green-100 text-green-600' : 'bg-red-50 text-red-600'
                                }`}>
                                {confirmModal.currentStatus === 'suspended' ? <Unlock size={32} /> : <Ban size={32} />}
                            </div>
                            <h3 className="text-xl font-bold text-dark mb-2">
                                {confirmModal.currentStatus === 'suspended' ? 'Unblock User?' : 'Suspend User?'}
                            </h3>
                            <p className="text-gray text-sm mb-6 leading-relaxed">
                                {confirmModal.currentStatus === 'suspended'
                                    ? 'Are you sure you want to reactivate this user? They will regain access to the platform.'
                                    : 'Are you sure you want to suspend this user? They will lose access to the platform immediately.'}
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setConfirmModal({ isOpen: false, userId: null, currentStatus: null })}
                                    className="flex-1 py-2.5 rounded-xl border border-gray/20 text-dark font-semibold hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmToggleStatus}
                                    className={`flex-1 py-2.5 rounded-xl text-white font-semibold transition-colors shadow-lg ${confirmModal.currentStatus === 'suspended'
                                        ? 'bg-green-600 hover:bg-green-700 shadow-green-600/20'
                                        : 'bg-red-600 hover:bg-red-700 shadow-red-600/20'
                                        }`}
                                >
                                    {confirmModal.currentStatus === 'suspended' ? 'Confirm Unblock' : 'Confirm Suspend'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

function StatsCard({ title, value, icon: Icon, color, isActive, onClick }) {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600',
        purple: 'bg-purple-50 text-purple-600',
        rose: 'bg-rose-50 text-rose-600',
        green: 'bg-green-50 text-green-600'
    }

    return (
        <div
            onClick={onClick}
            className={`bg-white p-6 rounded-xl shadow-sm border transition-all duration-300 cursor-pointer ${isActive
                ? `border-${color}-500 ring-2 ring-${color}-500/10 shadow-md transform scale-[1.02]`
                : 'border-gray/10 hover:shadow-md hover:border-accent/30 hover:translate-y-[-2px]'
                }`}
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-gray mb-1">{title}</p>
                    <h3 className="text-3xl font-extrabold text-dark">{value}</h3>
                </div>
                <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
                    <Icon size={24} />
                </div>
            </div>
        </div>
    )
}

function StatusBadge({ status }) {
    if (status === 'completed') {
        return (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
                <CheckCircle size={12} /> Completed
            </span>
        )
    }
    if (status === 'assigned') {
        return (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
                <Clock size={12} /> In Progress
            </span>
        )
    }
    return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
            <Clock size={12} /> Open
        </span>
    )
}
