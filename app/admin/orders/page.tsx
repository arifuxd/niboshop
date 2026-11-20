import type { Metadata } from 'next'
import Link from 'next/link'
import { OrdersTable } from '@/components/dashboard/orders-table'
import { PageHeader } from '@/components/dashboard/primitives'
import { buttonVariants } from '@/components/ui/button'
import { getOrders, type OrderStatus } from '@/lib/data'
import { cn } from '@/lib/utils'

export const metadata: Metadata = { title: 'Orders' }

const filters: { label: string; value?: OrderStatus }[] = [
  { label: 'All' },
  { label: 'Pending', value: 'pending' },
  { label: 'Processing', value: 'processing' },
  { label: 'Shipped', value: 'shipped' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Cancelled', value: 'cancelled' },
]

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const { status } = await searchParams
  const all = await getOrders()
  const orders = status ? all.filter((o) => o.status === status) : all

  return (
    <>
      <PageHeader title="Orders" description={`${orders.length} of ${all.length} orders`} />
      <nav aria-label="Filter orders by status" className="flex flex-wrap gap-2">
        {filters.map((f) => {
          const active = (f.value ?? undefined) === (status || undefined)
          return (
            <Link
              key={f.label}
              href={f.value ? `/admin/orders?status=${f.value}` : '/admin/orders'}
              aria-current={active ? 'page' : undefined}
              className={cn(buttonVariants({ variant: active ? 'default' : 'outline', size: 'sm' }))}
            >
              {f.label}
            </Link>
          )
        })}
      </nav>
      <OrdersTable orders={orders} showCustomer manageBaseHref="/admin/orders" />
    </>
  )
}
