'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Banner } from '@/lib/data/types'

function HeroCarousel({ banners }: { banners: Banner[] }) {
  const [index, setIndex] = React.useState(0)
  const [paused, setPaused] = React.useState(false)
  const count = banners.length

  React.useEffect(() => {
    if (paused || count < 2) return
    const t = setInterval(() => setIndex((i) => (i + 1) % count), 5000)
    return () => clearInterval(t)
  }, [paused, count])

  const go = (n: number) => setIndex((n + count) % count)

  return (
    <div
      className="group relative aspect-[16/8] overflow-hidden rounded-xl bg-muted lg:aspect-auto lg:h-full"
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured offers"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="flex h-full transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {banners.map((b, i) => (
          <Link
            key={b.id}
            href={b.href}
            className="relative block h-full w-full shrink-0"
            aria-hidden={i !== index}
            tabIndex={i === index ? 0 : -1}
          >
            <Image
              src={b.image}
              alt={b.alt}
              fill
              priority={i === 0}
              sizes="(min-width: 1024px) 66vw, 100vw"
              className="object-cover"
            />
          </Link>
        ))}
      </div>

      <Button
        variant="secondary"
        size="icon"
        className="absolute left-3 top-1/2 -translate-y-1/2 opacity-0 transition-opacity focus-visible:opacity-100 group-hover:opacity-100"
        onClick={() => go(index - 1)}
        aria-label="Previous slide"
      >
        <ChevronLeftIcon />
      </Button>
      <Button
        variant="secondary"
        size="icon"
        className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 transition-opacity focus-visible:opacity-100 group-hover:opacity-100"
        onClick={() => go(index + 1)}
        aria-label="Next slide"
      >
        <ChevronRightIcon />
      </Button>

      <div className="absolute inset-x-0 bottom-3 flex justify-center gap-2">
        {banners.map((b, i) => (
          <button
            key={b.id}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === index}
            className={cn(
              'h-2 rounded-full bg-white/60 transition-all',
              i === index ? 'w-6 bg-white' : 'w-2',
            )}
          />
        ))}
      </div>
    </div>
  )
}

export function Hero({
  banners,
  sideBanners,
}: {
  banners: Banner[]
  sideBanners: Banner[]
}) {
  return (
    <section className="container-shop grid gap-3 py-4 lg:h-[400px] lg:grid-cols-3">
      <div className="lg:col-span-2">
        <HeroCarousel banners={banners} />
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-1 lg:grid-rows-2">
        {sideBanners.map((b) => (
          <Link
            key={b.id}
            href={b.href}
            className="relative block aspect-[16/9] overflow-hidden rounded-xl bg-muted lg:aspect-auto"
          >
            <Image
              src={b.image}
              alt={b.alt}
              fill
              sizes="(min-width: 1024px) 33vw, 50vw"
              className="object-cover transition-transform duration-300 hover:scale-105"
            />
          </Link>
        ))}
      </div>
    </section>
  )
}
