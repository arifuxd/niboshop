import type { Metadata } from 'next'
import { CustomerForm } from '@/components/dashboard/customer-form'
import { PageHeader } from '@/components/dashboard/primitives'
import { Card, CardContent } from '@/components/ui/card'

export const metadata: Metadata = { title: 'Add customer' }

export default function NewCustomerPage() {
  return (
    <>
      <PageHeader title="Add customer" description="Create a customer record manually." />
      <Card className="max-w-2xl">
        <CardContent>
          <CustomerForm />
        </CardContent>
      </Card>
    </>
  )
}
