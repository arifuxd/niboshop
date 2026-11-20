'use client'

import * as React from 'react'
import { siteConfig } from './site-config'
import type { Product } from './data/types'

export type CartItem = {
  productId: string
  slug: string
  name: string
  image: string
  price: number
  comparePrice?: number
  quantity: number
}

type CartContextValue = {
  items: CartItem[]
  count: number
  subtotal: number
  discount: number
  delivery: number
  total: number
  isOpen: boolean
  setOpen: (open: boolean) => void
  addItem: (product: Product, quantity?: number, openCart?: boolean) => void
  setQuantity: (productId: string, quantity: number) => void
  removeItem: (productId: string) => void
  clear: () => void
}

const CartContext = React.createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<CartItem[]>([])
  const [isOpen, setOpen] = React.useState(false)

  const addItem = React.useCallback(
    (product: Product, quantity = 1, openCart = true) => {
      setItems((prev) => {
        const existing = prev.find((i) => i.productId === product.id)
        if (existing) {
          return prev.map((i) =>
            i.productId === product.id
              ? { ...i, quantity: Math.min(i.quantity + quantity, product.stock) }
              : i,
          )
        }
        return [
          ...prev,
          {
            productId: product.id,
            slug: product.slug,
            name: product.name,
            image: product.image,
            price: product.price,
            comparePrice: product.comparePrice,
            quantity: Math.min(quantity, product.stock),
          },
        ]
      })
      if (openCart) setOpen(true)
    },
    [],
  )

  const setQuantity = React.useCallback((productId: string, quantity: number) => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((i) => i.productId !== productId)
        : prev.map((i) => (i.productId === productId ? { ...i, quantity } : i)),
    )
  }, [])

  const removeItem = React.useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId))
  }, [])

  const clear = React.useCallback(() => setItems([]), [])

  const value = React.useMemo<CartContextValue>(() => {
    const count = items.reduce((s, i) => s + i.quantity, 0)
    const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)
    const discount = items.reduce(
      (s, i) => s + Math.max(0, (i.comparePrice ?? i.price) - i.price) * i.quantity,
      0,
    )
    const delivery =
      items.length === 0 || subtotal >= siteConfig.freeShippingThreshold
        ? 0
        : siteConfig.deliveryCharge.insideDhaka
    return {
      items,
      count,
      subtotal,
      discount,
      delivery,
      total: subtotal + delivery,
      isOpen,
      setOpen,
      addItem,
      setQuantity,
      removeItem,
      clear,
    }
  }, [items, isOpen, addItem, setQuantity, removeItem, clear])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = React.useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
