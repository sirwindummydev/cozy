import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaCalendarCheck, FaUser, FaMapMarkerAlt, FaClock, FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaTrophy } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { getMyBookings, updateProfile } from '../services/api'
import { useAuth } from '../context/AuthContext'

const statusConfig = {
  pending: { label: 'Pending', icon: FaHourglassHalf, color: 'text-yellow-600 bg-yellow-100' },
  confirmed: { label: 'Confirmed', icon: FaCheckCircle, color: 'text-green-600 bg-green-100' },
  cancelled: { label: 'Cancelled', icon: FaTimesCircle, color: 'text-red-600 bg-red-100' },
  completed: { label: 'Completed', icon: FaTrophy, color: 'text-blue-600 bg-blue-100' },
}

export default function UserDashboard() {
  const { user, refreshUser } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('bookings')
  const [profileForm, setProfileForm] = useState({ first_name: '', last_name: '', email: '', phone: '', address: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (user) {
      setProfileForm({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.profile?.phone || '',
        address: user.profile?.address || '',
      })
    }
    getMyBookings()
      .then(({ data }) => setBookings(data.results || data))
      .finally(() => setLoading(false))
  }, [user])

  const handleProfileSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await updateProfile(profileForm)
      await refreshUser()
      toast.success('Profile updated successfully!')
    } catch {
      toast.error('Failed to update profile.')
    } finally {
      setSaving(false)
    }
  }

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter((b) => b.status === 'confirmed').length,
    pending: bookings.filter((b) => b.status === 'pending').length,
    completed: bookings.filter((b) => b.status === 'completed').length,
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div className="bg-primary-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-accent-500 rounded-2xl flex items-center justify-center text-2xl font-bold">
              {(user?.first_name?.[0] || user?.username?.[0] || 'U').toUpperCase()}
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold">{user?.first_name} {user?.last_name}</h1>
              <p className="text-gray-300">{user?.email}</p>
              <p className="text-accent-400 text-sm mt-1">Member since {new Date(user?.date_joined).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Bookings', value: stats.total, color: 'bg-primary-500' },
            { label: 'Confirmed', value: stats.confirmed, color: 'bg-green-500' },
            { label: 'Pending', value: stats.pending, color: 'bg-yellow-500' },
            { label: 'Completed', value: stats.completed, color: 'bg-blue-500' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4">
              <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center text-white font-bold`}>{value}</div>
              <p className="text-gray-600 text-sm font-medium">{label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm mb-6 w-fit">
          {[['bookings', 'My Bookings', FaCalendarCheck], ['profile', 'Edit Profile', FaUser]].map(([key, label, Icon]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === key ? 'bg-primary-600 text-white shadow' : 'text-gray-500 hover:text-primary-700'}`}
            >
              <Icon className="text-sm" /> {label}
            </button>
          ))}
        </div>

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div>
            {loading ? (
              <div className="space-y-4">
                {[1,2,3].map((i) => <div key={i} className="bg-white rounded-xl h-24 animate-pulse" />)}
              </div>
            ) : bookings.length > 0 ? (
              <div className="space-y-4">
                {bookings.map((booking) => {
                  const status = statusConfig[booking.status] || statusConfig.pending
                  const StatusIcon = status.icon
                  return (
                    <div key={booking.id} className="bg-white rounded-xl shadow-sm p-5 flex flex-col md:flex-row md:items-center gap-4">
                      <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                        <img
                          src={booking.tour_cover || `https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=200`}
                          alt={booking.tour_title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-primary-900">{booking.tour_title}</h3>
                        <p className="text-gray-500 text-sm">Booking #{booking.id} • {booking.num_guests} guest{booking.num_guests > 1 ? 's' : ''}</p>
                        <p className="text-gray-400 text-xs mt-1">Booked on {new Date(booking.booked_at).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="font-bold text-primary-900">${booking.total_price}</p>
                          <p className="text-gray-400 text-xs">Total</p>
                        </div>
                        <span className={`badge ${status.color} flex items-center gap-1`}>
                          <StatusIcon className="text-xs" /> {status.label}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-xl shadow-sm">
                <FaCalendarCheck className="text-5xl text-gray-300 mx-auto mb-4" />
                <h3 className="font-semibold text-primary-900 mb-2">No bookings yet</h3>
                <p className="text-gray-500 mb-4">Start exploring and book your first adventure!</p>
                <Link to="/tours" className="btn-secondary">Browse Tours</Link>
              </div>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-xl shadow-sm p-6 max-w-xl">
            <h2 className="font-semibold text-xl text-primary-900 mb-6">Personal Information</h2>
            <form onSubmit={handleProfileSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input value={profileForm.first_name} onChange={(e) => setProfileForm((p) => ({ ...p, first_name: e.target.value }))} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input value={profileForm.last_name} onChange={(e) => setProfileForm((p) => ({ ...p, last_name: e.target.value }))} className="input-field" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value={profileForm.email} onChange={(e) => setProfileForm((p) => ({ ...p, email: e.target.value }))} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input type="tel" value={profileForm.phone} onChange={(e) => setProfileForm((p) => ({ ...p, phone: e.target.value }))} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea value={profileForm.address} onChange={(e) => setProfileForm((p) => ({ ...p, address: e.target.value }))} className="input-field resize-none" rows={2} />
              </div>
              <button type="submit" disabled={saving} className="btn-secondary disabled:opacity-60">
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
