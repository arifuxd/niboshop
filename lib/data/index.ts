/**
 * Data access layer. Every page reads data through these functions only,
 * so replacing the seed files with a database means editing this file alone.
 */
import { categories } from './categories'
import { products } from './products'
import { buildReviews } from './reviews'
import { customers, orders, revenueByMonth, currentCustomerId } from './orders'
import type { Customer, CustomerStatus, Order, OrderStatus, Product } from './types'

export * from './types'
export { heroBanners, sideBanners } from './banners'

export async function getCategories() {
  return categories
}

export async function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug)
}

export async function getProducts(opts: { categorySlug?: string } = {}) {
  return opts.categorySlug
    ? products.filter((p) => p.categorySlug === opts.categorySlug)
    : products
}

export async function getFeaturedProducts() {
  return products.filter((p) => p.isFeatured)
}

export async function getNewProducts() {
  return products.filter((p) => p.isNew)
}

export async function getProduct(slug: string) {
  return products.find((p) => p.slug === slug)
}

export async function getRelatedProducts(product: Product, limit = 4) {
  return products
    .filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id)
    .concat(products.filter((p) => p.categorySlug !== product.categorySlug))
    .slice(0, limit)
}

export async function getReviews(productId: string) {
  return buildReviews(productId)
}

export async function searchProducts(query: string, limit = 6) {
  const q = query.trim().toLowerCase()
  if (q.length < 3) return []
  return products
    .filter((p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q))
    .slice(0, limit)
}

export async function getOrders() {
  return orders
}

export async function getOrder(id: string) {
  return orders.find((o) => o.id === id)
}

export async function getCustomers() {
  return customers
}

export async function getRevenueByMonth() {
  return revenueByMonth
}

export async function getCurrentCustomer() {
  return customers.find((c) => c.id === currentCustomerId)!
}

export async function getCustomerOrders(customerId = currentCustomerId) {
  return orders.filter((o) => o.customerId === customerId)
}

/**
 * Mutations. These write to the in-memory seed arrays, so changes last until the
 * server restarts. Replace the bodies with database writes when persistence is added.
 */
export type NewProductInput = Pick<
  Product,
  'name' | 'brand' | 'categorySlug' | 'price' | 'stock' | 'image' | 'images' | 'description' | 'highlights'
> &
  Partial<Pick<Product, 'comparePrice' | 'isNew' | 'isFeatured'>>

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function createProduct(input: NewProductInput) {
  const base = slugify(input.name) || 'product'
  let slug = base
  for (let n = 2; products.some((p) => p.slug === slug); n++) slug = `${base}-${n}`
  const product: Product = {
    ...input,
    id: `p-${crypto.randomUUID().slice(0, 8)}`,
    slug,
    images: input.images,
    rating: 0,
    reviewCount: 0,
  }
  products.unshift(product)
  return product
}

export async function deleteProduct(id: string) {
  const i = products.findIndex((p) => p.id === id)
  if (i >= 0) products.splice(i, 1)
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  const order = orders.find((o) => o.id === id)
  if (order) order.status = status
  return order
}

export async function getCustomer(id: string) {
  return customers.find((c) => c.id === id)
}

export type CustomerInput = Pick<Customer, 'name' | 'email' | 'phone' | 'city'>

export async function createCustomer(input: CustomerInput) {
  const customer: Customer = {
    ...input,
    id: `c-${crypto.randomUUID().slice(0, 8)}`,
    orders: 0,
    spent: 0,
    joined: new Date().toISOString().slice(0, 10),
    status: 'active',
  }
  customers.unshift(customer)
  return customer
}

export async function updateCustomer(id: string, patch: Partial<CustomerInput> & { status?: CustomerStatus }) {
  const customer = customers.find((c) => c.id === id)
  if (customer) Object.assign(customer, patch)
  return customer
}

export async function deleteCustomer(id: string) {
  const i = customers.findIndex((c) => c.id === id)
  if (i >= 0) customers.splice(i, 1)
}

export async function getOrdersByCustomer(customerId: string): Promise<Order[]> {
  return orders.filter((o) => o.customerId === customerId)
}
