import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../utils/supabase'

const DataContext = createContext(null)

export function DataProvider({ children }) {
  const [shops, setShops] = useState([])
  const [products, setProducts] = useState([])

  const fetchAll = useCallback(async () => {
    if (!supabase) {
      console.error('Supabase client is not configured. Check your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY values in .env.')
      return
    }

    try {
      const [{ data: s }, { data: p }] = await Promise.all([
        supabase.from('shops').select('*').order('created_at', { ascending: false }),
        supabase.from('products').select('*').order('created_at', { ascending: false }),
      ])

      setShops((s || []).map(shop => ({
        ...shop,
        createdAt: shop.created_at || shop.createdAt,
        updatedAt: shop.updated_at || shop.updatedAt,
      })))

      setProducts(
        (p || []).map(prod => ({
          ...prod,
          shopId: prod.shop_id ?? prod.shopId,
          affiliateLink: prod.affiliate_link ?? prod.affiliateLink,
          createdAt: prod.created_at || prod.createdAt,
          updatedAt: prod.updated_at || prod.updatedAt,
        }))
      )
    } catch (error) {
      console.error('Failed to load Supabase data:', error)
    }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  const addShop = async (data) => {
    if (!supabase) {
      throw new Error('Supabase client is not configured. Update your .env file first.')
    }

    try {
      const { data: s, error } = await supabase.from('shops').insert([data]).select().single()
      if (error) throw error
      await fetchAll()
      return s
    } catch (error) {
      console.error('Failed to add shop:', error)
      throw error
    }
  }

  const editShop = async (id, data) => {
    if (!supabase) {
      throw new Error('Supabase client is not configured. Update your .env file first.')
    }

    try {
      const { error } = await supabase.from('shops')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', id)
      if (error) throw error
      await fetchAll()
    } catch (error) {
      console.error('Failed to update shop:', error)
      throw error
    }
  }

  const removeShop = async (id) => {
    if (!supabase) {
      throw new Error('Supabase client is not configured. Update your .env file first.')
    }

    try {
      const { error } = await supabase.from('shops').delete().eq('id', id)
      if (error) throw error
      await fetchAll()
    } catch (error) {
      console.error('Failed to remove shop:', error)
      throw error
    }
  }

  const addProduct = async (data) => {
    if (!supabase) {
      throw new Error('Supabase client is not configured. Update your .env file first.')
    }

    try {
      const { shopId, affiliateLink, ...rest } = data
      const { data: p, error } = await supabase.from('products')
        .insert([{ ...rest, shop_id: shopId, affiliate_link: affiliateLink }])
        .select().single()
      if (error) throw error
      await fetchAll()
      return p
    } catch (error) {
      console.error('Failed to add product:', error)
      throw error
    }
  }

  const editProduct = async (id, data) => {
    if (!supabase) {
      throw new Error('Supabase client is not configured. Update your .env file first.')
    }

    try {
      const { shopId, affiliateLink, ...rest } = data
      const { error } = await supabase.from('products')
        .update({ ...rest, shop_id: shopId, affiliate_link: affiliateLink, updated_at: new Date().toISOString() })
        .eq('id', id)
      if (error) throw error
      await fetchAll()
    } catch (error) {
      console.error('Failed to update product:', error)
      throw error
    }
  }

  const removeProduct = async (id) => {
    if (!supabase) {
      throw new Error('Supabase client is not configured. Update your .env file first.')
    }

    try {
      const { error } = await supabase.from('products').delete().eq('id', id)
      if (error) throw error
      await fetchAll()
    } catch (error) {
      console.error('Failed to remove product:', error)
      throw error
    }
  }

  const getShop = (id) => shops.find(s => s.id === id) || null
  const getProduct = (id) => products.find(p => p.id === id) || null
  const getShopProducts = (shopId) => products.filter(p => p.shopId === shopId)

  return (
    <DataContext.Provider value={{
      shops, products,
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