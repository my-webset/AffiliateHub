import { useState } from 'react'
import { Plus, Pencil, Trash2, Package, Store, ExternalLink, Search, Filter } from 'lucide-react'
import { useData } from '../context/DataContext'
import ProductForm from './ProductForm'
import EmptyState from '../components/EmptyState'
import { getCategoryColor, formatDate, formatPrice, truncate } from '../utils/helpers'

export default function ManageProducts() {
  const { products, shops, addProduct, editProduct, removeProduct, getShop } = useData()
  const [form, setForm] = useState(null) // null | 'new' | product
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [search, setSearch] = useState('')
  const [filterShop, setFilterShop] = useState('')

  const filtered = products.filter((p) => {
    const matchQ = !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description || '').toLowerCase().includes(search.toLowerCase())
    const matchShop = !filterShop || p.shopId === filterShop
    return matchQ && matchShop
  })

  const handleSave = (data) => {
    if (form && form !== 'new') {
      editProduct(form.id, data)
    } else {
      addProduct(data)
    }
    setForm(null)
  }

  const confirmDelete = () => {
    if (deleteConfirm) {
      removeProduct(deleteConfirm.id)
      setDeleteConfirm(null)
    }
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display font-bold text-2xl text-white">Manage Products</h2>
          <p className="text-sm text-slate-500 mt-0.5">{products.length} product{products.length !== 1 ? 's' : ''} total</p>
        </div>
        <button
          onClick={() => setForm('new')}
          disabled={shops.length === 0}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          title={shops.length === 0 ? 'Create a shop first' : ''}
        >
          <Plus size={15} />
          Add Product
        </button>
      </div>

      {shops.length === 0 && (
        <div className="mb-5 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs flex items-center gap-2">
          <Store size={14} />
          You need to create at least one shop before adding products.
        </div>
      )}

      {/* Filters */}
      {products.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1 max-w-xs">
            <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search products…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-9 py-2.5 text-xs"
            />
          </div>
          <div className="relative">
            <Filter size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <select
              value={filterShop}
              onChange={(e) => setFilterShop(e.target.value)}
              className="input-field pl-9 py-2.5 text-xs pr-8 appearance-none"
            >
              <option value="">All shops</option>
              {shops.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Products list */}
      {filtered.length === 0 ? (
        <EmptyState
          type="products"
          title={search || filterShop ? 'No matching products' : 'No products yet'}
          description={
            search || filterShop
              ? 'Try adjusting your search or filter'
              : shops.length === 0
              ? 'Create a shop first, then add products to it.'
              : 'Add your first affiliate product.'
          }
          action={
            !search && !filterShop && shops.length > 0 && (
              <button onClick={() => setForm('new')} className="btn-primary">
                <Plus size={14} /> Add First Product
              </button>
            )
          }
        />
      ) : (
        <div className="space-y-2">
          {filtered.map((product, i) => {
            const shop = getShop(product.shopId)
            return (
              <div
                key={product.id}
                className="glass rounded-xl border border-surface-border hover:border-brand-500/20 transition-all duration-200 animate-slide-up"
                style={{ animationDelay: `${i * 30}ms`, animationFillMode: 'both' }}
              >
                <div className="flex items-center gap-4 p-3.5">
                  {/* Image thumb */}
                  <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-surface-hover">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{
                          background: `linear-gradient(135deg, hsl(${[...product.name].reduce((a,c)=>a+c.charCodeAt(0),0)%360}, 30%, 10%), hsl(${([...product.name].reduce((a,c)=>a+c.charCodeAt(0),0)+80)%360}, 20%, 7%))`,
                        }}
                      >
                        <Package size={18} className="text-slate-600" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-display font-semibold text-sm text-white truncate">{product.name}</h3>
                      {product.category && (
                        <span className={`badge ${getCategoryColor(product.category)} text-xs`}>{product.category}</span>
                      )}
                      {product.affiliateLink && (
                        <span className="badge badge-green text-xs">
                          <ExternalLink size={9} /> Link
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-600 flex-wrap">
                      {shop && (
                        <span className="flex items-center gap-1 text-slate-500">
                          <Store size={10} />
                          {shop.name}
                        </span>
                      )}
                      {product.price && (
                        <span className="text-brand-400 font-mono font-semibold">
                          {formatPrice(product.price)}
                        </span>
                      )}
                      <span>{formatDate(product.createdAt)}</span>
                    </div>
                    {product.description && (
                      <p className="text-xs text-slate-600 mt-0.5 truncate">{truncate(product.description, 60)}</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {product.affiliateLink && (
                      <a
                        href={product.affiliateLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all border border-surface-border"
                        title="Preview affiliate link"
                      >
                        <ExternalLink size={14} />
                      </a>
                    )}
                    <button
                      onClick={() => setForm(product)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-brand-400 hover:bg-brand-500/10 transition-all border border-surface-border"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(product)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all border border-surface-border"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Product Form modal */}
      {form && (
        <ProductForm
          product={form !== 'new' ? form : undefined}
          onSave={handleSave}
          onClose={() => setForm(null)}
        />
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm glass-bright rounded-2xl p-6 shadow-2xl animate-scale-in">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4 mx-auto">
              <Trash2 size={20} className="text-red-400" />
            </div>
            <h3 className="font-display font-bold text-lg text-white text-center mb-2">Delete Product?</h3>
            <p className="text-sm text-slate-400 text-center mb-5">
              Delete <strong className="text-white">"{deleteConfirm.name}"</strong>? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="btn-secondary flex-1 justify-center">
                Cancel
              </button>
              <button onClick={confirmDelete} className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-sm bg-red-500 text-white hover:bg-red-600 active:scale-95 transition-all">
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}