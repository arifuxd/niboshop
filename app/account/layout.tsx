import type { Metadata } from 'next'
import { DashboardShell } from '@/components/dashboard/dashboard-shell'
import { accountNav } from '@/lib/site-config'
import { serverApi } from '@/lib/api-server'
import { redirect } from 'next/navigation'

export const metadata: Metadata = { title: { default: 'My Account', template: '%s | My Account' } }

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  let user:{role:string}; try { user=await serverApi<{role:string}>('/auth/me') } catch { redirect('/login') }
  if(user.role!=='customer') redirect('/admin')
  return (
    <DashboardShell title="My Account" nav={accountNav} rootHref="/account" showSignOut>
      {children}
    </DashboardShell>
  )
}
