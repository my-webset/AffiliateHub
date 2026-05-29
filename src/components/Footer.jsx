import { Link } from 'react-router-dom'
import { Zap, Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-surface-border bg-surface-card/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center">
              <Zap size={13} className="text-white fill-white" />
            </div>
            <span className="font-display font-bold text-base text-white">
              Affiliate<span className="text-brand-400">Hub</span>
            </span>
          </Link>

          <div className="flex items-center gap-6 text-sm text-slate-500">
            <Link to="/" className="hover:text-brand-400 transition-colors">Home</Link>
            <Link to="/admin/login" className="hover:text-brand-400 transition-colors">Admin</Link>
          </div>

          <p className="text-xs text-slate-600 flex items-center gap-1">
            Built with <Heart size={11} className="text-brand-500" /> for affiliates everywhere
          </p>
        </div>
      </div>
    </footer>
  )
}