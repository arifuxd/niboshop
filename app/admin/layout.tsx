import type { Metadata } from 'next'
import { DashboardShell } from '@/components/dashboard/dashboard-shell'
import { adminNav } from '@/lib/site-config'

export const metadata: Metadata = { title: { default: 'Admin', template: '%s | Admin' } }

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell title="Admin" nav={adminNav} rootHref="/admin">
      {children}
    </DashboardShell>
  )
}
