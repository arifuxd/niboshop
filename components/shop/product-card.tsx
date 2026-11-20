'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShoppingCartIcon } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useCart } from '@/lib/cart'
import { useLanguage } from '@/lib/language'
import { discountPercent } from '@/lib/format'
import type { Product } from '@/lib/data/types'
import { Price } from './price'
import { StarRating } from './star-rating'

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()
  const { t } = useLanguage()
  const router = useRouter()
  const off = discountPercent(product.price, product.comparePrice)
  const soldOut = product.stock === 0

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-md">
      <Link
        href={`/product/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-muted"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {off > 0 && <Badge className="bg-sale text-sale-foreground">-{off}%</Badge>}
          {product.isNew && <Badge variant="secondary">{t('New')}</Badge>}
          {product.freeShipping && <Badge variant="outline">Free shipping</Badge>}
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-3">
        <Link
          href={`/product/${product.slug}`}
          className="line-clamp-2 min-h-10 text-sm font-medium leading-5 hover:text-primary"
        >
          {product.name}
        </Link>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <StarRating rating={product.rating} />
          <span>({product.reviewCount})</span>
        </div>
        <Price price={product.price} comparePrice={product.comparePrice} />
        <div className="mt-auto flex flex-col gap-2 pt-1">
          <Button
            size="sm"
            className="h-11"
            disabled={soldOut}
            onClick={() => {
              addItem(product)
              toast.success(t('Added to cart'))
            }}
          >
            <ShoppingCartIcon data-icon="inline-start" />
            {t('Add to Cart')}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-11 border-primary text-primary hover:bg-accent hover:text-accent-foreground"
            disabled={soldOut}
            onClick={() => {
              addItem(product, 1, false)
              router.push('/checkout')
            }}
          >
            {t('Buy Now')}
          </Button>
        </div>
      </div>
    </article>
  )
}
