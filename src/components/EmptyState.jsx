import { PackageOpen, Store, Search, ShoppingBag } from 'lucide-react'

const ICONS = {
  shops: Store,
  products: PackageOpen,
  search: Search,
  orders: ShoppingBag,
  default: PackageOpen,
}

export default function EmptyState({
  type = 'default',
  title,
  description,
  action,
  icon: CustomIcon,
}) {
  const Icon = CustomIcon || ICONS[type] || ICONS.default

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-fade-in">
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-2xl glass flex items-center justify-center border border-surface-border">
          <Icon size={32} className="text-slate-600" />
        </div>
        <div className="absolute -inset-3 rounded-3xl bg-brand-500/5 blur-xl -z-10" />
      </div>

      <h3 className="font-display font-bold text-xl text-slate-300 mb-2">
        {title || 'Nothing here yet'}
      </h3>
      <p className="text-sm text-slate-500 max-w-sm mb-6 text-balance">
        {description || 'This space is waiting to be filled.'}
      </p>

      {action && (
        <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
          {action}
        </div>
      )}
    </div>
  )
}