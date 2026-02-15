import React, { createContext, useState, useEffect } from 'react'

export const AuthContext = createContext({ auth: null, setAuth: () => {} })

export function AuthProvider({ children }) {
	const [auth, setAuthState] = useState(() => {
		try {
			const raw = localStorage.getItem('auth')
			return raw ? JSON.parse(raw) : null
		} catch (e) {
			return null
		}
	})

	const setAuth = (value, remember = true) => {
		setAuthState(value)
		try {
			if (remember) localStorage.setItem('auth', JSON.stringify(value))
			else localStorage.removeItem('auth')
		} catch (e) {
			// ignore
		}
	}

	useEffect(() => {
		// keep localStorage in sync if auth changed elsewhere
		try {
			if (auth) localStorage.setItem('auth', JSON.stringify(auth))
			else localStorage.removeItem('auth')
		} catch (e) {}
	}, [auth])

	return <AuthContext.Provider value={{ auth, setAuth }}>{children}</AuthContext.Provider>
}

export default AuthProvider
