import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { login as loginApi } from '../api/auth'
import { m as motion } from 'framer-motion'

function parseError(err) {
  if (!err.response) {
    return { message: 'Cannot connect to server. Check your internet connection.', field: null }
  }

  const status = err.response.status
  // backend may use .message or .error
  const serverMsg = err.response.data?.message || err.response.data?.error || null

  if (status === 400) return { message: serverMsg || 'Please check your input and try again.', field: null }
  if (status === 401) return { message: serverMsg || 'Incorrect email or password.', field: 'password' }
  if (status === 403) return { message: serverMsg || 'Your account has been suspended.', field: null }
  if (status === 404) return { message: serverMsg || 'No account found with that email address.', field: 'email' }
  if (status === 429) return { message: serverMsg || 'Too many login attempts. Please wait a moment and try again.', field: null }
  if (status >= 500) return { message: 'Server error. Please try again in a moment.', field: null }

  return { message: serverMsg || 'Something went wrong. Please try again.', field: null }
}

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [fieldError, setFieldError] = useState(null)  // 'email' | 'password' | null
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
    setFieldError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setFieldError(null)
    setLoading(true)
    try {
      const res = await loginApi(form)
      login(res.data.token, res.data.user)
      navigate('/dashboard')
    } catch (err) {
      const { message, field } = parseError(err)
      setError(message)
      setFieldError(field)
    } finally {
      setLoading(false)
    }
  }

  const inputClass = (field) =>
    `w-full bg-gray-50 dark:bg-gray-800 border text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg px-4 py-3 text-sm focus:outline-none transition-colors ${
      fieldError === field
        ? 'border-red-400 dark:border-red-600 focus:border-red-500 bg-red-50 dark:bg-red-950/30'
        : 'border-gray-200 dark:border-gray-700 focus:border-violet-500'
    }`

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-900 dark:text-white font-bold text-2xl mb-6">
            <span className="text-2xl">⚡</span>
            CareerCopilot
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Log in to continue your journey</p>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 text-sm px-4 py-3 rounded-lg mb-6 flex items-start gap-2"
            >
              <span className="shrink-0 mt-0.5">⚠</span>
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                autoComplete="email"
                className={inputClass('email')}
              />
              {fieldError === 'email' && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1.5">No account found with this email.</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Your password"
                required
                autoComplete="current-password"
                className={inputClass('password')}
              />
              {fieldError === 'password' && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1.5">Incorrect password.</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Logging in…
                </span>
              ) : 'Log In →'}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300">
            Sign up free
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
