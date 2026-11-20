import { OrdersTable } from '@/components/dashboard/orders-table'
import { PageHeader, StatCard } from '@/components/dashboard/primitives'
import { RevenueChart } from '@/components/dashboard/revenue-chart'
import { getCustomers, getOrders, getProducts, getRevenueByMonth } from '@/lib/data'
import { formatPrice } from '@/lib/format'

export default async function AdminOverviewPage() {
  const [orders, customers, products, revenue] = await Promise.all([
    getOrders(),
    getCustomers(),
    getProducts(),
    getRevenueByMonth(),
  ])
  const sales = orders.filter((o) => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0)
  const pending = orders.filter((o) => o.status === 'pending' || o.status === 'processing').length

  return (
    <>
      <PageHeader title="Dashboard" description="Store performance at a glance." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Sales" value={formatPrice(sales)} icon="shopping-bag" hint="Excludes cancelled orders" />
        <StatCard label="Orders to handle" value={String(pending)} icon="package" hint={`${orders.length} total orders`} />
        <StatCard label="Customers" value={String(customers.length)} icon="users" />
        <StatCard label="Products" value={String(products.length)} icon="boxes" />
      </div>
      <RevenueChart data={revenue} />
      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Recent orders</h2>
        <OrdersTable orders={orders.slice(0, 6)} showCustomer />
      </section>
    </>
  )
}
