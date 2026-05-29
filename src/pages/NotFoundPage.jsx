import { Link } from 'react-router-dom'
import { Home, Zap } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-4 text-center">
      <div className="grid-bg fixed inset-0 pointer-events-none" />
      <div className="relative animate-fade-in">
        <div className="font-display font-extrabold text-[10rem] sm:text-[14rem] leading-none gradient-text opacity-20 select-none">
          404
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-2xl glass border border-brand-500/20 flex items-center justify-center mb-4">
            <Zap size={28} className="text-brand-400" />
          </div>
          <h1 className="font-display font-bold text-2xl text-white mb-2">Page not found</h1>
          <p className="text-slate-500 text-sm mb-6">This page doesn't exist or was moved.</p>
          <Link to="/" className="btn-primary">
            <Home size={15} />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}