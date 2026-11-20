import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/dashboard/primitives'
import { ProductForm } from '@/components/dashboard/product-form'
import { buttonVariants } from '@/components/ui/button'
import { getCategories } from '@/lib/data'
import { cn } from '@/lib/utils'

export const metadata: Metadata = { title: 'Add product' }

export default async function NewProductPage() {
  const categories = await getCategories()

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
      <ProductForm categories={categories} />
    </>
  )
}
