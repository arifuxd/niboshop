'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCartIcon, Trash2Icon, XIcon } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useCart } from '@/lib/cart'
import { useLanguage } from '@/lib/language'
import { formatPrice } from '@/lib/format'
import { useStoreSettings } from '@/lib/use-store-settings'
import { cn } from '@/lib/utils'
import { QuantityStepper } from './quantity-stepper'

export function CartButton() {
  const { count, setOpen } = useCart()
  const { t } = useLanguage()
  return (
    <Button
      variant="ghost"
      className="relative gap-2 text-header-foreground hover:bg-white/10 hover:text-header-foreground"
      onClick={() => setOpen(true)}
      aria-label={`${t('Open cart')}, ${count} ${t('items')}`}
    >
      <ShoppingCartIcon data-icon="inline-start" />
      <span className="hidden sm:inline">{t('Cart')}</span>
      <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-sale text-[11px] font-semibold text-sale-foreground">
        {count}
      </span>
    </Button>
  )
}

export function CartSheet() {
  const { items, isOpen, setOpen, setQuantity, removeItem, subtotal, discount, delivery, total, count } =
    useCart()
  const { t } = useLanguage()
  const { data: storeSettings } = useStoreSettings()

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent side="right" showCloseButton={false} className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="flex-row items-center justify-between border-b p-4">
          <div>
            <SheetTitle>{t('Shopping Cart')} ({count})</SheetTitle>
            <SheetDescription className="sr-only">
              {t('Products you have added to your cart')}
            </SheetDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label={t('Close cart')}>
            <XIcon />
          </Button>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-muted">
              <ShoppingCartIcon className="size-7 text-muted-foreground" />
            </div>
            <p className="font-medium">{t('Your cart is empty')}</p>
            <p className="text-sm text-muted-foreground">{t('Add some products to get started.')}</p>
            <Button onClick={() => setOpen(false)}>{t('Continue Shopping')}</Button>
          </div>
        ) : (
          <>
            <ScrollArea className="min-h-0 flex-1">
              <ul className="divide-y">
                {items.map((item) => (
                  <li key={item.productId} className="flex gap-3 p-4">
                    <Link
                      href={`/product/${item.slug}`}
                      onClick={() => setOpen(false)}
                      className="shrink-0"
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={72}
                        height={72}
                        className="size-[72px] rounded-lg bg-muted object-cover"
                      />
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                      <Link
                        href={`/product/${item.slug}`}
                        onClick={() => setOpen(false)}
                        className="line-clamp-2 text-sm font-medium hover:text-primary"
                      >
                        {item.name}
                      </Link>
                      <p className="text-sm font-semibold text-sale">{formatPrice(item.price)}</p>
                      <div className="flex items-center justify-between">
                        <QuantityStepper
                          size="sm"
                          value={item.quantity}
                          onChange={(q) => setQuantity(item.productId, q)}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7 text-muted-foreground hover:text-destructive"
                          onClick={() => removeItem(item.productId)}
                          aria-label={`${t('Remove')} ${item.name}`}
                        >
                          <Trash2Icon />
                        </Button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </ScrollArea>

            <div className="flex flex-col gap-3 border-t bg-muted/40 p-4">
              <h3 className="text-sm font-semibold">{t('Order Summary')}</h3>
              <dl className="flex flex-col gap-1.5 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">{t('Subtotal')}</dt>
                  <dd>{formatPrice(subtotal)}</dd>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">{t('You save')}</dt>
                    <dd className="text-success">-{formatPrice(discount)}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">{t('Delivery')}</dt>
                  <dd>{delivery === 0 ? t('Free') : formatPrice(delivery)}</dd>
                </div>
                <Separator className="my-1" />
                <div className="flex justify-between text-base font-semibold">
                  <dt>{t('Total')}</dt>
                  <dd>{formatPrice(total)}</dd>
                </div>
              </dl>
              {delivery > 0 && (
                <p className="text-xs text-muted-foreground">
                  {t('Add more for free delivery')}: {formatPrice(storeSettings!.freeShippingThreshold - subtotal)}
                </p>
              )}
              <Link
                href="/checkout"
                onClick={() => setOpen(false)}
                className={cn(buttonVariants({ size: 'lg' }), 'w-full')}
              >
                {t('Proceed to Checkout')}
              </Link>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
