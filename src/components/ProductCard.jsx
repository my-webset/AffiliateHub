import { Link } from 'react-router-dom'
import { ExternalLink, Tag, Store, ArrowRight } from 'lucide-react'
import { getCategoryColor, truncate, formatPrice } from '../utils/helpers'
import { useData } from '../context/DataContext'

export default function ProductCard({ product, showShop = false, animDelay = 0 }) {
  const { getShop } = useData()
  const shop = showShop ? getShop(product.shopId) : null

  return (
    <div
      className="card group animate-slide-up"
      style={{ animationDelay: `${animDelay}ms`, animationFillMode: 'both' }}
    >
      {/* Image */}
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative h-52 overflow-hidden bg-surface-card">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, hsl(${[...product.name].reduce((a, c) => a + c.charCodeAt(0), 0) % 360}, 35%, 10%), hsl(${([...product.name].reduce((a, c) => a + c.charCodeAt(0), 0) + 80) % 360}, 25%, 7%))`,
              }}
            >
              <Tag size={36} className="text-slate-700" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-surface-card/60 via-transparent to-transparent" />

          {product.category && (
            <div className="absolute top-2.5 left-2.5">
              <span className={`badge ${getCategoryColor(product.category)} text-xs`}>
                {product.category}
              </span>
            </div>
          )}

          {product.price && (
            <div className="absolute bottom-2.5 right-2.5 px-2 py-1 rounded-lg bg-black/50 backdrop-blur-sm text-xs font-bold text-white border border-white/10">
              {formatPrice(product.price)}
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        {showShop && shop && (
          <Link
            to={`/shop/${shop.id}`}
            className="flex items-center gap-1.5 mb-2 text-xs text-slate-500 hover:text-brand-400 transition-colors"
          >
            <Store size={11} />
            {shop.name}
          </Link>
        )}

        <Link to={`/product/${product.id}`}>
          <h3 className="font-display font-bold text-sm text-white group-hover:text-brand-400 transition-colors duration-200 leading-snug mb-1.5">
            {truncate(product.name, 60)}
          </h3>
        </Link>

        {product.description && (
          <p className="text-xs text-slate-500 leading-relaxed mb-3">
            {truncate(product.description, 80)}
          </p>
        )}

        <div className="flex items-center gap-2">
          {product.affiliateLink ? (
            <a
              href={product.affiliateLink}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="flex-1 btn-primary justify-center text-xs py-2"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink size={12} />
              Get Deal
            </a>
          ) : (
            <Link
              to={`/product/${product.id}`}
              className="flex-1 btn-secondary justify-center text-xs py-2"
            >
              View Details
              <ArrowRight size={12} />
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
