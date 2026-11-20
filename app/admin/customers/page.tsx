import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/dashboard/primitives'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getCustomers } from '@/lib/data'
import { formatDate, formatPrice } from '@/lib/format'
import { cn } from '@/lib/utils'

export const metadata: Metadata = { title: 'Customers' }

export default async function AdminCustomersPage() {
  const customers = await getCustomers()
  return (
    <>
      <PageHeader
        title="Customers"
        description={`${customers.length} customers`}
        actions={
          <Link href="/admin/customers/new" className={cn(buttonVariants())}>
            Add customer
          </Link>
        }
      />
      <Card className="overflow-hidden p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Spent</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((c) => (
              <TableRow key={c.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {c.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium">{c.name}</span>
                      <span className="text-xs text-muted-foreground">{c.email}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{c.phone}</TableCell>
                <TableCell>{c.city}</TableCell>
                <TableCell>{c.orders}</TableCell>
                <TableCell>{formatDate(c.joined)}</TableCell>
                <TableCell>
                  {c.status === 'blocked' ? (
                    <Badge variant="destructive">Blocked</Badge>
                  ) : (
                    <Badge variant="secondary" className="text-success">
                      Active
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">{formatPrice(c.spent)}</TableCell>
                <TableCell className="text-right">
                  <Link
                    href={`/admin/customers/${c.id}`}
                    className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
                  >
                    Manage
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </>
  )
}
