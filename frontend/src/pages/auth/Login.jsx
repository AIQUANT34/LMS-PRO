import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from '../../api/axios'
import { AuthContext } from '../../context/AuthContext'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { BookOpen, Eye, EyeOff, Mail, Lock } from 'lucide-react'

export default function Login() {
    const navigate = useNavigate()
    const { setAuth } = useContext(AuthContext)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [remember, setRemember] = useState(false)
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})
    const [serverError, setServerError] = useState('')

    const validate = () => {
        const e = {}
        if (!email) e.email = 'Email is required.'
        else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) e.email = 'Enter a valid email.'
        if (!password) e.password = 'Password is required.'
        else if (password.length < 6) e.password = 'Password must be at least 6 characters.'
        setErrors(e)
        return Object.keys(e).length === 0
    }

    const handleSubmit = async (ev) => {
        ev.preventDefault()
        setServerError('')
        if (!validate()) return
        setLoading(true)
        try {
            const res = await axios.post('/auth/login', { email, password, remember })
            const data = res.data
            setAuth({ user: data.user, token: data.token })
            navigate('/dashboard')
        } catch (err) {
            setServerError(err?.response?.data?.message || 'Login failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
                <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div className="hidden md:flex flex-col justify-center rounded-l-2xl bg-gradient-to-b from-purple-700 to-purple-500 p-10 text-white shadow-lg">
                        <div className="flex items-center space-x-2 mb-6">
                            <BookOpen className="h-12 w-12" />
                            <span className="text-2xl font-bold">LMS Pro</span>
                        </div>
                        <h3 className="text-3xl font-bold mb-2">Welcome back</h3>
                        <p className="opacity-90">Sign in to access your dashboard, courses and personalized settings.</p>
                        <div className="mt-8 space-y-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-2 h-2 bg-purple-300 rounded-full"></div>
                                <span className="text-sm">Access 1000+ courses</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="w-2 h-2 bg-purple-300 rounded-full"></div>
                                <span className="text-sm">Learn from expert instructors</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="w-2 h-2 bg-purple-300 rounded-full"></div>
                                <span className="text-sm">Track your progress</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10">
                        <div className="mb-6">
                            <h2 className="text-2xl font-semibold text-gray-800">Sign in to your account</h2>
                            <p className="text-sm text-gray-500">Use your email and password to continue</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className={`block w-full rounded-lg border border-gray-200 pl-10 pr-4 py-3 text-sm placeholder-gray-400 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${errors.email ? 'border-red-400' : ''}`}
                                        style={{fontSize:16}}
                                        placeholder="you@example.com"
                                        autoComplete="username"
                                    />
                                </div>
                                {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Password</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className={`block w-full rounded-lg border border-gray-200 pl-10 pr-12 py-3 text-sm placeholder-gray-400 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${errors.password ? 'border-red-400' : ''}`}
                                        style={{fontSize:16}}
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((s) => !s)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" /> : <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="inline-flex items-center">
                                    <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="rounded border-gray-300 text-purple-600 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50" />
                                    <span className="ml-2 text-sm text-gray-600">Remember me</span>
                                </label>
                                <Link to="/forgot" className="text-sm text-purple-600 hover:text-purple-700">Forgot password?</Link>
                            </div>

                            {serverError && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{serverError}</div>}

                            <div>
                                <button
                                    type="submit"
                                    className="w-full inline-flex justify-center items-center gap-2 rounded-lg bg-purple-600 text-white px-4 py-3 text-sm font-medium hover:bg-purple-700 disabled:opacity-60 transition-colors"
                                    disabled={loading}
                                >
                                    {loading && (
                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                        </svg>
                                    )}
                                    <span>{loading ? 'Signing in...' : 'Sign In'}</span>
                                </button>
                            </div>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-500">Or continue with</p>
                            <div className="mt-3 flex gap-3 justify-center">
                                <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M21 12.3c0-.73-.07-1.28-.22-1.84H12v3.48h4.98c-.1.84-.62 2.04-1.98 2.74v2.28h3.2c1.87-1.72 2.96-4.24 2.96-6.66z" fill="#4285F4"/></svg>
                                    <span className="text-sm">Google</span>
                                </button>
                                <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 .5C5.7.5.9 5.3.9 11.6c0 4.4 2.9 8.1 6.9 9.4.5.1.7-.2.7-.4v-1.6c-2.8.6-3.4-1.2-3.4-1.2-.5-1.2-1.2-1.6-1.2-1.6-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 .1 1.7.8 2.1 1.3.1-1 .4-1.6.7-2-2.2-.3-4.5-1.1-4.5-5 0-1.1.4-1.9 1.1-2.5-.1-.3-.5-1.4.1-2.9 0 0 .9-.3 3 .9.9-.3 1.8-.4 2.7-.4s1.8.1 2.7.4c2.1-1.3 3-.9 3-.9.6 1.5.2 2.6.1 2.9.7.7 1.1 1.5 1.1 2.5 0 3.9-2.3 4.7-4.6 5 .4.4.8 1.2.8 2.4v3.6c0 .2.2.5.7.4 4-1.3 6.9-5 6.9-9.4C23.1 5.3 18.3.5 12 .5z" fill="#333"/></svg>
                                    <span className="text-sm">GitHub</span>
                                </button>
                            </div>
                        </div>

                        <div className="mt-6 text-center text-sm text-gray-600">
                            Don't have an account? <Link to="/register" className="text-purple-600 hover:text-purple-700 font-medium">Create one</Link>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}