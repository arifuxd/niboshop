'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const gallery = images.length > 0 ? images : ['/placeholder.svg']
  const [activeIndex, setActiveIndex] = React.useState(0)

  return (
    <section aria-label={`${name} image gallery`} className="flex min-w-0 flex-col gap-3">
      <div className="relative aspect-square overflow-hidden rounded-xl border bg-card">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={gallery[activeIndex]} alt={`${name} — image ${activeIndex + 1} of ${gallery.length}`} className="size-full object-contain p-3" fetchPriority="high" />
      </div>
      {gallery.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1" role="group" aria-label="Choose product image">
          {gallery.map((src, index) => (
            <button
              key={`${src}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`${index === 0 ? 'Main image' : `Image ${index + 1}`} for ${name}`}
              aria-pressed={activeIndex === index}
              className={cn(
                'relative size-20 shrink-0 overflow-hidden rounded-xl border bg-card transition-colors sm:size-24',
                activeIndex === index ? 'border-primary ring-1 ring-primary' : 'hover:border-muted-foreground/50',
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="size-full object-contain p-1.5" />
            </button>
          ))}
        </div>
      )}
    </section>
  )
}
