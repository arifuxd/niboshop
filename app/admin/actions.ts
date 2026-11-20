'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import {
  createCategory,
  updateCategory,
  deleteCategory,
  updateProduct,
  createCustomer,
  createProduct,
  createSubcategory,
  deleteCustomer,
  deleteProduct,
  getCategory,
  updateCustomer,
  updateOrderStatus,
  updateHomepageBanners,
  updateHomepageSections,
  getProducts,
  saveSettings,
  type Banner,
  type CustomerStatus,
  type OrderStatus,
} from '@/lib/data'

export type FormState = {
  error?: string
  success?: string
  fieldErrors?: Record<string, string>
}

const orderStatuses: OrderStatus[] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']

const text = (data: FormData, key: string) => String(data.get(key) ?? '').trim()

export async function saveStoreSettingsAction(_prev: FormState, data: FormData): Promise<FormState> {
  const address = text(data, 'address')
  const phone = text(data, 'phone')
  const email = text(data, 'email')
  const hours = text(data, 'hours')
  const logoUrl = text(data, 'logoUrl')
  const insideDhakaCharge = Number(text(data, 'insideDhakaCharge'))
  const outsideDhakaCharge = Number(text(data, 'outsideDhakaCharge'))
  const freeShippingThreshold = Number(text(data, 'freeShippingThreshold'))
  const validLogo = logoUrl.startsWith('/') || logoUrl.startsWith('https://') || logoUrl.startsWith('http://')
  if (!address || address.length > 200 || !phone || phone.length > 30 || !/^\S+@\S+\.\S+$/.test(email) || email.length > 254 || !hours || hours.length > 100 || !validLogo || [insideDhakaCharge, outsideDhakaCharge, freeShippingThreshold].some((amount) => !Number.isSafeInteger(amount) || amount < 0)) {
    return { error: 'Check the store details and enter valid non-negative whole-number delivery amounts.' }
  }
  await saveSettings({ logoUrl, address, phone, email, hours, insideDhakaCharge, outsideDhakaCharge, freeShippingThreshold })
  revalidatePath('/', 'layout')
  return { success: 'Store settings saved.' }
}

export async function createCategoryAction(data: FormData) {
  const name = text(data, 'name')
  const description = text(data, 'description')
  const requestedIcon = text(data, 'icon')
  const validIcon = /^[a-z0-9-]+$/.test(requestedIcon) || requestedIcon.startsWith('https://') || requestedIcon.startsWith('http://') || requestedIcon.startsWith('/')
  if (name.length < 2 || description.length < 3 || !validIcon || requestedIcon.length > 500) redirect('/admin/categories?status=error')

  await createCategory({
    name,
    description,
    icon: requestedIcon,
  })
  revalidatePath('/', 'layout')
  redirect('/admin/categories?status=category-added')
}

export async function updateCategoryAction(data: FormData) {
  const slug = text(data, 'slug')
  const name = text(data, 'name')
  const description = text(data, 'description')
  const icon = text(data, 'icon')
  if (!slug || name.length < 2 || description.length < 3 || icon.length > 500 || !/^[a-z0-9-]+$/.test(icon) && !icon.startsWith('https://') && !icon.startsWith('http://') && !icon.startsWith('/')) {
    redirect('/admin/categories?status=error')
  }
  await updateCategory(slug, { name, description, icon })
  revalidatePath('/', 'layout')
  redirect('/admin/categories?status=category-updated')
}

export async function deleteCategoryAction(slug: string) {
  const deleted = await deleteCategory(slug)
  revalidatePath('/', 'layout')
  redirect(`/admin/categories?status=${deleted ? 'category-deleted' : 'category-in-use'}`)
}

export async function createSubcategoryAction(data: FormData) {
  const categorySlug = text(data, 'categorySlug')
  const name = text(data, 'name')
  if (name.length < 2 || !(await createSubcategory(categorySlug, name))) {
    redirect('/admin/categories?status=error')
  }
  revalidatePath('/', 'layout')
  redirect('/admin/categories?status=subcategory-added')
}

