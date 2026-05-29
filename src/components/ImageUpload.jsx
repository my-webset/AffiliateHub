import { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'

export default function ImageUpload({ value, onChange, label = 'Image', aspectRatio = 'video' }) {
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef(null)

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be under 5MB')
      return
    }
    const reader = new FileReader()
    reader.onloadend = () => onChange(reader.result)
    reader.readAsDataURL(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    handleFile(file)
  }

  const handleChange = (e) => {
    const file = e.target.files[0]
    handleFile(file)
  }

  const clear = (e) => {
    e.stopPropagation()
    onChange('')
    if (inputRef.current) inputRef.current.value = ''
  }

  const aspectClass = {
    video: 'aspect-video',
    square: 'aspect-square',
    wide: 'aspect-[3/1]',
  }[aspectRatio] || 'aspect-video'

  return (
    <div>
      {label && <label className="input-label">{label}</label>}

      <div
        onClick={() => !value && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`relative ${aspectClass} rounded-xl overflow-hidden border-2 border-dashed transition-all duration-200 cursor-pointer ${
          dragging
            ? 'border-brand-400 bg-brand-500/10'
            : value
            ? 'border-surface-border cursor-default'
            : 'border-surface-border hover:border-brand-500/50 hover:bg-surface-hover'
        }`}
      >
        {value ? (
          <>
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur text-white text-xs font-semibold border border-white/20 hover:bg-white/20 transition-all"
              >
                Change
              </button>
              <button
                type="button"
                onClick={clear}
                className="p-1.5 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-all"
              >
                <X size={14} />
              </button>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-slate-500">
            <div className="w-12 h-12 rounded-xl bg-surface-card border border-surface-border flex items-center justify-center">
              {dragging ? (
                <Upload size={20} className="text-brand-400" />
              ) : (
                <ImageIcon size={20} />
              )}
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold text-slate-400">
                {dragging ? 'Drop to upload' : 'Click or drag image'}
              </p>
              <p className="text-xs text-slate-600 mt-0.5">PNG, JPG up to 5MB</p>
            </div>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />
      </div>

      {/* URL fallback */}
      <div className="mt-2">
        <input
          type="url"
          placeholder="Or paste an image URL…"
          value={value && !value.startsWith('data:') ? value : ''}
          onChange={(e) => onChange(e.target.value)}
          className="input-field text-xs py-2"
        />
      </div>
    </div>
  )
}