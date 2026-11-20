import Link from 'next/link'
import { Hero } from '@/components/shop/hero'
import { NamedIcon } from '@/components/shop/category-icon'
import { ProductSection } from '@/components/shop/product-section'
import { LocalizedText } from '@/components/localized-text'
import {
  getCategories,
  getProducts,
  homepageSections,
  heroBanners,
  sideBanners,
} from '@/lib/data'

export default async function HomePage() {
  const [categories, allProducts] = await Promise.all([getCategories(), getProducts()])

  return (
    <>
      <Hero banners={heroBanners} sideBanners={sideBanners} />

      <section className="container-shop py-4" aria-labelledby="shop-by-category">
        <LocalizedText as="h2" id="shop-by-category" text="Shop by Category" className="mb-4 text-xl font-semibold tracking-tight md:text-2xl" />
        <ul className="flex snap-x snap-mandatory gap-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-4 sm:overflow-visible sm:snap-none lg:grid-cols-8">
          {categories.map((c) => (
            <li key={c.slug} className="w-[calc((100%-1.5rem)/3)] shrink-0 snap-start sm:w-auto">
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

      {homepageSections.map((section) => {
        const products = section.productIds.map((id) => allProducts.find((product) => product.id === id)).filter((product) => product !== undefined)
        return <ProductSection key={section.id} title={section.title} description={section.description} products={products} />
      })}
    </>
  )
}
