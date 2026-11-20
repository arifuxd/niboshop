import type { Metadata } from 'next'
import { PasswordUpdateCard } from '@/components/dashboard/password-update-card'
import { PageHeader } from '@/components/dashboard/primitives'

export const metadata: Metadata = { title: 'Profile and security' }

export default function AdminProfilePage() {
  return (
    <>
      <PageHeader title="Profile & security" description="Manage your admin account credentials." />
      <PasswordUpdateCard />
    </>
  )
}
