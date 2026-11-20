import Link from 'next/link'
import { Hero } from '@/components/shop/hero'
import { NamedIcon } from '@/components/shop/category-icon'
import { ProductSection } from '@/components/shop/product-section'
import {
  getCategories,
  getFeaturedProducts,
  getNewProducts,
  heroBanners,
  sideBanners,
} from '@/lib/data'

export default async function HomePage() {
  const [categories, featured, newest] = await Promise.all([
    getCategories(),
    getFeaturedProducts(),
    getNewProducts(),
  ])

  return (
    <>
      <Hero banners={heroBanners} sideBanners={sideBanners} />

      <section className="container-shop py-4" aria-labelledby="shop-by-category">
        <h2 id="shop-by-category" className="mb-4 text-xl font-semibold tracking-tight md:text-2xl">
          Shop by Category
        </h2>
        <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {categories.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/category/${c.slug}`}
                className="flex flex-col items-center gap-2 rounded-xl border bg-card p-3 text-center text-xs font-medium transition-colors hover:border-primary hover:text-primary sm:text-sm"
              >
                <span className="flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
                  <NamedIcon name={c.icon} className="size-6" />
                </span>
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <ProductSection
        title="Featured Products"
        description="Hand-picked bestsellers from our stores"
        href="/category/smartphones"
        products={featured.slice(0, 10)}
      />
      <ProductSection
        title="New Arrivals"
        description="Fresh in stock this week"
        products={newest.slice(0, 5)}
      />
    </>
  )
}
