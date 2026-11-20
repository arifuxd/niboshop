import type { Metadata } from 'next'
import { PageHeader } from '@/components/dashboard/primitives'
import { HomepageSettingsForm } from '@/components/dashboard/homepage-settings-form'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { getProducts, heroBanners, homepageSections, sideBanners } from '@/lib/data'

export const metadata: Metadata = { title: 'Homepage settings' }

export default async function AdminHomepageSettingsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const [{ status }, products] = await Promise.all([searchParams, getProducts()])
  return (
    <>
      <PageHeader title="Homepage settings" description="Manage hero banners, section titles, and featured products." />
      {status === 'saved' && <Alert><AlertDescription>Homepage settings saved.</AlertDescription></Alert>}
      {status === 'error' && <Alert variant="destructive"><AlertDescription>Some values were invalid. Check banner URLs, section titles, and product selections.</AlertDescription></Alert>}
      <HomepageSettingsForm hero={heroBanners} side={sideBanners} sections={homepageSections} products={products} />
    </>
  )
}
