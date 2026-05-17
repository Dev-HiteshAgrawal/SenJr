import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Menu, X, GraduationCap, LogOut, LayoutDashboard, ChevronDown, Zap, Calendar } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const Navbar = () => {
  const { user, userData, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  const handleLogout = async () => {
    await signOut()
    navigate('/')
    setIsOpen(false)
    setDropdownOpen(false)
  }

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsOpen(false)
  }, [location])

  const dashboardHref = userData?.role === 'mentor' ? '/dashboard/mentor' : '/dashboard/student'
  const primaryActionLabel = userData?.role === 'mentor' ? 'Mentor Hub' : 'My Dashboard'

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-gray-100 fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-primary-500 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-display font-bold text-gray-900 tracking-tight">Senjr</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-2">
            {user ? (
              <>
                {/* Primary action */}
                <Link
                  to={dashboardHref}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition-colors"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>{primaryActionLabel}</span>
                </Link>

                {/* Quick links based on role */}
                {userData?.role === 'student' && (
                  <>
                    <Link to="/sessions" className="px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" /> Sessions
                    </Link>
                    <Link to="/find-mentor" className="px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors flex items-center gap-1.5">
                      <Zap className="h-4 w-4" /> Find Mentor
                    </Link>
                  </>
                )}
                {userData?.role === 'mentor' && (
                  <Link to="/sessions" className="px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" /> Sessions
                  </Link>
                )}

                {/* User dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xs">
                      {userData?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <ChevronDown className={`h-4 w-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl shadow-gray-200/80 border border-gray-100 py-2 overflow-hidden"
                      >
                        <div className="px-4 py-2 border-b border-gray-100 mb-1">
                          <p className="text-xs text-gray-400 font-medium">Signed in as</p>
                          <p className="text-sm text-gray-800 font-semibold truncate">{user?.email}</p>
                          <span className="text-xs px-2 py-0.5 bg-primary-50 text-primary-600 rounded-full font-medium capitalize">{userData?.role || 'user'}</span>
                        </div>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 rounded-xl text-sm text-gray-600 font-medium hover:text-gray-900 hover:bg-gray-100 transition-colors">
                  Log in
                </Link>
                <Link
                  to="/join"
                  className="px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition-colors shadow-sm"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden bg-white border-t border-gray-100"
          >
            <div className="px-4 pt-3 pb-5 space-y-1">
              {user ? (
                <>
                  <div className="flex items-center gap-3 px-3 py-3 mb-2 bg-gray-50 rounded-xl">
                    <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                      {userData?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{userData?.displayName || 'Welcome back'}</p>
                      <p className="text-xs text-gray-400 capitalize">{userData?.role || 'user'}</p>
                    </div>
                  </div>
                  <Link
                    to={dashboardHref}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-800 font-semibold bg-gray-900 text-white"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    {primaryActionLabel}
                  </Link>
                  <Link to="/sessions" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors">
                    <Calendar className="h-4 w-4" /> Sessions
                  </Link>
                  {userData?.role === 'student' && (
                    <Link to="/find-mentor" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors">
                      <Zap className="h-4 w-4" /> Find Mentor
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-600 hover:bg-red-50 transition-colors mt-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block px-3 py-2.5 rounded-xl text-gray-700 font-medium hover:bg-gray-100 transition-colors">
                    Log in
                  </Link>
                  <Link to="/join" className="block px-3 py-2.5 rounded-xl bg-gray-900 text-white font-semibold text-center">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar