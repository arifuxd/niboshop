import type { Metadata } from 'next'
import { OrdersTable } from '@/components/dashboard/orders-table'
import { PageHeader } from '@/components/dashboard/primitives'
import { getCustomerOrders } from '@/lib/data'

export const metadata: Metadata = { title: 'My Orders' }

export default async function AccountOrdersPage() {
  const orders = await getCustomerOrders()
  return (
    <>
      <PageHeader title="My Orders" description="Everything you have ordered from Niboshop." />
      <OrdersTable orders={orders} />
    </>
  )
}
