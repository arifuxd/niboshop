import type { Metadata } from 'next'
import { PageHeader } from '@/components/dashboard/primitives'
import { CategoryManager } from '@/components/dashboard/category-manager'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { getCategories, getProducts } from '@/lib/data'

export const metadata: Metadata = { title: 'Categories' }

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const [{ status }, categories, products] = await Promise.all([searchParams, getCategories(), getProducts()])
  const notice = status === 'category-added'
    ? 'Category added to the storefront.'
    : status === 'category-updated'
      ? 'Category changes saved.'
      : status === 'category-deleted'
        ? 'Category deleted.'
        : status === 'category-in-use'
          ? 'This category still has products. Move or delete them before removing it.'
          : status === 'subcategory-added'
            ? 'Subcategory added to the storefront.'
            : null

  return (
    <>
      <PageHeader
        title="Categories"
        description={`${categories.length} top-level categories · manage storefront navigation and product organization`}
      />
      {notice && <Alert><AlertDescription>{notice}</AlertDescription></Alert>}
      {status === 'error' && (
        <Alert variant="destructive">
          <AlertDescription>Enter a valid name and description, then try again.</AlertDescription>
        </Alert>
      )}
      <CategoryManager categories={categories} productCategorySlugs={products.map((product) => product.categorySlug)} />
    </>
  )
}
