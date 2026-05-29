import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff, ShieldCheck, Zap, Lock, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function AdminLogin() {
  const { login, isAdmin, loginError, clearError } = useAuth()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [shake, setShake] = useState(false)

  useEffect(() => {
    if (isAdmin) navigate('/admin', { replace: true })
  }, [isAdmin, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 400))
    const ok = login(password)
    setLoading(false)
    if (ok) {
      navigate('/admin', { replace: true })
    } else {
      setShake(true)
      setTimeout(() => setShake(false), 600)
    }
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-4">
      <div className="grid-bg fixed inset-0 pointer-events-none" />
      <div className="hero-glow fixed inset-0 pointer-events-none" />

      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 mb-10 group">
        <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center shadow-lg shadow-brand-900/50 group-hover:shadow-brand-500/40 transition-all duration-300">
          <Zap size={18} className="text-white fill-white" />
        </div>
        <span className="font-display font-bold text-xl text-white">
          Affiliate<span className="text-brand-400">Hub</span>
        </span>
      </Link>

      {/* Card */}
      <div
        className={`w-full max-w-sm glass-bright rounded-2xl p-8 animate-scale-in ${
          shake ? 'animate-[wiggle_0.5s_ease-in-out]' : ''
        }`}
        style={{
          '--tw-shadow': '0 25px 50px -12px rgba(0,0,0,0.6)',
          boxShadow: 'var(--tw-shadow)',
        }}
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center mb-4 shadow-lg shadow-brand-900/50 glow-brand">
            <ShieldCheck size={24} className="text-white" />
          </div>
          <h1 className="font-display font-bold text-2xl text-white text-center">Admin Access</h1>
          <p className="text-sm text-slate-500 mt-1 text-center">Enter your password to continue</p>
        </div>

        {/* Error */}
        {loginError && (
          <div className="flex items-center gap-2 px-3.5 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-5 animate-slide-down">
            <AlertCircle size={15} className="flex-shrink-0" />
            {loginError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="input-label">Password</label>
            <div className="relative">
              <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type={show ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); clearError() }}
                placeholder="Enter admin password"
                autoFocus
                required
                className="input-field pl-9 pr-10"
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              >
                {show ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full btn-primary justify-center py-3 text-base rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Verifying…
              </div>
            ) : (
              <>
                <ShieldCheck size={16} />
                Login to Dashboard
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/" className="text-xs text-slate-600 hover:text-brand-400 transition-colors">
            ← Back to Marketplace
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes wiggle {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-5px); }
          80% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  )
}