export async function saveHomepageSettingsAction(data: FormData) {
  const validDestination = (value: string) => {
    if (value.startsWith('/') && !value.startsWith('//')) return true
    try {
      return new URL(value).protocol === 'https:'
    } catch {
      return false
    }
  }
  const validAsset = (value: string) => value.startsWith('/') || value.startsWith('https://') || value.startsWith('http://')
  const readBanners = (prefix: string, count: number): Banner[] =>
    Array.from({ length: count }, (_, index) => ({
      id: text(data, `${prefix}-${index}-id`),
      image: text(data, `${prefix}-${index}-image`),
      alt: text(data, `${prefix}-${index}-alt`),
      href: text(data, `${prefix}-${index}-href`),
    }))
  const heroCount = Number(text(data, 'hero-count'))
  const sideCount = Number(text(data, 'side-count'))
  const hero = readBanners('hero', heroCount)
  const side = readBanners('side', sideCount)
  if (!Number.isInteger(heroCount) || heroCount < 1 || heroCount > 8 || sideCount !== 2 ||
    [...hero, ...side].some((banner) => !banner.id || !validAsset(banner.image) || banner.alt.length > 160 || !validDestination(banner.href))) {
    redirect('/admin/homepage?status=error')
  }

  const sectionCount = Number(text(data, 'section-count'))
  if (!Number.isInteger(sectionCount) || sectionCount < 1 || sectionCount > 8) redirect('/admin/homepage?status=error')
  const availableProducts = await getProducts()
  const sections = Array.from({ length: sectionCount }, (_, index) => {
    const id = text(data, `section-${index}-id`)
    const title = text(data, `section-${index}-title`)
    const description = text(data, `section-${index}-description`)
    const productIds = data.getAll(`section-${index}-product`).map(String)
    return { id, title, description, productIds }
  })
  if (sections.some((section) => !section.id || !section.title || section.title.length > 80 || section.description.length > 160 ||
    section.productIds.length > availableProducts.length || new Set(section.productIds).size !== section.productIds.length || section.productIds.some((id) => !availableProducts.some((product) => product.id === id)))) {
    redirect('/admin/homepage?status=error')
  }
  await updateHomepageBanners({ hero, side })
  await updateHomepageSections(sections)
  revalidatePath('/', 'layout')
  revalidatePath('/admin/homepage')
  redirect('/admin/homepage?status=saved')
}

export async function createProductAction(_prev: FormState, data: FormData): Promise<FormState> {
  const fieldErrors: Record<string, string> = {}
  const name = text(data, 'name')
  const brand = text(data, 'brand')
  const categorySlug = text(data, 'categorySlug')
  const subcategorySlug = text(data, 'subcategorySlug')
  const price = Number(text(data, 'price'))
  const comparePriceRaw = text(data, 'comparePrice')
  const comparePrice = comparePriceRaw ? Number(comparePriceRaw) : undefined
  const stock = Number(text(data, 'stock'))
  const image = text(data, 'image')
  let images: string[] = []
  try {
    const parsed = JSON.parse(text(data, 'images'))
    if (Array.isArray(parsed) && parsed.every((src) => typeof src === 'string')) images = parsed
  } catch {
    fieldErrors.image = 'Upload product images.'
  }
  const description = text(data, 'description')
  const highlights = text(data, 'highlights')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)

  if (name.length < 3) fieldErrors.name = 'Enter a product name (at least 3 characters).'
  if (!brand) fieldErrors.brand = 'Enter a brand.'
  const category = await getCategory(categorySlug)
  if (!category) fieldErrors.categorySlug = 'Choose a category.'
  if (subcategorySlug && !category?.subcategories.some((subcategory) => subcategory.slug === subcategorySlug)) {
    fieldErrors.subcategorySlug = 'Choose a subcategory from the selected category.'
  }
  if (!Number.isFinite(price) || price <= 0) fieldErrors.price = 'Enter a price greater than 0.'
  if (comparePrice !== undefined && (!Number.isFinite(comparePrice) || comparePrice <= price))
    fieldErrors.comparePrice = 'Regular price must be higher than the sale price.'
  if (!Number.isInteger(stock) || stock < 0) fieldErrors.stock = 'Enter a whole number, 0 or more.'
  if (images.length < 1 || images.length > 6 || images[0] !== image || images.some((src) => !(src.startsWith('https://') || src.startsWith('http://') || src.startsWith('/'))))
    fieldErrors.image = 'Upload 1 to 6 valid product images and choose a main image.'
  if (description.length < 10) fieldErrors.description = 'Write a short description.'

  if (Object.keys(fieldErrors).length > 0) {
    return { error: 'Please fix the highlighted fields.', fieldErrors }
  }

  await createProduct({
    name,
    brand,
    categorySlug,
    subcategorySlug: subcategorySlug || undefined,
    price,
    comparePrice,
    stock,
    image,
    images,
    description,
    highlights,
    isNew: data.get('isNew') === 'on',
    isFeatured: data.get('isFeatured') === 'on',
    freeShipping: data.get('freeShipping') === 'on',
  })
  revalidatePath('/', 'layout')
  redirect('/admin/products')
}

