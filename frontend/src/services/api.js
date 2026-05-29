import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
})

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

API.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      const refresh = localStorage.getItem('refresh_token')
      if (refresh) {
        try {
          const { data } = await axios.post('/api/accounts/token/refresh/', { refresh })
          localStorage.setItem('access_token', data.access)
          original.headers.Authorization = `Bearer ${data.access}`
          return API(original)
        } catch {
          localStorage.clear()
          window.location.href = '/login'
        }
      }
    }
    return Promise.reject(error)
  }
)

// Auth
export const register = (data) => API.post('/accounts/register/', data)
export const login = (data) => API.post('/accounts/login/', data)
export const getProfile = () => API.get('/accounts/profile/')
export const updateProfile = (data) => API.patch('/accounts/profile/', data)

// Tours
export const getTours = (params) => API.get('/tours/', { params })
export const getFeaturedTours = () => API.get('/tours/featured/')
export const getTourBySlug = (slug) => API.get(`/tours/${slug}/`)
export const getCategories = () => API.get('/tours/categories/')

// Admin Tours
export const adminGetTours = (params) => API.get('/tours/admin/all/', { params })
export const adminCreateTour = (data) => API.post('/tours/admin/all/', data, { headers: { 'Content-Type': 'multipart/form-data' } })
export const adminUpdateTour = (id, data) => API.patch(`/tours/admin/${id}/`, data, { headers: { 'Content-Type': 'multipart/form-data' } })
export const adminDeleteTour = (id) => API.delete(`/tours/admin/${id}/`)
export const adminAddTourImage = (tourId, data) => API.post(`/tours/admin/${tourId}/images/`, data, { headers: { 'Content-Type': 'multipart/form-data' } })
export const adminDeleteTourImage = (imageId) => API.delete(`/tours/admin/images/${imageId}/`)
export const getTourSchedules = (tourId) => API.get(`/tours/${tourId}/schedules/`)
export const adminCreateSchedule = (tourId, data) => API.post(`/tours/${tourId}/schedules/`, data)

// Bookings
export const createBooking = (data) => API.post('/bookings/', data)
export const getMyBookings = () => API.get('/bookings/')
export const adminGetBookings = () => API.get('/bookings/')
export const updateBookingStatus = (id, status) => API.patch(`/bookings/${id}/status/`, { status })
export const getTourReviews = (tourId) => API.get(`/bookings/tours/${tourId}/reviews/`)
export const createReview = (tourId, data) => API.post(`/bookings/tours/${tourId}/reviews/`, data)

// Admin Users
export const adminGetUsers = () => API.get('/accounts/users/')
export const adminToggleUser = (id) => API.patch(`/accounts/users/${id}/toggle-active/`)
export const adminGetStats = () => API.get('/accounts/stats/')

export default API
