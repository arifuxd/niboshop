'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import useSWR from 'swr'
import { SearchIcon, XIcon } from 'lucide-react'
import { useLanguage } from '@/lib/language'
import { Price } from './price'

type SearchResult = {
  id: string
  slug: string
  name: string
  image: string
  price: number
  comparePrice?: number
}

const fetcher = (url: string) => fetch(url).then((r) => r.json() as Promise<SearchResult[]>)

export function SearchBox({ className }: { className?: string }) {
  const { t } = useLanguage()
  const [query, setQuery] = React.useState('')
  const [debounced, setDebounced] = React.useState('')
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim()), 200)
    return () => clearTimeout(t)
  }, [query])

  React.useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const enabled = debounced.length >= 3
  const { data, isLoading } = useSWR(
    enabled ? `/api/search?q=${encodeURIComponent(debounced)}` : null,
    fetcher,
    { keepPreviousData: true },
  )

  const showPanel = open && query.trim().length >= 3

  return (
    <div ref={ref} className={`relative ${className ?? ''}`}>
      <div className="flex h-11 items-center gap-2 rounded-lg border bg-background px-3 text-foreground focus-within:ring-2 focus-within:ring-ring">
        <SearchIcon className="size-4 text-muted-foreground" aria-hidden="true" />
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
          placeholder={t('Search for products...')}
          aria-label={t('Search products')}
          className="h-full flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:hidden"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('')
              setOpen(false)
            }}
            aria-label={t('Clear search')}
            className="text-muted-foreground hover:text-foreground"
          >
            <XIcon className="size-4" />
          </button>
        )}
      </div>

      {showPanel && (
        <div className="absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-xl border bg-popover text-popover-foreground shadow-lg">
          {!data && isLoading ? (
            <p className="p-4 text-sm text-muted-foreground">{t('Searching...')}</p>
          ) : data && data.length > 0 ? (
            <ul className="max-h-96 divide-y overflow-y-auto">
              {data.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/product/${p.slug}`}
                    onClick={() => {
                      setOpen(false)
                      setQuery('')
                    }}
                    className="flex items-center gap-3 p-3 hover:bg-accent"
                  >
                    <Image
                      src={p.image}
                      alt=""
                      width={48}
                      height={48}
                      className="size-12 shrink-0 rounded-md bg-muted object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm font-medium">{p.name}</p>
                      <Price price={p.price} comparePrice={p.comparePrice} size="sm" />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="p-4 text-sm text-muted-foreground">
              {t('No products found for')} &ldquo;{debounced}&rdquo;.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
