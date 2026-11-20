import type { Metadata } from 'next'
import Image from 'next/image'
import { PageHeader } from '@/components/dashboard/primitives'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { DeleteProductButton } from '@/components/dashboard/delete-product-button'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getCategories, getProducts } from '@/lib/data'
import { formatPrice } from '@/lib/format'

export const metadata: Metadata = { title: 'Products' }

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()])
  const categoryName = (slug: string) => categories.find((c) => c.slug === slug)?.name ?? slug

  return (
    <>
      <PageHeader
        title="Products"
        description={`${products.length} products`}
        actions={
          <Link href="/admin/products/new" className={cn(buttonVariants())}>
            Add product
          </Link>
        }
      />
      <Card className="overflow-hidden p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-16 text-right">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Image
                      src={p.image}
                      alt=""
                      width={40}
                      height={40}
                      className="size-10 rounded-md bg-muted object-cover"
                    />
                    <span className="line-clamp-1 max-w-xs font-medium">{p.name}</span>
                  </div>
                </TableCell>
                <TableCell>{categoryName(p.categorySlug)}</TableCell>
                <TableCell>{formatPrice(p.price)}</TableCell>
                <TableCell>{p.stock}</TableCell>
                <TableCell>
                  {p.stock === 0 ? (
                    <Badge variant="destructive">Out of stock</Badge>
                  ) : p.stock < 10 ? (
                    <Badge variant="secondary">Low stock</Badge>
                  ) : (
                    <Badge variant="secondary" className="text-success">
                      Active
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <DeleteProductButton id={p.id} name={p.name} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </>
  )
}
