'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { UserIcon } from 'lucide-react'
import { AuthForm } from '@/components/dashboard/auth-form'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/lib/language'
import { api } from '@/lib/api'

export function AccountAccess() {
  const [open, setOpen] = useState(false)
  const [checking, setChecking] = useState(false)
  const { t } = useLanguage()
  const router = useRouter()

  async function openAccount() {
    if (checking) return
    setChecking(true)
    try {
      const user = await api<{ role: string }>('/auth/me')
      router.push(user.role === 'admin' ? '/admin' : '/account')
    } catch {
      setOpen(true)
    } finally {
      setChecking(false)
    }
  }

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        onClick={openAccount}
        disabled={checking}
        className="size-9 w-9 gap-2 p-0 text-header-foreground hover:bg-white/10 hover:text-header-foreground sm:w-auto sm:px-4"
        aria-label={t('Account')}
        aria-haspopup="dialog"
      >
        <UserIcon data-icon="inline-start" />
        <span className="hidden sm:inline">{t('Account')}</span>
      </Button>
      {open && <AuthForm mode="login" onClose={() => setOpen(false)} />}
    </>
  )
}
