import { useState } from 'react'
import { Routes, Route, Link, useNavigate, useLocation, Navigate } from 'react-router-dom'
import {
  Store, Package, LayoutDashboard, LogOut, Zap, ChevronRight,
  ExternalLink, TrendingUp, Plus, Menu, X
} from 'lucide-react'
import ManageShops from './ManageShops'
import ManageProducts from './ManageProducts'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import { formatDate } from '../utils/helpers'

function OverviewPanel() {
  const { shops, products } = useData()
  const navigate = useNavigate()
  const affiliateCount = products.filter((p) => p.affiliateLink).length
  const recentShops = [...shops].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3)
  const recentProducts = [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5)

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h2 className="font-display font-bold text-2xl text-white">Dashboard Overview</h2>
        <p className="text-sm text-slate-500 mt-0.5">Welcome back, Admin</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Shops', value: shops.length, icon: Store, color: 'text-brand-400', bg: 'bg-brand-500/10', border: 'border-brand-500/20', action: () => navigate('/admin/shops') },
          { label: 'Total Products', value: products.length, icon: Package, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', action: () => navigate('/admin/products') },
          { label: 'Affiliate Links', value: affiliateCount, icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', action: null },
        ].map(({ label, value, icon: Icon, color, bg, border, action }) => (
          <button
            key={label}
            onClick={action}
            className={`glass rounded-xl p-5 border ${border} text-left transition-all duration-200 hover:scale-[1.02] hover:shadow-lg ${action ? 'cursor-pointer' : 'cursor-default'} animate-slide-up`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${bg} border ${border} flex items-center justify-center`}>
                <Icon size={18} className={color} />
              </div>
              {action && <ChevronRight size={14} className="text-slate-600" />}
            </div>
            <div className={`font-display font-bold text-3xl ${color} mb-0.5`}>{value}</div>
            <div className="text-xs text-slate-500">{label}</div>
          </button>
        ))}
      </div>

      {/* Quick actions */}
      <div className="glass rounded-xl p-5 border border-surface-border mb-6">
        <h3 className="font-display font-semibold text-sm text-slate-400 uppercase tracking-wider mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => navigate('/admin/shops')} className="btn-primary text-sm">
            <Plus size={14} /> New Shop
          </button>
          <button
            onClick={() => navigate('/admin/products')}
            disabled={shops.length === 0}
            className="btn-secondary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={14} /> Add Product
          </button>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary text-sm"
          >
            <ExternalLink size={14} /> View Marketplace
          </a>
        </div>
      </div>

      {/* Recent activity */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Recent shops */}
        <div className="glass rounded-xl p-5 border border-surface-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-sm text-slate-400 uppercase tracking-wider">Recent Shops</h3>
            <Link to="/admin/shops" className="text-xs text-brand-400 hover:text-brand-300 transition-colors">
              View all →
            </Link>
          </div>
          {recentShops.length === 0 ? (
            <p className="text-xs text-slate-600 text-center py-4">No shops yet</p>
          ) : (
            <div className="space-y-3">
              {recentShops.map((shop) => (
                <div key={shop.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 bg-surface-hover">
                    {shop.image ? (
                      <img src={shop.image} alt={shop.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Store size={13} className="text-slate-600" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-300 truncate">{shop.name}</p>
                    <p className="text-xs text-slate-600">{formatDate(shop.createdAt)}</p>
                  </div>
                  <Link to={`/shop/${shop.id}`} target="_blank" className="text-slate-600 hover:text-brand-400 transition-colors">
                    <ExternalLink size={12} />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent products */}
        <div className="glass rounded-xl p-5 border border-surface-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-sm text-slate-400 uppercase tracking-wider">Recent Products</h3>
            <Link to="/admin/products" className="text-xs text-brand-400 hover:text-brand-300 transition-colors">
              View all →
            </Link>
          </div>
          {recentProducts.length === 0 ? (
            <p className="text-xs text-slate-600 text-center py-4">No products yet</p>
          ) : (
            <div className="space-y-2.5">
              {recentProducts.map((p) => (
                <div key={p.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 bg-surface-hover">
                    {p.image ? (
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package size={12} className="text-slate-600" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-300 truncate">{p.name}</p>
                    <p className="text-xs text-slate-600">{formatDate(p.createdAt)}</p>
                  </div>
                  {p.affiliateLink && (
                    <a
                      href={p.affiliateLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-500 hover:text-emerald-400 transition-colors"
                    >
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const NAV_ITEMS = [
  { label: 'Overview', path: '/admin', icon: LayoutDashboard, exact: true },
  { label: 'Shops', path: '/admin/shops', icon: Store },
  { label: 'Products', path: '/admin/products', icon: Package },
]

export default function AdminDashboard() {
  const { logout } = useAuth()
  const { shops, products } = useData()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.path
    return location.pathname.startsWith(item.path)
  }

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="px-4 py-5 border-b border-surface-border flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center shadow-lg">
            <Zap size={15} className="text-white fill-white" />
          </div>
          <span className="font-display font-bold text-base text-white">
            Affiliate<span className="text-brand-400">Hub</span>
          </span>
        </Link>
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden p-1 rounded text-slate-500 hover:text-white"
        >
          <X size={16} />
        </button>
      </div>

      {/* Admin badge */}
      <div className="px-4 py-3 border-b border-surface-border">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-brand-500/10 border border-brand-500/20">
          <div className="w-6 h-6 rounded-full bg-brand-500 flex items-center justify-center">
            <span className="text-xs font-bold text-white">A</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-white">Admin</p>
            <p className="text-xs text-slate-500">Full access</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item)
          const Icon = item.icon
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                active
                  ? 'bg-brand-500/15 text-brand-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-surface-hover'
              }`}
            >
              <Icon size={16} />
              {item.label}
              {item.label === 'Shops' && shops.length > 0 && (
                <span className="ml-auto text-xs font-mono bg-surface-border text-slate-400 px-1.5 py-0.5 rounded-md">
                  {shops.length}
                </span>
              )}
              {item.label === 'Products' && products.length > 0 && (
                <span className="ml-auto text-xs font-mono bg-surface-border text-slate-400 px-1.5 py-0.5 rounded-md">
                  {products.length}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-surface-border space-y-1">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-slate-200 hover:bg-surface-hover transition-all"
        >
          <ExternalLink size={15} />
          View Marketplace
        </a>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all text-left"
        >
          <LogOut size={15} />
          Logout
        </button>
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-surface flex">
      <div className="grid-bg fixed inset-0 pointer-events-none" />

      {/* Sidebar — desktop */}
      <aside className="hidden lg:flex flex-col w-56 flex-shrink-0 glass border-r border-surface-border min-h-screen fixed left-0 top-0 z-30">
        <SidebarContent />
      </aside>

      {/* Sidebar — mobile overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative z-50 flex flex-col w-56 glass border-r border-surface-border min-h-screen">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main area */}
      <div className="flex-1 lg:ml-56 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="glass border-b border-surface-border px-4 sm:px-6 h-14 flex items-center gap-3 sticky top-0 z-20">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-surface-hover transition-all"
          >
            <Menu size={18} />
          </button>

          <div className="flex-1">
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
              {NAV_ITEMS.find(i => isActive(i))?.label || 'Admin'}
            </p>
          </div>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 hover:text-brand-400 transition-colors"
          >
            <ExternalLink size={12} />
            Marketplace
          </a>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 max-w-5xl">
          <Routes>
            <Route index element={<OverviewPanel />} />
            <Route path="shops" element={<ManageShops />} />
            <Route path="products" element={<ManageProducts />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}