'use server'

import { revalidatePath } from 'next/cache'
import { updateStoreSettings } from '@/lib/store-settings'
import { redirect } from 'next/navigation'
import {
  createCategory,
  createCustomer,
  createProduct,
  createSubcategory,
  deleteCustomer,
  deleteProduct,
  getCategory,
  updateCustomer,
  updateOrderStatus,
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
  const validLogo = logoUrl.startsWith('/') || logoUrl.startsWith('https://')
  if (!address || address.length > 200 || !phone || phone.length > 30 || !/^\S+@\S+\.\S+$/.test(email) || email.length > 254 || !hours || hours.length > 100 || !validLogo || [insideDhakaCharge, outsideDhakaCharge, freeShippingThreshold].some((amount) => !Number.isSafeInteger(amount) || amount < 0)) {
    return { error: 'Check the store details and enter valid non-negative whole-number delivery amounts.' }
  }
  updateStoreSettings({ logoUrl, address, phone, email, hours, insideDhakaCharge, outsideDhakaCharge, freeShippingThreshold })
  revalidatePath('/', 'layout')
  return { success: 'Store settings saved.' }
}

export async function createCategoryAction(data: FormData) {
  const name = text(data, 'name')
  const description = text(data, 'description')
  const requestedIcon = text(data, 'icon')
  const icons = ['smartphone', 'tablet', 'laptop', 'watch', 'headphones', 'battery-charging', 'gamepad-2', 'cooking-pot']
  if (name.length < 2 || description.length < 3) redirect('/admin/categories?status=error')

  await createCategory({
    name,
    description,
    icon: icons.includes(requestedIcon) ? requestedIcon : 'boxes',
  })
  revalidatePath('/', 'layout')
  redirect('/admin/categories?status=category-added')
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
  if (images.length < 1 || images.length > 6 || images[0] !== image || images.some((src) => !src.startsWith('https://')))
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
