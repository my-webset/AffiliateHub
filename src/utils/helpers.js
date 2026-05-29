export const CATEGORIES = [
  'All',
  'Electronics',
  'Fashion',
  'Beauty',
  'Health',
  'Home & Garden',
  'Sports',
  'Books',
  'Food & Drink',
  'Software',
  'Travel',
  'Finance',
  'Gaming',
  'Automotive',
  'Pets',
  'Other',
]

export const CATEGORY_COLORS = {
  Electronics: 'badge-brand',
  Fashion: 'badge-purple',
  Beauty: 'badge-amber',
  Health: 'badge-green',
  'Home & Garden': 'badge-brand',
  Sports: 'badge-green',
  Books: 'badge-purple',
  'Food & Drink': 'badge-amber',
  Software: 'badge-brand',
  Travel: 'badge-purple',
  Finance: 'badge-green',
  Gaming: 'badge-brand',
  Automotive: 'badge-amber',
  Pets: 'badge-green',
  Other: 'badge-purple',
}

export const getCategoryColor = (category) =>
  CATEGORY_COLORS[category] || 'badge-brand'

export const truncate = (str, len = 80) =>
  str && str.length > len ? str.slice(0, len) + '…' : str

export const formatDate = (iso) => {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export const formatPrice = (price, currency = 'USD') => {
  const num = parseFloat(price)
  if (isNaN(num)) return ''
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num)
}

export const slugify = (str) =>
  str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

export const generatePlaceholderImage = (text, size = 400) => {
  const hue = [...text].reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(text)}&size=${size}&background=${hue.toString(16).padStart(6, '0')}&color=ffffff&bold=true&format=svg`
}