import type { Metadata } from 'next'
import { DashboardShell } from '@/components/dashboard/dashboard-shell'
import { adminNav } from '@/lib/site-config'
import { serverApi } from '@/lib/api-server'
import { redirect } from 'next/navigation'

export const metadata: Metadata = { title: { default: 'Admin', template: '%s | Admin' } }

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  let user:{role:string}; try { user=await serverApi<{role:string}>('/auth/me') } catch { redirect('/login') }
  if(user.role!=='admin') redirect('/account')
  return (
    <DashboardShell title="Admin" nav={adminNav} rootHref="/admin" showSignOut>
      {children}
    </DashboardShell>
  )
}
