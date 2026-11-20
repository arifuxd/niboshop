/**
 * Data access layer. Every page reads data through these functions only,
 * so replacing the seed files with a database means editing this file alone.
 */
import { categories } from './categories'
import { products } from './products'
import { buildReviews } from './reviews'
import { customers, orders, revenueByMonth, currentCustomerId } from './orders'
import { heroBanners, sideBanners } from './banners'
import type { Banner, Category, Customer, CustomerStatus, Order, OrderStatus, Product } from './types'

export * from './types'
export { heroBanners, sideBanners }

export type HomepageSection = {
  id: string
  title: string
  description: string
  productIds: string[]
}

export const homepageSections: HomepageSection[] = [
  { id: 'featured', title: 'Featured Products', description: 'Hand-picked bestsellers from our stores', productIds: products.filter((product) => product.isFeatured).slice(0, 10).map((product) => product.id) },
  { id: 'new-arrivals', title: 'New Arrivals', description: 'Fresh in stock this week', productIds: products.filter((product) => product.isNew).slice(0, 5).map((product) => product.id) },
]

export async function updateHomepageBanners(input: { hero: Banner[]; side: Banner[] }) {
  heroBanners.splice(0, heroBanners.length, ...input.hero)
  sideBanners.splice(0, sideBanners.length, ...input.side)
}

export async function updateHomepageSections(sections: HomepageSection[]) {
  homepageSections.splice(0, homepageSections.length, ...sections)
}

export async function getCategories() {
  return categories
}

export async function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug)
}

export async function createCategory(input: Omit<Category, 'slug' | 'subcategories'>) {
  const base = slugify(input.name) || 'category'
  let slug = base
  for (let n = 2; categories.some((category) => category.slug === slug); n++) slug = `${base}-${n}`
  const category: Category = { ...input, slug, subcategories: [] }
  categories.push(category)
  return category
}

export async function updateCategory(slug: string, patch: Pick<Category, 'name' | 'description' | 'icon'>) {
  const category = categories.find((item) => item.slug === slug)
  if (category) Object.assign(category, patch)
  return category
}

export async function deleteCategory(slug: string) {
  if (products.some((product) => product.categorySlug === slug)) return false
  const index = categories.findIndex((category) => category.slug === slug)
  if (index < 0) return false
  categories.splice(index, 1)
  return true
}

export async function createSubcategory(categorySlug: string, name: string) {
  const category = categories.find((item) => item.slug === categorySlug)
  if (!category) return undefined
  const base = slugify(name) || 'subcategory'
  let slug = base
  for (let n = 2; category.subcategories.some((subcategory) => subcategory.slug === slug); n++) slug = `${base}-${n}`
  category.subcategories.push({ name, slug })
  return category
}

export async function getProducts(opts: { categorySlug?: string; subcategorySlug?: string } = {}) {
  return products.filter((product) => {
    if (opts.categorySlug && product.categorySlug !== opts.categorySlug) return false
    if (opts.subcategorySlug && product.subcategorySlug !== opts.subcategorySlug) return false
    return true
  })
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
  'name' | 'brand' | 'categorySlug' | 'subcategorySlug' | 'price' | 'stock' | 'image' | 'images' | 'description' | 'highlights'
> &
  Partial<Pick<Product, 'comparePrice' | 'isNew' | 'isFeatured' | 'freeShipping'>>

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

export async function updateProduct(id: string, input: NewProductInput) {
  const product = products.find((item) => item.id === id)
  if (!product) return undefined
  Object.assign(product, input)
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
