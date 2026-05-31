import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Store, Zap } from 'lucide-react'
import Navbar from './Navbar'
import Footer from './Footer'
import ShopCard from './ShopCard'
import ProductCard from './ProductCard'
import CategoryFilter from './CategoryFilter'
import EmptyState from './EmptyState'
import { useData } from './DataContext'

// Skeleton Card
function SkeletonCard() {
  return (
    <div className="glass rounded-2xl overflow-hidden border border-surface-border">
      <div className="h-48 shimmer-bg" />
      <div className="p-4 space-y-3">
        <div className="h-3 rounded-full shimmer-bg w-1/3" />
        <div className="h-4 rounded-full shimmer-bg w-3/4" />
        <div className="h-3 rounded-full shimmer-bg w-full" />
        <div className="h-8 rounded-xl shimmer-bg w-full mt-2" />
      </div>
    </div>
  )
}

export default function HomePage() {
  const { shops, products, loading } = useData()
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [category, setCategory] = useState('All')
  const [tab, setTab] = useState('shops')

  useEffect(() => {
    const q = searchParams.get('q')
    if (q !== null) setQuery(q)
  }, [searchParams])

  const handleSearch = (val) => {
    setQuery(val)
    if (val.trim()) setSearchParams({ q: val })
    else setSearchParams({})
  }

  const filteredShops = shops.filter((s) => {
    const matchQ = !query ||
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      (s.description || '').toLowerCase().includes(query.toLowerCase())
    const matchCat = category === 'All' || s.category === category
    return matchQ && matchCat
  })

  const filteredProducts = products.filter((p) => {
    const matchQ = !query ||
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      (p.description || '').toLowerCase().includes(query.toLowerCase())
    const matchCat = category === 'All' || p.category === category
    return matchQ && matchCat
  })

  const isSearching = !!query || category !== 'All'

  return (
    <div className="min-h-screen bg-surface">
      <div className="grid-bg fixed inset-0 pointer-events-none" />
      <Navbar onSearch={handleSearch} searchValue={query} />

      <main className="max-w-7xl mx-auto px-3 sm:px-6 pt-24 pb-10">

        {isSearching && (
          <div className="mb-5 animate-fade-in">
            <h2 className="font-display font-bold text-xl text-white mb-0.5">
              {query ? `Results for "${query}"` : 'Browse by category'}
            </h2>
            <p className="text-sm text-slate-500">
              {filteredShops.length} shops · {filteredProducts.length} products
            </p>
          </div>
        )}

        <div className="mb-5">
          <CategoryFilter selected={category} onChange={setCategory} />
        </div>

        {isSearching && (
          <div className="flex items-center gap-1 mb-5 p-1 glass rounded-xl w-fit border border-surface-border">
            {['shops', 'products'].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all duration-200 ${
                  tab === t ? 'bg-brand-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                }`}
              >
                {t === 'shops' ? `Shops (${filteredShops.length})` : `Products (${filteredProducts.length})`}
              </button>
            ))}
          </div>
        )}

        {/* Shops */}
        {(!isSearching || tab === 'shops') && (
          <section className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
                  <Store size={18} className="text-brand-500" />
                  Shops
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Discover curated affiliate stores</p>
              </div>
              <span className="text-xs text-slate-500">{filteredShops.length} total</span>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : filteredShops.length === 0 ? (
              <EmptyState
                type="shops"
                title={isSearching ? 'No shops found' : 'No shops yet'}
                description={isSearching ? 'Try different search terms' : 'Shops will appear here once admin adds them.'}
              />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {filteredShops.map((shop, i) => (
                  <ShopCard key={shop.id} shop={shop} animDelay={i * 60} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* Products */}
        {(!isSearching || tab === 'products') && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
                  <Zap size={18} className="text-brand-500" />
                  Latest Products
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Handpicked affiliate products</p>
              </div>
              <span className="text-xs text-slate-500">{products.length} items</span>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : filteredProducts.length === 0 ? (
              <EmptyState
                type="products"
                title={isSearching ? 'No products found' : 'No products yet'}
                description={isSearching ? 'Try different search terms' : 'Products will appear here.'}
              />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {filteredProducts.map((product, i) => (
                  <ProductCard key={product.id} product={product} showShop animDelay={i * 60} />
                ))}
              </div>
            )}
          </section>
        )}

      </main>
      <Footer />
    </div>
  )
}
