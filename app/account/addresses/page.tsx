import type { Metadata } from 'next'
import { PageHeader } from '@/components/dashboard/primitives'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getCurrentCustomer } from '@/lib/data'

export const metadata: Metadata = { title: 'Addresses' }

export default async function AddressesPage() {
  const c = await getCurrentCustomer()
  const addresses = [
    { label: 'Home', text: `House 12, Road 5, Dhanmondi, ${c.city} 1205`, isDefault: true },
    { label: 'Office', text: `Level 6, Gulshan Avenue, ${c.city} 1212`, isDefault: false },
  ]
  return (
    <>
      <PageHeader title="Addresses" actions={<Button>Add address</Button>} />
      <div className="grid gap-4 sm:grid-cols-2">
        {addresses.map((a) => (
          <Card key={a.label}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{a.label}</CardTitle>
              {a.isDefault && <Badge>Default</Badge>}
            </CardHeader>
            <CardContent className="flex flex-col gap-1 text-sm text-muted-foreground">
              <p className="text-foreground">{c.name}</p>
              <p>{a.text}</p>
              <p>{c.phone}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )
}
