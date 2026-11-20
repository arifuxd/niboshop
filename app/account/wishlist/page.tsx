import type { Metadata } from 'next'
import { PageHeader } from '@/components/dashboard/primitives'
import { ProductGrid } from '@/components/shop/product-section'
import { getFeaturedProducts } from '@/lib/data'

export const metadata: Metadata = { title: 'Wishlist' }

export default async function WishlistPage() {
  const products = (await getFeaturedProducts()).slice(0, 4)
  return (
    <>
      <PageHeader title="Wishlist" description="Products you saved for later." />
      <ProductGrid products={products} />
    </>
  )
}
