import { createContext, useContext, useState, useCallback } from 'react'

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || '123456jai'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [loginError, setLoginError] = useState('')

  const login = useCallback((password) => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true)
      setLoginError('')
      return true
    }
    setLoginError('Incorrect password. Please try again.')
    return false
  }, [])

  const logout = useCallback(() => {
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
