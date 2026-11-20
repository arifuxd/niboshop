import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { OrderManager } from '@/components/dashboard/order-manager'
import { PageHeader, StatusBadge } from '@/components/dashboard/primitives'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getCustomers, getOrder } from '@/lib/data'
import { formatDate, formatPrice } from '@/lib/format'
import { cn } from '@/lib/utils'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  return { title: `Order ${id}` }
}

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const order = await getOrder(id)
  if (!order) notFound()
  const customer = (await getCustomers()).find((c) => c.id === order.customerId)

  return (
    <>
      <PageHeader
        title={`Order ${order.id}`}
        description={`Placed on ${formatDate(order.date)} via ${order.payment}`}
        actions={
          <Link href="/admin/orders" className={cn(buttonVariants({ variant: 'outline' }))}>
            Back to orders
          </Link>
        }
      />
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Items</CardTitle>
            <StatusBadge status={order.status} />
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col divide-y">
              {order.items.map((item) => (
                <li key={item.productId} className="flex items-center gap-4 py-3 first:pt-0">
                  <Image src={item.image} alt="" width={56} height={56} className="size-14 rounded-md bg-muted object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatPrice(item.price)} x {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-center justify-between border-t pt-4 text-lg font-semibold">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Manage order</CardTitle>
            </CardHeader>
            <CardContent>
              <OrderManager orderId={order.id} status={order.status} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Customer</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-1 text-sm">
              <p className="font-medium">{order.customerName}</p>
              {customer && (
                <>
                  <p className="text-muted-foreground">{customer.email}</p>
                  <p className="text-muted-foreground">{customer.phone}</p>
                  <p className="text-muted-foreground">{customer.city}</p>
                  <Link href={`/admin/customers/${customer.id}`} className="mt-2 font-medium text-primary hover:underline">
                    View customer
                  </Link>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
