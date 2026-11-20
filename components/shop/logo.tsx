'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useStoreSettings } from '@/lib/use-store-settings'
import { siteConfig } from '@/lib/site-config'
import { cn } from '@/lib/utils'

// The logo artwork is the white-on-dark version, so it must sit on a dark surface (header, footer, dashboard bar).
export function Logo({ className }: { className?: string }) {
  const { data: settings } = useStoreSettings()
  return (
    <Link
      href="/"
      aria-label={`${siteConfig.name} home`}
      className={cn('flex shrink-0 items-center', className)}
    >
      <Image
        src={settings!.logoUrl}
        alt={siteConfig.name}
        width={1970}
        height={440}
        priority
        className="h-7 w-auto sm:h-9"
      />
    </Link>
  )
}
