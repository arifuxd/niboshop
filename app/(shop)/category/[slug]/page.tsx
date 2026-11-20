import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Breadcrumbs } from '@/components/shop/breadcrumbs'
import { ProductGrid } from '@/components/shop/product-section'
import { getCategories, getCategory, getProducts } from '@/lib/data'
import { cn } from '@/lib/utils'

const sorts = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
] as const

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategory(slug)
  return { title: category?.name ?? 'Category', description: category?.description }
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ sort?: string; brand?: string; subcategory?: string }>
}) {
  const { slug } = await params
  const { sort = 'featured', brand, subcategory: subcategorySlug } = await searchParams
  const [category, categories, all] = await Promise.all([
    getCategory(slug),
    getCategories(),
    getProducts({ categorySlug: slug, subcategorySlug }),
  ])
  if (!category) notFound()

  const brands = Array.from(new Set(all.map((p) => p.brand))).sort()
  const activeSubcategory = category.subcategories.find((item) => item.slug === subcategorySlug)
  let list = brand ? all.filter((p) => p.brand === brand) : [...all]
  if (sort === 'price-asc') list.sort((a, b) => a.price - b.price)
  if (sort === 'price-desc') list.sort((a, b) => b.price - a.price)
  if (sort === 'rating') list.sort((a, b) => b.rating - a.rating)

  const href = (next: { sort?: string; brand?: string; subcategory?: string }) => {
    const q = new URLSearchParams()
    const s = next.sort ?? sort
    const b = 'brand' in next ? next.brand : brand
    const subcategory = 'subcategory' in next ? next.subcategory : subcategorySlug
    if (s && s !== 'featured') q.set('sort', s)
    if (b) q.set('brand', b)
    if (subcategory) q.set('subcategory', subcategory)
    const qs = q.toString()
    return `/category/${slug}${qs ? `?${qs}` : ''}`
  }

  const pill = (active: boolean) =>
    cn(
      'rounded-full border px-3 py-1.5 text-sm transition-colors',
      active
        ? 'border-primary bg-primary-gradient text-primary-foreground'
        : 'bg-card hover:border-primary hover:text-primary',
    )

  return (
    <div className="container-shop py-4">
      <Breadcrumbs items={[{ label: category.name }]} />
      <div className="mt-3 flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          {activeSubcategory ? `${category.name} / ${activeSubcategory.name}` : category.name}
        </h1>
        <p className="text-sm text-muted-foreground">{category.description}</p>
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-[220px_1fr]">
        <aside className="flex flex-col gap-5" aria-label="Filters">
          <div>
            <h2 className="mb-2 text-sm font-semibold">Categories</h2>
            <ul className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/category/${c.slug}`}
                    className={cn(
                      'block rounded-md px-2 py-1.5 text-sm hover:bg-accent',
                      c.slug === slug && 'bg-accent font-medium text-accent-foreground',
                    )}
                  >
                    {c.name}
                  </Link>
                  {c.slug === slug && c.subcategories.length > 0 && (
                    <ul className="ml-3 mt-1 flex flex-wrap gap-1.5 lg:flex-col">
                      <li>
                        <Link href={href({ subcategory: undefined })} className={cn('block rounded-md px-2 py-1.5 text-xs hover:bg-accent', !activeSubcategory && 'font-medium text-primary')}>
                          All {c.name}
                        </Link>
                      </li>
                      {c.subcategories.map((subcategory) => (
                        <li key={subcategory.slug}>
                          <Link href={href({ subcategory: subcategory.slug })} className={cn('block rounded-md px-2 py-1.5 text-xs hover:bg-accent', activeSubcategory?.slug === subcategory.slug && 'font-medium text-primary')}>
                            {subcategory.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
          {brands.length > 1 && (
            <div>
              <h2 className="mb-2 text-sm font-semibold">Brand</h2>
              <div className="flex flex-wrap gap-2">
                <Link href={href({ brand: undefined })} className={pill(!brand)}>
                  All
                </Link>
                {brands.map((b) => (
                  <Link key={b} href={href({ brand: b })} className={pill(brand === b)}>
                    {b}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>

        <section aria-label="Products">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-card p-3">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium text-foreground">{list.length}</span> products
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              {sorts.map((s) => (
                <Link key={s.value} href={href({ sort: s.value })} className={pill(sort === s.value)}>
                  {s.label}
                </Link>
              ))}
            </div>
          </div>
          {list.length === 0 ? (
            <p className="rounded-lg border bg-card p-10 text-center text-muted-foreground">
              No products found.
            </p>
          ) : (
            <div className="[&>div]:xl:grid-cols-4">
              <ProductGrid products={list} />
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
