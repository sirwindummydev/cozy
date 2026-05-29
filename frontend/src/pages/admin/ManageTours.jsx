import { useState, useEffect } from 'react'
import { FaPlus, FaEdit, FaTrash, FaSearch, FaStar, FaToggleOn, FaToggleOff, FaTimes } from 'react-icons/fa'
import toast from 'react-hot-toast'
import AdminSidebar from '../../components/admin/AdminSidebar'
import { adminGetTours, adminCreateTour, adminUpdateTour, adminDeleteTour, getCategories } from '../../services/api'

const EMPTY_FORM = {
  title: '', category: '', summary: '', description: '', price: '',
  discount_price: '', duration: '', max_group_size: 15, difficulty: 'moderate',
  location: '', country: '', cover_image_url: '', is_featured: false, is_active: true,
  highlights: '', includes: '', excludes: '',
}

export default function ManageTours() {
  const [tours, setTours] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editTour, setEditTour] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  const fetchTours = () => {
    setLoading(true)
    adminGetTours({ search }).then(({ data }) => {
      setTours(data.results || data)
    }).finally(() => setLoading(false))
  }

  useEffect(() => {
    getCategories().then(({ data }) => setCategories(data.results || data))
    fetchTours()
  }, [])

  useEffect(() => {
    const t = setTimeout(fetchTours, 400)
    return () => clearTimeout(t)
  }, [search])

  const openCreate = () => {
    setEditTour(null)
    setForm(EMPTY_FORM)
    setModalOpen(true)
  }

  const openEdit = (tour) => {
    setEditTour(tour)
    setForm({
      title: tour.title, category: tour.category || '', summary: tour.summary || '',
      description: tour.description || '', price: tour.price, discount_price: tour.discount_price || '',
      duration: tour.duration, max_group_size: tour.max_group_size, difficulty: tour.difficulty,
      location: tour.location, country: tour.country, cover_image_url: tour.cover || '',
      is_featured: tour.is_featured, is_active: tour.is_active,
      highlights: '', includes: '', excludes: '',
    })
    setModalOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    const payload = new FormData()
    Object.entries(form).forEach(([k, v]) => {
      if (v !== '' && v !== null && v !== undefined) payload.append(k, v)
    })
    try {
      if (editTour) {
        await adminUpdateTour(editTour.id, payload)
        toast.success('Tour updated successfully!')
      } else {
        await adminCreateTour(payload)
        toast.success('Tour created successfully!')
      }
      setModalOpen(false)
      fetchTours()
    } catch (err) {
      const errors = err.response?.data
      toast.error(errors ? Object.values(errors).flat().join('. ') : 'Failed to save tour.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return
    try {
      await adminDeleteTour(id)
      toast.success('Tour deleted.')
      fetchTours()
    } catch {
      toast.error('Failed to delete tour.')
    }
  }

  const update = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-primary-900">Manage Tours</h1>
            <p className="text-gray-500 text-sm">{tours.length} total tours</p>
          </div>
          <button onClick={openCreate} className="btn-primary flex items-center gap-2 text-sm py-2">
            <FaPlus /> Add New Tour
          </button>
        </header>

        <main className="flex-1 p-8">
          {/* Search */}
          <div className="relative mb-6 max-w-sm">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tours..."
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm bg-white"
            />
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {['Tour', 'Category', 'Price', 'Duration', 'Rating', 'Status', 'Actions'].map((h) => (
                      <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    [1,2,3,4,5].map((i) => (
                      <tr key={i}><td colSpan={7} className="px-6 py-4"><div className="h-8 bg-gray-100 rounded animate-pulse" /></td></tr>
                    ))
                  ) : tours.map((tour) => (
                    <tr key={tour.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            <img src={tour.cover || `https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=100`} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="font-medium text-primary-900 text-sm">{tour.title}</p>
                            <p className="text-gray-400 text-xs">{tour.location}, {tour.country}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{tour.category_name || '—'}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-primary-900">
                        ${tour.price}
                        {tour.discount_price && <span className="text-xs text-green-600 ml-1">(${tour.discount_price})</span>}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{tour.duration}</td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-1 text-sm"><FaStar className="text-accent-500 text-xs" />{tour.rating}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className={`badge w-fit ${tour.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                            {tour.is_active ? 'Active' : 'Inactive'}
                          </span>
                          {tour.is_featured && <span className="badge bg-accent-100 text-accent-700 w-fit">Featured</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEdit(tour)} className="w-8 h-8 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center hover:bg-primary-200 transition-colors">
                            <FaEdit className="text-xs" />
                          </button>
                          <button onClick={() => handleDelete(tour.id, tour.title)} className="w-8 h-8 bg-red-100 text-red-600 rounded-lg flex items-center justify-center hover:bg-red-200 transition-colors">
                            <FaTrash className="text-xs" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!loading && tours.length === 0 && (
                <div className="text-center py-16 text-gray-400">
                  No tours found. <button onClick={openCreate} className="text-primary-600 font-medium">Add one?</button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="font-display text-xl font-bold text-primary-900">{editTour ? 'Edit Tour' : 'Create New Tour'}</h2>
              <button onClick={() => setModalOpen(false)} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200">
                <FaTimes className="text-gray-500 text-sm" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tour Title *</label>
                  <input value={form.title} onChange={update('title')} className="input-field" placeholder="Amazing Tour Name" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select value={form.category} onChange={update('category')} className="input-field bg-white" required>
                    <option value="">Select Category</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty *</label>
                  <select value={form.difficulty} onChange={update('difficulty')} className="input-field bg-white">
                    <option value="easy">Easy</option>
                    <option value="moderate">Moderate</option>
                    <option value="challenging">Challenging</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                  <input value={form.location} onChange={update('location')} className="input-field" placeholder="City" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                  <input value={form.country} onChange={update('country')} className="input-field" placeholder="Country" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (USD) *</label>
                  <input type="number" step="0.01" value={form.price} onChange={update('price')} className="input-field" placeholder="999.00" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount Price</label>
                  <input type="number" step="0.01" value={form.discount_price} onChange={update('discount_price')} className="input-field" placeholder="Optional" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration *</label>
                  <input value={form.duration} onChange={update('duration')} className="input-field" placeholder="7 Days / 6 Nights" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Group Size *</label>
                  <input type="number" value={form.max_group_size} onChange={update('max_group_size')} className="input-field" required />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image URL</label>
                  <input value={form.cover_image_url} onChange={update('cover_image_url')} className="input-field" placeholder="https://..." />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Summary *</label>
                  <textarea value={form.summary} onChange={update('summary')} className="input-field resize-none" rows={2} placeholder="Brief description..." required />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Description *</label>
                  <textarea value={form.description} onChange={update('description')} className="input-field resize-none" rows={4} placeholder="Detailed tour description..." required />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Highlights <span className="text-gray-400 font-normal">(one per line)</span></label>
                  <textarea value={form.highlights} onChange={update('highlights')} className="input-field resize-none" rows={3} placeholder="Visit Eiffel Tower&#10;River cruise&#10;Wine tasting" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">What's Included <span className="text-gray-400 font-normal">(one per line)</span></label>
                  <textarea value={form.includes} onChange={update('includes')} className="input-field resize-none" rows={3} placeholder="Hotel accommodation&#10;Daily breakfast" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Excluded <span className="text-gray-400 font-normal">(one per line)</span></label>
                  <textarea value={form.excludes} onChange={update('excludes')} className="input-field resize-none" rows={3} placeholder="International flights&#10;Visa fees" />
                </div>
                <div className="col-span-2 flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.is_active} onChange={update('is_active')} className="w-4 h-4 accent-primary-500" />
                    <span className="text-sm font-medium text-gray-700">Active (visible to users)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.is_featured} onChange={update('is_featured')} className="w-4 h-4 accent-accent-500" />
                    <span className="text-sm font-medium text-gray-700">Featured on Homepage</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button type="submit" disabled={saving} className="btn-secondary flex-1 disabled:opacity-60">
                  {saving ? 'Saving...' : editTour ? 'Update Tour' : 'Create Tour'}
                </button>
                <button type="button" onClick={() => setModalOpen(false)} className="btn-outline flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
