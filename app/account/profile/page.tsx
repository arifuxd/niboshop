import type { Metadata } from 'next'
import { PageHeader } from '@/components/dashboard/primitives'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getCurrentCustomer } from '@/lib/data'

export const metadata: Metadata = { title: 'Profile' }

export default async function ProfilePage() {
  const c = await getCurrentCustomer()
  const fields = [
    { id: 'name', label: 'Full name', value: c.name, type: 'text' },
    { id: 'email', label: 'Email', value: c.email, type: 'email' },
    { id: 'phone', label: 'Phone', value: c.phone, type: 'tel' },
    { id: 'city', label: 'City', value: c.city, type: 'text' },
  ]
  return (
    <>
      <PageHeader title="Profile" description="Update your personal information." />
      <Card>
        <CardContent>
          <form className="grid max-w-2xl gap-4 sm:grid-cols-2">
            {fields.map((f) => (
              <div key={f.id} className="flex flex-col gap-2">
                <Label htmlFor={f.id}>{f.label}</Label>
                <Input id={f.id} name={f.id} type={f.type} defaultValue={f.value} />
              </div>
            ))}
            <div className="sm:col-span-2">
              <Button type="submit">Save changes</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  )
}
