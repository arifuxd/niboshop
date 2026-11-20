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
      <div className="flex flex-col gap-3 sm:hidden">
        {customers.map((c) => (
          <article key={c.id} className="min-w-0 rounded-xl border bg-card p-4 shadow-sm">
            <div className="flex min-w-0 items-center gap-3">
              <Avatar className="shrink-0"><AvatarFallback>{c.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}</AvatarFallback></Avatar>
              <div className="min-w-0 flex-1"><p className="truncate font-medium">{c.name}</p><p className="truncate text-xs text-muted-foreground">{c.email}</p></div>
              {c.status === 'blocked' ? <Badge variant="destructive">Blocked</Badge> : <Badge variant="secondary" className="text-success">Active</Badge>}
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-3 border-t pt-3 text-sm">
              <div><dt className="text-muted-foreground">Phone</dt><dd className="truncate font-medium">{c.phone}</dd></div>
              <div><dt className="text-muted-foreground">City</dt><dd className="truncate font-medium">{c.city}</dd></div>
              <div><dt className="text-muted-foreground">Orders</dt><dd className="font-medium">{c.orders}</dd></div>
              <div><dt className="text-muted-foreground">Joined</dt><dd className="font-medium">{formatDate(c.joined)}</dd></div>
              <div><dt className="text-muted-foreground">Spent</dt><dd className="font-semibold">{formatPrice(c.spent)}</dd></div>
              <div className="flex items-end justify-end"><Link href={`/admin/customers/${c.id}`} className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}>Manage</Link></div>
            </dl>
          </article>
        ))}
      </div>
      <Card className="hidden min-w-0 overflow-hidden p-0 sm:block">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader><TableRow><TableHead>Customer</TableHead><TableHead>Phone</TableHead><TableHead>City</TableHead><TableHead>Orders</TableHead><TableHead>Joined</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Spent</TableHead><TableHead className="w-24 text-right">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {customers.map((c) => (
                <TableRow key={c.id}>
                  <TableCell><div className="flex items-center gap-3"><Avatar><AvatarFallback>{c.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}</AvatarFallback></Avatar><div className="flex min-w-0 flex-col"><span className="truncate font-medium">{c.name}</span><span className="truncate text-xs text-muted-foreground">{c.email}</span></div></div></TableCell>
                  <TableCell>{c.phone}</TableCell><TableCell>{c.city}</TableCell><TableCell>{c.orders}</TableCell><TableCell>{formatDate(c.joined)}</TableCell>
                  <TableCell>{c.status === 'blocked' ? <Badge variant="destructive">Blocked</Badge> : <Badge variant="secondary" className="text-success">Active</Badge>}</TableCell>
                  <TableCell className="text-right">{formatPrice(c.spent)}</TableCell><TableCell className="text-right"><Link href={`/admin/customers/${c.id}`} className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}>Manage</Link></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </>
  )
}