export async function updateProductAction(id: string, _prev: FormState, data: FormData): Promise<FormState> {
  const name = text(data, 'name')
  const brand = text(data, 'brand')
  const categorySlug = text(data, 'categorySlug')
  const subcategorySlug = text(data, 'subcategorySlug')
  const price = Number(text(data, 'price'))
  const compareRaw = text(data, 'comparePrice')
  const comparePrice = compareRaw ? Number(compareRaw) : undefined
  const stock = Number(text(data, 'stock'))
  const description = text(data, 'description')
  const highlights = text(data, 'highlights').split('\n').map((line) => line.trim()).filter(Boolean)
  let images: string[] = []
  try {
    const parsed: unknown = JSON.parse(text(data, 'images'))
    if (Array.isArray(parsed) && parsed.every((src) => typeof src === 'string' && (src.startsWith('https://') || src.startsWith('http://') || src.startsWith('/')))) images = parsed
  } catch {}
  const category = await getCategory(categorySlug)
  const fieldErrors: Record<string, string> = {}
  if (name.length < 3) fieldErrors.name = 'Enter a product name (at least 3 characters).'
  if (!brand) fieldErrors.brand = 'Enter a brand.'
  if (!category) fieldErrors.categorySlug = 'Choose a category.'
  if (subcategorySlug && !category?.subcategories.some((subcategory) => subcategory.slug === subcategorySlug)) fieldErrors.subcategorySlug = 'Choose a valid subcategory.'
  if (!Number.isFinite(price) || price <= 0) fieldErrors.price = 'Enter a price greater than 0.'
  if (comparePrice !== undefined && (!Number.isFinite(comparePrice) || comparePrice <= price)) fieldErrors.comparePrice = 'Regular price must be higher than sale price.'
  if (!Number.isInteger(stock) || stock < 0) fieldErrors.stock = 'Enter a whole number, 0 or more.'
  if (images.length < 1 || images.length > 6) fieldErrors.image = 'Keep 1 to 6 valid product images.'
  if (description.length < 10) fieldErrors.description = 'Write a short description.'
  if (Object.keys(fieldErrors).length) return { error: 'Please fix the highlighted fields.', fieldErrors }
  const product = await updateProduct(id, {
    name, brand, categorySlug, subcategorySlug: subcategorySlug || undefined, price, comparePrice, stock,
    image: images[0], images, description, highlights,
    isNew: data.get('isNew') === 'on', isFeatured: data.get('isFeatured') === 'on', freeShipping: data.get('freeShipping') === 'on',
  })
  if (!product) return { error: 'Product not found.' }
  revalidatePath('/', 'layout')
  revalidatePath(`/product/${product.slug}`)
  redirect('/admin/products')
}

export async function deleteProductAction(id: string) {
  await deleteProduct(id)
  revalidatePath('/', 'layout')
}

export async function updateOrderStatusAction(id: string, status: string): Promise<FormState> {
  if (!orderStatuses.includes(status as OrderStatus)) return { error: 'Invalid status.' }
  await updateOrderStatus(id, status as OrderStatus)
  revalidatePath('/admin', 'layout')
  revalidatePath('/account', 'layout')
  return { success: `Order marked as ${status}.` }
}

function readCustomer(data: FormData) {
  const fieldErrors: Record<string, string> = {}
  const name = text(data, 'name')
  const email = text(data, 'email')
  const phone = text(data, 'phone')
  const city = text(data, 'city')
  if (name.length < 2) fieldErrors.name = 'Enter the customer name.'
  if (!/^\S+@\S+\.\S+$/.test(email)) fieldErrors.email = 'Enter a valid email address.'
  if (phone.length < 6) fieldErrors.phone = 'Enter a phone number.'
  if (!city) fieldErrors.city = 'Enter a city.'
  return { fieldErrors, value: { name, email, phone, city } }
}

export async function createCustomerAction(_prev: FormState, data: FormData): Promise<FormState> {
  const { fieldErrors, value } = readCustomer(data)
  if (Object.keys(fieldErrors).length > 0) {
    return { error: 'Please fix the highlighted fields.', fieldErrors }
  }
  const customer = await createCustomer(value)
  revalidatePath('/admin', 'layout')
  redirect(`/admin/customers/${customer.id}`)
}

export async function updateCustomerAction(
  id: string,
  _prev: FormState,
  data: FormData,
): Promise<FormState> {
  const { fieldErrors, value } = readCustomer(data)
  if (Object.keys(fieldErrors).length > 0) {
    return { error: 'Please fix the highlighted fields.', fieldErrors }
  }
  await updateCustomer(id, value)
  revalidatePath('/admin', 'layout')
  return { success: 'Customer details saved.' }
}

export async function setCustomerStatusAction(id: string, status: CustomerStatus) {
  await updateCustomer(id, { status })
  revalidatePath('/admin', 'layout')
}

export async function deleteCustomerAction(id: string) {
  await deleteCustomer(id)
  revalidatePath('/admin', 'layout')
  redirect('/admin/customers')
}
