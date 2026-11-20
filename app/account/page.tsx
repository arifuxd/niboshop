import Link from 'next/link'
import { OrdersTable } from '@/components/dashboard/orders-table'
import { PageHeader, StatCard } from '@/components/dashboard/primitives'
import { buttonVariants } from '@/components/ui/button'
import { getCurrentCustomer, getCustomerOrders } from '@/lib/data'
import { formatPrice } from '@/lib/format'

export default async function AccountOverviewPage() {
  const [customer, orders] = await Promise.all([getCurrentCustomer(), getCustomerOrders()])
  const active = orders.filter((o) => ['pending', 'processing', 'shipped'].includes(o.status)).length

  return (
    <>
      <PageHeader
        title={`Welcome back, ${customer.name.split(' ')[0]}`}
        description="Track orders and manage your account details."
        actions={
          <Link href="/" className={buttonVariants()}>
            Continue shopping
          </Link>
        }
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total orders" value={String(orders.length)} icon="package" />
        <StatCard label="Active orders" value={String(active)} icon="shopping-bag" />
        <StatCard label="Total spent" value={formatPrice(customer.spent)} icon="user" />
      </div>
      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Recent orders</h2>
        <OrdersTable orders={orders.slice(0, 5)} />
      </section>
    </>
  )
}
