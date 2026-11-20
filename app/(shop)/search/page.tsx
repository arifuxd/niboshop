import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/shop/breadcrumbs'
import { ProductGrid } from '@/components/shop/product-section'
import { LocalizedText } from '@/components/localized-text'
import { getProducts } from '@/lib/data'

export const metadata: Metadata = { title: 'Search products' }

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q = '' } = await searchParams
  const query = q.trim().slice(0, 120)
  let products = null as Awaited<ReturnType<typeof getProducts>> | null

  if (query.length >= 3) {
    try {
      products = await getProducts({ query })
    } catch {
      products = null
    }
  }

  return (
    <div className="container-shop py-4">
      <Breadcrumbs items={[{ label: 'Search results' }]} />
      <section className="mt-5">
        <LocalizedText as="h1" text="Search results" className="text-2xl font-semibold tracking-tight" />
        {query ? (
          <p className="mt-1 text-sm text-muted-foreground">
            {products ? `${products.length} ${products.length === 1 ? 'product' : 'products'} found for` : 'Results for'} “{query}”
          </p>
        ) : (
          <LocalizedText as="p" text="Enter at least 3 characters to search." className="mt-1 text-sm text-muted-foreground" />
        )}

        {products === null && query.length >= 3 ? (
          <p role="status" className="mt-5 rounded-lg border bg-card p-6 text-sm text-muted-foreground">
            <LocalizedText text="Product search is temporarily unavailable." />
          </p>
        ) : products && products.length > 0 ? (
          <div className="mt-5">
            <ProductGrid products={products} />
          </div>
        ) : query.length >= 3 ? (
          <p className="mt-5 rounded-lg border bg-card p-10 text-center text-muted-foreground">
            <LocalizedText text="No products found for" /> “{query}”.
          </p>
        ) : null}
      </section>
    </div>
  )
}
