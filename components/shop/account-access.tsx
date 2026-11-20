'use client'

import { useState } from 'react'
import { UserIcon } from 'lucide-react'
import { AuthForm } from '@/components/dashboard/auth-form'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/lib/language'

export function AccountAccess({ showLabel = false, menuStyle = false }: { showLabel?: boolean; menuStyle?: boolean }) {
  const [open, setOpen] = useState(false)
  const { t } = useLanguage()

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        onClick={() => setOpen(true)}
        className={menuStyle ? 'w-full justify-start gap-3 px-3 py-2.5 text-foreground hover:bg-accent hover:text-foreground' : 'size-9 w-9 gap-2 p-0 text-header-foreground hover:bg-white/10 hover:text-header-foreground sm:w-auto sm:px-4'}
        aria-label={t('Account')}
        aria-haspopup="dialog"
      >
        <UserIcon data-icon="inline-start" />
        <span className={showLabel ? '' : 'hidden sm:inline'}>{t('Account')}</span>
      </Button>
      {open && <AuthForm mode="login" onClose={() => setOpen(false)} />}
    </>
  )
}
