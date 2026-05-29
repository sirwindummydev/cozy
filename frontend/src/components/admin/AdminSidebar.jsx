import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaPlane, FaTachometerAlt, FaMap, FaUsers, FaCalendarCheck, FaSignOutAlt, FaHome } from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  { icon: FaTachometerAlt, label: 'Dashboard', to: '/admin' },
  { icon: FaMap, label: 'Manage Tours', to: '/admin/tours' },
  { icon: FaUsers, label: 'Manage Users', to: '/admin/users' },
  { icon: FaCalendarCheck, label: 'Manage Bookings', to: '/admin/bookings' },
]

export default function AdminSidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { logoutUser, user } = useAuth()

  const handleLogout = () => {
    logoutUser()
    navigate('/')
  }

  return (
    <aside className="w-64 min-h-screen bg-primary-900 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-accent-500 rounded-lg flex items-center justify-center">
            <FaPlane className="text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm">Cozy Travel</p>
            <p className="text-accent-400 text-xs">Admin Panel</p>
          </div>
        </div>
        <div className="mt-4 bg-white/5 rounded-lg p-3">
          <p className="text-white text-sm font-medium">{user?.first_name} {user?.last_name}</p>
          <p className="text-gray-400 text-xs">{user?.email}</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map(({ icon: Icon, label, to }) => {
            const active = location.pathname === to
            return (
              <li key={to}>
                <Link
                  to={to}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    active
                      ? 'bg-accent-500 text-white'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="text-sm flex-shrink-0" />
                  <span className="font-medium text-sm">{label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 space-y-1">
        <Link to="/" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/10 rounded-lg transition-colors text-sm">
          <FaHome className="text-sm" /> View Website
        </Link>
        <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-sm">
          <FaSignOutAlt className="text-sm" /> Sign Out
        </button>
      </div>
    </aside>
  )
}
