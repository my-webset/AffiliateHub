    import { Link } from 'react-router-dom'
import { Store, Package, ArrowRight, ExternalLink } from 'lucide-react'
import { getCategoryColor, truncate } from '../utils/helpers'
import { useData } from '../context/DataContext'

export default function ShopCard({ shop, animDelay = 0 }) {
  const { getShopProducts } = useData()
  const products = getShopProducts(shop.id)

  const imgSrc = shop.image || null

  return (
    <Link
      to={`/shop/${shop.id}`}
      className="card group block animate-slide-up"
      style={{ animationDelay: `${animDelay}ms`, animationFillMode: 'both' }}
    >
      {/* Cover image */}
      <div className="relative h-48 overflow-hidden bg-surface-card">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={shop.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, hsl(${[...shop.name].reduce((a, c) => a + c.charCodeAt(0), 0) % 360}, 40%, 12%), hsl(${([...shop.name].reduce((a, c) => a + c.charCodeAt(0), 0) + 60) % 360}, 30%, 8%))`,
            }}
          >
            <Store size={40} className="text-slate-700" />
          </div>
        )}
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface-card/80 via-transparent to-transparent" />

        {/* Category badge */}
        {shop.category && (
          <div className="absolute top-3 left-3">
            <span className={`badge ${getCategoryColor(shop.category)} text-xs`}>
              {shop.category}
            </span>
          </div>
        )}

        {/* Product count */}
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-black/40 backdrop-blur-sm text-xs text-slate-300 border border-white/10">
          <Package size={11} />
          {products.length}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-display font-bold text-base text-white group-hover:text-brand-400 transition-colors duration-200 leading-tight">
            {shop.name}
          </h3>
          <ArrowRight
            size={16}
            className="text-slate-600 group-hover:text-brand-400 group-hover:translate-x-1 transition-all duration-200 flex-shrink-0 mt-0.5"
          />
        </div>

        {shop.description && (
          <p className="text-xs text-slate-500 leading-relaxed mb-3">
            {truncate(shop.description, 90)}
          </p>
        )}

        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-600 flex items-center gap-1">
            <Package size={11} />
            {products.length} {products.length === 1 ? 'product' : 'products'}
          </span>
          {shop.website && (
            <span className="flex items-center gap-1 text-xs text-slate-600">
              <ExternalLink size={11} />
              Visit
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
