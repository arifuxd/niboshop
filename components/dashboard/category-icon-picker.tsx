'use client'

import * as React from 'react'
import * as LucideIcons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { ImagePlusIcon, SearchIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

const iconEntries = Object.entries(LucideIcons)
  .filter(([name, value]) => name.endsWith('Icon') && name !== 'createLucideIcon' && (typeof value === 'function' || (typeof value === 'object' && value !== null)))
  .map(([name, Icon]) => [name.replace(/Icon$/, ''), Icon as LucideIcon] as const)

function toIconValue(name: string) {
  return name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

function fromIconValue(value: string) {
  return value.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join('')
}

export function CategoryIconPicker({ name = 'icon', defaultValue = 'smartphone' }: { name?: string; defaultValue?: string }) {
  const [value, setValue] = React.useState(defaultValue)
  const [query, setQuery] = React.useState('')
  const [error, setError] = React.useState('')
  const [uploading, setUploading] = React.useState(false)
  const fileRef = React.useRef<HTMLInputElement>(null)
  const matching = iconEntries.filter(([iconName]) => iconName.toLowerCase().includes(query.trim().toLowerCase())).slice(0, 120)
  const activeIcon = iconEntries.find(([iconName]) => toIconValue(iconName) === value)?.[1]

  async function uploadIcon(file?: File) {
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(file.type) || file.size > 5 * 1024 * 1024) {
      setError('Choose a square JPG, PNG, WebP, or AVIF image under 5 MB.')
      return
    }
    const bitmap = await createImageBitmap(file)
    if (bitmap.width !== bitmap.height) {
      bitmap.close()
      setError('Category icons must be square.')
      return
    }
    bitmap.close()
    setError('')
    setUploading(true)
    try {
      const body = new FormData()
      body.set('file', file)
      const response = await fetch('/api/admin/category-icons', { method: 'POST', body })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Icon upload failed.')
      setValue(result.url)
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Icon upload failed.')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <input type="hidden" name={name} value={value} />
      <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3">
        <span className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-accent text-accent-foreground">
          {value.startsWith('https://') || value.startsWith('/') ? <img src={value} alt="Selected category icon" className="size-full object-cover" /> : activeIcon ? React.createElement(activeIcon, { 'aria-hidden': true }) : null}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">Choose an icon</p>
          <p className="truncate text-xs text-muted-foreground">Search Lucide or upload your own square image</p>
        </div>
        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="sr-only" aria-label="Upload square category icon" onChange={(event) => void uploadIcon(event.target.files?.[0])} />
        <Button type="button" size="sm" variant="outline" disabled={uploading} onClick={() => fileRef.current?.click()}>
          <ImagePlusIcon data-icon="inline-start" />{uploading ? 'Uploading' : 'Upload'}
        </Button>
      </div>
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search icons…" aria-label="Search category icons" className="pl-9" />
      </div>
      <div className="grid max-h-44 grid-cols-6 gap-1 overflow-y-auto rounded-lg border p-2 sm:grid-cols-8" role="listbox" aria-label="Icon library">
        {matching.map(([iconName, Icon]) => {
          const iconValue = toIconValue(iconName)
          return (
            <button key={iconName} type="button" role="option" aria-selected={value === iconValue} aria-label={iconName} title={iconName} onClick={() => { setValue(iconValue); setError('') }} className={cn('flex aspect-square items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground', value === iconValue && 'bg-accent text-accent-foreground ring-1 ring-ring')}>
              <Icon aria-hidden="true" />
            </button>
          )
        })}
        {!matching.length && <p className="col-span-full p-3 text-center text-sm text-muted-foreground">No icons match that search.</p>}
      </div>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
