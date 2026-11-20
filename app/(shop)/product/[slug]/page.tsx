import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { BookOpenTextIcon, CheckCircle2Icon, ShieldCheckIcon, TruckIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Breadcrumbs } from '@/components/shop/breadcrumbs'
import { Price } from '@/components/shop/price'
import { ProductPurchase } from '@/components/shop/product-purchase'
import { ProductGallery } from '@/components/shop/product-gallery'
import { ProductPageScrollReset } from '@/components/shop/product-page-scroll-reset'
import { ProductSection } from '@/components/shop/product-section'
import { LocalizedText } from '@/components/localized-text'
import { StarRating } from '@/components/shop/star-rating'
import { getCategory, getProduct, getRelatedProducts } from '@/lib/data'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug)
  return { title: product?.name ?? 'Product', description: product?.highlights.join('. ') }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) notFound()

  const [category, related] = await Promise.all([
    getCategory(product.categorySlug),
    getRelatedProducts(product, 5),
  ])

  return (
    <>
      <div className="container-shop py-4">
        <ProductPageScrollReset />
        <Breadcrumbs
          items={[
            ...(category ? [{ label: category.name, href: `/category/${category.slug}` }] : []),
            { label: product.name },
          ]}
        />

        <div className="mt-4 grid gap-8 rounded-xl border bg-card p-4 md:p-6 lg:grid-cols-2">
          <ProductGallery images={product.images} name={product.name} />

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h1 className="text-balance text-2xl font-semibold tracking-tight">{product.name}</h1>
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <StarRating rating={product.rating} />
                <span>
                  {product.rating.toFixed(1)} ({product.reviewCount} reviews)
                </span>
                <span aria-hidden="true">•</span>
                <span>Brand: {product.brand}</span>
              </div>
            </div>

            <Price price={product.price} comparePrice={product.comparePrice} size="lg" />

            <div>
              {product.stock > 0 ? (
                <Badge variant="secondary" className="gap-1 text-success">
                  <CheckCircle2Icon data-icon="inline-start" />
                  In stock ({product.stock} available)
                </Badge>
              ) : (
                <Badge variant="destructive">Out of stock</Badge>
              )}
            </div>

            <ul className="flex flex-col gap-1.5 text-sm">
              {product.highlights.map((h) => (
                <li key={h} className="flex gap-2">
                  <CheckCircle2Icon className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                  {h}
                </li>
              ))}
            </ul>

            <ProductPurchase product={product} />

            <ul className="grid gap-3 border-t pt-4 text-sm sm:grid-cols-2">
              <li className="flex items-center gap-2">
                <TruckIcon className="size-5 text-primary" aria-hidden="true" />
                Fast delivery across Bangladesh
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheckIcon className="size-5 text-primary" aria-hidden="true" />
                100% genuine product
              </li>
            </ul>
          </div>
        </div>

        <Tabs defaultValue="description" className="mt-6 overflow-hidden rounded-xl border bg-card">
          <TabsList className="h-auto w-full justify-start rounded-none border-b bg-muted/40 px-4 py-3 md:px-6">
            <TabsTrigger
              value="description"
              className="h-auto flex-none gap-2 rounded-lg border border-primary/15 bg-background px-4 py-2.5 text-base font-semibold text-primary shadow-sm data-active:border-primary/30 data-active:bg-primary/5 data-active:text-primary"
            >
              <BookOpenTextIcon className="size-4" aria-hidden="true" />
              Description
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="p-5 md:p-7">
            <section aria-labelledby="product-description-heading">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <BookOpenTextIcon className="size-5" aria-hidden="true" />
                </span>
                <LocalizedText
                  as="h2"
                  id="product-description-heading"
                  className="text-lg font-semibold tracking-tight md:text-xl"
                  text="Product description"
                />
              </div>
            </section>
          </TabsContent>
        </Tabs>
      </div>

      <ProductSection title="Related Products" products={related} />
    </>
  )
}
