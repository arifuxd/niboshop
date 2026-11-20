import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/dashboard/primitives'
import { ProductForm } from '@/components/dashboard/product-form'
import { buttonVariants } from '@/components/ui/button'
import { getCategories, getProducts } from '@/lib/data'
import { cn } from '@/lib/utils'

export const metadata: Metadata = { title: 'Add product' }

export default async function NewProductPage() {
  const [categories, products] = await Promise.all([getCategories(), getProducts()])
  const seen = new Set<string>()
  const imageChoices = products
    .filter((p) => !seen.has(p.image) && seen.add(p.image))
    .map((p) => ({ src: p.image, label: p.name }))

  return (
    <>
      <PageHeader
        title="Add product"
        description="New products appear on the storefront immediately."
        actions={
          <Link href="/admin/products" className={cn(buttonVariants({ variant: 'outline' }))}>
            Back to products
          </Link>
        }
      />
      <ProductForm categories={categories} imageChoices={imageChoices} />
    </>
  )
}
