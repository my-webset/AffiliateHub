import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../utils/supabase'

const DataContext = createContext(null)

export function DataProvider({ children }) {
  const [shops, setShops] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchAll = useCallback(async () => {
    try {
      // Cache se pehle dikhao
      const cachedShops = localStorage.getItem('cache_shops')
      const cachedProducts = localStorage.getItem('cache_products')
      const cacheTime = localStorage.getItem('cache_time')
      const isFresh = cacheTime && (Date.now() - parseInt(cacheTime)) < 60000 // 1 min

      if (cachedShops && cachedProducts) {
        setShops(JSON.parse(cachedShops))
        setProducts(JSON.parse(cachedProducts).map(mapProduct))
        setLoading(false)
        if (isFresh) return // Cache fresh hai toh Supabase call mat karo
      }

      // Background mein fresh data lo
      const [{ data: s }, { data: p }] = await Promise.all([
        supabase.from('shops').select('*').order('created_at', { ascending: false }),
        supabase.from('products').select('*').order('created_at', { ascending: false }),
      ])

      const freshShops = s || []
      const freshProducts = (p || []).map(mapProduct)

      setShops(freshShops)
      setProducts(freshProducts)
      setLoading(false)

      // Cache update karo
      localStorage.setItem('cache_shops', JSON.stringify(freshShops))
      localStorage.setItem('cache_products', JSON.stringify(p || []))
      localStorage.setItem('cache_time', Date.now().toString())

    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }, [])

  const mapProduct = (prod) => ({
    ...prod,
    shopId: prod.shop_id,
    affiliateLink: prod.affiliate_link,
  })

  useEffect(() => { fetchAll() }, [fetchAll])

  const addShop = async (data) => {
    const { data: s } = await supabase.from('shops').insert([data]).select().single()
    localStorage.removeItem('cache_time') // Cache invalidate
    await fetchAll()
    return s
  }

  const editShop = async (id, data) => {
    await supabase.from('shops').update({ ...data, updated_at: new Date().toISOString() }).eq('id', id)
    localStorage.removeItem('cache_time')
    await fetchAll()
  }

  const removeShop = async (id) => {
    await supabase.from('shops').delete().eq('id', id)
    localStorage.removeItem('cache_time')
    await fetchAll()
  }

  const addProduct = async (data) => {
    const { shopId, affiliateLink, ...rest } = data
    const { data: p } = await supabase.from('products')
      .insert([{ ...rest, shop_id: shopId, affiliate_link: affiliateLink }])
      .select().single()
    localStorage.removeItem('cache_time')
    await fetchAll()
    return p
  }

  const editProduct = async (id, data) => {
    const { shopId, affiliateLink, ...rest } = data
    await supabase.from('products')
      .update({ ...rest, shop_id: shopId, affiliate_link: affiliateLink, updated_at: new Date().toISOString() })
      .eq('id', id)
    localStorage.removeItem('cache_time')
    await fetchAll()
  }

  const removeProduct = async (id) => {
    await supabase.from('products').delete().eq('id', id)
    localStorage.removeItem('cache_time')
    await fetchAll()
  }

  const getShop = (id) => shops.find(s => s.id === id) || null
  const getProduct = (id) => products.find(p => p.id === id) || null
  const getShopProducts = (shopId) => products.filter(p => p.shopId === shopId)

  return (
    <DataContext.Provider value={{
      shops, products, loading,
      addShop, editShop, removeShop, getShop,
      addProduct, editProduct, removeProduct, getProduct,
      getShopProducts, refresh: fetchAll,
    }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}
