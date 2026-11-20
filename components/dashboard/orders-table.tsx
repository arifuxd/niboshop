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
    <Card className="overflow-hidden p-0">
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
          {orders.map((o) => (
            <TableRow key={o.id}>
              <TableCell className="font-medium">{o.id}</TableCell>
              {showCustomer && <TableCell>{o.customerName}</TableCell>}
              <TableCell>{formatDate(o.date)}</TableCell>
              <TableCell>{o.items.reduce((s, i) => s + i.quantity, 0)}</TableCell>
              <TableCell>{o.payment}</TableCell>
              <TableCell>
                <StatusBadge status={o.status} />
              </TableCell>
              <TableCell className="text-right">{formatPrice(o.total)}</TableCell>
              {manageBaseHref && (
                <TableCell className="text-right">
                  <Link
                    href={`${manageBaseHref}/${o.id}`}
                    className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
                  >
                    Manage
                  </Link>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}
