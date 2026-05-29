import { useState, useEffect } from 'react'
import { FaSearch, FaUserCheck, FaUserTimes, FaUser } from 'react-icons/fa'
import toast from 'react-hot-toast'
import AdminSidebar from '../../components/admin/AdminSidebar'
import { adminGetUsers, adminToggleUser } from '../../services/api'

export default function ManageUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const fetchUsers = () => {
    setLoading(true)
    adminGetUsers().then(({ data }) => setUsers(data.results || data)).finally(() => setLoading(false))
  }

  useEffect(() => { fetchUsers() }, [])

  const handleToggle = async (user) => {
    try {
      await adminToggleUser(user.id)
      toast.success(`${user.username} ${user.is_active ? 'deactivated' : 'activated'}.`)
      fetchUsers()
    } catch {
      toast.error('Failed to update user.')
    }
  }

  const filtered = users.filter((u) =>
    !search || u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    `${u.first_name} ${u.last_name}`.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <h1 className="font-display text-2xl font-bold text-primary-900">Manage Users</h1>
          <p className="text-gray-500 text-sm">{users.length} total registered users</p>
        </header>

        <main className="flex-1 p-8">
          {/* Search */}
          <div className="relative mb-6 max-w-sm">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users..."
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm bg-white"
            />
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {['User', 'Email', 'Phone', 'Role', 'Joined', 'Status', 'Actions'].map((h) => (
                      <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    [1,2,3,4,5].map((i) => (
                      <tr key={i}><td colSpan={7} className="px-6 py-4"><div className="h-8 bg-gray-100 rounded animate-pulse" /></td></tr>
                    ))
                  ) : filtered.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-sm">
                            {(user.first_name?.[0] || user.username?.[0] || 'U').toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-primary-900 text-sm">{user.first_name} {user.last_name}</p>
                            <p className="text-gray-400 text-xs">@{user.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{user.profile?.phone || '—'}</td>
                      <td className="px-6 py-4">
                        <span className={`badge ${user.is_staff ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                          {user.is_staff ? 'Admin' : 'Customer'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {new Date(user.date_joined).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`badge ${user.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {user.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {!user.is_staff && (
                          <button
                            onClick={() => handleToggle(user)}
                            className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                              user.is_active
                                ? 'bg-red-100 text-red-600 hover:bg-red-200'
                                : 'bg-green-100 text-green-600 hover:bg-green-200'
                            }`}
                          >
                            {user.is_active ? <><FaUserTimes /> Deactivate</> : <><FaUserCheck /> Activate</>}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!loading && filtered.length === 0 && (
                <div className="text-center py-16 text-gray-400">No users found.</div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
