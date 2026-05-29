import { useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import {
  Store, Package, ExternalLink, ArrowLeft, Globe, Calendar, Search, Tag
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import CategoryFilter from '../components/CategoryFilter'
import EmptyState from '../components/EmptyState'
import { useData } from '../context/DataContext'
import { formatDate, getCategoryColor, truncate } from '../utils/helpers'

export default function ShopPage() {
  const { shopId } = useParams()
  const { getShop, getShopProducts } = useData()
  const shop = getShop(shopId)
  const products = getShopProducts(shopId)

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  if (!shop) return <Navigate to="/" replace />

  const filtered = products.filter((p) => {
    const matchQ = !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description || '').toLowerCase().includes(search.toLowerCase())
    const matchCat = category === 'All' || p.category === category
    return matchQ && matchCat
  })

  return (
    <div className="min-h-screen bg-surface">
      <div className="grid-bg fixed inset-0 pointer-events-none" />
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-10">
        {/* Back */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-brand-400 transition-colors mb-6"
        >
          <ArrowLeft size={15} />
          Back to Marketplace
        </Link>

        {/* Shop header */}
        <div className="glass rounded-2xl overflow-hidden mb-8 animate-fade-in">
          {/* Cover */}
          <div className="relative h-48 sm:h-64 overflow-hidden bg-surface-card">
            {shop.image ? (
              <img src={shop.image} alt={shop.name} className="w-full h-full object-cover" />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, hsl(${[...shop.name].reduce((a,c) => a+c.charCodeAt(0),0)%360}, 35%, 10%), hsl(${([...shop.name].reduce((a,c)=>a+c.charCodeAt(0),0)+80)%360}, 25%, 6%))`,
                }}
              >
                <Store size={60} className="text-slate-700" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-surface-card/90 via-surface-card/30 to-transparent" />

            {/* Info overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex flex-wrap items-end gap-4 justify-between">
                <div>
                  {shop.category && (
                    <span className={`badge ${getCategoryColor(shop.category)} mb-2`}>
                      {shop.category}
                    </span>
                  )}
                  <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white leading-tight">
                    {shop.name}
                  </h1>
                </div>

                {shop.website && (
                  <a
                    href={shop.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary text-sm"
                  >
                    <Globe size={14} />
                    Visit Shop
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Meta */}
          <div className="px-6 py-4 flex flex-wrap items-center gap-6 border-t border-surface-border">
            {shop.description && (
              <p className="text-sm text-slate-400 flex-1 min-w-[200px]">
                {shop.description}
              </p>
            )}
            <div className="flex items-center gap-4 text-xs text-slate-500 flex-shrink-0">
              <span className="flex items-center gap-1.5">
                <Package size={13} className="text-brand-500" />
                {products.length} {products.length === 1 ? 'Product' : 'Products'}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={13} />
                {formatDate(shop.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Products section */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-5">
            <h2 className="font-display font-bold text-xl text-white flex-1">
              Products
            </h2>

            {/* Search */}
            <div className="relative max-w-xs w-full">
              <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search products…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-surface-card border border-surface-border text-slate-300 placeholder-slate-500 text-xs focus:outline-none focus:border-brand-500/50 transition-all"
              />
            </div>
          </div>

          {/* Category filter */}
          <div className="mb-5">
            <CategoryFilter selected={category} onChange={setCategory} />
          </div>

          {filtered.length === 0 ? (
            <EmptyState
              type="products"
              title={search || category !== 'All' ? 'No matching products' : 'No products yet'}
              description={
                search || category !== 'All'
                  ? 'Try adjusting your search or category filter'
                  : 'This shop hasn\'t added any products yet.'
              }
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((product, i) => (
                <ProductCard key={product.id} product={product} animDelay={i * 50} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}