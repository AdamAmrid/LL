import { useState, useRef, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { collection, query, where, onSnapshot, orderBy, limit, updateDoc, doc, getDocs, getDoc } from 'firebase/firestore'
import { db, auth } from '../firebase'
import { Menu, X, LogOut, User, BookOpen, Bell, MessageSquare } from 'lucide-react'
import UM6PLogo from './UM6PLogo'
import SCILogo from './SCILogo'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/activities', label: 'Activities' },
  { to: '/team', label: 'Our Team' },
]

export default function Navbar({ user }) {
  const [open, setOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [chatUnreadCount, setChatUnreadCount] = useState(0)
  const [selectedNotification, setSelectedNotification] = useState(null)

  const dropdownRef = useRef(null)
  const notificationRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Listen for Notifications
  useEffect(() => {
    if (!user) {
      setNotifications([])
      return
    }

    // Simplest query to avoid index requirements: just filter by recipient.
    // We'll sort by date client-side.
    const q = query(
      collection(db, 'notifications'),
      where('recipientId', '==', user.uid),
      limit(20)
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      }))
      // Sort client-side (Newest first)
      notifs.sort((a, b) => b.createdAt - a.createdAt)

      setNotifications(notifs)
      setUnreadCount(notifs.filter(n => !n.read).length)
    }, (error) => {
      console.error("Error listening to notifications:", error)
    })

    return () => unsubscribe()
  }, [user])

  // Check admin role
  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        setIsAdmin(false)
        return
      }

      // 1. Email Check
      if (user.email?.toLowerCase().trim() === 'shephardjack977@gmail.com') {
        setIsAdmin(true)
        return
      }

      // 2. Firestore Role Check
      try {
        const userDocRef = doc(db, 'users', user.uid)
        const userDocSnap = await getDoc(userDocRef)
        if (userDocSnap.exists() && userDocSnap.data().role === 'admin') {
          setIsAdmin(true)
        } else {
          setIsAdmin(false)
        }
      } catch (err) {
        console.error("Error checking admin role:", err)
        setIsAdmin(false)
      }
    }

    checkAdmin()
  }, [user])

  // Listen for Unread Messages in Chats
  useEffect(() => {
    if (!user) return

    const q = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', user.uid)
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let count = 0
      snapshot.docs.forEach(doc => {
        const data = doc.data()
        // Check unread count for current user
        // We stored it as map: unreadCount: { uid: number }
        if (data.unreadCount && data.unreadCount[user.uid]) {
          count += data.unreadCount[user.uid]
        }
      })
      setChatUnreadCount(count)
    })
    return () => unsubscribe()
  }, [user])

  const markAsRead = async (notification) => {
    if (!notification.read) {
      try {
        await updateDoc(doc(db, 'notifications', notification.id), {
          read: true
        })
      } catch (err) {
        console.error("Error marking read:", err)
      }
    }
  }

  const handleNotificationClick = async (notification) => {
    await markAsRead(notification)
    setSelectedNotification(notification)
    setShowNotifications(false)
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      navigate('/login')
      setIsDropdownOpen(false)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const getInitials = (email) => {
    if (!email) return 'U'
    return email.substring(0, 2).toUpperCase()
  }

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 bg-white shadow-um6p">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to={isAdmin ? "/admin" : "/"} className="flex items-center gap-3 group">
              <UM6PLogo className="h-10 sm:h-12" />
              <div className="hidden sm:block">
                <SCILogo iconSize="h-8 sm:h-10" showText={false} className="opacity-80" />
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-[11px] tracking-wide text-dark/80 hidden xl:block">A UM6P Student Initiative</span>
                <span className="text-lg sm:text-xl font-mont font-extrabold text-dark group-hover:text-accent transition-colors duration-300">USN - UM6P Solidarity Network</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1" aria-label="Main Navigation">
              {/* Only show regular nav items if NOT admin */}
              {!isAdmin && navItems.map((item, index) => (
                <div key={item.to} className="flex items-center">
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg ${isActive
                        ? 'text-accent font-semibold bg-accent/5'
                        : 'text-dark hover:text-accent hover:bg-secondary'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                  {index < navItems.length - 1 && (
                    <span className="text-dark/20 mx-1">|</span>
                  )}
                </div>
              ))}

              {/* If Admin, show only Admin related links if necessary, or nothing (dashboard is main view) */}
              {isAdmin && (
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg ${isActive
                      ? 'text-accent font-semibold bg-accent/5'
                      : 'text-dark hover:text-accent hover:bg-secondary'
                    }`
                  }
                >
                  Admin Dashboard
                </NavLink>
              )}

              {/* Auth Actions - Desktop */}
              <div className="ml-4 pl-4 border-l border-gray/20 flex items-center gap-4">
                {user && user.emailVerified ? (
                  <>
                    {!isAdmin && (
                      <>
                        {/* Messages Link */}
                        <Link
                          to="/chat"
                          className="p-2 text-gray hover:text-accent transition-colors rounded-full hover:bg-gray-100 relative"
                        >
                          <MessageSquare size={20} />
                          {chatUnreadCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
                          )}
                        </Link>

                        {/* Notifications */}
                        <div className="relative" ref={notificationRef}>
                          <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="relative p-2 text-gray hover:text-accent transition-colors rounded-full hover:bg-gray-100"
                          >
                            <Bell size={20} />
                            {unreadCount > 0 && (
                              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
                            )}
                          </button>

                          {showNotifications && (
                            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray/10 py-2 animate-fade-in origin-top-right overflow-hidden z-50">
                              <div className="px-4 py-2 border-b border-gray/10 flex justify-between items-center bg-gray-50/50">
                                <h3 className="font-bold text-sm text-dark">Notifications</h3>
                                {unreadCount > 0 && <span className="text-xs text-accent font-medium">{unreadCount} new</span>}
                              </div>
                              <div className="max-h-80 overflow-y-auto">
                                {notifications.length > 0 ? (
                                  notifications.map(notif => (
                                    <div
                                      key={notif.id}
                                      onClick={() => handleNotificationClick(notif)}
                                      className={`px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray/5 last:border-0 ${!notif.read ? 'bg-blue-50/30' : ''}`}
                                    >
                                      <div className="flex gap-3">
                                        <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${!notif.read ? 'bg-accent' : 'bg-gray-200'}`} />
                                        <div>
                                          <p className={`text-sm ${!notif.read ? 'font-semibold text-dark' : 'text-gray-700'}`}>
                                            {notif.title}
                                          </p>
                                          <p className="text-xs text-gray mt-0.5 line-clamp-2">
                                            {notif.message}
                                          </p>
                                          <p className="text-[10px] text-gray/60 mt-1.5">
                                            {notif.createdAt?.toLocaleDateString()}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <div className="p-8 text-center text-gray">
                                    <Bell size={24} className="mx-auto mb-2 opacity-20" />
                                    <p className="text-xs">No notifications yet</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </>
                    )}

                    {/* Profile Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                      <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-accent text-white font-bold text-sm hover:bg-accent/90 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
                        aria-label="User menu"
                      >
                        {getInitials(user.email)}
                      </button>

                      {/* Dropdown Menu */}
                      {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray/10 py-2 animate-fade-in origin-top-right">
                          <div className="px-4 py-3 border-b border-gray/10">
                            <p className="text-xs text-gray">Signed in as</p>
                            <p className="text-sm font-semibold text-dark truncate">{user.email}</p>
                            {isAdmin && <span className="inline-block mt-1 px-2 py-0.5 bg-accent/10 text-accent text-xs font-bold rounded">ADMIN</span>}
                          </div>

                          <div className="py-1">
                            {!isAdmin ? (
                              <Link
                                to="/my-requests"
                                onClick={() => setIsDropdownOpen(false)}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-dark hover:bg-gray-50 hover:text-accent transition-colors"
                              >
                                <BookOpen size={16} />
                                My Requests
                              </Link>
                            ) : (
                              <Link
                                to="/admin"
                                onClick={() => setIsDropdownOpen(false)}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-dark hover:bg-gray-50 hover:text-accent transition-colors"
                              >
                                <div className="w-4 h-4 flex items-center justify-center">
                                  {/* Shield icon placeholder or simple svg */}
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                                </div>
                                Admin Dashboard
                              </Link>
                            )}
                          </div>

                          <div className="border-t border-gray/10 pt-1 mt-1">
                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                            >
                              <LogOut size={16} />
                              Sign Out
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-accent hover:bg-accent/90 rounded-lg transition-all duration-200 shadow-um6p"
                    aria-label="Log in"
                  >
                    Log In
                  </Link>
                )}
              </div>
            </nav>


            {/* Mobile Menu Button */}
            <button
              aria-label="Toggle menu"
              className="lg:hidden p-2 text-dark hover:text-accent transition-colors"
              onClick={() => setOpen(!open)}
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {open && (
          <div className="lg:hidden border-t border-gray/20 bg-white">
            <nav className="px-4 pt-4 pb-6 space-y-2" aria-label="Mobile Navigation">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-3 text-base font-medium rounded-lg transition-all duration-200 ${isActive
                      ? 'text-accent font-semibold bg-accent/10'
                      : 'text-dark hover:text-accent hover:bg-secondary'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}

              {/* Auth Actions - Mobile */}
              <div className="px-4 py-3 border-t border-gray/20 mt-2">
                {user && user.emailVerified ? (
                  <>
                    <div className="flex items-center gap-2 text-sm text-gray mb-3">
                      <User size={16} />
                      <span>{user.email || user.displayName || 'User'}</span>
                      {isAdmin && <span className="text-accent text-xs font-bold bg-accent/10 px-1 rounded">ADMIN</span>}
                    </div>

                    {!isAdmin ? (
                      <Link
                        to="/my-requests"
                        onClick={() => setOpen(false)}
                        className="w-full inline-flex items-center gap-2 px-4 py-3 text-base font-medium text-dark hover:text-accent hover:bg-secondary rounded-lg transition-all duration-200 mb-2"
                      >
                        <BookOpen size={18} />
                        My Requests
                      </Link>
                    ) : (
                      <Link
                        to="/admin"
                        onClick={() => setOpen(false)}
                        className="w-full inline-flex items-center gap-2 px-4 py-3 text-base font-medium text-dark hover:text-accent hover:bg-secondary rounded-lg transition-all duration-200 mb-2"
                      >
                        <div className="w-4 h-4 flex items-center justify-center">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                        </div>
                        Admin Dashboard
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        handleLogout()
                        setOpen(false)
                      }}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-base font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                      aria-label="Sign out"
                    >
                      <LogOut size={18} />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-base font-medium text-white bg-accent hover:bg-accent/90 rounded-lg transition-all duration-200 shadow-um6p"
                    aria-label="Log in"
                  >
                    Log In
                  </Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>
      {/* Notification Info Modal */}
      {selectedNotification && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-slide-up">
            <div className="p-6">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 text-accent">
                <Bell size={24} />
              </div>

              <h3 className="text-xl font-bold text-dark mb-2 text-center">{selectedNotification.title}</h3>

              <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray/10 text-center">
                <p className="text-gray-700 text-sm leading-relaxed">
                  {selectedNotification.message.split(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi).map((part, index) => {
                    if (part.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+$/)) {
                      return (
                        <span key={index} className="font-bold text-dark bg-yellow-100 px-1 rounded">
                          {part}
                        </span>
                      )
                    }
                    return <span key={index}>{part}</span>
                  })}
                </p>
                <p className="text-xs text-gray/50 mt-3 border-t border-gray/10 pt-2">
                  Received on {selectedNotification.createdAt?.toLocaleString()}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                {selectedNotification.type === 'offer_accepted' ? (
                  <button
                    onClick={async () => {
                      // Navigate to chat
                      const q = query(
                        collection(db, 'chats'),
                        where('requestId', '==', selectedNotification.requestId),
                        where('participants', 'array-contains', user.uid)
                      )
                      const snap = await getDocs(q)
                      if (!snap.empty) {
                        navigate(`/chat/${snap.docs[0].id}`)
                      } else {
                        navigate('/chat')
                      }
                      setSelectedNotification(null)
                    }}
                    className="w-full py-2.5 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20 flex items-center justify-center gap-2"
                  >
                    <MessageSquare size={18} />
                    Start Chat
                  </button>
                ) : null}

                <button
                  onClick={() => setSelectedNotification(null)}
                  className="w-full py-2.5 rounded-xl bg-accent text-white font-semibold hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20"
                >
                  Got it
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
