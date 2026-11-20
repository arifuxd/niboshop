import type { Metadata } from 'next'
import { PageHeader } from '@/components/dashboard/primitives'
import { StoreSettingsForm } from '@/components/dashboard/store-settings-form'
import { getStoreSettings } from '@/lib/store-settings'

export const metadata: Metadata = { title: 'Store settings' }

export default function StoreSettingsPage() {
  return (
    <>
      <PageHeader title="Store settings" description="Manage your storefront identity, support contacts and delivery pricing." />
      <StoreSettingsForm settings={getStoreSettings()} />
    </>
  )
}
