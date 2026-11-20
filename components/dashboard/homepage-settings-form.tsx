'use client'

import * as React from 'react'
import Image from 'next/image'
import { ImagePlusIcon, PlusIcon, SearchIcon, Trash2Icon, XIcon } from 'lucide-react'
import { saveHomepageSettingsAction } from '@/app/admin/actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import type { Banner, Product } from '@/lib/data'
import type { HomepageSection } from '@/lib/data'

const acceptedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']

function BannerImageUpload({ id, label, name, value, onChange }: { id: string; label: string; name: string; value: string; onChange: (value: string) => void }) {
  const fileRef = React.useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = React.useState(false)
  const [error, setError] = React.useState('')

  async function uploadImage(file?: File) {
    if (!file) return
    if (!acceptedImageTypes.includes(file.type) || file.size === 0 || file.size > 5 * 1024 * 1024) {
      setError('Choose a JPG, PNG, WebP, or AVIF image under 5 MB.')
      return
    }
    setError('')
    setUploading(true)
    try {
      const body = new FormData()
      body.set('file', file)
      const response = await fetch('/api/admin/homepage-images', { method: 'POST', body })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Image upload failed.')
      onChange(result.url)
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Image upload failed.')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  return (
    <Field className="sm:col-span-2">
      <FieldLabel htmlFor={`${id}-file`}>{label}</FieldLabel>
      <input type="hidden" name={name} value={value} />
      <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3">
        <div className="relative size-16 shrink-0 overflow-hidden rounded-md bg-muted">
          {value ? <Image src={value} alt="Selected banner preview" fill sizes="64px" className="object-cover" unoptimized /> : <div className="flex size-full items-center justify-center text-muted-foreground"><ImagePlusIcon aria-hidden="true" /></div>}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">{value ? 'Image selected' : 'No image selected'}</p>
          <p className="text-xs text-muted-foreground">JPG, PNG, WebP, or AVIF · Max 5 MB</p>
        </div>
        <input ref={fileRef} id={`${id}-file`} type="file" accept={acceptedImageTypes.join(',')} className="sr-only" aria-label={`Upload ${label.toLowerCase()}`} onChange={(event) => void uploadImage(event.target.files?.[0])} />
        <Button type="button" variant="outline" disabled={uploading} onClick={() => fileRef.current?.click()}>
          <ImagePlusIcon data-icon="inline-start" />{uploading ? 'Uploading…' : 'Upload image'}
        </Button>
      </div>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    </Field>
  )
}

type Props = { hero: Banner[]; side: Banner[]; sections: HomepageSection[]; products: Product[] }

export function HomepageSettingsForm({ hero, side, sections, products }: Props) {
  const [slides, setSlides] = React.useState(hero)
  const [sideBanners, setSideBanners] = React.useState(side)
  const [homepageSections, setHomepageSections] = React.useState(sections)
  const [queries, setQueries] = React.useState<Record<string, string>>({})
  const updateBanner = (index: number, key: keyof Banner, value: string) => {
    setSlides((current) => current.map((banner, i) => i === index ? { ...banner, [key]: value } : banner))
  }
  const updateSideBanner = (index: number, key: keyof Banner, value: string) => {
    setSideBanners((current) => current.map((banner, i) => i === index ? { ...banner, [key]: value } : banner))
  }
  const updateSection = (index: number, patch: Partial<HomepageSection>) => {
    setHomepageSections((current) => current.map((section, i) => i === index ? { ...section, ...patch } : section))
  }

  return (
    <form action={saveHomepageSettingsAction} className="flex flex-col gap-6">
      <input type="hidden" name="hero-count" value={slides.length} />
      <input type="hidden" name="side-count" value={sideBanners.length} />
      <input type="hidden" name="section-count" value={homepageSections.length} />
      <Card>
        <CardHeader>
          <CardTitle>Hero slideshow</CardTitle>
          <CardDescription>Upload banner images, add optional accessible descriptions, and set a destination URL for each slide.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          {slides.map((banner, index) => (
            <div key={banner.id} className="grid gap-3 rounded-lg border p-4 sm:grid-cols-2">
              <input type="hidden" name={`hero-${index}-id`} value={banner.id} />
              <BannerImageUpload id={`hero-image-${index}`} label={`Slide ${index + 1} image`} name={`hero-${index}-image`} value={banner.image} onChange={(value) => updateBanner(index, 'image', value)} />
              <Field><FieldLabel htmlFor={`hero-alt-${index}`}>Image description (Optional)</FieldLabel><Input id={`hero-alt-${index}`} value={banner.alt} onChange={(event) => updateBanner(index, 'alt', event.target.value)} name={`hero-${index}-alt`} maxLength={160} /></Field>
              <Field><FieldLabel htmlFor={`hero-href-${index}`}>Click destination URL</FieldLabel><Input id={`hero-href-${index}`} value={banner.href} onChange={(event) => updateBanner(index, 'href', event.target.value)} name={`hero-${index}-href`} required placeholder="https://example.com or /category/phones" /></Field>
              {slides.length > 1 && <Button type="button" variant="outline" className="sm:col-span-2 sm:justify-self-end" onClick={() => setSlides((current) => current.filter((_, i) => i !== index))}><Trash2Icon data-icon="inline-start" />Remove slide</Button>}
            </div>
          ))}
          <Button type="button" variant="outline" className="self-start" disabled={slides.length >= 8} onClick={() => setSlides((current) => [...current, { id: `hero-${crypto.randomUUID()}`, image: '', alt: '', href: '/' }])}><PlusIcon data-icon="inline-start" />Add slideshow image</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Side banners</CardTitle><CardDescription>Upload the two banners that appear beside the hero slideshow.</CardDescription></CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          {sideBanners.map((banner, index) => (
            <div key={banner.id} className="flex flex-col gap-3 rounded-lg border p-4">
              <input type="hidden" name={`side-${index}-id`} value={banner.id} />
              <BannerImageUpload id={`side-image-${index}`} label={`Banner ${index + 1} image`} name={`side-${index}-image`} value={banner.image} onChange={(value) => updateSideBanner(index, 'image', value)} />
              <Field><FieldLabel htmlFor={`side-alt-${index}`}>Image description (Optional)</FieldLabel><Input id={`side-alt-${index}`} name={`side-${index}-alt`} value={banner.alt} onChange={(event) => updateSideBanner(index, 'alt', event.target.value)} maxLength={160} /></Field>
              <Field><FieldLabel htmlFor={`side-href-${index}`}>Click destination URL</FieldLabel><Input id={`side-href-${index}`} name={`side-${index}-href`} value={banner.href} onChange={(event) => updateSideBanner(index, 'href', event.target.value)} required placeholder="https://example.com or /category/phones" /></Field>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Homepage product sections</CardTitle><CardDescription>Search for products and add them to each homepage section.</CardDescription></CardHeader>
        <CardContent className="flex flex-col gap-5">
          {homepageSections.map((section, index) => {
            const query = (queries[section.id] ?? '').trim().toLowerCase()
            const matches = products.filter((product) => product.name.toLowerCase().includes(query)).slice(0, 8)
            const selectedProducts = products.filter((product) => section.productIds.includes(product.id))
            const allSelected = products.length > 0 && section.productIds.length === products.length
            return (
              <section key={section.id} className="flex flex-col gap-4 rounded-lg border p-4" aria-label={`Homepage section ${index + 1}`}>
                <input type="hidden" name={`section-${index}-id`} value={section.id} />
                <FieldGroup className="sm:grid sm:grid-cols-2">
                  <Field><FieldLabel htmlFor={`section-title-${index}`}>Section title</FieldLabel><Input id={`section-title-${index}`} name={`section-${index}-title`} value={section.title} onChange={(event) => updateSection(index, { title: event.target.value })} required maxLength={80} /></Field>
                  <Field><FieldLabel htmlFor={`section-description-${index}`}>Subtitle</FieldLabel><Input id={`section-description-${index}`} name={`section-${index}-description`} value={section.description} onChange={(event) => updateSection(index, { description: event.target.value })} maxLength={160} /></Field>
                </FieldGroup>
                <fieldset className="flex flex-col gap-3">
                  <legend className="text-sm font-medium">Products in this section</legend>
                  {section.productIds.map((productId) => <input key={productId} type="hidden" name={`section-${index}-product`} value={productId} />)}
                  <label className="flex w-fit items-center gap-2 text-sm font-medium">
                    <input type="checkbox" checked={allSelected} onChange={(event) => updateSection(index, { productIds: event.target.checked ? products.map((product) => product.id) : [] })} className="size-4 accent-primary" />
                    Select all products
                  </label>
                  <div className="relative">
                    <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                    <Input value={queries[section.id] ?? ''} onChange={(event) => setQueries((current) => ({ ...current, [section.id]: event.target.value }))} placeholder="Search products by name…" aria-label={`Search products for ${section.title || `section ${index + 1}`}`} className="pl-9" />
                  </div>
                  {query && <div className="max-h-64 overflow-y-auto rounded-md border" role="listbox" aria-label="Product search results">
                    {matches.length ? matches.map((product) => {
                      const selected = section.productIds.includes(product.id)
                      return <button key={product.id} type="button" role="option" aria-selected={selected} disabled={selected} onClick={() => updateSection(index, { productIds: [...section.productIds, product.id] })} className="flex w-full items-center gap-3 border-b p-3 text-left last:border-b-0 hover:bg-accent disabled:cursor-default disabled:opacity-60">
                        <Image src={product.image} alt="" width={44} height={44} className="size-11 shrink-0 rounded-md bg-muted object-cover" />
                        <span className="min-w-0 flex-1 truncate text-sm font-medium">{product.name}</span>
                        <span className="text-xs text-muted-foreground">{selected ? 'Added' : 'Add'}</span>
                      </button>
                    }) : <p className="p-3 text-sm text-muted-foreground">No products found.</p>}
                  </div>}
                  <div className="flex flex-col gap-2">
                    {selectedProducts.map((product) => <div key={product.id} className="flex items-center gap-3 rounded-md border p-2">
                      <Image src={product.image} alt="" width={40} height={40} className="size-10 shrink-0 rounded-md bg-muted object-cover" />
                      <span className="min-w-0 flex-1 truncate text-sm">{product.name}</span>
                      <Button type="button" variant="ghost" size="icon" aria-label={`Remove ${product.name}`} onClick={() => updateSection(index, { productIds: section.productIds.filter((id) => id !== product.id) })}><XIcon /></Button>
                    </div>)}
                    {selectedProducts.length === 0 && <p className="text-sm text-muted-foreground">No products added yet. Search above to add products.</p>}
                  </div>
                </fieldset>
                {homepageSections.length > 1 && <Button type="button" variant="ghost" className="self-end text-destructive" onClick={() => setHomepageSections((current) => current.filter((_, i) => i !== index))}><Trash2Icon data-icon="inline-start" />Remove section</Button>}
              </section>
            )
          })}
          <Button type="button" variant="outline" className="self-start" disabled={homepageSections.length >= 8} onClick={() => setHomepageSections((current) => [...current, { id: `section-${crypto.randomUUID()}`, title: '', description: '', productIds: [] }])}><PlusIcon data-icon="inline-start" />Add section</Button>
        </CardContent>
      </Card>
      <div className="sticky bottom-3 z-10 flex justify-end"><Button type="submit" size="lg">Save homepage settings</Button></div>
    </form>
  )
}
