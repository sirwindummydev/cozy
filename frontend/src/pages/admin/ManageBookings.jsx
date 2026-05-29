import { useState, useEffect } from 'react'
import { FaSearch, FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaTrophy } from 'react-icons/fa'
import toast from 'react-hot-toast'
import AdminSidebar from '../../components/admin/AdminSidebar'
import { adminGetBookings, updateBookingStatus } from '../../services/api'

const STATUS_OPTIONS = ['pending', 'confirmed', 'cancelled', 'completed']

const statusConfig = {
  pending: { color: 'text-yellow-600 bg-yellow-100', icon: FaHourglassHalf },
  confirmed: { color: 'text-green-600 bg-green-100', icon: FaCheckCircle },
  cancelled: { color: 'text-red-600 bg-red-100', icon: FaTimesCircle },
  completed: { color: 'text-blue-600 bg-blue-100', icon: FaTrophy },
}

export default function ManageBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const fetchBookings = () => {
    setLoading(true)
    adminGetBookings().then(({ data }) => setBookings(data.results || data)).finally(() => setLoading(false))
  }

  useEffect(() => { fetchBookings() }, [])

  const handleStatusChange = async (booking, newStatus) => {
    try {
      await updateBookingStatus(booking.id, newStatus)
      toast.success(`Booking #${booking.id} marked as ${newStatus}.`)
      fetchBookings()
    } catch {
      toast.error('Failed to update booking status.')
    }
  }

  const filtered = bookings.filter((b) => {
    const matchSearch = !search ||
      b.user_name?.toLowerCase().includes(search.toLowerCase()) ||
      b.tour_title?.toLowerCase().includes(search.toLowerCase()) ||
      String(b.id).includes(search)
    const matchStatus = !statusFilter || b.status === statusFilter
    return matchSearch && matchStatus
  })

  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === 'pending').length,
    confirmed: bookings.filter((b) => b.status === 'confirmed').length,
    revenue: bookings.filter((b) => ['confirmed', 'completed'].includes(b.status)).reduce((sum, b) => sum + parseFloat(b.total_price || 0), 0),
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <h1 className="font-display text-2xl font-bold text-primary-900">Manage Bookings</h1>
          <p className="text-gray-500 text-sm">{bookings.length} total bookings</p>
        </header>

        <main className="flex-1 p-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total', value: stats.total, color: 'bg-primary-500' },
              { label: 'Pending', value: stats.pending, color: 'bg-yellow-500' },
              { label: 'Confirmed', value: stats.confirmed, color: 'bg-green-500' },
              { label: 'Revenue', value: `$${stats.revenue.toFixed(0)}`, color: 'bg-blue-500' },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-3">
                <div className={`w-8 h-8 ${color} rounded-lg flex items-center justify-center text-white text-xs font-bold`}>{String(value).length > 4 ? '$$' : value}</div>
                <div>
                  <p className="font-semibold text-primary-900 text-sm">{value}</p>
                  <p className="text-gray-500 text-xs">{label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="relative flex-1 min-w-48">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search bookings..."
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm bg-white"
              />
            </div>
            <select
              value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-white"
            >
              <option value="">All Statuses</option>
              {STATUS_OPTIONS.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
            </select>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {['#', 'Customer', 'Tour', 'Guests', 'Total', 'Date', 'Status', 'Action'].map((h) => (
                      <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    [1,2,3,4,5].map((i) => (
                      <tr key={i}><td colSpan={8} className="px-4 py-4"><div className="h-8 bg-gray-100 rounded animate-pulse" /></td></tr>
                    ))
                  ) : filtered.map((booking) => {
                    const st = statusConfig[booking.status] || statusConfig.pending
                    const StIcon = st.icon
                    return (
                      <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-4 text-sm font-medium text-primary-600">#{booking.id}</td>
                        <td className="px-4 py-4">
                          <p className="font-medium text-primary-900 text-sm">{booking.user_name}</p>
                          <p className="text-gray-400 text-xs">{booking.email}</p>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600 max-w-32 truncate">{booking.tour_title}</td>
                        <td className="px-4 py-4 text-sm text-gray-600 text-center">{booking.num_guests}</td>
                        <td className="px-4 py-4 text-sm font-semibold text-primary-900">${booking.total_price}</td>
                        <td className="px-4 py-4 text-xs text-gray-400">{new Date(booking.booked_at).toLocaleDateString()}</td>
                        <td className="px-4 py-4">
                          <span className={`badge flex items-center gap-1 w-fit ${st.color}`}>
                            <StIcon className="text-xs" /> {booking.status}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <select
                            value={booking.status}
                            onChange={(e) => handleStatusChange(booking, e.target.value)}
                            className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary-400 bg-white capitalize"
                          >
                            {STATUS_OPTIONS.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
                          </select>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              {!loading && filtered.length === 0 && (
                <div className="text-center py-16 text-gray-400">No bookings found.</div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
