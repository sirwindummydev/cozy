import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FaSearch, FaFilter, FaTimes, FaChevronDown } from 'react-icons/fa'
import TourCard from '../components/TourCard'
import { getTours, getCategories } from '../services/api'

const DIFFICULTIES = ['easy', 'moderate', 'challenging']
const DURATIONS = ['1-3 days', '4-7 days', '8-14 days', '15+ days']

export default function Tours() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [tours, setTours] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [filterOpen, setFilterOpen] = useState(false)

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: '',
    difficulty: '',
    ordering: '-created_at',
    is_featured: '',
  })

  useEffect(() => {
    getCategories().then(({ data }) => setCategories(data.results || data)).catch(() => {})
  }, [])

  const fetchTours = useCallback(() => {
    setLoading(true)
    const params = { page, ...filters }
    Object.keys(params).forEach((k) => { if (!params[k]) delete params[k] })
    getTours(params)
      .then(({ data }) => {
        setTours(data.results || data)
        setTotal(data.count || (data.results || data).length)
      })
      .finally(() => setLoading(false))
  }, [page, filters])

  useEffect(() => { fetchTours() }, [fetchTours])

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPage(1)
  }

  const clearFilters = () => {
    setFilters({ search: '', category: '', difficulty: '', ordering: '-created_at', is_featured: '' })
    setPage(1)
  }

  const hasFilters = filters.search || filters.category || filters.difficulty || filters.is_featured

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Banner */}
      <div className="relative h-64 bg-primary-900 flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: "url(https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1200)" }}
        />
        <div className="relative text-center text-white">
          <h1 className="font-display text-4xl md:text-5xl font-bold">All Tours</h1>
          <p className="text-gray-300 mt-2">Discover your perfect adventure</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl shadow-md p-4 mb-8 flex flex-wrap gap-3 items-center">
          <div className="flex-1 min-w-64 relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="Search destinations, tours..."
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm"
            />
          </div>

          {/* Category */}
          <select
            value={filters.category}
            onChange={(e) => updateFilter('category', e.target.value)}
            className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-white"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          {/* Difficulty */}
          <select
            value={filters.difficulty}
            onChange={(e) => updateFilter('difficulty', e.target.value)}
            className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-white capitalize"
          >
            <option value="">Any Difficulty</option>
            {DIFFICULTIES.map((d) => (
              <option key={d} value={d} className="capitalize">{d}</option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={filters.ordering}
            onChange={(e) => updateFilter('ordering', e.target.value)}
            className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-white"
          >
            <option value="-created_at">Newest First</option>
            <option value="price">Price: Low to High</option>
            <option value="-price">Price: High to Low</option>
            <option value="-rating">Top Rated</option>
          </select>

          <label className="flex items-center gap-2 px-3 py-2.5 border border-gray-200 rounded-lg text-sm cursor-pointer hover:bg-gray-50">
            <input
              type="checkbox"
              checked={filters.is_featured === 'true'}
              onChange={(e) => updateFilter('is_featured', e.target.checked ? 'true' : '')}
              className="accent-accent-500"
            />
            Featured Only
          </label>

          {hasFilters && (
            <button onClick={clearFilters} className="flex items-center gap-1 text-red-500 hover:text-red-700 text-sm font-medium px-3 py-2.5">
              <FaTimes /> Clear
            </button>
          )}
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600 text-sm">
            {loading ? 'Loading...' : `Showing ${tours.length} of ${total} tours`}
          </p>
        </div>

        {/* Tour Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1,2,3,4,5,6].map((i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-56 bg-gray-200" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : tours.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tours.map((tour) => <TourCard key={tour.id} tour={tour} />)}
            </div>
            {/* Pagination */}
            {total > 9 && (
              <div className="flex justify-center gap-2 mt-12">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-sm disabled:opacity-40 hover:bg-primary-50 transition-colors"
                >
                  Previous
                </button>
                {Array.from({ length: Math.ceil(total / 9) }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-10 h-10 rounded-lg text-sm transition-colors ${p === page ? 'bg-primary-600 text-white' : 'border border-gray-200 hover:bg-primary-50'}`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  disabled={page === Math.ceil(total / 9)}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-sm disabled:opacity-40 hover:bg-primary-50 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400 text-6xl mb-4">🗺️</p>
            <h3 className="text-xl font-semibold text-primary-900 mb-2">No tours found</h3>
            <p className="text-gray-500">Try adjusting your filters or search terms.</p>
            <button onClick={clearFilters} className="btn-secondary mt-4">Clear Filters</button>
          </div>
        )}
      </div>
    </div>
  )
}
