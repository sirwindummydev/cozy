import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { FaPlane, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { login, getProfile } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const { loginUser } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await login(form)
      localStorage.setItem('access_token', data.access)
      localStorage.setItem('refresh_token', data.refresh)
      const { data: user } = await getProfile()
      loginUser(user, { access: data.access, refresh: data.refresh })
      toast.success(`Welcome back, ${user.first_name || user.username}!`)
      navigate(user.is_staff ? '/admin' : from, { replace: true })
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex pt-20">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800"
          alt="Travel"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary-900/60 flex flex-col justify-center items-center text-white p-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-accent-500 rounded-xl flex items-center justify-center">
              <FaPlane className="text-white text-xl" />
            </div>
            <div>
              <p className="font-display font-bold text-2xl">Cozy Travel</p>
              <p className="text-accent-400 text-sm">& TOURS</p>
            </div>
          </div>
          <h2 className="font-display text-4xl font-bold text-center mb-4">Your Adventure Awaits</h2>
          <p className="text-gray-300 text-center text-lg max-w-sm">Sign in to access your bookings, manage trips, and discover new destinations.</p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold text-primary-900 mb-2">Welcome Back</h1>
            <p className="text-gray-500">Sign in to continue your journey</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md p-8 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Username or Email</label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={form.username}
                  onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
                  className="input-field pl-9"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                  className="input-field pl-9 pr-10"
                  required
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                <input type="checkbox" className="accent-primary-500" /> Remember me
              </label>
              <a href="#" className="text-primary-600 hover:text-primary-800 font-medium">Forgot password?</a>
            </div>

            <button type="submit" disabled={loading} className="btn-secondary w-full py-3.5 disabled:opacity-60">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>

            <div className="text-center pt-2">
              <p className="text-gray-500 text-sm">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary-600 hover:text-primary-800 font-semibold">Create Account</Link>
              </p>
            </div>
          </form>

          <p className="text-center text-xs text-gray-400 mt-6">
            Demo admin: <strong>admin</strong> / <strong>admin123</strong>
          </p>
        </div>
      </div>
    </div>
  )
}
