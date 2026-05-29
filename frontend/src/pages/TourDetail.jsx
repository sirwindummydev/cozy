import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { FaStar, FaClock, FaUsers, FaMapMarkerAlt, FaCheck, FaTimes, FaChevronLeft, FaChevronRight, FaCalendar, FaHiking } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { getTourBySlug, getTourSchedules, createBooking, getTourReviews } from '../services/api'
import { useAuth } from '../context/AuthContext'

const difficultyColor = { easy: 'text-green-600 bg-green-100', moderate: 'text-yellow-600 bg-yellow-100', challenging: 'text-red-600 bg-red-100' }

export default function TourDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [tour, setTour] = useState(null)
  const [schedules, setSchedules] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeImg, setActiveImg] = useState(0)
  const [bookingForm, setBookingForm] = useState({ schedule: '', num_guests: 1, first_name: '', last_name: '', email: '', phone: '', special_requests: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setLoading(true)
    getTourBySlug(slug)
      .then(({ data }) => {
        setTour(data)
        if (user) {
          setBookingForm((prev) => ({
            ...prev,
            first_name: user.first_name || '',
            last_name: user.last_name || '',
            email: user.email || '',
            phone: user.profile?.phone || '',
          }))
        }
        return Promise.all([
          getTourSchedules(data.id).catch(() => ({ data: [] })),
          getTourReviews(data.id).catch(() => ({ data: [] })),
        ])
      })
      .then(([schedRes, revRes]) => {
        setSchedules(schedRes.data.results || schedRes.data || [])
        setReviews(revRes.data.results || revRes.data || [])
      })
      .catch(() => navigate('/tours'))
      .finally(() => setLoading(false))
  }, [slug])

  const allImages = tour ? [
    { image_url: tour.cover, caption: tour.title },
    ...(tour.images || []),
  ].filter((img) => img.image_url || img.image) : []

  const handleBooking = async (e) => {
    e.preventDefault()
    if (!user) { navigate('/login'); return }
    if (!bookingForm.schedule) { toast.error('Please select a tour date'); return }
    setSubmitting(true)
    try {
      await createBooking({ ...bookingForm, tour: tour.id })
      toast.success('Booking submitted! We\'ll confirm shortly.')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Booking failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading tour details...</p>
        </div>
      </div>
    )
  }

  if (!tour) return null

  const selectedSchedule = schedules.find((s) => s.id === parseInt(bookingForm.schedule))
  const totalPrice = selectedSchedule
    ? (selectedSchedule.effective_price * bookingForm.num_guests).toFixed(2)
    : (tour.price * bookingForm.num_guests).toFixed(2)

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Image Gallery */}
      <div className="relative bg-primary-900 h-96 md:h-[500px] overflow-hidden">
        {allImages.length > 0 ? (
          <>
            <img
              src={allImages[activeImg]?.image_url || allImages[activeImg]?.image}
              alt={allImages[activeImg]?.caption}
              className="w-full h-full object-cover opacity-80"
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200' }}
            />
            {allImages.length > 1 && (
              <>
                <button onClick={() => setActiveImg((i) => (i === 0 ? allImages.length - 1 : i - 1))}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors">
                  <FaChevronLeft />
                </button>
                <button onClick={() => setActiveImg((i) => (i === allImages.length - 1 ? 0 : i + 1))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors">
                  <FaChevronRight />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {allImages.map((_, i) => (
                    <button key={i} onClick={() => setActiveImg(i)}
                      className={`w-2 h-2 rounded-full transition-all ${i === activeImg ? 'bg-white w-6' : 'bg-white/50'}`} />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full bg-primary-800 flex items-center justify-center text-white text-6xl">🗺️</div>
        )}

        {/* Thumbnail Strip */}
        {allImages.length > 1 && (
          <div className="absolute bottom-4 right-4 flex gap-2">
            {allImages.slice(0, 4).map((img, i) => (
              <button key={i} onClick={() => setActiveImg(i)}
                className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${i === activeImg ? 'border-accent-400 scale-110' : 'border-white/50'}`}>
                <img src={img.image_url || img.image} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=200' }} />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className={`badge ${difficultyColor[tour.difficulty] || 'bg-gray-100 text-gray-700'} capitalize`}>
                  <FaHiking className="mr-1" /> {tour.difficulty}
                </span>
                {tour.is_featured && <span className="badge bg-accent-100 text-accent-700">Featured</span>}
                <span className="text-gray-500 text-sm flex items-center gap-1">
                  <FaMapMarkerAlt className="text-accent-500" /> {tour.location}, {tour.country}
                </span>
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-primary-900 mb-3">{tour.title}</h1>
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                <span className="flex items-center gap-1"><FaStar className="text-accent-500" /> <strong>{tour.rating}</strong> ({tour.rating_quantity} reviews)</span>
                <span className="flex items-center gap-1"><FaClock className="text-primary-400" /> {tour.duration}</span>
                <span className="flex items-center gap-1"><FaUsers className="text-primary-400" /> Max {tour.max_group_size} people</span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="font-semibold text-xl text-primary-900 mb-4">About This Tour</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{tour.description}</p>
            </div>

            {/* Highlights */}
            {tour.highlights_list?.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="font-semibold text-xl text-primary-900 mb-4">Tour Highlights</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {tour.highlights_list.map((h, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-600">
                      <div className="w-5 h-5 bg-accent-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <FaCheck className="text-accent-600 text-xs" />
                      </div>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Includes/Excludes */}
            {(tour.includes_list?.length > 0 || tour.excludes_list?.length > 0) && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="font-semibold text-xl text-primary-900 mb-4">What's Included</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {tour.includes_list?.length > 0 && (
                    <div>
                      <h3 className="font-medium text-green-700 mb-3">Included</h3>
                      <ul className="space-y-2">
                        {tour.includes_list.map((item, i) => (
                          <li key={i} className="flex items-center gap-2 text-gray-600 text-sm">
                            <FaCheck className="text-green-500 flex-shrink-0" /> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {tour.excludes_list?.length > 0 && (
                    <div>
                      <h3 className="font-medium text-red-700 mb-3">Not Included</h3>
                      <ul className="space-y-2">
                        {tour.excludes_list.map((item, i) => (
                          <li key={i} className="flex items-center gap-2 text-gray-600 text-sm">
                            <FaTimes className="text-red-400 flex-shrink-0" /> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Reviews */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="font-semibold text-xl text-primary-900 mb-4">Traveler Reviews ({reviews.length})</h2>
              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium text-primary-900">{review.user_name}</p>
                          <p className="text-gray-400 text-xs">{new Date(review.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="flex gap-0.5">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <FaStar key={i} className="text-accent-500 text-sm" />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No reviews yet. Be the first to review this tour!</p>
              )}
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <div className="text-center mb-6 pb-6 border-b border-gray-100">
                {tour.discount_price ? (
                  <>
                    <p className="text-gray-400 line-through text-sm">${tour.price} per person</p>
                    <p className="text-3xl font-bold text-primary-900">${tour.discount_price}<span className="text-sm font-normal text-gray-500"> / person</span></p>
                  </>
                ) : (
                  <p className="text-3xl font-bold text-primary-900">${tour.price}<span className="text-sm font-normal text-gray-500"> / person</span></p>
                )}
              </div>

              <form onSubmit={handleBooking} className="space-y-4">
                {/* Schedule */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
                  <div className="relative">
                    <FaCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                    <select
                      value={bookingForm.schedule}
                      onChange={(e) => setBookingForm((prev) => ({ ...prev, schedule: e.target.value }))}
                      className="input-field pl-9 text-sm"
                      required
                    >
                      <option value="">Choose a date...</option>
                      {schedules.filter((s) => s.remaining_slots > 0 && s.is_active).map((s) => (
                        <option key={s.id} value={s.id}>
                          {new Date(s.start_date).toLocaleDateString()} — {new Date(s.end_date).toLocaleDateString()} ({s.remaining_slots} spots left)
                        </option>
                      ))}
                    </select>
                  </div>
                  {schedules.length === 0 && <p className="text-xs text-red-500 mt-1">No available dates. Contact us.</p>}
                </div>

                {/* Guests */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Number of Guests</label>
                  <input
                    type="number" min="1" max={tour.max_group_size}
                    value={bookingForm.num_guests}
                    onChange={(e) => setBookingForm((prev) => ({ ...prev, num_guests: parseInt(e.target.value) || 1 }))}
                    className="input-field text-sm"
                  />
                </div>

                {!user && (
                  <div className="bg-primary-50 rounded-lg p-3 text-sm text-primary-700">
                    <Link to="/login" className="font-semibold underline">Sign in</Link> to complete your booking
                  </div>
                )}

                {user && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">First Name</label>
                        <input value={bookingForm.first_name} onChange={(e) => setBookingForm((p) => ({ ...p, first_name: e.target.value }))} className="input-field text-sm" required />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Last Name</label>
                        <input value={bookingForm.last_name} onChange={(e) => setBookingForm((p) => ({ ...p, last_name: e.target.value }))} className="input-field text-sm" required />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                      <input type="email" value={bookingForm.email} onChange={(e) => setBookingForm((p) => ({ ...p, email: e.target.value }))} className="input-field text-sm" required />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Phone</label>
                      <input type="tel" value={bookingForm.phone} onChange={(e) => setBookingForm((p) => ({ ...p, phone: e.target.value }))} className="input-field text-sm" required />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Special Requests</label>
                      <textarea value={bookingForm.special_requests} onChange={(e) => setBookingForm((p) => ({ ...p, special_requests: e.target.value }))} className="input-field text-sm resize-none" rows={2} />
                    </div>
                  </>
                )}

                {/* Price Summary */}
                <div className="bg-gray-50 rounded-xl p-4 text-sm">
                  <div className="flex justify-between text-gray-600 mb-1">
                    <span>${selectedSchedule ? selectedSchedule.effective_price : tour.price} × {bookingForm.num_guests} guests</span>
                    <span>${totalPrice}</span>
                  </div>
                  <div className="flex justify-between font-bold text-primary-900 border-t border-gray-200 pt-2 mt-2">
                    <span>Total</span>
                    <span>${totalPrice}</span>
                  </div>
                </div>

                <button type="submit" disabled={submitting || !user} className="btn-primary w-full text-center disabled:opacity-60 disabled:cursor-not-allowed">
                  {submitting ? 'Processing...' : user ? 'Book This Tour' : 'Sign In to Book'}
                </button>
              </form>

              <p className="text-xs text-gray-400 text-center mt-3">Free cancellation up to 24 hours before departure</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
