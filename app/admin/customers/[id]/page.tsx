import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CustomerActions } from '@/components/dashboard/customer-actions'
import { CustomerForm } from '@/components/dashboard/customer-form'
import { OrdersTable } from '@/components/dashboard/orders-table'
import { PageHeader } from '@/components/dashboard/primitives'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getCustomer, getOrdersByCustomer } from '@/lib/data'
import { formatDate, formatPrice } from '@/lib/format'
import { cn } from '@/lib/utils'

export const metadata: Metadata = { title: 'Manage customer' }

export default async function AdminCustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const customer = await getCustomer(id)
  if (!customer) notFound()
  const orders = await getOrdersByCustomer(customer.id)

  return (
    <>
      <PageHeader
        title={customer.name}
        description={`Customer since ${formatDate(customer.joined)}`}
        actions={
          <Link href="/admin/customers" className={cn(buttonVariants({ variant: 'outline' }))}>
            Back to customers
          </Link>
        }
      />
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="flex min-w-0 flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent>
              <CustomerForm customer={customer} />
            </CardContent>
          </Card>
          <section aria-labelledby="customer-orders" className="flex flex-col gap-3">
            <h2 id="customer-orders" className="text-lg font-semibold">
              Orders
            </h2>
            {orders.length > 0 ? (
              <OrdersTable orders={orders} manageBaseHref="/admin/orders" />
            ) : (
              <p className="text-sm text-muted-foreground">This customer has no orders yet.</p>
            )}
          </section>
        </div>
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                {customer.status === 'blocked' ? (
                  <Badge variant="destructive">Blocked</Badge>
                ) : (
                  <Badge variant="secondary" className="text-success">
                    Active
                  </Badge>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Orders</span>
                <span className="font-medium">{customer.orders}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total spent</span>
                <span className="font-medium">{formatPrice(customer.spent)}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Account actions</CardTitle>
            </CardHeader>
            <CardContent>
              <CustomerActions customer={customer} />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
