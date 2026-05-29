import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaPlane, FaBars, FaTimes, FaUser, FaChevronDown, FaCog, FaSignOutAlt, FaTachometerAlt } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, logoutUser, isAdmin } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    setDropdownOpen(false)
  }, [location])

  const handleLogout = () => {
    logoutUser()
    navigate('/')
  }

  const navClass = isHome && !scrolled
    ? 'fixed top-0 left-0 right-0 z-50 bg-transparent'
    : 'fixed top-0 left-0 right-0 z-50 bg-primary-900 shadow-lg'

  const linkClass = 'font-medium transition-colors duration-200 hover:text-accent-400'

  return (
    <nav className={`${navClass} transition-all duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-accent-500 rounded-xl flex items-center justify-center shadow-lg group-hover:bg-accent-400 transition-colors">
              <FaPlane className="text-white text-lg" />
            </div>
            <div>
              <span className="text-white font-display font-bold text-xl leading-none block">Cozy Travel</span>
              <span className="text-accent-400 text-xs font-medium tracking-wider">& TOURS</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className={`${linkClass} text-white`}>Home</Link>
            <Link to="/tours" className={`${linkClass} text-white`}>Tours</Link>
            <a href="/#destinations" className={`${linkClass} text-white`}>Destinations</a>
            <a href="/#about" className={`${linkClass} text-white`}>About</a>
            <a href="/#contact" className={`${linkClass} text-white`}>Contact</a>
          </div>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all duration-200"
                >
                  <div className="w-7 h-7 bg-accent-500 rounded-full flex items-center justify-center">
                    <FaUser className="text-xs" />
                  </div>
                  <span className="font-medium">{user.first_name || user.username}</span>
                  <FaChevronDown className={`text-xs transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl py-2 z-50 border border-gray-100">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-semibold text-primary-900">{user.first_name} {user.last_name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    {isAdmin && (
                      <Link to="/admin" className="flex items-center gap-3 px-4 py-2 text-primary-700 hover:bg-primary-50 transition-colors">
                        <FaTachometerAlt className="text-sm" />
                        Admin Panel
                      </Link>
                    )}
                    <Link to="/dashboard" className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors">
                      <FaCog className="text-sm" />
                      My Dashboard
                    </Link>
                    <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-2 text-red-600 hover:bg-red-50 transition-colors">
                      <FaSignOutAlt className="text-sm" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="text-white font-medium hover:text-accent-400 transition-colors">Sign In</Link>
                <Link to="/register" className="btn-primary text-sm py-2">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-white text-2xl p-2">
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-primary-900 border-t border-white/10 px-4 py-4">
          <div className="flex flex-col gap-4">
            <Link to="/" className="text-white font-medium py-2">Home</Link>
            <Link to="/tours" className="text-white font-medium py-2">Tours</Link>
            <a href="/#destinations" className="text-white font-medium py-2">Destinations</a>
            <a href="/#about" className="text-white font-medium py-2">About</a>
            {user ? (
              <>
                <Link to="/dashboard" className="text-accent-400 font-medium py-2">My Dashboard</Link>
                {isAdmin && <Link to="/admin" className="text-accent-400 font-medium py-2">Admin Panel</Link>}
                <button onClick={handleLogout} className="text-left text-red-400 font-medium py-2">Sign Out</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-white font-medium py-2">Sign In</Link>
                <Link to="/register" className="btn-primary text-center">Get Started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
