'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle2Icon, ShoppingCartIcon } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { useCart } from '@/lib/cart'
import { formatPrice } from '@/lib/format'
import { siteConfig } from '@/lib/site-config'
import { useStoreSettings } from '@/lib/use-store-settings'
import { cn } from '@/lib/utils'
import { QuantityStepper } from './quantity-stepper'

const payments = [
  { value: 'cod', label: 'Cash on Delivery', hint: 'Pay when you receive your order' },
  { value: 'bkash', label: 'bKash', hint: 'Pay with your bKash wallet' },
  { value: 'card', label: 'Credit / Debit Card', hint: 'Visa, Mastercard, Amex' },
] as const

export function CheckoutForm() {
  const { items, subtotal, discount, count, clear, setQuantity } = useCart()
  const { data: storeSettings } = useStoreSettings()
  const [zone, setZone] = React.useState<'inside' | 'outside'>('inside')
  const [payment, setPayment] = React.useState<string>('cod')
  const [placed, setPlaced] = React.useState<string | null>(null)

  const delivery =
    items.length === 0 || subtotal >= storeSettings!.freeShippingThreshold || items.every((item) => item.freeShipping)
      ? 0
      : zone === 'inside'
        ? storeSettings!.insideDhakaCharge
        : storeSettings!.outsideDhakaCharge
  const total = subtotal + delivery

  if (placed) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-xl border bg-card p-10 text-center">
        <CheckCircle2Icon className="size-14 text-success" aria-hidden="true" />
        <h1 className="text-2xl font-semibold">Order placed!</h1>
        <p className="text-sm text-muted-foreground">
          Thank you for shopping with {siteConfig.name}. Your order number is{' '}
          <span className="font-semibold text-foreground">{placed}</span>. We will call you shortly
          to confirm.
        </p>
        <div className="flex gap-2">
          <Link href="/" className={buttonVariants()}>
            Continue Shopping
          </Link>
          <Link href="/account/orders" className={buttonVariants({ variant: 'outline' })}>
            My Orders
          </Link>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-xl border bg-card p-10 text-center">
        <ShoppingCartIcon className="size-12 text-muted-foreground" aria-hidden="true" />
        <h1 className="text-xl font-semibold">Your cart is empty</h1>
        <p className="text-sm text-muted-foreground">Add products to your cart to checkout.</p>
        <Link href="/" className={buttonVariants()}>
          Browse Products
        </Link>
      </div>
    )
  }

  return (
    <form
      className="grid gap-6 lg:grid-cols-[1fr_400px]"
      onSubmit={(e) => {
        e.preventDefault()
        setPlaced(`NB-${10500 + Math.floor(Math.random() * 400)}`)
        clear()
      }}
    >
      <div className="flex flex-col gap-6">
        <section className="flex flex-col gap-4 rounded-xl border bg-card p-4 md:p-6">
          <h2 className="text-lg font-semibold">Delivery Information</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" name="name" autoComplete="name" required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="phone">Phone number</Label>
              <Input id="phone" name="phone" type="tel" autoComplete="tel" required />
            </div>
            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label htmlFor="email">Email (optional)</Label>
              <Input id="email" name="email" type="email" autoComplete="email" />
            </div>
            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label htmlFor="address">Full address</Label>
              <Textarea id="address" name="address" autoComplete="street-address" required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="city">City / District</Label>
              <Input id="city" name="city" autoComplete="address-level2" required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="note">Order note (optional)</Label>
              <Input id="note" name="note" />
            </div>
          </div>

          <fieldset className="flex flex-col gap-2">
            <legend className="mb-1 text-sm font-medium">Delivery area</legend>
            <RadioGroup
              value={zone}
              onValueChange={(v) => setZone(v as 'inside' | 'outside')}
              className="grid gap-2 sm:grid-cols-2"
            >
              {(
                [
                  ['inside', 'Inside Dhaka', storeSettings!.insideDhakaCharge],
                  ['outside', 'Outside Dhaka', storeSettings!.outsideDhakaCharge],
                ] as const
              ).map(([value, label, fee]) => (
                <Label
                  key={value}
                  htmlFor={`zone-${value}`}
                  className={cn(
                    'flex cursor-pointer items-center gap-3 rounded-lg border p-3 font-normal',
                    zone === value && 'border-primary bg-accent',
                  )}
                >
                  <RadioGroupItem id={`zone-${value}`} value={value} />
                  <span className="flex-1">{label}</span>
                  <span className="text-sm text-muted-foreground">{formatPrice(fee)}</span>
                </Label>
              ))}
            </RadioGroup>
          </fieldset>
        </section>

        <section className="flex flex-col gap-4 rounded-xl border bg-card p-4 md:p-6">
          <h2 className="text-lg font-semibold">Payment Method</h2>
          <RadioGroup value={payment} onValueChange={setPayment} className="grid gap-2">
            {payments.map((p) => (
              <Label
                key={p.value}
                htmlFor={`pay-${p.value}`}
                className={cn(
                  'flex cursor-pointer items-center gap-3 rounded-lg border p-3 font-normal',
                  payment === p.value && 'border-primary bg-accent',
                )}
              >
                <RadioGroupItem id={`pay-${p.value}`} value={p.value} />
                <span className="flex flex-col">
                  <span className="font-medium">{p.label}</span>
                  <span className="text-xs text-muted-foreground">{p.hint}</span>
                </span>
              </Label>
            ))}
          </RadioGroup>
        </section>
      </div>

      <aside className="h-fit rounded-xl border bg-card p-4 md:p-6 lg:sticky lg:top-32">
        <h2 className="mb-4 text-lg font-semibold">Order Summary ({count})</h2>
        <ul className="flex flex-col divide-y">
          {items.map((item) => (
            <li key={item.productId} className="flex gap-3 py-3 first:pt-0">
              <Image
                src={item.image}
                alt={item.name}
                width={56}
                height={56}
                className="size-14 rounded-md bg-muted object-cover"
              />
              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <p className="line-clamp-2 text-sm">{item.name}</p>
                <div className="flex items-center justify-between">
                  <QuantityStepper
                    size="sm"
                    value={item.quantity}
                    onChange={(q) => setQuantity(item.productId, q)}
                  />
                  <span className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <Separator className="my-4" />
        <dl className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Subtotal</dt>
            <dd>{formatPrice(subtotal)}</dd>
          </div>
          {discount > 0 && (
            <div className="flex justify-between">
              <dt className="text-muted-foreground">You save</dt>
              <dd className="text-success">-{formatPrice(discount)}</dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Delivery</dt>
            <dd>{delivery === 0 ? 'Free' : formatPrice(delivery)}</dd>
          </div>
          <Separator className="my-1" />
          <div className="flex justify-between text-base font-semibold">
            <dt>Total</dt>
            <dd>{formatPrice(total)}</dd>
          </div>
        </dl>
        <Button type="submit" size="lg" className="mt-4 w-full">
          Place Order
        </Button>
      </aside>
    </form>
  )
}
