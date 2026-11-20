import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { PageHeader } from '@/components/dashboard/primitives'
import { ProductForm } from '@/components/dashboard/product-form'
import { buttonVariants } from '@/components/ui/button'
import { getCategories, getProduct } from '@/lib/data'
import { cn } from '@/lib/utils'

export const metadata: Metadata = { title: 'Edit product' }

export default async function EditProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const [{ slug }, categories] = await Promise.all([params, getCategories()])
  const product = await getProduct(slug)
  if (!product) notFound()

  return (
    <>
      <PageHeader
        title="Edit product"
        description={`Update ${product.name} and its storefront details.`}
        actions={<Link href="/admin/products" className={cn(buttonVariants({ variant: 'outline' }))}>Back to products</Link>}
      />
      <ProductForm categories={categories} product={product} />
    </>
  )
}
