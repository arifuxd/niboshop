import Link from 'next/link'
import { ArrowRightIcon } from 'lucide-react'
import type { Product } from '@/lib/data/types'
import { ProductCard } from './product-card'

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  )
}

export function ProductSection({
  title,
  description,
  href,
  products,
}: {
  title: string
  description?: string
  href?: string
  products: Product[]
}) {
  return (
    <section className="container-shop py-6 md:py-8">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight md:text-2xl">{title}</h2>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {href && (
          <Link
            href={href}
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            View all
            <ArrowRightIcon className="size-4" />
          </Link>
        )}
      </div>
      <ProductGrid products={products} />
    </section>
  )
}
