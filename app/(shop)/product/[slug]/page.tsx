import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CheckCircle2Icon, ShieldCheckIcon, TruckIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Breadcrumbs } from '@/components/shop/breadcrumbs'
import { Price } from '@/components/shop/price'
import { ProductPurchase } from '@/components/shop/product-purchase'
import { ProductGallery } from '@/components/shop/product-gallery'
import { ProductSection } from '@/components/shop/product-section'
import { StarRating } from '@/components/shop/star-rating'
import { formatDate } from '@/lib/format'
import { getCategory, getProduct, getRelatedProducts, getReviews } from '@/lib/data'

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

  const [category, related, reviews] = await Promise.all([
    getCategory(product.categorySlug),
    getRelatedProducts(product, 5),
    getReviews(product.id),
  ])

  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }))

  return (
    <>
      <div className="container-shop py-4">
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

        <Tabs defaultValue="description" className="mt-6 rounded-xl border bg-card p-4 md:p-6">
          <TabsList>
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({product.reviewCount})</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="pt-4">
            <div className="flex max-w-3xl flex-col gap-3 text-sm leading-7 text-muted-foreground">
              {product.description.split('\n\n').map((para) => (
                <p key={para}>{para}</p>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="pt-4">
            <div className="grid gap-8 md:grid-cols-[240px_1fr]">
              <div className="flex flex-col gap-3">
                <p className="text-5xl font-semibold">{product.rating.toFixed(1)}</p>
                <StarRating rating={product.rating} />
                <p className="text-sm text-muted-foreground">Based on {product.reviewCount} reviews</p>
                <ul className="flex flex-col gap-1.5">
                  {distribution.map((d) => (
                    <li key={d.star} className="flex items-center gap-2 text-xs">
                      <span className="w-3">{d.star}</span>
                      <Progress value={(d.count / reviews.length) * 100} className="h-1.5" />
                      <span className="w-3 text-muted-foreground">{d.count}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <ul className="flex flex-col divide-y">
                {reviews.map((r) => (
                  <li key={r.id} className="flex flex-col gap-1.5 py-4 first:pt-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <StarRating rating={r.rating} />
                      <span className="text-sm font-medium">{r.title}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{r.body}</p>
                    <p className="text-xs text-muted-foreground">
                      {r.author} • {formatDate(r.date)}
                      {r.verified && <span className="text-success"> • Verified purchase</span>}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <ProductSection title="Related Products" products={related} />
    </>
  )
}
