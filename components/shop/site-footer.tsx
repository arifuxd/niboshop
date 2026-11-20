'use client'

import Link from 'next/link'
import { ClockIcon, MailIcon, PhoneIcon } from 'lucide-react'

import { footerLinks, siteConfig } from '@/lib/site-config'
import { useLanguage } from '@/lib/language'
import { useStoreSettings } from '@/lib/use-store-settings'
import { Logo } from './logo'

export function SiteFooter() {
  const { t } = useLanguage()
  const { data: settings } = useStoreSettings()

  return (
    <footer className="mt-12 bg-footer text-footer-foreground">
      <div className="container-shop grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr]">
        <div className="flex flex-col gap-4">
          <Logo />
          <p className="text-sm leading-6">{t(siteConfig.description)}</p>
          <ul className="flex flex-col gap-2 text-sm">
            <li className="flex items-center gap-2">
              <PhoneIcon className="size-4 shrink-0" aria-hidden="true" />
              <a href={`tel:${settings!.phone}`}>{settings!.phone}</a>
            </li>
            <li className="flex items-center gap-2">
              <MailIcon className="size-4 shrink-0" aria-hidden="true" />
              <a href={`mailto:${settings!.email}`}>{settings!.email}</a>
            </li>
            <li className="flex items-center gap-2">
              <ClockIcon className="size-4 shrink-0" aria-hidden="true" />
              <span>{settings!.hours}</span>
            </li>
          </ul>
        </div>

        <FooterColumn title="Shop" links={footerLinks.shop} />
        <FooterColumn title="My Account" links={footerLinks.account} />
      </div>
      <div className="border-t border-white/10">
        <p className="container-shop py-4 text-center text-xs">
          &copy; {new Date().getFullYear()} {siteConfig.name}. {t('All rights reserved.')}
        </p>
      </div>
    </footer>
  )
}

function FooterColumn({
  title,
  links,
}: {
  title: string
  links: readonly { label: string; href: string }[]
}) {
  const { t } = useLanguage()

  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-semibold text-header-foreground">{t(title)}</h3>
      <ul className="flex flex-col gap-2 text-sm">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="hover:text-header-foreground hover:underline">
              {t(l.label)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
