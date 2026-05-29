import { useState } from 'react'
import { Plus, Pencil, Trash2, Store, Package, ExternalLink, Search } from 'lucide-react'
import { useData } from '../context/DataContext'
import ShopForm from './ShopForm'
import ProductForm from './ProductForm'
import EmptyState from '../components/EmptyState'
import { getCategoryColor, formatDate, truncate } from '../utils/helpers'

export default function ManageShops() {
  const { shops, products, addShop, editShop, removeShop, addProduct, getShopProducts } = useData()
  const [shopForm, setShopForm] = useState(null) // null | 'new' | shop object
  const [productShopId, setProductShopId] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [search, setSearch] = useState('')
  const [expandedShop, setExpandedShop] = useState(null)

  const filtered = shops.filter((s) =>
    !search || s.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleSaveShop = (data) => {
    if (shopForm && shopForm !== 'new') {
      editShop(shopForm.id, data)
    } else {
      addShop(data)
    }
    setShopForm(null)
  }

  const handleDeleteShop = (shop) => {
    const shopProducts = getShopProducts(shop.id)
    setDeleteConfirm({ ...shop, productCount: shopProducts.length })
  }

  const confirmDelete = () => {
    if (deleteConfirm) {
      removeShop(deleteConfirm.id)
      setDeleteConfirm(null)
      if (expandedShop === deleteConfirm.id) setExpandedShop(null)
    }
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display font-bold text-2xl text-white">Manage Shops</h2>
          <p className="text-sm text-slate-500 mt-0.5">{shops.length} shop{shops.length !== 1 ? 's' : ''} total</p>
        </div>
        <button onClick={() => setShopForm('new')} className="btn-primary">
          <Plus size={15} />
          New Shop
        </button>
      </div>

      {/* Search */}
      {shops.length > 0 && (
        <div className="relative mb-5 max-w-sm">
          <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search shops…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9 py-2.5 text-xs"
          />
        </div>
      )}

      {/* List */}
      {filtered.length === 0 ? (
        <EmptyState
          type="shops"
          title={search ? 'No matching shops' : 'No shops yet'}
          description={search ? 'Try a different search term' : 'Create your first shop to get started.'}
          action={
            !search && (
              <button onClick={() => setShopForm('new')} className="btn-primary">
                <Plus size={14} /> Create First Shop
              </button>
            )
          }
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((shop, i) => {
            const shopProds = getShopProducts(shop.id)
            const isExpanded = expandedShop === shop.id

            return (
              <div
                key={shop.id}
                className="glass rounded-xl overflow-hidden border border-surface-border hover:border-brand-500/20 transition-all duration-200 animate-slide-up"
                style={{ animationDelay: `${i * 40}ms`, animationFillMode: 'both' }}
              >
                {/* Shop row */}
                <div className="flex items-center gap-4 p-4">
                  {/* Cover thumb */}
                  <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-surface-hover">
                    {shop.image ? (
                      <img src={shop.image} alt={shop.name} className="w-full h-full object-cover" />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{
                          background: `linear-gradient(135deg, hsl(${[...shop.name].reduce((a,c)=>a+c.charCodeAt(0),0)%360}, 35%, 12%), hsl(${([...shop.name].reduce((a,c)=>a+c.charCodeAt(0),0)+60)%360}, 25%, 8%))`,
                        }}
                      >
                        <Store size={20} className="text-slate-600" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-display font-bold text-sm text-white">{shop.name}</h3>
                      {shop.category && (
                        <span className={`badge ${getCategoryColor(shop.category)} text-xs`}>{shop.category}</span>
                      )}
                    </div>
                    {shop.description && (
                      <p className="text-xs text-slate-500 mt-0.5">{truncate(shop.description, 70)}</p>
                    )}
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-600">
                      <span className="flex items-center gap-1">
                        <Package size={11} />
                        {shopProds.length} products
                      </span>
                      <span>{formatDate(shop.createdAt)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => setProductShopId(shop.id)}
                      className="btn-success text-xs px-3 py-1.5"
                    >
                      <Plus size={12} />
                      Product
                    </button>
                    <button
                      onClick={() => setExpandedShop(isExpanded ? null : shop.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-brand-400 hover:bg-brand-500/10 transition-all text-xs border border-surface-border"
                    >
                      <Package size={14} />
                    </button>
                    <button
                      onClick={() => setShopForm(shop)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-brand-400 hover:bg-brand-500/10 transition-all border border-surface-border"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteShop(shop)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all border border-surface-border"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Expanded products */}
                {isExpanded && (
                  <div className="border-t border-surface-border bg-surface-card/50 px-4 py-3 animate-slide-down">
                    {shopProds.length === 0 ? (
                      <p className="text-xs text-slate-500 text-center py-3">
                        No products in this shop yet.{' '}
                        <button
                          onClick={() => setProductShopId(shop.id)}
                          className="text-brand-400 hover:underline"
                        >
                          Add one
                        </button>
                      </p>
                    ) : (
                      <div className="space-y-1.5">
                        <p className="text-xs text-slate-500 mb-2 font-semibold uppercase tracking-wider">Products ({shopProds.length})</p>
                        {shopProds.map((p) => (
                          <div key={p.id} className="flex items-center gap-3 py-1.5 px-2 rounded-lg hover:bg-surface-hover transition-colors">
                            {p.image ? (
                              <img src={p.image} alt={p.name} className="w-8 h-8 rounded object-cover flex-shrink-0" />
                            ) : (
                              <div className="w-8 h-8 rounded bg-surface-border flex items-center justify-center flex-shrink-0">
                                <Package size={12} className="text-slate-600" />
                              </div>
                            )}
                            <span className="flex-1 text-xs text-slate-300 truncate">{p.name}</span>
                            {p.price && <span className="text-xs text-brand-400 font-mono">${p.price}</span>}
                            {p.affiliateLink && (
                              <ExternalLink size={11} className="text-emerald-500" title="Has affiliate link" />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Modals */}
      {shopForm && (
        <ShopForm
          shop={shopForm !== 'new' ? shopForm : undefined}
          onSave={handleSaveShop}
          onClose={() => setShopForm(null)}
        />
      )}

      {productShopId && (
        <ProductForm
          defaultShopId={productShopId}
          onSave={(data) => { addProduct(data); setProductShopId(null) }}
          onClose={() => setProductShopId(null)}
        />
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm glass-bright rounded-2xl p-6 shadow-2xl animate-scale-in">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4 mx-auto">
              <Trash2 size={20} className="text-red-400" />
            </div>
            <h3 className="font-display font-bold text-lg text-white text-center mb-2">Delete Shop?</h3>
            <p className="text-sm text-slate-400 text-center mb-1">
              Are you sure you want to delete <strong className="text-white">"{deleteConfirm.name}"</strong>?
            </p>
            {deleteConfirm.productCount > 0 && (
              <p className="text-xs text-red-400 text-center mb-4">
                This will also delete {deleteConfirm.productCount} product{deleteConfirm.productCount !== 1 ? 's' : ''}.
              </p>
            )}
            <div className="flex gap-3 mt-5">
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