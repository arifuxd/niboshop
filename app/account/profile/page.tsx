import type { Metadata } from 'next'
import { PageHeader } from '@/components/dashboard/primitives'
import { getCurrentCustomer } from '@/lib/data'
import { ProfileEditor } from '@/components/dashboard/profile-editor'
import { PasswordUpdateCard } from '@/components/dashboard/password-update-card'

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
      <ProfileEditor fields={fields} />
      <PasswordUpdateCard />
    </>
  )
}
