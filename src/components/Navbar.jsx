import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Search, Zap, Menu, X, ShieldCheck } from 'lucide-react'

export default function Navbar({ onSearch, searchValue = '' }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [localSearch, setLocalSearch] = useState(searchValue)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const handleSearch = (e) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(localSearch)
    } else {
      navigate(`/?q=${encodeURIComponent(localSearch)}`)
    }
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass border-b border-surface-border shadow-xl shadow-black/20' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0 group">
          <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center shadow-lg shadow-brand-900/50 group-hover:shadow-brand-500/40 transition-all duration-300">
            <Zap size={16} className="text-white fill-white" />
          </div>
          <span className="font-display font-bold text-lg text-white">
            Affiliate<span className="text-brand-400">Hub</span>
          </span>
        </Link>

        {/* Search bar - desktop */}
        <form
          onSubmit={handleSearch}
          className="flex flex-1 max-w-xl items-center gap-2"
        >
          <div className="relative w-full">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search shops, products…"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-surface-card border border-surface-border text-slate-300 placeholder-slate-500 text-sm focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/20 transition-all duration-200"
            />
          </div>
        </form>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <Link
            to="/admin/login"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-brand-400 transition-colors duration-200"
          >
            <ShieldCheck size={14} />
            Admin
          </Link>
          <Link
            to="/"
            className="hidden sm:flex btn-primary text-xs px-4 py-2"
          >
            Browse
          </Link>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="sm:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-surface-hover transition-all"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden glass border-t border-surface-border animate-slide-down">
          <div className="px-4 py-4 space-y-3">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search…"
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  className="input-field pl-9 py-2.5"
                />
              </div>
            </form>
            <div className="flex items-center gap-2">
              <Link to="/" className="flex-1 btn-secondary text-center text-xs justify-center">
                Browse
              </Link>
              <Link to="/admin/login" className="flex-1 btn-secondary text-center text-xs justify-center">
                <ShieldCheck size={13} /> Admin
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}