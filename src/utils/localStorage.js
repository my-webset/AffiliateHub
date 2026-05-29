// Keys
export const KEYS = {
  SHOPS: 'affiliateHub_shops',
  PRODUCTS: 'affiliateHub_products',
  AUTH: 'affiliateHub_auth',
}

// Generic helpers
export const getItem = (key, fallback = null) => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : fallback
  } catch {
    return fallback
  }
}

export const setItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export const removeItem = (key) => {
  try {
    localStorage.removeItem(key)
    return true
  } catch {
    return false
  }
}

// Shops
export const getShops = () => getItem(KEYS.SHOPS, [])
export const setShops = (shops) => setItem(KEYS.SHOPS, shops)

export const createShop = (shopData) => {
  const shops = getShops()
  const newShop = {
    ...shopData,
    id: `shop_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  setShops([...shops, newShop])
  return newShop
}

export const updateShop = (id, updates) => {
  const shops = getShops()
  const updated = shops.map((s) =>
    s.id === id ? { ...s, ...updates, updatedAt: new Date().toISOString() } : s
  )
  setShops(updated)
  return updated.find((s) => s.id === id)
}

export const deleteShop = (id) => {
  const shops = getShops()
  setShops(shops.filter((s) => s.id !== id))
  // Also delete products belonging to this shop
  const products = getProducts()
  setProducts(products.filter((p) => p.shopId !== id))
}

export const getShopById = (id) => getShops().find((s) => s.id === id) || null

// Products
export const getProducts = () => getItem(KEYS.PRODUCTS, [])
export const setProducts = (products) => setItem(KEYS.PRODUCTS, products)

export const getProductsByShop = (shopId) =>
  getProducts().filter((p) => p.shopId === shopId)

export const createProduct = (productData) => {
  const products = getProducts()
  const newProduct = {
    ...productData,
    id: `prod_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  setProducts([...products, newProduct])
  return newProduct
}

export const updateProduct = (id, updates) => {
  const products = getProducts()
  const updated = products.map((p) =>
    p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
  )
  setProducts(updated)
  return updated.find((p) => p.id === id)
}

export const deleteProduct = (id) => {
  const products = getProducts()
  setProducts(products.filter((p) => p.id !== id))
}

export const getProductById = (id) => getProducts().find((p) => p.id === id) || null