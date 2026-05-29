import { useState, useEffect } from 'react'
import { X, Store, Save } from 'lucide-react'
import { CATEGORIES } from '../utils/helpers'
import ImageUpload from '../components/ImageUpload'

const BLANK = { name: '', description: '', category: '', website: '', image: '' }

export default function ShopForm({ shop, onSave, onClose }) {
  const [form, setForm] = useState(shop ? { ...shop } : BLANK)
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
    if (!form.name.trim()) e.name = 'Shop name is required'
    return e
  }

  const handleSubmit = (ev) => {
    ev.preventDefault()
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    onSave(form)
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
            <Store size={17} className="text-brand-400" />
            <h2 className="font-display font-bold text-base text-white">
              {shop ? 'Edit Shop' : 'Create New Shop'}
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
            label="Shop Cover Image"
            value={form.image}
            onChange={(v) => set('image', v)}
            aspectRatio="video"
          />

          {/* Name */}
          <div>
            <label className="input-label">
              Shop Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="e.g. TechGadgets Pro"
              className={`input-field ${errors.name ? 'border-red-500/50 focus:border-red-500/70' : ''}`}
            />
            {errors.name && (
              <p className="text-xs text-red-400 mt-1">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="input-label">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="What does this shop sell?"
              rows={3}
              className="input-field resize-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="input-label">Category</label>
            <select
              value={form.category}
              onChange={(e) => set('category', e.target.value)}
              className="input-field"
            >
              <option value="">Select category…</option>
              {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Website */}
          <div>
            <label className="input-label">Website URL</label>
            <input
              type="url"
              value={form.website}
              onChange={(e) => set('website', e.target.value)}
              placeholder="https://example.com"
              className="input-field"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2 border-t border-surface-border">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1 justify-center">
              <Save size={14} />
              {shop ? 'Save Changes' : 'Create Shop'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}