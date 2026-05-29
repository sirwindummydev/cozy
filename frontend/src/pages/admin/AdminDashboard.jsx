import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaUsers, FaMap, FaCalendarCheck, FaDollarSign, FaArrowRight, FaCheckCircle, FaHourglassHalf, FaTimes, FaTrophy } from 'react-icons/fa'
import AdminSidebar from '../../components/admin/AdminSidebar'
import { adminGetStats } from '../../services/api'

const statusConfig = {
  pending: { color: 'text-yellow-600 bg-yellow-100', icon: FaHourglassHalf },
  confirmed: { color: 'text-green-600 bg-green-100', icon: FaCheckCircle },
  cancelled: { color: 'text-red-600 bg-red-100', icon: FaTimes },
  completed: { color: 'text-blue-600 bg-blue-100', icon: FaTrophy },
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminGetStats()
      .then(({ data }) => setStats(data))
      .finally(() => setLoading(false))
  }, [])

  const cards = stats ? [
    { icon: FaUsers, label: 'Total Users', value: stats.total_users, color: 'bg-blue-500', link: '/admin/users' },
    { icon: FaMap, label: 'Active Tours', value: stats.total_tours, color: 'bg-primary-500', link: '/admin/tours' },
    { icon: FaCalendarCheck, label: 'Total Bookings', value: stats.total_bookings, color: 'bg-purple-500', link: '/admin/bookings' },
    { icon: FaDollarSign, label: 'Total Revenue', value: `$${stats.total_revenue.toLocaleString()}`, color: 'bg-green-500', link: '/admin/bookings' },
  ] : []

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-primary-900">Dashboard</h1>
            <p className="text-gray-500 text-sm">Welcome back! Here's what's happening.</p>
          </div>
          <Link to="/admin/tours" className="btn-primary text-sm py-2 flex items-center gap-2">
            Add New Tour <FaArrowRight />
          </Link>
        </header>

        <main className="flex-1 p-8">
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1,2,3,4].map((i) => <div key={i} className="bg-white rounded-xl h-28 animate-pulse" />)}
            </div>
          ) : (
            <>
              {/* Stat Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {cards.map(({ icon: Icon, label, value, color, link }) => (
                  <Link key={label} to={link} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow group">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                        <Icon className="text-xl" />
                      </div>
                      <FaArrowRight className="text-gray-300 group-hover:text-primary-500 transition-colors" />
                    </div>
                    <p className="text-2xl font-bold text-primary-900">{value}</p>
                    <p className="text-gray-500 text-sm mt-1">{label}</p>
                  </Link>
                ))}
              </div>

              {/* Recent Bookings */}
              <div className="bg-white rounded-xl shadow-sm">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                  <h2 className="font-semibold text-lg text-primary-900">Recent Bookings</h2>
                  <Link to="/admin/bookings" className="text-primary-600 text-sm hover:text-primary-800 font-medium flex items-center gap-1">
                    View All <FaArrowRight className="text-xs" />
                  </Link>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        {['#', 'Customer', 'Tour', 'Guests', 'Total', 'Status', 'Date'].map((h) => (
                          <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {stats?.recent_bookings?.map((booking) => {
                        const st = statusConfig[booking.status] || statusConfig.pending
                        const StIcon = st.icon
                        return (
                          <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 text-sm font-medium text-primary-600">#{booking.id}</td>
                            <td className="px-6 py-4 text-sm text-gray-900">{booking.user_name}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{booking.tour_title}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{booking.num_guests}</td>
                            <td className="px-6 py-4 text-sm font-semibold text-primary-900">${booking.total_price}</td>
                            <td className="px-6 py-4">
                              <span className={`badge ${st.color} flex items-center gap-1 w-fit`}>
                                <StIcon className="text-xs" /> {booking.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-400">{new Date(booking.booked_at).toLocaleDateString()}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                  {(!stats?.recent_bookings?.length) && (
                    <div className="text-center py-12 text-gray-400">No bookings yet</div>
                  )}
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
