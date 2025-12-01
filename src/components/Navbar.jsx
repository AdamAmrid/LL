import { useState, useRef, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
import { Menu, X, LogOut, User, BookOpen } from 'lucide-react'
import UM6PLogo from './UM6PLogo'
import SCILogo from './SCILogo'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/organization', label: 'Organization' },
  { to: '/team', label: 'Our Team' },
]

export default function Navbar({ user }) {
  const [open, setOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

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
    <header className="fixed top-0 inset-x-0 z-50 bg-white shadow-um6p">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
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
            {navItems.map((item, index) => (
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

            {/* Auth Actions - Desktop */}
            <div className="ml-4 pl-4 border-l border-gray/20">
              {user && user.emailVerified ? (
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
                      </div>

                      <div className="py-1">
                        <Link
                          to="/my-requests"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-dark hover:bg-gray-50 hover:text-accent transition-colors"
                        >
                          <BookOpen size={16} />
                          My Requests
                        </Link>
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
                  </div>

                  <Link
                    to="/my-requests"
                    onClick={() => setOpen(false)}
                    className="w-full inline-flex items-center gap-2 px-4 py-3 text-base font-medium text-dark hover:text-accent hover:bg-secondary rounded-lg transition-all duration-200 mb-2"
                  >
                    <BookOpen size={18} />
                    My Requests
                  </Link>

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
  )
}
