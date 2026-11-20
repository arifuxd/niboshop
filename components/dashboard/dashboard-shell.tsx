'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ExternalLinkIcon } from 'lucide-react'
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
  const isActive = (href: string) =>
    href === rootHref ? pathname === href : pathname.startsWith(href)

  return (
    <div className="min-h-svh bg-muted/40">
      <header className="sticky top-0 z-30 border-b bg-header text-header-foreground">
        <div className="container-shop flex h-14 items-center gap-4">
          <Logo />
          <span className="hidden rounded-md bg-white/10 px-2 py-1 text-xs font-medium sm:inline">
            {title}
          </span>
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'sm' }),
              'ml-auto text-header-foreground hover:bg-white/10 hover:text-header-foreground',
            )}
          >
            <ExternalLinkIcon data-icon="inline-start" />
            View store
          </Link>
        </div>
      </header>

      <div className="container-shop grid gap-6 py-6 lg:grid-cols-[220px_1fr]">
        <nav aria-label={`${title} navigation`} className="lg:sticky lg:top-20 lg:h-fit">
          <ul className="flex gap-1 overflow-x-auto scrollbar-none lg:flex-col">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className={cn(
                    'flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive(item.href)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                  )}
                >
                  <NamedIcon name={item.icon} className="size-4" />
                  {item.label}
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
