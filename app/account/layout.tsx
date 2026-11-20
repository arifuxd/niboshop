import type { Metadata } from 'next'
import { DashboardShell } from '@/components/dashboard/dashboard-shell'
import { accountNav } from '@/lib/site-config'

export const metadata: Metadata = { title: { default: 'My Account', template: '%s | My Account' } }

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell title="My Account" nav={accountNav} rootHref="/account">
      {children}
    </DashboardShell>
  )
}
