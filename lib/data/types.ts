export type Subcategory = {
  slug: string
  name: string
}

export type Category = {
  slug: string
  name: string
  icon: string
  description: string
  subcategories: Subcategory[]
}

export type Product = {
  id: string
  slug: string
  name: string
  brand: string
  categorySlug: string
  subcategorySlug?: string
  price: number
  comparePrice?: number
  image: string
  images: string[]
  stock: number
  rating: number
  reviewCount: number
  highlights: string[]
  description: string
  isNew?: boolean
  isFeatured?: boolean
}

export type Review = {
  id: string
  productId: string
  author: string
  rating: number
  date: string
  title: string
  body: string
  verified: boolean
}

export type Banner = {
  id: string
  image: string
  alt: string
  href: string
}

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'

export type OrderItem = {
  productId: string
  name: string
  image: string
  price: number
  quantity: number
}

export type Order = {
  id: string
  customerId: string
  customerName: string
  date: string
  status: OrderStatus
  payment: 'Cash on Delivery' | 'bKash' | 'Card'
  items: OrderItem[]
  total: number
}

export type CustomerStatus = 'active' | 'blocked'

export type Customer = {
  id: string
  name: string
  email: string
  phone: string
  city: string
  orders: number
  spent: number
  joined: string
  status: CustomerStatus
}
