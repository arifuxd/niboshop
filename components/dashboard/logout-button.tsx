'use client'

import { LogOutIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function LogoutButton() {
  const router = useRouter()

  async function signOut() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } finally {
      window.dispatchEvent(new Event('niboshop-auth-change'))
      router.push('/login')
      router.refresh()
    }
  }

  return (
    <button
      type="button"
      onClick={signOut}
      className="flex min-h-11 w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 hover:text-destructive"
    >
      <LogOutIcon className="size-4 shrink-0" aria-hidden="true" />
      Sign out
    </button>
  )
}
