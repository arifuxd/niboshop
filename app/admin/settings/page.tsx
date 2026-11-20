import type { Metadata } from 'next'
import { PageHeader } from '@/components/dashboard/primitives'
import { StoreSettingsForm } from '@/components/dashboard/store-settings-form'
import { serverApi } from '@/lib/api-server'
import type { StoreSettings } from '@/lib/store-settings'

export const metadata: Metadata = { title: 'Store settings' }

export default async function StoreSettingsPage() {
  const settings = await serverApi<StoreSettings>('/settings')
  return (
    <>
      <PageHeader title="Store settings" description="Manage your storefront identity, support contacts and delivery pricing." />
      <StoreSettingsForm settings={settings} />
    </>
  )
}
