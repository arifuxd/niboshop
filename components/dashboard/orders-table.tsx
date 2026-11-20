import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatDate, formatPrice } from '@/lib/format'
import type { Order } from '@/lib/data/types'
import { StatusBadge } from './primitives'

export function OrdersTable({
  orders,
  showCustomer = false,
  manageBaseHref,
}: {
  orders: Order[]
  showCustomer?: boolean
  manageBaseHref?: string
}) {
  return (
    <>
      <div className="flex flex-col gap-3 sm:hidden">
        {orders.map((order) => (
          <article key={order.id} className="min-w-0 rounded-xl border bg-card p-4 shadow-sm">
            <div className="flex min-w-0 items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-semibold">{order.id}</p>
                {showCustomer && <p className="mt-1 truncate text-sm text-muted-foreground">{order.customerName}</p>}
                <p className="mt-1 text-sm text-muted-foreground">{formatDate(order.date)}</p>
              </div>
              <StatusBadge status={order.status} />
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 border-t pt-3 text-sm">
              <div><dt className="text-muted-foreground">Items</dt><dd className="font-medium">{order.items.reduce((sum, item) => sum + item.quantity, 0)}</dd></div>
              <div><dt className="text-muted-foreground">Payment</dt><dd className="truncate font-medium">{order.payment}</dd></div>
              <div className="col-span-2 flex items-end justify-between gap-3">
                <div><dt className="text-muted-foreground">Total</dt><dd className="font-semibold">{formatPrice(order.total)}</dd></div>
                {manageBaseHref && <Link href={`${manageBaseHref}/${order.id}`} className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}>Manage</Link>}
              </div>
            </dl>
          </article>
        ))}
      </div>
      <Card className="hidden min-w-0 overflow-hidden p-0 sm:block">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                {showCustomer && <TableHead>Customer</TableHead>}
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
                {manageBaseHref && <TableHead className="w-24 text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  {showCustomer && <TableCell>{order.customerName}</TableCell>}
                  <TableCell>{formatDate(order.date)}</TableCell>
                  <TableCell>{order.items.reduce((sum, item) => sum + item.quantity, 0)}</TableCell>
                  <TableCell>{order.payment}</TableCell>
                  <TableCell><StatusBadge status={order.status} /></TableCell>
                  <TableCell className="text-right">{formatPrice(order.total)}</TableCell>
                  {manageBaseHref && <TableCell className="text-right"><Link href={`${manageBaseHref}/${order.id}`} className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}>Manage</Link></TableCell>}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </>
  )
}
