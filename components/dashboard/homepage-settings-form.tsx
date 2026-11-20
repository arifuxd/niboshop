'use client'

import * as React from 'react'
import { PlusIcon, Trash2Icon } from 'lucide-react'
import { saveHomepageSettingsAction } from '@/app/admin/actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import type { Banner, Product } from '@/lib/data'
import type { HomepageSection } from '@/lib/data'

type Props = { hero: Banner[]; side: Banner[]; sections: HomepageSection[]; products: Product[] }

export function HomepageSettingsForm({ hero, side, sections, products }: Props) {
  const [slides, setSlides] = React.useState(hero)
  const [homepageSections, setHomepageSections] = React.useState(sections)
  const updateBanner = (index: number, key: keyof Banner, value: string) => {
    setSlides((current) => current.map((banner, i) => i === index ? { ...banner, [key]: value } : banner))
  }
  const updateSection = (index: number, patch: Partial<HomepageSection>) => {
    setHomepageSections((current) => current.map((section, i) => i === index ? { ...section, ...patch } : section))
  }

  return (
    <form action={saveHomepageSettingsAction} className="flex flex-col gap-6">
      <input type="hidden" name="hero-count" value={slides.length} />
      <input type="hidden" name="side-count" value={side.length} />
      <input type="hidden" name="section-count" value={homepageSections.length} />
      <Card>
        <CardHeader>
          <CardTitle>Hero slideshow</CardTitle>
          <CardDescription>Change the image, accessible description, and destination for each carousel slide. Use a site path or HTTPS image URL.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          {slides.map((banner, index) => (
            <div key={banner.id} className="grid gap-3 rounded-lg border p-4 sm:grid-cols-2">
              <input type="hidden" name={`hero-${index}-id`} value={banner.id} />
              <Field className="sm:col-span-2"><FieldLabel htmlFor={`hero-image-${index}`}>Slide {index + 1} image path or URL</FieldLabel><Input id={`hero-image-${index}`} value={banner.image} onChange={(event) => updateBanner(index, 'image', event.target.value)} name={`hero-${index}-image`} required /></Field>
              <Field><FieldLabel htmlFor={`hero-alt-${index}`}>Image description</FieldLabel><Input id={`hero-alt-${index}`} value={banner.alt} onChange={(event) => updateBanner(index, 'alt', event.target.value)} name={`hero-${index}-alt`} required maxLength={160} /></Field>
              <Field><FieldLabel htmlFor={`hero-href-${index}`}>Click destination</FieldLabel><Input id={`hero-href-${index}`} value={banner.href} onChange={(event) => updateBanner(index, 'href', event.target.value)} name={`hero-${index}-href`} required placeholder="/category/smartphones" /></Field>
              {slides.length > 1 && <Button type="button" variant="outline" className="sm:col-span-2 sm:justify-self-end" onClick={() => setSlides((current) => current.filter((_, i) => i !== index))}><Trash2Icon data-icon="inline-start" />Remove slide</Button>}
            </div>
          ))}
          <Button type="button" variant="outline" className="self-start" disabled={slides.length >= 8} onClick={() => setSlides((current) => [...current, { id: `hero-${crypto.randomUUID()}`, image: '/images/banners/hero-1.png', alt: '', href: '/' }])}><PlusIcon data-icon="inline-start" />Add slideshow image</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Side banners</CardTitle><CardDescription>These two banners appear beside the hero slideshow on the homepage.</CardDescription></CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          {side.map((banner, index) => (
            <div key={banner.id} className="flex flex-col gap-3 rounded-lg border p-4">
              <input type="hidden" name={`side-${index}-id`} value={banner.id} />
              <Field><FieldLabel htmlFor={`side-image-${index}`}>Banner {index + 1} image path or URL</FieldLabel><Input id={`side-image-${index}`} name={`side-${index}-image`} defaultValue={banner.image} required /></Field>
              <Field><FieldLabel htmlFor={`side-alt-${index}`}>Image description</FieldLabel><Input id={`side-alt-${index}`} name={`side-${index}-alt`} defaultValue={banner.alt} maxLength={160} required /></Field>
              <Field><FieldLabel htmlFor={`side-href-${index}`}>Click destination</FieldLabel><Input id={`side-href-${index}`} name={`side-${index}-href`} defaultValue={banner.href} required /></Field>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Homepage product sections</CardTitle><CardDescription>Set section titles and choose which products appear in each row.</CardDescription></CardHeader>
        <CardContent className="flex flex-col gap-5">
          {homepageSections.map((section, index) => (
            <section key={section.id} className="flex flex-col gap-4 rounded-lg border p-4" aria-label={`Homepage section ${index + 1}`}>
              <input type="hidden" name={`section-${index}-id`} value={section.id} />
              <FieldGroup className="sm:grid sm:grid-cols-2">
                <Field><FieldLabel htmlFor={`section-title-${index}`}>Section title</FieldLabel><Input id={`section-title-${index}`} name={`section-${index}-title`} value={section.title} onChange={(event) => updateSection(index, { title: event.target.value })} required maxLength={80} /></Field>
                <Field><FieldLabel htmlFor={`section-description-${index}`}>Subtitle</FieldLabel><Input id={`section-description-${index}`} name={`section-${index}-description`} value={section.description} onChange={(event) => updateSection(index, { description: event.target.value })} maxLength={160} /></Field>
              </FieldGroup>
              <fieldset className="flex flex-col gap-2">
                <legend className="mb-1 text-sm font-medium">Products in this section</legend>
                <div className="grid max-h-56 gap-2 overflow-y-auto rounded-md border p-3 sm:grid-cols-2">
                  {products.map((product) => (
                    <label key={product.id} className="flex min-w-0 items-center gap-2 text-sm">
                      <input type="checkbox" name={`section-${index}-product`} value={product.id} checked={section.productIds.includes(product.id)} onChange={(event) => updateSection(index, { productIds: event.target.checked ? [...section.productIds, product.id] : section.productIds.filter((id) => id !== product.id) })} className="size-4 accent-primary" />
                      <span className="truncate">{product.name}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              {homepageSections.length > 1 && <Button type="button" variant="ghost" className="self-end text-destructive" onClick={() => setHomepageSections((current) => current.filter((_, i) => i !== index))}><Trash2Icon data-icon="inline-start" />Remove section</Button>}
            </section>
          ))}
          <Button type="button" variant="outline" className="self-start" disabled={homepageSections.length >= 8} onClick={() => setHomepageSections((current) => [...current, { id: `section-${crypto.randomUUID()}`, title: '', description: '', productIds: [] }])}><PlusIcon data-icon="inline-start" />Add section</Button>
        </CardContent>
      </Card>
      <div className="sticky bottom-3 z-10 flex justify-end"><Button type="submit" size="lg">Save homepage settings</Button></div>
    </form>
  )
}
