import { createContext, useContext, useState, useCallback } from 'react'
import { getItem, setItem, removeItem, KEYS } from '../utils/localStorage'

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD?.trim() || ''

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(() => !!getItem(KEYS.AUTH))
  const [loginError, setLoginError] = useState('')

  const login = useCallback((password) => {
    if (password === ADMIN_PASSWORD) {
      setItem(KEYS.AUTH, { loggedIn: true, at: new Date().toISOString() })
      setIsAdmin(true)
      setLoginError('')
      return true
    }
    setLoginError('Incorrect password. Please try again.')
    return false
  }, [])

  const logout = useCallback(() => {
    removeItem(KEYS.AUTH)
    setIsAdmin(false)
  }, [])

  const clearError = useCallback(() => setLoginError(''), [])

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout, loginError, clearError }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}