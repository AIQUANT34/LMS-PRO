import React, { useState, useContext, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from '../../api/axios'
import { AuthContext } from '../../context/AuthContext'
import logo from '../../logo.jpg'


export default function Register() {
  const navigate = useNavigate()
  const { setAuth } = useContext(AuthContext)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')

  const validate = () => {
    const e = {}
    if (!name) e.name = 'Name is required.'
    if (!email) e.email = 'Email is required.'
    else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) e.email = 'Enter a valid email.'
    if (!password) e.password = 'Password is required.'
    else if (password.length < 6) e.password = 'Password must be at least 6 characters.'
    if (confirm !== password) e.confirm = 'Passwords do not match.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    setServerError('')
    if (!validate()) return
    setLoading(true)
    try {
      const res = await axios.post('/auth/register', { name, email, password })
      const data = res.data
      setAuth({ user: data.user, token: data.token })
      navigate('/dashboard')
    } catch (err) {
      setServerError(err?.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const strength = useMemo(() => {
    if (!password) return 0
    let score = 0
    if (password.length >= 8) score += 1
    if (/[A-Z]/.test(password)) score += 1
    if (/[0-9]/.test(password)) score += 1
    if (/[^A-Za-z0-9]/.test(password)) score += 1
    return score
  }, [password])

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="hidden md:flex flex-col justify-center rounded-l-2xl bg-gradient-to-b from-emerald-600 to-emerald-400 p-10 text-white shadow-lg" style={{overflow:'hidden'}}>
          <img src={logo} alt="logo" className="mb-6" style={{width:110, height:110, maxWidth:'100%', objectFit:'contain'}} />
          <h3 className="text-3xl font-bold mb-2">Join our community</h3>
          <p className="opacity-90">Create an account to track progress, access courses and more.</p>
        </div>

        <div className="bg-white rounded-2xl shadow p-8 md:p-10">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Create your account</h2>
            <p className="text-sm text-gray-500">Enter your details to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`mt-1 block w-full rounded-lg border border-gray-200 px-4 py-2 text-sm placeholder-gray-400 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300 ${errors.name ? 'border-red-400' : ''}`}
                style={{fontSize:16}}
                placeholder="Your full name"
              />
              {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
            </div>

            <div>
            
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                
                onChange={(e) => setEmail(e.target.value)}
                className={`mt-1 block w-full rounded-lg border border-gray-200 px-4 py-2 text-sm placeholder-gray-400 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300 ${errors.email ? 'border-red-400' : ''}`}
                style={{fontSize:16}}
                placeholder="you@example.com"
                autoComplete="email"
              />
              {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="relative mt-1">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`block w-full rounded-lg border border-gray-200 px-4 py-2 text-sm placeholder-gray-400 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300 ${errors.password ? 'border-red-400' : ''}`}
                  style={{fontSize:16}}
                  placeholder="Create a password"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-2 text-sm text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <div className="mt-2">
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${strength >= 3 ? 'bg-emerald-500' : strength === 2 ? 'bg-yellow-400' : 'bg-red-400' }`} style={{ width: `${(strength/4)*100}%` }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Use 8+ chars with a mix of letters, numbers and symbols.</p>
              </div>
              {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className={`mt-1 block w-full rounded-lg border border-gray-200 px-4 py-2 text-sm placeholder-gray-400 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300 ${errors.confirm ? 'border-red-400' : ''}`}
                style={{fontSize:16}}
                placeholder="Repeat your password"
                autoComplete="new-password"
              />
              {errors.confirm && <p className="text-sm text-red-500 mt-1">{errors.confirm}</p>}
            </div>

            {serverError && <div className="text-sm text-red-600">{serverError}</div>}

            <div>
              <button
                type="submit"
                className="w-full inline-flex justify-center items-center gap-2 rounded-md bg-emerald-600 text-white px-4 py-2 text-sm font-medium hover:bg-emerald-700 disabled:opacity-60"
                disabled={loading}
              >
                {loading && (
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                )}
                <span>{loading ? 'Creating account...' : 'Create account'}</span>
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">Or sign up with</p>
            <div className="mt-3 flex gap-3 justify-center">
              <button className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-gray-200 hover:bg-gray-50">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M21 12.3c0-.73-.07-1.28-.22-1.84H12v3.48h4.98c-.1.84-.62 2.04-1.98 2.74v2.28h3.2c1.87-1.72 2.96-4.24 2.96-6.66z" fill="#4285F4"/></svg>
                <span className="text-sm">Google</span>
              </button>
              <button className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-gray-200 hover:bg-gray-50">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 .5C5.7.5.9 5.3.9 11.6c0 4.4 2.9 8.1 6.9 9.4.5.1.7-.2.7-.4v-1.6c-2.8.6-3.4-1.2-3.4-1.2-.5-1.2-1.2-1.6-1.2-1.6-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 .1 1.7.8 2.1 1.3.1-1 .4-1.6.7-2-2.2-.3-4.5-1.1-4.5-5 0-1.1.4-1.9 1.1-2.5-.1-.3-.5-1.4.1-2.9 0 0 .9-.3 3 .9.9-.3 1.8-.4 2.7-.4s1.8.1 2.7.4c2.1-1.3 3-.9 3-.9.6 1.5.2 2.6.1 2.9.7.7 1.1 1.5 1.1 2.5 0 3.9-2.3 4.7-4.6 5 .4.4.8 1.2.8 2.4v3.6c0 .2.2.5.7.4 4-1.3 6.9-5 6.9-9.4C23.1 5.3 18.3.5 12 .5z" fill="#333"/></svg>
                <span className="text-sm">GitHub</span>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account? <Link to="/login" className="text-emerald-600 hover:underline">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  )
}