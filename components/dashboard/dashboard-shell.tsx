'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ExternalLinkIcon } from 'lucide-react'
import { LanguageSwitcher } from '@/components/language-switcher'
import { useLanguage } from '@/lib/language'
import { NamedIcon } from '@/components/shop/category-icon'
import { Logo } from '@/components/shop/logo'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type NavItem = { readonly label: string; readonly href: string; readonly icon: string }

export function DashboardShell({
  title,
  nav,
  rootHref,
  children,
}: {
  title: string
  nav: readonly NavItem[]
  rootHref: string
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { t } = useLanguage()
  const isActive = (href: string) =>
    href === rootHref ? pathname === href : pathname.startsWith(href)

  return (
    <div className="min-h-svh overflow-x-clip bg-muted/40">
      <header className="sticky top-0 z-30 border-b bg-header text-header-foreground">
        <div className="container-shop flex h-14 items-center gap-4">
          <Logo />
          <span className="hidden rounded-md bg-white/10 px-2 py-1 text-xs font-medium sm:inline">
            {t(title)}
          </span>
          <LanguageSwitcher className="ml-auto" />
          <Link
            href="/"
            aria-label={t('View store')}
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'sm' }),
              'text-header-foreground hover:bg-white/10 hover:text-header-foreground',
            )}
          >
            <ExternalLinkIcon data-icon="inline-start" />
            <span className="hidden sm:inline">{t('View store')}</span>
          </Link>
        </div>
      </header>

      <div className="container-shop grid min-w-0 gap-5 py-5 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-6 lg:py-6">
        <nav aria-label={`${t(title)} navigation`} className="min-w-0 lg:sticky lg:top-20 lg:h-fit">
          <details open className="group overflow-hidden rounded-xl border bg-card shadow-sm lg:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-4 text-sm font-semibold [&::-webkit-details-marker]:hidden">
              <span className="flex items-center gap-2"><NamedIcon name="user" className="size-4" />{t(title)} {t('Details')}</span>
              <span className="text-muted-foreground transition-transform group-open:rotate-180">⌄</span>
            </summary>
            <ul className="border-t p-1.5">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} aria-current={isActive(item.href) ? 'page' : undefined} className={cn('flex min-h-11 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors', isActive(item.href) ? 'bg-accent text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground')}>
                    <NamedIcon name={item.icon} className="size-4 shrink-0" />{t(item.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </details>
          <ul className="hidden overflow-hidden rounded-xl border bg-card p-1.5 shadow-sm lg:flex lg:flex-col">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} aria-current={isActive(item.href) ? 'page' : undefined} className={cn('flex min-h-11 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors', isActive(item.href) ? 'bg-accent text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground')}>
                  <NamedIcon name={item.icon} className="size-4 shrink-0" />{t(item.label)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="min-w-0 flex flex-col gap-6">{children}</div>
      </div>
    </div>
  )
}
