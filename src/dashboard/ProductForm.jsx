import { useState, useEffect } from 'react'
import { X, Package, Save } from 'lucide-react'
import { CATEGORIES } from '../utils/helpers'
import ImageUpload from '../components/ImageUpload'
import { useData } from '../context/DataContext'

const BLANK = {
  name: '', description: '', price: '', category: '',
  affiliateLink: '', image: '', shopId: '',
}

export default function ProductForm({ product, defaultShopId, onSave, onClose }) {
  const { shops } = useData()
  const [form, setForm] = useState(
    product
      ? { ...product }
      : { ...BLANK, shopId: defaultShopId || (shops[0]?.id || '') }
  )
  const [errors, setErrors] = useState({})

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }))
    if (errors[k]) setErrors((e) => ({ ...e, [k]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Product name is required'
    if (!form.shopId) e.shopId = 'Please select a shop'
    if (form.affiliateLink && !/^https?:\/\//.test(form.affiliateLink)) {
      e.affiliateLink = 'Must be a valid URL starting with http(s)://'
    }
    if (form.price && isNaN(parseFloat(form.price))) {
      e.price = 'Must be a valid number'
    }
    return e
  }

  const handleSubmit = (ev) => {
    ev.preventDefault()
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    onSave({ ...form, price: form.price ? String(form.price) : '' })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-full max-w-lg glass-bright rounded-2xl shadow-2xl shadow-black/60 animate-scale-in max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-border">
          <div className="flex items-center gap-2">
            <Package size={17} className="text-brand-400" />
            <h2 className="font-display font-bold text-base text-white">
              {product ? 'Edit Product' : 'Add New Product'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-surface-hover transition-all"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          {/* Image */}
          <ImageUpload
            label="Product Image"
            value={form.image}
            onChange={(v) => set('image', v)}
            aspectRatio="video"
          />

          {/* Shop selector */}
          <div>
            <label className="input-label">
              Shop <span className="text-red-400">*</span>
            </label>
            {shops.length === 0 ? (
              <div className="input-field text-slate-500 text-xs flex items-center">
                No shops available — create a shop first
              </div>
            ) : (
              <select
                value={form.shopId}
                onChange={(e) => set('shopId', e.target.value)}
                className={`input-field ${errors.shopId ? 'border-red-500/50' : ''}`}
              >
                <option value="">Select shop…</option>
                {shops.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            )}
            {errors.shopId && <p className="text-xs text-red-400 mt-1">{errors.shopId}</p>}
          </div>

          {/* Name */}
          <div>
            <label className="input-label">
              Product Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="e.g. Wireless Noise-Cancelling Headphones"
              className={`input-field ${errors.name ? 'border-red-500/50' : ''}`}
            />
            {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="input-label">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Describe the product…"
              rows={3}
              className="input-field resize-none"
            />
          </div>

          {/* Price + Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="input-label">Price (USD)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => set('price', e.target.value)}
                placeholder="0.00"
                className={`input-field ${errors.price ? 'border-red-500/50' : ''}`}
              />
              {errors.price && <p className="text-xs text-red-400 mt-1">{errors.price}</p>}
            </div>
            <div>
              <label className="input-label">Category</label>
              <select
                value={form.category}
                onChange={(e) => set('category', e.target.value)}
                className="input-field"
              >
                <option value="">Select…</option>
                {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Affiliate link */}
          <div>
            <label className="input-label">Affiliate Link</label>
            <input
              type="url"
              value={form.affiliateLink}
              onChange={(e) => set('affiliateLink', e.target.value)}
              placeholder="https://affiliate.example.com/product?ref=your-id"
              className={`input-field ${errors.affiliateLink ? 'border-red-500/50' : ''}`}
            />
            {errors.affiliateLink && (
              <p className="text-xs text-red-400 mt-1">{errors.affiliateLink}</p>
            )}
            <p className="text-xs text-slate-600 mt-1">This link opens in a new tab for visitors</p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2 border-t border-surface-border">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">
              Cancel
            </button>
            <button
              type="submit"
              disabled={shops.length === 0}
              className="btn-primary flex-1 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={14} />
              {product ? 'Save Changes' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}