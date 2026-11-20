'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { ShoppingCartIcon } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useCart } from '@/lib/cart'
import type { Product } from '@/lib/data/types'
import { QuantityStepper } from './quantity-stepper'

export function ProductPurchase({ product }: { product: Product }) {
  const [quantity, setQuantity] = React.useState(1)
  const { addItem } = useCart()
  const router = useRouter()
  const soldOut = product.stock === 0

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium">Quantity</span>
        <QuantityStepper value={quantity} onChange={setQuantity} max={Math.max(product.stock, 1)} />
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <Button
          size="lg"
          disabled={soldOut}
          onClick={() => {
            addItem(product, quantity)
            toast.success('Added to cart')
          }}
        >
          <ShoppingCartIcon data-icon="inline-start" />
          Add to Cart
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="border-primary text-primary hover:bg-accent hover:text-accent-foreground"
          disabled={soldOut}
          onClick={() => {
            addItem(product, quantity, false)
            router.push('/checkout')
          }}
        >
          Buy Now
        </Button>
      </div>
    </div>
  )
}
