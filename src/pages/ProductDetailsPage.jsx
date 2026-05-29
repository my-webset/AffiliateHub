import { useParams, Link, Navigate } from 'react-router-dom'
import {
  ArrowLeft, ExternalLink, Store, Tag, Calendar, DollarSign, Link2, Package
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import { useData } from '../context/DataContext'
import { getCategoryColor, formatDate, formatPrice } from '../utils/helpers'

export default function ProductDetailsPage() {
  const { productId } = useParams()
  const { getProduct, getShop, getShopProducts } = useData()

  const product = getProduct(productId)
  if (!product) return <Navigate to="/" replace />

  const shop = getShop(product.shopId)
  const relatedProducts = getShopProducts(product.shopId)
    .filter((p) => p.id !== product.id)
    .slice(0, 4)

  return (
    <div className="min-h-screen bg-surface">
      <div className="grid-bg fixed inset-0 pointer-events-none" />
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6 flex-wrap">
          <Link to="/" className="hover:text-brand-400 transition-colors">Marketplace</Link>
          <span>/</span>
          {shop && (
            <>
              <Link to={`/shop/${shop.id}`} className="hover:text-brand-400 transition-colors">{shop.name}</Link>
              <span>/</span>
            </>
          )}
          <span className="text-slate-400 truncate max-w-[200px]">{product.name}</span>
        </div>

        {/* Product layout */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Image */}
          <div className="animate-fade-in">
            <div className="glass rounded-2xl overflow-hidden aspect-video lg:aspect-square">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, hsl(${[...product.name].reduce((a,c)=>a+c.charCodeAt(0),0)%360}, 35%, 10%), hsl(${([...product.name].reduce((a,c)=>a+c.charCodeAt(0),0)+80)%360}, 25%, 6%))`,
                  }}
                >
                  <Tag size={60} className="text-slate-700" />
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="animate-slide-up flex flex-col">
            {/* Category & date */}
            <div className="flex items-center gap-3 mb-4">
              {product.category && (
                <span className={`badge ${getCategoryColor(product.category)}`}>
                  {product.category}
                </span>
              )}
              <span className="text-xs text-slate-600 flex items-center gap-1">
                <Calendar size={11} />
                {formatDate(product.createdAt)}
              </span>
            </div>

            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white leading-tight mb-4">
              {product.name}
            </h1>

            {product.description && (
              <p className="text-slate-400 text-base leading-relaxed mb-6">
                {product.description}
              </p>
            )}

            {/* Price */}
            {product.price && (
              <div className="flex items-center gap-2 mb-6">
                <DollarSign size={20} className="text-brand-500" />
                <span className="font-display font-bold text-3xl gradient-text">
                  {formatPrice(product.price)}
                </span>
              </div>
            )}

            {/* Details list */}
            <div className="glass rounded-xl p-4 mb-6 space-y-3">
              {shop && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 flex items-center gap-1.5">
                    <Store size={13} /> Shop
                  </span>
                  <Link
                    to={`/shop/${shop.id}`}
                    className="text-xs font-semibold text-brand-400 hover:text-brand-300 transition-colors"
                  >
                    {shop.name}
                  </Link>
                </div>
              )}
              {product.affiliateLink && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 flex items-center gap-1.5">
                    <Link2 size={13} /> Affiliate Link
                  </span>
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                    Active
                  </span>
                </div>
              )}
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3 mt-auto">
              {product.affiliateLink ? (
                <a
                  href={product.affiliateLink}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="btn-primary flex-1 justify-center text-base py-3.5 rounded-xl animated-border"
                >
                  <ExternalLink size={16} />
                  Get This Deal
                </a>
              ) : (
                <div className="flex-1 flex items-center justify-center py-3.5 rounded-xl glass border border-surface-border text-slate-500 text-sm">
                  No affiliate link available
                </div>
              )}
              {shop && (
                <Link
                  to={`/shop/${shop.id}`}
                  className="btn-secondary flex-1 justify-center py-3.5 rounded-xl"
                >
                  <Store size={15} />
                  View Shop
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <section>
            <div className="divider mb-8" />
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
                <Package size={18} className="text-brand-500" />
                More from {shop?.name || 'this shop'}
              </h2>
              {shop && (
                <Link to={`/shop/${shop.id}`} className="text-xs text-brand-400 hover:text-brand-300 transition-colors flex items-center gap-1">
                  View all <ArrowLeft size={12} className="rotate-180" />
                </Link>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} animDelay={i * 50} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}