import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaPlane, FaUser, FaEnvelope, FaLock, FaPhone, FaEye, FaEyeSlash } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { register } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [form, setForm] = useState({
    first_name: '', last_name: '', username: '', email: '',
    phone: '', password: '', password2: '',
  })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const { loginUser } = useAuth()
  const navigate = useNavigate()

  const update = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.password2) { toast.error('Passwords do not match'); return }
    if (form.password.length < 8) { toast.error('Password must be at least 8 characters'); return }
    setLoading(true)
    try {
      const { data } = await register(form)
      loginUser(data.user, { access: data.access, refresh: data.refresh })
      toast.success('Account created! Welcome to Cozy Travel!')
      navigate('/')
    } catch (err) {
      const errors = err.response?.data
      if (errors) {
        const msg = Object.values(errors).flat().join('. ')
        toast.error(msg)
      } else {
        toast.error('Registration failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const Field = ({ icon: Icon, label, name, type = 'text', placeholder, required = true }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
        <input
          type={type}
          placeholder={placeholder}
          value={form[name]}
          onChange={update(name)}
          className="input-field pl-9"
          required={required}
        />
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex pt-20">
      {/* Left Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800" alt="Travel" className="w-full h-full object-cover" />
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
          <h2 className="font-display text-4xl font-bold text-center mb-4">Start Your Journey</h2>
          <p className="text-gray-300 text-center text-lg max-w-sm">Join thousands of happy travelers and explore the world with our expert guides.</p>
          <div className="mt-8 grid grid-cols-3 gap-4 w-full max-w-sm">
            {[['15K+', 'Travelers'], ['80+', 'Destinations'], ['4.9★', 'Rating']].map(([val, lbl]) => (
              <div key={lbl} className="text-center bg-white/10 rounded-xl p-3">
                <p className="font-bold text-xl">{val}</p>
                <p className="text-gray-300 text-xs">{lbl}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50 overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold text-primary-900 mb-2">Create Account</h1>
            <p className="text-gray-500">Join Cozy Travel and explore the world</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md p-8 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field icon={FaUser} label="First Name" name="first_name" placeholder="John" />
              <Field icon={FaUser} label="Last Name" name="last_name" placeholder="Doe" />
            </div>
            <Field icon={FaUser} label="Username" name="username" placeholder="johndoe123" />
            <Field icon={FaEnvelope} label="Email Address" name="email" type="email" placeholder="john@example.com" />
            <Field icon={FaPhone} label="Phone Number" name="phone" type="tel" placeholder="+1 (555) 000-0000" required={false} />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Min. 8 characters"
                  value={form.password}
                  onChange={update('password')}
                  className="input-field pl-9 pr-10"
                  required
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPass ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Re-enter password"
                  value={form.password2}
                  onChange={update('password2')}
                  className="input-field pl-9"
                  required
                />
              </div>
            </div>

            <label className="flex items-start gap-2 text-sm text-gray-600 cursor-pointer">
              <input type="checkbox" className="accent-primary-500 mt-0.5" required />
              I agree to the <a href="#" className="text-primary-600 hover:underline">Terms of Service</a> and <a href="#" className="text-primary-600 hover:underline">Privacy Policy</a>
            </label>

            <button type="submit" disabled={loading} className="btn-secondary w-full py-3.5 disabled:opacity-60">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating Account...
                </span>
              ) : 'Create Account'}
            </button>

            <div className="text-center">
              <p className="text-gray-500 text-sm">
                Already have an account?{' '}
                <Link to="/login" className="text-primary-600 hover:text-primary-800 font-semibold">Sign In</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
