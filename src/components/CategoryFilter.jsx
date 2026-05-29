import { CATEGORIES } from '../utils/helpers'

export default function CategoryFilter({ selected, onChange }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border ${
            selected === cat
              ? 'bg-brand-500 text-white border-brand-500 shadow-lg shadow-brand-900/40'
              : 'bg-surface-card border-surface-border text-slate-400 hover:border-brand-500/40 hover:text-slate-200'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}