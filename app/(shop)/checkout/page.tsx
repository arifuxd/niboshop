import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/shop/breadcrumbs'
import { CheckoutForm } from '@/components/shop/checkout-form'

export const metadata: Metadata = { title: 'Checkout' }

export default function CheckoutPage() {
  return (
    <div className="container-shop flex flex-col gap-4 py-4">
      <Breadcrumbs items={[{ label: 'Checkout' }]} />
      <CheckoutForm />
    </div>
  )
}
