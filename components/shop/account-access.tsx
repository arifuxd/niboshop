'use client'

import { useState } from 'react'
import { UserIcon } from 'lucide-react'
import { AuthForm } from '@/components/dashboard/auth-form'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/lib/language'

export function AccountAccess() {
  const [open, setOpen] = useState(false)
  const { t } = useLanguage()

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        onClick={() => setOpen(true)}
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
