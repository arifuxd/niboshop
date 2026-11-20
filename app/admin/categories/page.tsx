import type { Metadata } from 'next'
import { PageHeader } from '@/components/dashboard/primitives'
import { CategoryManager } from '@/components/dashboard/category-manager'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { getCategories } from '@/lib/data'

export const metadata: Metadata = { title: 'Categories' }

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const [{ status }, categories] = await Promise.all([searchParams, getCategories()])
  const notice = status === 'category-added'
    ? 'Category added to the storefront.'
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
      <CategoryManager categories={categories} />
    </>
  )
}
